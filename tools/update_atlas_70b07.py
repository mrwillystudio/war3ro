"""Reconstruct and validate the uploaded-map atlas dataset; never change branches."""
from pathlib import Path
import base64, hashlib, json, os, subprocess, urllib.request
ROOT = Path(os.environ.get('ATLAS_SITE_ROOT', '.')).resolve()
WORK = Path(os.environ.get('ATLAS_BUILD_DIR', '/tmp/atlas-build'))
WORK.mkdir(parents=True, exist_ok=True)
API = 'https://api.github.com/repos/mrwillystudio/war3ro'
SHAS = [
 'e0f621189405e5b43b8ac614d0913ee4b237ca15',
 '144e3c048a7d1bfd52f1016538d822220b3a8502',
 'c93151d337becb8c88259191d050c1ee7082a2fc',
 '241c8d205d935eb3c1e95a391b8ac827a53a0101',
 '739aa0c556daf36a51946ff66d302d18231c3561',
 '340086d81e8424e9ddac148356f65b907106ced7',
 '75521e46d027fe9a0943b178b21f42e32c2a5aba',
 '7b3810c93d73695cabb3f622fb85fa6b3cfeff6f',
 '3c035b69170976e7e370b30aee526c116a2d860d',
 'd1d0e2aa849f7c2a8cf2529780a7ad306ecdddd0',
 '100550f85cf8ec39a348be46d56ccad4ed062681',
 '7f6fa9663c84076478264b3864077566552d1d4e',
 'cd377fe3bb4e0c5d4418798e1d9c5578d64a4532']

def api(path, payload=None):
    headers = {'Accept':'application/vnd.github+json','User-Agent':'atlas-70b07-validator'}
    if os.environ.get('GH_TOKEN'):
        headers['Authorization'] = 'Bearer ' + os.environ['GH_TOKEN']
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(API + path, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.load(response)

def blob(sha):
    cache = os.environ.get('ATLAS_BLOB_CACHE')
    data = (Path(cache)/sha).read_bytes() if cache else base64.b64decode(api('/git/blobs/'+sha)['content'])
    assert hashlib.sha1(('blob %d\0' % len(data)).encode()+data).hexdigest() == sha
    return base64.b64encode(data).decode()

parts = [blob(sha) for sha in SHAS]
u = parts[1]
prefix = (parts[0] + u[:5792] + u[6917:7448] + 'RFWegXnly' + u[7448:15406])[:29408]
assert hashlib.sha256(base64.b64decode(prefix)).hexdigest() == 'f9c01467286348a5f9533e741b6cc0d22ee526fd102e62a94d15d567eccf5d08'
repairs = {2:[[543,544,'N'],[607,608,''],[679,680,'Y'],[731,733,'Z'],[4001,4004,'n']],8:[[1226,1270,'']]}
for index, edits in repairs.items():
    for start, end, value in reversed(edits):
        parts[index] = parts[index][:start] + value + parts[index][end:]
encoded = prefix + ''.join(parts[2:])
assert len(encoded) == 71752
packed = base64.b64decode(encoded, validate=True)
assert hashlib.sha256(packed).hexdigest() == 'c109482d3b5ecdaf17b19267654805544017b5ebc489ede346632396e93e613b'
(WORK/'update.zst').write_bytes(packed)
loader = r"""
const fs=require('fs'),vm=require('vm');
const c={window:{__atlasParts:[]},console};vm.createContext(c);
for(const n of fs.readdirSync('atlas-data').filter(x=>/^part-\d+\.js$/.test(x)).sort()) vm.runInContext(fs.readFileSync('atlas-data/'+n,'utf8'),c);
c.window.RODB=JSON.parse(c.window.__atlasParts.join(''));
for(const n of ['model-previews-v11.js','model-previews-lowkey.js','map-corrections-r85.js']) vm.runInContext(fs.readFileSync('atlas-data/'+n,'utf8'),c);
if(process.argv[2]==='updated') vm.runInContext(fs.readFileSync('atlas-data/update-70b07.js','utf8'),c);
fs.writeFileSync(process.argv[1],JSON.stringify(c.window.RODB));
"""
subprocess.run(['node','-e',loader,str(WORK/'baseline.json')],cwd=ROOT,check=True)
base_bytes=(WORK/'baseline.json').read_bytes()
assert hashlib.sha256(base_bytes).hexdigest() == '53bce9f6e2019ea62a9de9d991f7bc96f2344fbdc5cb49dfe4052dfec0881dcd'
subprocess.run(['zstd','-d','--long=27','--patch-from='+str(WORK/'baseline.json'),str(WORK/'update.zst'),'-o',str(WORK/'updated.json'),'-f'],check=True)
new_bytes=(WORK/'updated.json').read_bytes()
assert hashlib.sha256(new_bytes).hexdigest() == '446644deac4a3accaab59b0da400dcdf17cffed19efe23b768d437060bc43139'
old=json.loads(base_bytes); new=json.loads(new_bytes)
assert new['meta']['version'] == 'Ro-Online 7.0b07'
assert new['meta']['sha256'] == 'ec9ffd6c97bfefb647f1498e1b21f409c17068784855138ebdc53a15405fb057'
assert old['assets']['worldmap'] == new['assets']['worldmap']
assert len(old['areas']) == len(new['areas']) == 40
assert all(a['mapRegions']==b['mapRegions'] for a,b in zip(old['areas'],new['areas']))
patch={'meta':new['meta'],'records':{},'replace':{},'assets':{k:v for k,v in new['assets'].items() if old['assets'].get(k)!=v}}
for kind in ['monsters','items','areas']:
    before={v['id']:v for v in old[kind]}; after={v['id']:v for v in new[kind]}; changes={}
    for ident, record in after.items():
        change=record if ident not in before else {k:v for k,v in record.items() if k not in before[ident] or before[ident][k]!=v}
        if change: changes[ident]=change
    patch['records'][kind]={'changes':changes,'remove':[k for k in before if k not in after]}
for kind in ['drops','recipes','sets','shops','sources','mvpDropPools']:
    if old[kind]!=new[kind]: patch['replace'][kind]=new[kind]
(WORK/'patch.json').write_text(json.dumps(patch,ensure_ascii=False,separators=(',',':')),encoding='utf8')
subprocess.run(['python','tools/package_atlas_70b07.py'],cwd=ROOT,check=True,env={**os.environ,'ATLAS_SITE_ROOT':str(ROOT),'ATLAS_BUILD_DIR':str(WORK)})
subprocess.run(['node','-e',loader,str(WORK/'runtime.json'),'updated'],cwd=ROOT,check=True)
runtime=json.loads((WORK/'runtime.json').read_text())
for kind in ['monsters','items','areas']:
    assert {r['id']:r for r in runtime[kind]} == {r['id']:r for r in new[kind]},kind
for kind in new:
    if kind not in ['monsters','items','areas']: assert runtime[kind]==new[kind],kind
report={'version':new['meta']['version'],'source':new['meta']['file'],'sha256':new['meta']['sha256'],'coverage':new['meta']['coverage'],'verifiedSections':new['meta']['verifiedSections'],'referenceSections':new['meta']['referenceSections'],'preservedAreas':40,'runtimeMatchesParsedDataset':True,'files':{}}
expected={'index.html':'a3ed5ec230f62041eced275b456babb5ee6676f7','atlas-data/update-70b07.js':'418eac829618f49f656c5dc6498f65ab3ed8876b'}
for filename in ['index.html','atlas-data/update-70b07.js']:
    data=(ROOT/filename).read_bytes()
    sha=hashlib.sha1(('blob %d\0' % len(data)).encode()+data).hexdigest()
    assert sha==expected[filename],filename
    if os.environ.get('GH_TOKEN'):
        stored=api('/git/blobs',{'content':base64.b64encode(data).decode(),'encoding':'base64'})
        assert stored['sha']==sha
    report['files'][filename]={'sha':sha,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
(ROOT/'atlas-update-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(report,ensure_ascii=False,indent=2))
