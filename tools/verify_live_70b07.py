"""Read-only public-site deployment verification."""
from pathlib import Path
import datetime,hashlib,json,re,subprocess,time,urllib.request,sys
BASE='https://war3ro.mrwillytw.workers.dev/'
EXPECTED={'index.html':'df1a2f28cec57f45e2faf96df5fe04151568fc41d5fb2dd636ef62b7ebf6a590','atlas-data/update-70b07.js':'e76a43c49f4299a99c1dc9f4053996fc9dede15b76de13eda250a644c32ff16f'}
REPORT={'url':BASE,'commit':'bc10d5e10c4b4d7d847acddabb00d599559c0916','expectedVersion':'Ro-Online 7.0b07','files':{},'attempts':[]}
def get(path):
    for n in range(4):
        try:
            print('GET',BASE+path,flush=True)
            req=urllib.request.Request(BASE+path,headers={'User-Agent':'Mozilla/5.0 RO-Atlas-Verification','Cache-Control':'no-cache'})
            with urllib.request.urlopen(req,timeout=25) as r:return r.read(),r.status
        except Exception as exc:
            print('HTTP_RETRY',path,str(exc),flush=True)
            if n==3:raise
            time.sleep(4)
try:
    index,status=get('?verify=bc10d5e-final')
    digest=hashlib.sha256(index).hexdigest()
    assert digest==EXPECTED['index.html'],('index mismatch',digest)
    Path('index.html').write_bytes(index)
    REPORT['files']['index.html']={'sha256':digest,'httpStatus':status,'matchesValidatedRelease':True}
    for src in re.findall(r'<script src="([^"]+)"',index.decode()):
        name=src.split('?')[0].removeprefix('./')
        assert name.startswith('atlas-data/') and '..' not in name
        data,status=get(src.removeprefix('./'))
        sha=hashlib.sha256(data).hexdigest()
        if name in EXPECTED:assert sha==EXPECTED[name],name
        else:assert data==Path(name).read_bytes(),'Existing data changed: '+name
        Path(name).write_bytes(data)
        REPORT['files'][name]={'sha256':sha,'httpStatus':status,'matchesValidatedRelease':True}
    node=r"""
const fs=require('fs'),vm=require('vm');const c={window:{__atlasParts:[]},console};vm.createContext(c);
for(const n of fs.readdirSync('atlas-data').filter(x=>/^part-\d+\.js$/.test(x)).sort())vm.runInContext(fs.readFileSync('atlas-data/'+n,'utf8'),c);
c.window.RODB=JSON.parse(c.window.__atlasParts.join(''));
for(const n of ['model-previews-v11.js','model-previews-lowkey.js','map-corrections-r85.js','update-70b07.js'])vm.runInContext(fs.readFileSync('atlas-data/'+n,'utf8'),c);
const d=c.window.RODB;if(d.meta.version!=='Ro-Online 7.0b07')throw Error('version');
if(d.areas.length!==40||d.monsters.length!==186||d.items.length!==977||d.drops.length!==469||d.recipes.length!==60)throw Error('counts');
for(const id of ['Udth','UKrk'])if(!d.monsters.some(m=>m.id===id))throw Error('missing '+id);
console.log(JSON.stringify({version:d.meta.version,sourceSha256:d.meta.sha256,monsters:d.monsters.length,items:d.items.length,drops:d.drops.length,recipes:d.recipes.length,areas:d.areas.length,newMonsters:d.monsters.filter(m=>['Udth','UKrk'].includes(m.id)).map(m=>({id:m.id,name:m.name}))}));
"""
    REPORT['runtime']=json.loads(subprocess.check_output(['node','-e',node],text=True))
    REPORT['passed']=True
except Exception as exc:
    REPORT['passed']=False
    REPORT['error']=str(exc)
finally:
    REPORT['checkedAtUTC']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    Path('atlas-live-verification.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2))
    print(json.dumps(REPORT,ensure_ascii=False,indent=2),flush=True)
assert REPORT['passed'],REPORT.get('error')
