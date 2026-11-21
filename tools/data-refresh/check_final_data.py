from pathlib import Path
import argparse,hashlib,json,re,sys
parser=argparse.ArgumentParser(description='Independently audit a rebuilt RO Atlas dataset against extracted map objects and source lines.')
parser.add_argument('--work',type=Path,required=True,help='Extraction work directory containing map_extract/ and current_rodb.json')
parser.add_argument('--dataset',type=Path,help='Rebuilt JSON dataset (default: WORK/final_rodb.json)')
parser.add_argument('--map',dest='map_file',type=Path,help='Optional original W3X; verify SHA-256 against dataset metadata')
parser.add_argument('--report',type=Path,help='Optional JSON report destination; stdout always receives the report')
args=parser.parse_args()
W=args.work.resolve();M=W/'map_extract' 
def load(p):return json.loads(p.read_text())
D=load(args.dataset or W/'final_rodb.json');old=load(W/'current_rodb.json');raw={x['id']:x for x in load(M/'objects_w3t.json')['objects']};native=load(M/'native_item_127.json');units={x['id']:x for x in load(M/'objects_w3u.json')['objects']};un=load(M/'native_unit_127.json');j=(M/'extracted/war3map.j').read_text();lines=j.splitlines();funcs={m.group(1):(j.count('\n',0,m.start())+1,m.group(0))for m in re.finditer(r'^function (\w+)\b.*?^endfunction',j,re.M|re.S)}
issues=[]
def check(cond,msg,*detail):
 if not cond:issues.append({'check':msg,'details':list(detail)})
def baseprice(rid):
 obj=raw.get(rid,{});n=native.get(obj.get('base_id',rid),{});f=obj.get('fields',{});return [f.get('igol',n.get('goldcost')),f.get('ilum',n.get('lumbercost'))]
if args.map_file:check(hashlib.sha256(args.map_file.read_bytes()).hexdigest()==D['meta'].get('sha256'),'source map hash matches dataset')
I={i['id']:i for i in D['items']};U={m['id']:m for m in D['monsters']};S={s['unit']:s for s in D['shops']};A={a['id']:a for a in D['areas']};pools={p['id']:p for p in D['mvpDropPools']}
for name in ['items','monsters','drops','recipes','sets','areas','regions','mvpDropPools']:
 vals=D[name];ids=[x['id'] for x in vals];check(len(set(ids))==len(ids),'unique IDs',name)
for i in D['items']:
 check([i.get('gold'),i.get('mvpCost')]==baseprice(i['id']),'native template + own object cost',i['id'],[i.get('gold'),i.get('mvpCost')],baseprice(i['id']))
 check(not re.search(r'TRIGSTR_\d+',i.get('name','')),'resolved item name',i['id'])
 for a in i.get('triggerSources',[]):
  check(a.get('function') in funcs,'item trigger function exists',i['id'],a.get('function'))
 for s in i.get('shopSources',[]):
  check(s['unit'] in S,'item shop exists',i['id'],s['unit'])
  check([s.get('gold'),s.get('mvpCost')]==baseprice(s['soldItem']),'shop source menu price',i['id'],s['soldItem'])
  check(any(o['soldItem']==s['soldItem'] and o['item']==i['id'] for o in S[s['unit']]['offers']),'bidirectional shop mapping',i['id'],s['unit'],s['soldItem'])
 if i.get('buyPrice'):
  prices={tuple([s.get('gold'),s.get('mvpCost')])for s in i.get('shopSources',[])};check(len(prices)==1 and tuple([i['buyPrice']['gold'],i['buyPrice']['mvpCost']]) in prices,'aggregated price consistency',i['id'])
for s in D['shops']:
 r=units[s['unit']];sell=str(r['fields'].get('usei',un.get(r['base_id'],{}).get('sellitems',''))).split(',')
 for o in s['offers']:
  check(o['soldItem'] in sell,'sold menu in NPC usei',s['unit'],o['soldItem']);check(o['item'] in I,'shop item resolves',s['unit'],o['item']);check([o.get('gold'),o.get('mvpCost')]==baseprice(o['soldItem']),'shop menu object price',s['unit'],o['soldItem'])
  if 'line' in o:check("'"+o['item']+"'" in lines[o['line']-1],'purchase alias source',s['unit'],o['item'],o['line'])
 for p in s['positions']:check("'"+s['unit']+"'" in lines[p['line']-1] and 'CreateUnit' in lines[p['line']-1],'NPC placement source',s['unit'],p['line'])
for d in D['drops']:
 check(d['item'] in I and d['monster'] in U,'drop references',d['id']);check(0<=d['rate']<=100,'drop rate bounds',d['id']);check("'"+d['item']+"'" in lines[d['line']-1],'drop source item',d['id'])
 if d.get('poolId'):
  p=pools[d['poolId']];check(d['item'] in p['items'] and d['monster']==p['monster'],'pool/drop link',d['id']);check(d['minDeath']==p['minDeath'],'death gate matches',d['id']);check(d.get('rolls')==p['roll'],'roll count matches',d['id'])
for p in D['mvpDropPools']:
 check(p['monster'] in U and all(i in I for i in p['items']),'pool references',p['id']);check('RODrop_Pool' in lines[p['lines'][0]-1],'pool source',p['id']);check(len([d for d in D['drops']if d.get('poolId')==p['id']])==len(p['items']),'pool candidates preserved',p['id'])
 linked=[d for d in D['drops']if d.get('poolId')==p['id']];check(abs(sum(d['rate']for d in linked)-p['rate'])<1e-4,'candidate probabilities sum to pool activation',p['id'])
for r in D['recipes']:
 check(r['result'] in I and all(x['id'] in I for x in r['materials']),'recipe references',r['id']);check("'"+r['result']+"'" in lines[r['line']-1],'recipe source result',r['id']);check(all(x['quantity']>0 for x in r['materials']),'recipe quantities positive',r['id'])
for s in D['sets']:check(all(i in I for i in s['itemIds']) and all(i in I for g in s['groups']for i in g['items']),'set references',s['id']);check(s['verificationStatus']=='verified-membership-and-direct-deltas','set membership verified',s['id'])
for m in D['monsters']:
 for rec in m.get('mvpSkills',{}).get('mechanics',[])+([m['summonGuide']] if m.get('summonGuide') else []):
  for n in rec.get('sourceLines',rec.get('lines',[])):
   check(isinstance(n,int) and 1<=n<=len(lines),'mechanic/guide source line in current JASS',m['id'],n)
  for ev in rec.get('sourceEvidence',rec.get('evidence',[])):
   n=ev.get('line');text=ev.get('text')
   if isinstance(n,int) and text is not None:
    check(1<=n<=len(lines) and lines[n-1].strip()==text.strip(),'mechanic/guide quoted source matches current JASS',m['id'],n)
 for p in m.get('placements',[]):
  check(p.get('area') is None or p['area'] in A,'placement area resolves',m['id']);check("'"+m['id']+"'" in lines[p['line']-1] and 'CreateUnit' in lines[p['line']-1],'monster placement source',m['id'],p['line'])
 for a in m.get('abilities',[]):
  check(('Rhpm' in str(a.get('requirements')))==(a['modeLabel']=='狂暴模式'),'rage requirement classification',m['id'],a['id'])
check(D['areas']==old['areas'],'manual geography preserved byte-equivalent')
oldplacements={(m['id'],p['x'],p['y']):(p.get('area'),p.get('areaName'))for m in old['monsters']for p in m.get('placements',[])}
newplacements={(m['id'],p['x'],p['y']):(p.get('area'),p.get('areaName'))for m in D['monsters']for p in m.get('placements',[])}
check(all(newplacements.get(k)==v for k,v in oldplacements.items()),'manual placement mappings preserved')
report={'counts':{k:len(D[k])for k in ['items','monsters','drops','recipes','sets','areas','regions','shops','mvpDropPools']},'verifiedObjectPrices':len(I),'verifiedShopOffers':sum(len(s['offers'])for s in D['shops']),'manualPlacementsPreserved':len(oldplacements),'issues':issues}
report['mapSha256']=D['meta'].get('sha256');report['sourceMapHashChecked']=bool(args.map_file)
text=json.dumps(report,ensure_ascii=False,indent=2)+'\n'
if args.report:
 args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(text)
print(text,end='')
sys.exit(1 if issues else 0)
