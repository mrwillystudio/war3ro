"""Refresh item records from independently resolved Warcraft object defaults.

Custom objects ALWAYS inherit the unmodified Warcraft template. A map's modified
original object is a separate object, never a parent for custom records.
"""
from __future__ import annotations
import argparse, base64, copy, hashlib, io, json, re, sys
from pathlib import Path

VERSION = 'Ro-Online 7.0c08'
FIELDS = {
    'igol': 'goldcost', 'ilum': 'lumbercost', 'ilev': 'level',
    'iabi': 'abillist', 'iico': 'art', 'icla': 'class', 'iuse': 'uses',
    'ihtp': 'hp', 'ipaw': 'pawnable', 'isel': 'sellable', 'ifil': 'file',
    'unam': 'name', 'utip': 'tip', 'utub': 'ubertip', 'ides': 'description',
}

def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def clean(value):
    value = re.sub(r'\|[cC][0-9a-fA-F]{8}|\|[rR]', '', str(value or ''))
    return value.replace('|n', '\n').replace('|N', '\n').replace('\r\n', '\n').strip()

def linefield(text, key):
    m = re.search(r'(?:^|\n)\s*' + key + r'\s*[：:]\s*([^\n]+)', text)
    return m.group(1).strip() if m else None

def numfield(text, key):
    v = linefield(text, key)
    if not v:
        return None
    m = re.match(r'([+-]?[\d,]+(?:\.\d+)?)', v)
    if not m:
        return None
    value = float(m.group(1).replace(',', ''))
    return int(value) if value.is_integer() else value

def resolved_object(obj, native):
    # Do not recursively follow obj.base_id into the map-modified object table.
    template = native[obj['base_id']]
    result = {key: template.get(field) for key, field in FIELDS.items()}
    result.update(obj['fields'])
    return result

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--work', type=Path, required=True)
    ap.add_argument('--output', type=Path, required=True)
    args = ap.parse_args()
    work = args.work
    old = read(work / 'current_rodb.json')
    old_items = {x['id']: x for x in old['items']}
    objects = read(work / 'map_extract/objects_w3t.json')['objects']
    native = read(work / 'map_extract/native_item_127.json')
    assert all(x['base_id'] in native for x in objects)
    resolved = {x['id']: resolved_object(x, native) for x in objects}
    by_obj = {x['id']: x for x in objects}
    icon_by_path = {}
    for item in old['items']:
        if item.get('icon') and item.get('iconPath'):
            icon_by_path.setdefault(item['iconPath'].lower(), item['icon'])
    for monster in old['monsters']:
        if monster.get('icon') and monster.get('iconPath'):
            icon_by_path.setdefault(monster['iconPath'].lower(), monster['icon'])
    items, excluded, changes, prices, new_ids, missing_icons = [], [], [], [], [], []
    for obj in objects:
        ident = obj['id']
        f = resolved[ident]
        prev = old_items.get(ident)
        raw_name = clean(f.get('unam'))
        raw_desc = clean(f.get('utub'))
        series = linefield(raw_desc, '系列')
        family_match = re.match(r'^\[([A-Z][a-z])([A-Z0-9])\]', raw_name)
        # Preserve the existing player catalog; include newly defined equipment.
        include = prev is not None or (series is not None and f.get('icla') != 'Purchasable' and not re.match(r'^\[(?:武器|防具|專武|其他|任務|材料|鍛造|魔物|委託|轉職)\]', raw_name))
        if not include:
            excluded.append({'id': ident, 'name': raw_name, 'class': f.get('icla'), 'reason': '服務／購買選單／其他未列入玩家物品的物件'})
            continue
        i = copy.deepcopy(prev) if prev else {'id': ident, 'playerItem': True, 'menuEntry': False}
        name = re.sub(r'^\[[A-Z][a-z][A-Z0-9]\]', '', raw_name).strip()
        family = family_match.group(1) if family_match else None
        variant = bool(family_match and family_match.group(2) != '0')
        sockets_match = re.search(r'[（(](\d+)洞[）)]', raw_name)
        sockets = int(sockets_match.group(1)) if sockets_match else 0
        restored_native = bool(prev and 'unam' not in obj['fields'])
        category = series or ('其他' if restored_native else (prev or {}).get('category', '其他'))
        job = linefield(raw_desc, '裝備') or ''
        element = linefield(raw_desc, '屬性')
        effect = raw_desc.split('系列：')[0].split('系列:')[0].strip() or None
        icon_path = str(f.get('iico') or '')
        icon = icon_by_path.get(icon_path.lower())
        if not icon:
            missing_icons.append({'id': ident, 'path': icon_path})
        gold, mvp = f['igol'], f['ilum']
        if not isinstance(gold, (int, float)) or not isinstance(mvp, (int, float)):
            raise ValueError(f'Unknown price basis: {ident} {gold} {mvp}')
        i.update({
            'name': name, 'rawName': raw_name, 'description': raw_desc,
            'descriptionOriginal': raw_desc, 'category': category,
            'slot': linefield(raw_desc, '裝置') if category == '卡片' else None,
            'sockets': sockets, 'variant': variant, 'family': family, 'job': job,
            'effect': effect, 'levelKey': f['ilev'], 'gold': gold, 'mvpCost': mvp,
            'priceEquivalent': gold + mvp * 10000,
            'priceFormula': f'{gold:,} Zeny' + (f' + {mvp:,} MVP' if mvp else ''),
            'abilities': [x for x in str(f.get('iabi') or '').split(',') if x and x != '_'],
            'source': 'war3map.w3t · ' + VERSION, 'base': obj['base_id'],
            'iconPath': icon_path, 'icon': icon, 'series': category,
            'attackValue': numfield(raw_desc, '攻擊'),
            'defenseValue': numfield(raw_desc, '防禦'),
            'weaponLevel': numfield(raw_desc, '武器等級'),
            'element': element, 'jobTags': [job] if job else [],
            'objectClass': f.get('icla'), 'charges': f.get('iuse'),
            'pawnable': bool(f.get('ipaw')), 'sellable': bool(f.get('isel')),
            'dataSources': {'base': 'Warcraft III 1.27.1 Custom 未修改原生物件', 'map': '7.0c08-v48 war3map.w3t', 'icon': icon_path},
            'priceSource': {'rule': '未修改原生模板 + 本物件覆寫；不繼承地圖中同 rawcode 的改造物件', 'base': obj['base_id'],
                'gold': 'war3map.w3t/igol' if 'igol' in obj['fields'] else 'native/goldcost',
                'mvpCost': 'war3map.w3t/ilum' if 'ilum' in obj['fields'] else 'native/lumbercost'},
            'verificationStatus': 'verified-map-object',
        })
        # Old existence notes are re-derived once all current sources are known.
        i.pop('availabilityStatus', None)
        i.pop('buyPrice', None)
        if restored_native:
            i.update({'catalogHidden': True, 'previousName': prev['name'],
                      'availabilityStatus': '此代碼在本版已還原為 Warcraft 原生物件；舊版活動裝備資料已停用。',
                      'catalogHiddenReason': '本版無自訂裝備定義與已確認玩家取得來源'})
        if prev:
            changed = {k: {'before': prev.get(k), 'after': i.get(k)} for k in ['rawName', 'descriptionOriginal', 'category', 'slot', 'sockets', 'variant', 'family', 'job', 'effect', 'levelKey', 'gold', 'mvpCost', 'abilities', 'iconPath', 'attackValue', 'defenseValue', 'weaponLevel', 'element'] if prev.get(k) != i.get(k)}
            if changed:
                changes.append({'id': ident, 'name': name, 'changes': changed})
            if prev.get('gold') != gold or prev.get('mvpCost') != mvp:
                prices.append({'id': ident, 'name': name, 'base': obj['base_id'], 'variant': variant,
                    'before': {'gold': prev.get('gold'), 'mvpCost': prev.get('mvpCost')}, 'after': {'gold': gold, 'mvpCost': mvp},
                    'source': i['priceSource']})
        else:
            new_ids.append(ident)
        items.append(i)

    result = {'items': items, 'resolvedObjects': resolved,
              'audit': {'mapObjectCount': len(objects), 'items': len(items), 'excludedCount': len(excluded),
                        'newIds': new_ids, 'priceChanges': prices, 'changes': changes, 'excluded': excluded, 'missingIcons': missing_icons}}
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: (len(v) if isinstance(v, list) else v) for k, v in result['audit'].items()}, ensure_ascii=False))

if __name__ == '__main__':
    main()
