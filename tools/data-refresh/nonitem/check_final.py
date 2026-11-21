#!/usr/bin/env python3
"""Independent integration gates for the v48 atlas refresh (no map mutations)."""
import argparse, collections, json, re
from pathlib import Path

def load(p):return json.loads(p.read_text())
def main(work):
    w=Path(work);d=load(w/'final_rodb.json');old=load(w/'current_rodb.json');j=(w/'map_extract/extracted/war3map.j').read_text().splitlines();errors=[];warnings=[]
    items={x['id']:x for x in d['items']};monsters={x['id']:x for x in d['monsters']};pools={x['id']:x for x in d['mvpDropPools']}
    def check(ok,*detail):
        if not ok:errors.append(detail)
    check(d['meta']['version']=='Ro-Online 7.0c08','current version')
    for kind in ['items','monsters','recipes','sets','areas','mvpDropPools']:
        ids=[x['id'] for x in d[kind]];check(len(ids)==len(set(ids)),'duplicate IDs',kind)
    for r in d['drops']:
        check(r['item'] in items and r['monster'] in monsters,'dangling drop',r['id'])
        check(0<=r['rate']<=100,'drop probability',r['id'])
        if r.get('exclusivePool'):check(r['exclusivePool'] in pools and r['item'] in pools[r['exclusivePool']]['items'],'exclusive pool',r['id'])
        n=r.get('line');check(n and "'"+r['item']+"'" in j[n-1],'drop source line',r['id'],n)
    for r in d['recipes']:
        check(r['result'] in items,'recipe result',r['id']);check("'"+r['result']+"'" in j[r['line']-1],'recipe source',r['id'])
        for m in r['materials']:check(m['id'] in items and m['quantity']>=1,'recipe material',r['id'],m)
    oldrecipes={r['id']:r['result'] for r in old['recipes']};newrecipes={r['id']:r['result'] for r in d['recipes']}
    check(all(newrecipes.get(k)==v for k,v in oldrecipes.items()),'existing recipe ID compatibility')
    for s in d['shops']:
        check(all(i in items for i in s['items']),'shop item',s['unit'])
        for offer in s.get('offers',[]):check(offer['item'] in items,'shop offer',s['unit'],offer['soldItem'])
    for s in d['sets']:
        check(all(i in items for i in s['itemIds']),'set item',s['id'])
        check(s['line']>=1 and s['line']<=len(j),'set source line',s['id'])
    geom=lambda db:[(a['id'],a.get('bounds'),a.get('mapRegions')) for a in db['areas']]
    check(geom(d)==geom(old),'manual areas changed')
    pts=lambda db:[(m['id'],p['x'],p['y'],p.get('area'),p.get('areaName')) for m in db['monsters'] for p in m['placements']]
    check(pts(d)==pts(old),'manual placements changed')
    rawu={x['id']:x for x in load(w/'map_extract/objects_w3u.json')['objects']};rawa={x['id']:x for x in load(w/'map_extract/objects_w3a.json')['objects']};rawi={x['id']:x for x in load(w/'map_extract/objects_w3t.json')['objects']}
    nativeu=load(w/'map_extract/native_unit_127.json');nativei=load(w/'map_extract/native_item_127.json')
    # Verify a small set of direct and inherited fields using native parent IDs, never resolved map originals.
    for rid,m in monsters.items():
        u=rawu[rid];f=u['fields'];n=nativeu[u['base_id']]
        for public,raw,native in [('hpBase','uhpm','hp'),('attackBase','ua1b','dmgplus1'),('attackRange','ua1r','rangen1'),('attackDice','ua1d','dice1')]:
            check(m.get(public)==f.get(raw,n.get(native)),'monster inheritance',rid,public,m.get(public),f.get(raw,n.get(native)))
        enabled=int(f.get('uaen',n.get('weapson',0)))
        check(m.get('attackEnabled')==bool(enabled&1),'ordinary attack enablement',rid)
        check(m.get('attackTargets')==f.get('ua1g',n.get('targs1','')),'weapon1 targets',rid)
        if enabled&2:
            s=m.get('secondaryAttack',{});core=f.get('ua2b',n.get('dmgplus2',0))+m.get('attackAttribute',0);dice=f.get('ua2d',n.get('dice2',0));sides=f.get('ua2s',n.get('sides2',0))
            check(s.get('min')==core+dice and s.get('max')==core+dice*sides,'weapon2 damage',rid)
            check(s.get('range')==f.get('ua2r',n.get('rangen2')) and s.get('targets')==f.get('ua2g',n.get('targs2','')),'weapon2 range/targets',rid)
        for a in m['abilities']:
            f=rawa.get(a['id'],{}).get('fields',{})
            if 'areq:0:0' in f:check((a.get('requirements') or '')==(f['areq:0:0'] or ''),'ability requirement',rid,a['id'])
            check((a['modeLabel']=='狂暴模式')==('Rhpm' in str(a.get('requirements'))),'mode',rid,a['id'])
    for rid,i in items.items():
        mo=rawi.get(rid)
        if not mo:continue
        f=mo['fields'];n=nativei.get(mo['base_id'],{})
        for public,raw,native in [('gold','igol','goldcost'),('mvpCost','ilum','lumbercost')]:
            check(i.get(public)==f.get(raw,n.get(native)),'item inheritance',rid,public,i.get(public),f.get(raw,n.get(native)))
    for key,source in d['sources'].items():
        if not isinstance(source,str):continue
        for line in source.splitlines():
            m=re.match(r'^(\d+): (.*)$',line)
            if m:check(0<int(m[1])<=len(j) and m[2]==j[int(m[1])-1],'source snippet stale',key,int(m[1]))
    linefunc={};fn=None
    for n,line in enumerate(j,1):
        if line.startswith('function '):fn=line.split()[1]
        linefunc[n]=fn
    for rid,m in monsters.items():
        g=m.get('summonGuide')
        if not g:continue
        refs=g.get('lines',[]);ev={e['line']:e for e in g.get('evidence',[])}
        check(bool(refs),'summon guide without current source',rid)
        check(set(refs)==set(ev),'summon guide evidence missing',rid,refs)
        for n in refs:
            e=ev.get(n,{})
            check(isinstance(n,int) and 0<n<=len(j),'summon guide line range',rid,n)
            if isinstance(n,int) and 0<n<=len(j):
                check(e.get('text')==j[n-1],'summon guide source stale',rid,n)
                check(e.get('function')==linefunc[n],'summon guide function mismatch',rid,n,e.get('function'),linefunc[n])
                check(str(n) in d['sources'],'summon guide source snippet missing',rid,n)
        for e in g.get('objectEvidence',[]):
            records=rawu if e['file']=='war3map.w3u' else rawa if e['file']=='war3map.w3a' else {}
            value=records.get(e['id'],{}).get('fields',{}).get(e['field'])
            check(e['contains'] in str(value).split(',') if 'contains' in e else value==e.get('value'),'summon guide object evidence',rid,e)
    def walk(x,path=''):
        if isinstance(x,dict):
            for k,v in x.items():
                if k not in ['assets','portraitSource']:walk(v,path+'.'+k)
        elif isinstance(x,list):
            for i,v in enumerate(x):walk(v,path+f'[{i}]')
        elif isinstance(x,str) and '7.0b07' in x and not any(t in x for t in ['前版','歷史','沿用']):warnings.append({'path':path,'text':x[:180]})
    walk(d)
    report={'passed':not errors,'errors':errors,'staleNonPreviewVersionLabels':warnings,'counts':{k:len(d[k]) for k in ['monsters','items','drops','recipes','shops','sets','areas','regions']},'sourceSnippets':len(d['sources']),'summonGuides':sum(bool(m.get('summonGuide')) for m in monsters.values()),'verifiedSummonGuides':sum(bool(m.get('summonGuide',{}).get('verified')) for m in monsters.values()),'unconfirmedSummonEntrances':[m['id'] for m in monsters.values() if m.get('summonGuide') and not m['summonGuide'].get('verified')],'summonGuideUnverifiedFields':{m['id']:m['summonGuide']['unverifiedFields'] for m in monsters.values() if m.get('summonGuide',{}).get('unverifiedFields')},'placements':len(pts(d))}
    (w/'data_audit/final_integrity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
    return 0 if not errors else 1
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--work',required=True,help='Work directory containing final_rodb.json and map_extract/');a=p.parse_args();raise SystemExit(main(a.work))
