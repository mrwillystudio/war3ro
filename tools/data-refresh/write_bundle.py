from pathlib import Path
import argparse,hashlib,json,re

parser=argparse.ArgumentParser(description='Write the audited 7.0c08 overlay and cache-busted loader')
parser.add_argument('--work',type=Path,required=True)
parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2])
args=parser.parse_args()
repo=args.repo.resolve()
data=json.loads((args.work/'final_rodb.json').read_text())
old=json.loads((args.work/'current_rodb.json').read_text())
payload={'meta':data['meta'],'replace':{k:v for k,v in data.items() if k not in ['meta','assets','areas']},
         'assets':{k:v for k,v in data['assets'].items() if old['assets'].get(k)!=v}}
assert data['areas']==old['areas']
code='''/* RO ATLAS — Ro-Online 7.0c08; current-map data and independent native inheritance. */
(function(){'use strict';const D=window.RODB;
if(!D||D.meta.sha256!=='ec9ffd6c97bfefb647f1498e1b21f409c17068784855138ebdc53a15405fb057'||D.areas.length!==40)throw new Error('7.0c08 requires the verified baseline and geographical correction layer');
const P='''+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+''';
Object.assign(D,P.replace);D.meta=P.meta;Object.assign(D.assets,P.assets);
const I=new Set(D.items.map(x=>x.id)),M=new Set(D.monsters.map(x=>x.id));
if(I.size!==D.items.length||M.size!==D.monsters.length)throw new Error('Duplicate catalog IDs');
if(D.drops.some(d=>!I.has(d.item)||!M.has(d.monster))||D.recipes.some(r=>!I.has(r.result)||r.materials.some(m=>!I.has(m.id))))throw new Error('Catalog reference mismatch');
if(D.items.some(i=>!Number.isFinite(i.gold)||!Number.isFinite(i.mvpCost)))throw new Error('Unverified object cost');
if(D.meta.version!=='Ro-Online 7.0c08')throw new Error('Atlas version mismatch');
})();
'''
target=repo/'atlas-data/update-70c08.js';target.write_text(code)
h=hashlib.sha256(code.encode()).hexdigest()
p=repo/'index.html';html=p.read_text()
html=re.sub(r'<script src="\./atlas-data/update-70c08\.js(?:\?[^"]*)?"></script>','',html)
marker='<script>/* RO ATLAS · v68'
assert html.count(marker)==1
html=html.replace(marker,f'<script src="./atlas-data/update-70c08.js?v={h[:12]}"></script>'+marker)
p.write_text(html)
print(json.dumps({'path':str(target),'size':target.stat().st_size,'sha256':h,'newAssets':len(payload['assets'])}))
