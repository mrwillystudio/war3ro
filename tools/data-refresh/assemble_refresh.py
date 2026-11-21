"""Assemble the current map audit into the RO Atlas data overlay.

Inputs remain immutable. Generated assets contain only website images; source
maps, MDX models and BLP game textures are never copied into the repository.
"""
from __future__ import annotations
import argparse, base64, collections, copy, hashlib, importlib.util, io, json, re, shutil, sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--work', type=Path, required=True)
parser.add_argument('--repo', type=Path, default=SCRIPT_DIR.parents[1])
parser.add_argument('--map', type=Path, required=True)
args = parser.parse_args()
WORK = args.work.resolve()
REPO = args.repo.resolve()
MAP = args.map.resolve()
VERSION = 'Ro-Online 7.0c08'
SOURCE_MAP_SHA256 = '0be2938f1e367bd8d560799d925694adda359421eecb08f77805dbb506683cf4'
assert hashlib.sha256(MAP.read_bytes()).hexdigest() == SOURCE_MAP_SHA256, 'This release builder is pinned to the audited v48 source map'
sys.path.insert(0, str(SCRIPT_DIR / 'extract'))
sys.path.insert(0, str(SCRIPT_DIR / 'nonitem'))
from mpyq import MPQArchive
from nonitem_refresh import resolve_text
from PIL import Image

def load(p): return json.loads(Path(p).read_text(encoding='utf-8'))
def dump(p,v): Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(s): return re.sub(r'\|[rR]|\|[cC][0-9a-fA-F]{8}','',str(s or '')).replace('|n','\n').strip()

old = load(WORK / 'current_rodb.json')
item_patch = load(WORK / 'items_patch.json')
nonitems = load(WORK / 'data_audit/nonitem_patch.json')
objects = item_patch['resolvedObjects']
abilities = load(WORK / 'data_audit/resolved_abilities.json')
units = load(WORK / 'data_audit/resolved_units.json')
lines = (WORK / 'map_extract/extracted/war3map.j').read_text().splitlines()
data = copy.deepcopy(old)
data.update(copy.deepcopy(nonitems))
data['items'] = copy.deepcopy(item_patch['items'])
items = {i['id']: i for i in data['items']}
monsters = {m['id']: m for m in data['monsters']}
assets = {}
audit = {'items': item_patch['audit'], 'nonitems': load(WORK / 'data_audit/nonitem_audit.json')}

def source(line, radius=8):
    data['sources'][str(line)] = '\n'.join(f'{j+1}: {lines[j]}' for j in range(max(0,line-2),min(len(lines),line+radius)))

# Human-reviewed trigger summaries are source-bound to this audited map.
mechanics_path = SCRIPT_DIR / 'mechanics-70c08.json'
if mechanics_path.exists():
    mechanics_patch = load(mechanics_path)
    assert mechanics_patch['mapSha256'] == SOURCE_MAP_SHA256
    for ident, patch in mechanics_patch['monsters'].items():
        m = monsters[ident]
        by_id = {a['id']: a for a in patch['mechanics']}
        previous = m.get('mvpSkills', {}).get('mechanics', [])
        for a in by_id.values():
            for evidence in a.get('sourceEvidence', []):
                assert lines[evidence['line']-1].strip() == evidence['text'].strip(), ('mechanics source mismatch', a['id'], evidence['line'])
                source(evidence['line'], 2)
        m.setdefault('mvpSkills', {})['mechanics'] = [copy.deepcopy(by_id.get(a['id'], a)) for a in previous] + [copy.deepcopy(a) for aid, a in by_id.items() if aid not in {v['id'] for v in previous}]
        if all(a.get('sourceVersion') == VERSION for a in m['mvpSkills']['mechanics']):
            m['skillReferenceNote'] = '技能物件、冷卻、消耗、Rhpm 模式條件與下列機制摘要已對照本版來源；暫時增益與實戰狀態另計。'
    audit['mechanicsReviewed'] = sum(len(x['mechanics']) for x in mechanics_patch['monsters'].values())

for i in items.values():
    original = i['descriptionOriginal']
    i['description'] = clean(resolve_text(original, abilities))
    i['effect'] = i['description'].split('系列：')[0].split('系列:')[0].strip() or None
    i['shopSources'] = []
    i['npcMenuSources'] = []
    i['triggerSources'] = []

# Resolve the actual sold menu item, not the inventory item it creates.
shop_price_differences = []
for sh in data['shops']:
    for offer in sh.get('offers', []):
        ident, sold = offer['item'], offer['soldItem']
        if ident not in items:
            raise AssertionError(('shop item missing',sh['unit'],ident))
        f = objects[sold]
        price = {'gold': f['igol'], 'mvpCost': f['ilum']}
        assert all(isinstance(v,(int,float)) for v in price.values())
        price['equivalent'] = price['gold'] + price['mvpCost'] * 10000
        price['source'] = 'war3map.w3t/'+sold+' igol/ilum + 未修改原生模板'
        offer.update(price)
        row = {'unit':sh['unit'],'name':sh['name'],'positions':sh['positions'],
               'itemCount':len(sh['items']), 'soldItem':sold, **price,
               'mappingSource':offer['mappingSource'], 'verificationStatus':'verified-sale-object'}
        if offer.get('conditionNote'): row['conditionNote'] = offer['conditionNote']
        if offer.get('line'):
            row.update({'line':offer['line'],'function':offer['function']})
            source(offer['line'], 2)
        items[ident]['shopSources'].append(row)
        if price['gold'] != items[ident]['gold'] or price['mvpCost'] != items[ident]['mvpCost']:
            shop_price_differences.append({'id':ident,'name':items[ident]['name'],'soldItem':sold,
                                           'shop':sh['unit'],'offer':price,
                                           'object':{'gold':items[ident]['gold'],'mvpCost':items[ident]['mvpCost']}})
for i in items.values():
    costs = {(s['gold'],s['mvpCost']) for s in i['shopSources']}
    if len(costs) == 1:
        gold,mvp = next(iter(costs))
        i['buyPrice'] = {'gold':gold,'mvpCost':mvp,'equivalent':gold+mvp*10000,
                         'source':'已確認的本版 NPC 出售物件；一般購買條件下的標示價格'}
    else:
        i.pop('buyPrice', None)
audit['shopPriceDifferences'] = shop_price_differences

# Re-read direct creation statements. Test/GM creation paths are never presented
# as player acquisition sources. Conditions are not claimed to be exhaustive.
labels = {
    'Trig_Beginner_Initialization_Actions':'新手初始裝備',
    'Trig_Item_Exclusive_Actions':'職業裝備轉換',
    'Trig_RedeemItem_Actions':'NPC 任務兌換',
    'Trig_Ninja_1_Actions':'忍者進修任務',
    'Trig_Ninja_2_Actions':'忍者任務',
    'Trig_GunSlinger_2_Actions':'神槍手任務',
    'Trig_Forest_labyrinth_treasure_Actions':'迷藏森林寶藏',
    'Trig_Sushi_Artisan_Exchange_AIjass_Actions':'引路人任務',
    'Trig_Metempsychosis_Actions':'轉生獎勵',
    'Trig_Destructible_Revive_Actions':'擊破可破壞物件',
    'Trig_Money_Attack_vJass_Actions':'金幣事件',
    'ROKr_TrySummon':'魔鬼大烏賊召喚程序',
}
fn = ''
ignored_test_sources = 0
for n,line in enumerate(lines,1):
    match = re.match(r'function\s+(\w+)',line)
    if match: fn = match.group(1)
    if not re.search(r'\b(?:CreateItem|CreateItemLoc|CreateItemLocBJ|UnitAddItemByIdSwapped|UnitAddItemById|UnitAddItemByIdLoc)\s*\(',line):
        continue
    for ident in re.findall(r"'(.{4})'",line):
        if ident not in items: continue
        if re.search(r'(?:TEST|GM|Debug|debug)',fn):
            ignored_test_sources += 1
            continue
        entry = {'function':fn,'line':n,'label':labels.get(fn,'魔物／事件程序'),
                 'verificationStatus':'verified-creation-statement',
                 'note':'已確認本版建立或給予物品的程式；取得仍需符合該事件條件。'}
        if ident == 'I0JX' and fn == 'Trig_Sushi_Artisan_Exchange_AIjass_Actions':
            assert any('if total < 30 then' in x for x in lines[n-20:n])
            entry.update({'label':'引路人任務',
                          'note':'向壽司師傅選擇「引路人」，消耗人魚之心 ×30，並保留一個空物品欄位，可取得死亡引導者。',
                          'materials':[{'id':'bfhr','quantity':30}], 'menuItem':'IQW1',
                          'npc':'odkt','verificationStatus':'verified-exchange-conditions'})
        items[ident]['triggerSources'].append(entry)
        source(n, 7)

# Shared redemption procedure: input item/count -> output item/count. Preserve
# the inspected exchange relationship without inventing the surrounding quest.
fn = ''
for n,line in enumerate(lines,1):
    match = re.match(r'function\s+(\w+)',line)
    if match: fn = match.group(1)
    if not re.search(r'ConditionalTriggerExecute\(\s*gg_trg_RedeemItem_Process\s*\)',line): continue
    block = '\n'.join(lines[max(0,n-8):n])
    ids = {int(k):v for k,v in re.findall(r"set udg_it_redeemItem\[(\d)\] = '(.{4})'",block)}
    nums = {int(k):int(v) for k,v in re.findall(r'set udg_i_redeemInteger\[(\d)\] = (\d+)',block)}
    if not all(k in ids and k in nums for k in [1,2]) or ids[2] not in items: continue
    ident = ids[2]
    entry = {'function':fn,'line':n,'label':'NPC 材料兌換','verificationStatus':'verified-exchange-table',
             'materials':[{'id':ids[1],'quantity':nums[1]}], 'resultQuantity':nums[2],
             'note':f'{items.get(ids[1],{}).get("name",ids[1])} ×{nums[1]} 可兌換 {items[ident]["name"]} ×{nums[2]}；須符合對應 NPC 的任務條件。'}
    items[ident]['triggerSources'].append(entry)
    source(n,2)

# Keep names of quest menus as references, never as a confirmed purchase price.
def identity_name(name):
    return re.sub(r'\s+','',re.sub(r'^\[[^\]]+\]|\([A-Z]\)$','',clean(name))).replace('（','(').replace('）',')')
names = collections.defaultdict(list)
for i in items.values():
    if not i['variant']: names[identity_name(i['name'])].append(i['id'])
for u in units.values():
    if u['_id'] not in {x['unit'] for x in audit['nonitems'].get('otherPlacedUnitMenus',[])}:
        continue
    for mid in str(u.get('sellitems','')).split(','):
        f = objects.get(mid)
        if not f or f.get('icla') == 'Purchasable' or mid in items: continue
        for ident in names.get(identity_name(f.get('unam','')),[]):
            items[ident]['npcMenuSources'].append({'unit':u['_id'],'name':clean(u.get('name',u['_id'])),
                'menuItem':mid,'verificationStatus':'verified-menu-reference','note':'NPC 有對應選單；條件與獎勵須依任務判定。'})

for i in items.values():
    # One descriptive entry per source function; retain all actual source lines.
    grouped={}
    for s in i['triggerSources']:
        key=(s['function'],s['label'],s.get('note',''))
        if key not in grouped:
            grouped[key]=s;grouped[key]['lines']=[s['line']]
        elif s['line'] not in grouped[key]['lines']:
            grouped[key]['lines'].append(s['line'])
    i['triggerSources']=list(grouped.values())
    i['acquisitionKeywords']=' '.join([s['name'] for s in i['shopSources']]+[s['name'] for s in i['npcMenuSources']]+[s['label'] for s in i['triggerSources']])
    if not i.get('availabilityStatus') and not i['shopSources'] and not i['triggerSources'] and not any(d['item']==i['id'] for d in data['drops']) and not any(r['result']==i['id'] for r in data['recipes']):
        if i['variant']: i['availabilityStatus']='已嵌卡衍生物件，依嵌卡程序轉換；未列為一般直接取得物品。'
        elif i['npcMenuSources']: i['availabilityStatus']='已找到對應 NPC 選單；任務解鎖／獎勵條件未完整解析。'
        else: i['availabilityStatus']='本版未在已解析的固定掉落、商店、配方與直接給予程序中確認取得方式。'
audit['triggerSources']={'items':sum(bool(i['triggerSources']) for i in items.values()),
                         'records':sum(len(i['triggerSources']) for i in items.values()),
                         'testStatementsExcluded':ignored_test_sources}

# Refresh map-supplied icons from actual BLP bytes. Reuse verified native icons
# where no map override exists; missing old icons use pinned classic resources.
map_bytes=MAP.read_bytes()
mpq=MPQArchive(io.BytesIO(map_bytes[map_bytes.index(b'MPQ\x1a'):]),listfile=False)
icon_dir=WORK/'icons';icon_dir.mkdir(exist_ok=True)
codec_path=SCRIPT_DIR/'preview/blp_decode.py'
spec=importlib.util.spec_from_file_location('atlas_blp',codec_path);blp=importlib.util.module_from_spec(spec);spec.loader.exec_module(blp)
icon_cache={};icon_provenance=[];icon_failures=[]
native_icon_hashes={x['path']:x['sha256'] for x in load(SCRIPT_DIR/'extract/native_icon_sources.json')['files']}
all_icon_records=list(items.values())+list(monsters.values())
for m in monsters.values():
    all_icon_records.extend(m.get('abilities',[]))
    for k in ['normal','rage','mechanics']: all_icon_records.extend(m.get('mvpSkills',{}).get(k,[]))
for record in all_icon_records:
    path=record.get('iconPath')
    if not path: continue
    key=path.lower().replace('/','\\')
    if key in icon_cache:
        record['icon']=icon_cache[key]
        continue
    try:
        content=mpq.read_file(path)
        origin='v48 map override'
        if content is None:
            if record.get('icon') and record['icon'] in old['assets']: continue
            candidate=WORK/'map_extract/native_assets'/path.lower().replace('\\','/')
            if not candidate.exists():
                icon_failures.append({'id':record['id'],'path':path,'reason':'no source file'})
                continue
            content=candidate.read_bytes();origin='pinned classic native asset'
            assert hashlib.sha256(content).hexdigest()==native_icon_hashes[path.lower().replace('\\','/')], ('native icon hash mismatch',path)
        h=hashlib.sha256(content).hexdigest();temp=icon_dir/(h+'.blp');temp.write_bytes(content)
        if content[:4]==b'BLP1' and int.from_bytes(content[4:8],'little')==0:
            im=Image.fromarray(blp.decode(temp),'RGBA')
        else:
            im=Image.open(io.BytesIO(content)).convert('RGBA')
        im.thumbnail((64,64),Image.Resampling.LANCZOS)
        buf=io.BytesIO();im.save(buf,format='WEBP',lossless=True,method=6)
        png_hash=hashlib.sha256(buf.getvalue()).hexdigest()
        asset='c08icon_'+png_hash[:12]
        assets[asset]='data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
        record['icon']=asset;icon_cache[key]=asset
        icon_provenance.append({'path':path,'source':origin,'sourceSha256':h,'imageSha256':png_hash,'size':list(im.size),'asset':asset})
    except Exception as e:
        icon_failures.append({'id':record.get('id'),'path':path,'reason':str(e)})
audit['icons']={'refreshed':len(icon_provenance),'failures':icon_failures,'provenance':icon_provenance}

minimap=mpq.read_file('war3mapMap.blp')
if minimap:
    im=Image.open(io.BytesIO(minimap)).convert('RGB')
    assert im.size==(256,256)
    buf=io.BytesIO();im.save(buf,format='WEBP',lossless=True,method=6)
    assets['worldmap']='data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
    audit['worldMap']={'file':'war3mapMap.blp','sourceSha256':hashlib.sha256(minimap).hexdigest(),
                       'imageSha256':hashlib.sha256(buf.getvalue()).hexdigest(),'size':list(im.size)}

# Optional independently rendered preview updates; repeat assembly after the
# render batch completes without modifying prior source data.
preview_inputs=[WORK/'site_audit/previews/new_model_preview_records.json',WORK/'map_extract/previews/model_preview_records.json']
if not any(p.exists() for p in preview_inputs):
    preview_inputs=[SCRIPT_DIR/'preview/preview-records-70c08.json']
for path in preview_inputs:
    if not path.exists(): continue
    payload=load(path)
    audit.setdefault('previewInputs',[]).append(path.name)
    assets.update(payload.get('assets',{}))
    for ident,fields in payload.get('monsters',{}).items():
        assert ident in monsters,('unknown preview monster',ident)
        monsters[ident].update(fields)
    for f in payload.get('files',[]):
        target=REPO/(f.get('repoPath') or f['repo'])
        source_path=Path(f.get('localPath') or f.get('local') or target)
        target.parent.mkdir(parents=True,exist_ok=True)
        if source_path.resolve()!=target.resolve():
            shutil.copyfile(source_path,target)

data['assets'].update(assets)
meta=copy.deepcopy(old['meta'])
for key in ['auditR7','attackAudit','modelAlphaFix','modelPathChanges','newModelPreviews','modelPreviewsPending','frontModelPreviewCount','lowKeyPreviewSource','indexVersionFrom']:
    meta.pop(key,None)
meta.update({'version':VERSION,'mapVersion':VERSION,'revision':VERSION,'mapBuild':'',
    'file':MAP.name,'sha256':hashlib.sha256(map_bytes).hexdigest(),'dataRevision':'2026-11-21 · 全表資料與價格核對',
    'generator':'原生模板 + 本物件覆寫；本版 WTS、JASS、物件資料重建',
    'mechanicsReviewed':audit.get('mechanicsReviewed',0),
    'rawCounts':{k:len(load(WORK/f'map_extract/objects_{ext}.json')['objects']) for k,ext in [('units','w3u'),('items','w3t'),('abilities','w3a')]},
    'priceRule':{'mvpToZeny':10000,'label':'1 MVP（木頭）＝ 10,000 Zeny；購買價格以 NPC 實際出售物件為準'},
    'notes':[
        '資料依本次上傳的 Ro-Online 7.0c08-v48.w3x 重建；來源地圖未修改。',
        '每個自訂物件使用未修改的 Warcraft 原生模板加上自己的覆寫，已修正斗篷等物品誤繼承其他改造物件成本的問題。',
        '商店價格依實際出售物件與購買選單對應核對；沒有販售來源時，只顯示物件定價，零值不代表免費。',
        '重新解析單位、物品、技能物件與英雄生成等級；HP、ATK、DEF 不含戰鬥光環與臨時增益。',
        '一般掉落、MVP 權重與互斥抽選、Merge 合成和 Forging 鍛造表均依本版程式重建；條件機率與每次抽取機率分開說明。',
        '七組套裝的成員條件已核對；物品文案與程式內部屬性單位分開呈現。',
        '保留 40 個人工地理區域及既有點位校正；新增動態魔物不假裝成靜態預放點。',
        '圖鑑現有召喚與戰鬥機制摘要已逐條對照本版程式；仍未確認的生成入口、任務解鎖與套裝下游效果分別標註。',
        '資料來自此自訂 Warcraft III 地圖；沒有套用官方 Ragnarok Online 的遊戲數值。'
    ],
    'verifiedSections':['全部單位、物品、技能物件與原生繼承','全部物品定價、商店出售物件與購買選單對應','一般掉落與 MVP 加權互斥池','Merge 合成及 Forging 鍛造表','七組套裝成員條件','預放座標與已保留人工校正'],
    'referenceSections':['人工地理名稱與邊界','部分任務解鎖條件及未確認生成入口（逐筆標示）','套裝下游戰鬥效果中的未確認分支'],
    'nativeDefaultSource':load(WORK/'map_extract/native_provenance.json')})
meta['mapObjectCount']=meta['rawCounts'].copy()
meta['excludedItemCount']=item_patch['audit']['excludedCount']
meta['catalogHiddenItemCount']=sum(bool(i.get('catalogHidden')) for i in items.values())
meta['hiddenEncounterGuides']=sum(bool(m.get('summonGuide')) for m in monsters.values())
meta['attachmentPreviewCount']=sum(bool(m.get('portraitSource',{}).get('attachments')) for m in monsters.values())
meta['attackRangeAdded']=sum(m.get('attackRange') is not None for m in monsters.values())
meta['worldMapSource']=audit.get('worldMap')
meta['historicalNativeSources']=meta.pop('nativeSources',[])
for entry in meta['nativeDefaultSource']['sources']:
    entry.pop('parsed_path',None)
meta['modelPreviewRefreshCount']=sum(m.get('portraitRevision','').startswith('70c08') for m in monsters.values())
meta['modelPreviewReusedCount']=len(monsters)-meta['modelPreviewRefreshCount']
meta['modelPreviewRevision']='70c08-20261121'
meta['coverage']={**old['meta']['coverage'],'monsters':len(monsters),'itemsTotal':len(items),
    'itemsWithoutVariants':sum(not i['variant'] for i in items.values()),
    'visibleItemsWithoutVariants':sum(not i['variant'] and not i.get('catalogHidden') for i in items.values()),
    'excludedItems':item_patch['audit']['excludedCount'],'cards':sum(i['category']=='卡片' and not i.get('catalogHidden') for i in items.values()),
    'sockets':sum(i['sockets']>0 and not i['variant'] and not i.get('catalogHidden') for i in items.values()),
    'recipes':len(data['recipes']),'drops':len(data['drops']),'shops':len(data['shops']),
    'heroesCalculated':sum(m['isHero'] for m in monsters.values()),
    'visibleMonsters':sum(not m.get('catalogHidden') for m in monsters.values()),
    'catalogHiddenItems':sum(bool(i.get('catalogHidden')) for i in items.values()),
    'monsterIcons':sum(bool(m.get('icon')) for m in monsters.values()),'itemIcons':sum(bool(i.get('icon')) for i in items.values()),
    'realSets':len(data['sets']),
    'modelPreviewsRendered':sum(bool(m.get('portrait') and m['portrait'] in data['assets']) for m in monsters.values()),
    'modelPreviewsTotal':len(monsters),'hiddenEncounters':meta['hiddenEncounterGuides'],
    'uniqueAssets':len(data['assets']),
    'resolvedTextReferences':sum(i['description']!=i['descriptionOriginal'] for i in items.values())}
data['meta']=meta
dump(WORK/'final_rodb.json',data)
dump(WORK/'refresh_audit.json',audit)
print(json.dumps({'coverage':meta['coverage'],'triggerSources':audit['triggerSources'],'newAssets':len(assets),'iconFailures':icon_failures},ensure_ascii=False))
