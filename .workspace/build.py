from pathlib import Path
import subprocess
import re
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'index.html'
s=p.read_text(encoding='utf-8')
assert 'WORLD-CORRECTION-WORKSPACE-20261019' not in s, 'Already patched; start from the original index.html'
def replace(old,new):
 global s
 assert s.count(old)==1,(old[:120],s.count(old))
 s=s.replace(old,new,1)
replace('</style>', '\n'+(ROOT/'.workspace/workspace.css').read_text(encoding='utf-8')+'\n</style>')
replace('function render(){nav();', (ROOT/'.workspace/workspace.js').read_text(encoding='utf-8')+'\nfunction render(){nav();')
replace('function renderWorld(){const pool=worldPool()', 'function renderWorld(){if(workspace.enabled)return renderWorldWorkspace();const pool=worldPool()')
# data-index is the filtered index. Keep it for legacy behavior; add the original index.
replace('data-id="${m.id}" data-index="${n}" title="${esc(m.name)}', 'data-id="${m.id}" data-index="${n}" data-placement="${m.placements.indexOf(p)}" title="${esc(m.name)}')
replace('main.innerHTML=pages[route]();hydrate();renderCompareBar();setupInfiniteScroll();}', 'main.innerHTML=pages[route]();hydrate();renderCompareBar();setupInfiniteScroll();if(workspace.enabled&&route===\'world\')workspaceRefresh();}')
old="function hashChanged(){const parts=location.hash.slice(1).split('/');let next=parts[0]||'monsters';if(!routes[next])next='monsters';if(next!==route||!main.innerHTML){route=next;render();window.scrollTo({top:0});}else nav();"
new="function hashChanged(){const fragment=location.hash.slice(1),q=fragment.indexOf('?'),path=q<0?fragment:fragment.slice(0,q),params=new URLSearchParams(q<0?'':fragment.slice(q+1)),parts=path.split('/');let next=parts[0]||'monsters';if(!routes[next])next='monsters';const editing=next==='world'&&params.get('p')==='workspace',modeChanged=editing!==workspace.enabled;workspace.enabled=editing;if(next!==route||modeChanged||!main.innerHTML){route=next;render();window.scrollTo({top:0});}else nav();"
replace(old,new)
replace("const hash=`${route}/${type}/${encodeURIComponent(id)}`;", "const hash=`${route}/${type}/${encodeURIComponent(id)}${workspace.enabled&&route==='world'?'?p=workspace':''}`;")
replace("if(update&&location.hash.includes('/'))location.hash=route;", "if(update&&location.hash.includes('/'))location.hash=route+(workspace.enabled&&route==='world'?'?p=workspace':'');")
replace("const action=b.dataset.action,id=b.dataset.id,value=b.dataset.value;\n switch(action){", "const action=b.dataset.action,id=b.dataset.id,value=b.dataset.value;\n if(action.startsWith('workspace-')){workspaceClick(action,b);return;}\n switch(action){")
replace("case 'map-point':openEntity('m',id,'map');break;", "case 'map-point':if(workspace.enabled&&b.closest('#world-map'))workspaceAdd(b);else openEntity('m',id,'map');break;")
p.write_text(s,encoding='utf-8')
# Syntax-check every inline script without loading the application data.
for n,script in enumerate(re.findall(r'<script\b[^>]*>(.*?)</script>',s,re.S|re.I)):
 if not script.strip():continue
 tmp=ROOT/'.workspace'/f'check-{n}.js';tmp.write_text(script,encoding='utf-8')
 try:subprocess.run(['node','--check',str(tmp)],check=True)
 finally:tmp.unlink()
print(f'Patched index.html: {len(s.encode("utf-8"))} bytes; inline JavaScript syntax OK')
