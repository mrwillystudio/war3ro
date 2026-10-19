// WORLD-CORRECTION-WORKSPACE-20261019
// Review suggestions only. Never mutate D.monsters, placements, or region assignments.
const workspaceKey='ROATLAS-world-corrections-v1';
const workspace={enabled:false,rows:[],savedAt:null,storageError:'',batch:''};
const workspaceSource=()=>({mapVersion:D.meta.mapVersion||D.meta.version,mapBuild:D.meta.mapBuild||'',dataRevision:D.meta.dataRevision||D.meta.version,datasetSHA:D.meta.sha256||''});
const workspaceIdentity=(m,p,index)=>JSON.stringify([m.id,p.line??null,p.x,p.y,index]);
const workspaceRegion=value=>String(value??'').replace(/[\r\n\t\u2028\u2029「」]/g,' ').trim().slice(0,100);
function workspaceSnapshot(m,p,index){return {key:workspaceIdentity(m,p,index),monsterId:m.id,monsterName:m.name,placementIndex:index,sourceLine:p.line??null,kind:p.kind||'預放座標',x:p.x,y:p.y,originalAreaId:p.area||'',originalAreaName:p.areaName||A.get(p.area)?.name||'未標區域',targetArea:'',source:workspaceSource()};}
function workspaceResolve(row){const m=M.get(row.monsterId),p=m?.placements?.[row.placementIndex];return p&&workspaceIdentity(m,p,row.placementIndex)===row.key?{m,p}:null;}
function workspaceRead(raw){
 if(!raw)return {rows:[],savedAt:null};
 const data=JSON.parse(raw);
 if(data?.format!==workspaceKey||!Array.isArray(data.rows)||data.rows.length>5000)throw new Error('草稿格式不符');
 const seen=new Set(),rows=[];
 for(const r of data.rows){
  if(!r||typeof r.monsterId!=='string'||typeof r.monsterName!=='string'||!Number.isFinite(r.x)||!Number.isFinite(r.y)||!Number.isInteger(r.placementIndex)||r.placementIndex<0||r.sourceLine!=null&&!Number.isFinite(r.sourceLine))throw new Error('點位資料不完整');
  const key=JSON.stringify([r.monsterId,r.sourceLine??null,r.x,r.y,r.placementIndex]);
  if(r.key!==key)throw new Error('點位識別碼不符');
  if(seen.has(key))continue;
  seen.add(key);
  const source=r.source&&typeof r.source==='object'?Object.fromEntries(['mapVersion','mapBuild','dataRevision','datasetSHA'].map(k=>[k,String(r.source[k]||'')])):{};
  rows.push({key,monsterId:r.monsterId,monsterName:r.monsterName.slice(0,200),placementIndex:r.placementIndex,sourceLine:r.sourceLine??null,kind:String(r.kind||'預放座標').slice(0,100),x:r.x,y:r.y,originalAreaId:String(r.originalAreaId||'').slice(0,100),originalAreaName:String(r.originalAreaName||'未標區域').slice(0,200),targetArea:workspaceRegion(r.targetArea),source});
 }
 return {rows,savedAt:typeof data.savedAt==='string'?data.savedAt:null};
}
try{Object.assign(workspace,workspaceRead(localStorage.getItem(workspaceKey)));}catch{workspace.storageError='無法讀取本機草稿；目前清單仍可使用，請複製或匯出備份。';}
function workspacePayload(){return {format:workspaceKey,schemaVersion:1,...workspaceSource(),savedAt:workspace.savedAt,rows:workspace.rows};}
function workspaceSave(){
 workspace.savedAt=new Date().toISOString();
 try{localStorage.setItem(workspaceKey,JSON.stringify(workspacePayload()));workspace.storageError='';}catch{workspace.storageError='草稿未能儲存（儲存空間不足或權限受限）；離開前請複製或匯出。';}
}
function workspaceText(){return '[世界地圖 魔物分布修正清單]：\n'+workspace.rows.map(r=>`${r.monsterName} (${r.x}, ${r.y}) 修正為「${workspaceRegion(r.targetArea)}」`).join('\n');}
function workspaceStale(r){return !workspaceResolve(r)||r.source?.datasetSHA!==workspaceSource().datasetSHA||r.source?.dataRevision!==workspaceSource().dataRevision;}
function workspaceMarkPoints(){
 if(!workspace.enabled)return;
 const rows=new Map(workspace.rows.map(r=>[r.key,r]));
 $$('#world-map [data-action="map-point"]').forEach(b=>{
  const m=M.get(b.dataset.id),index=Number(b.dataset.placement),p=m?.placements?.[index];
  const r=p?rows.get(workspaceIdentity(m,p,index)):null;
  b.classList.toggle('is-queued',!!r);b.classList.toggle('is-complete',!!r?.targetArea);
  b.setAttribute('aria-pressed',String(!!r));
  if(p)b.setAttribute('aria-label',`${m.name} (${p.x}, ${p.y})，${r?'已加入修正清單':'加入修正清單'}`);
 });
}
function workspaceRow(r,i){return `<article class="workspace-row ${r.targetArea?'is-complete':''}" data-workspace-key="${esc(r.key)}"><div class="workspace-row-top"><span class="workspace-row-number">${String(i+1).padStart(2,'0')}</span><div class="workspace-row-title"><b>${esc(r.monsterName)}</b><code>(${r.x}, ${r.y})</code></div><button class="workspace-remove" data-action="workspace-remove" data-key="${esc(r.key)}" aria-label="移除 ${esc(r.monsterName)} (${r.x}, ${r.y})" title="移除此筆">×</button></div><div class="workspace-original"><span>原地區：${esc(r.originalAreaName)}</span><button class="workspace-locate" data-action="workspace-locate" data-key="${esc(r.key)}" ${workspaceResolve(r)?'':'disabled'}>定位</button></div><label class="workspace-field">修正為「<input type="text" data-workspace-region="${esc(r.key)}" list="workspace-regions" value="${esc(r.targetArea)}" maxlength="100" placeholder="填寫正確地區" autocomplete="off" aria-label="${esc(r.monsterName)} (${r.x}, ${r.y}) 正確地區">」</label>${workspaceStale(r)?'<p class="workspace-stale">舊版草稿或點位已變更，請核對後再使用。</p>':''}</article>`;}
function workspacePanel(){return `<aside class="workspace-panel" aria-label="魔物分布修正清單"><div class="workspace-panel-head"><div class="eyebrow">CORRECTION WORKSPACE</div><h2>魔物分布修正清單</h2><p>點一下地圖圓點，再填「」內的正確地區。</p><div class="workspace-status" aria-live="polite"><b id="workspace-count"></b><span id="workspace-progress"></span></div><div class="workspace-batch"><input id="workspace-batch" type="text" list="workspace-regions" maxlength="100" value="${esc(workspace.batch)}" placeholder="多筆同地區：輸入地區名稱" aria-label="批次填入的地區名稱"><button class="btn" data-action="workspace-fill" title="只填寫目前清單中空白的地區，不覆蓋已填資料">填入空白筆</button></div></div><div class="workspace-list" id="workspace-list"></div><div class="workspace-footer"><button class="btn btn-primary" data-action="workspace-copy">${ic('code')} 複製修正清單</button><div class="workspace-secondary"><button class="btn" data-action="workspace-txt">下載 TXT</button><button class="btn" data-action="workspace-json">JSON 備份</button><button class="btn workspace-clear" data-action="workspace-clear">清空</button></div><p class="workspace-save" id="workspace-save" role="status"></p><details class="workspace-preview"><summary>查看輸出格式</summary><textarea id="workspace-preview" readonly aria-label="修正清單純文字預覽"></textarea></details></div><datalist id="workspace-regions">${[...new Set(D.areas.map(a=>a.name))].map(name=>`<option value="${esc(name)}"></option>`).join('')}</datalist></aside>`;}
function workspaceRefreshStats(){
 if(!workspace.enabled||!$('#workspace-count'))return;
 const count=workspace.rows.length,done=workspace.rows.filter(r=>r.targetArea).length;
 $('#workspace-count').textContent=`${count} 筆點位`;
 $('#workspace-progress').textContent=`已填 ${done} · 待填 ${count-done}`;
 $('#workspace-preview').value=workspaceText();
 const status=$('#workspace-save');
 status.textContent=workspace.storageError||(workspace.savedAt?'草稿已自動儲存在此瀏覽器；空白筆會保留「」。':'草稿只保存在此瀏覽器；不會上傳或直接修改正式資料。');
 status.classList.toggle('has-error',!!workspace.storageError);
 $$('.workspace-footer button,.workspace-batch button').forEach(b=>{b.disabled=!count;});
 workspaceMarkPoints();
}
function workspaceRefresh(focusKey=null){
 if(!workspace.enabled)return;
 const list=$('#workspace-list');if(!list)return;
 const scroll=list.scrollTop;
 list.innerHTML=workspace.rows.length?workspace.rows.map(workspaceRow).join(''):`<div class="workspace-empty">${ic('pin')}<b>從第一個點位開始</b><p>可連續點選多筆，再一起填地區。<br>同一個點位不會重複加入。</p></div>`;
 workspaceRefreshStats();
 if(focusKey){const row=$$('[data-workspace-key]',list).find(b=>b.dataset.workspaceKey===focusKey);if(row){list.scrollTop=Math.max(0,row.offsetTop-list.offsetTop-10);if(matchMedia('(min-width:761px) and (pointer:fine)').matches)$('input',row)?.focus({preventScroll:true});}}else list.scrollTop=scroll;
}
function workspaceAdd(button){
 const m=M.get(button.dataset.id),index=Number(button.dataset.placement),p=m?.placements?.[index];
 if(!p||!Number.isInteger(index)||!Number.isFinite(p.x)||!Number.isFinite(p.y)){toast('此點位缺少原始座標，未加入清單。');return;}
 const row=workspaceSnapshot(m,p,index),exists=workspace.rows.some(r=>r.key===row.key);
 if(!exists){workspace.rows.push(row);workspaceSave();}
 workspaceRefresh(row.key);
 toast(exists?'這個點位已在清單中，已定位至該筆。':`已加入 ${m.name}；目前 ${workspace.rows.length} 筆。`);
}
function workspaceLocate(key){
 const row=workspace.rows.find(r=>r.key===key),found=row&&workspaceResolve(row);if(!found){toast('找不到原始點位，請核對資料版本。');return;}
 // Never use the area-filtered data-index to identify an original placement.
 if(!$$('#world-map [data-action="map-point"]').some(b=>b.dataset.id===row.monsterId&&Number(b.dataset.placement)===row.placementIndex)){world.area='all';world.monster=row.monsterId;world.shop=null;render();}
 const viewport=$('#world-map'),surface=$('.map-surface',viewport);
 viewport.scrollLeft=surface.clientWidth*found.p.map[0]/100-viewport.clientWidth/2;
 viewport.scrollTop=surface.clientHeight*found.p.map[1]/100-viewport.clientHeight/2;
 const b=$$('[data-action="map-point"]',viewport).find(b=>b.dataset.id===row.monsterId&&Number(b.dataset.placement)===row.placementIndex);
 b?.focus({preventScroll:true});
 if(matchMedia('(max-width:760px)').matches)viewport.scrollIntoView({block:'center'});
}
async function workspaceCopy(){
 const text=workspaceText();let copied=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}}catch{}
 if(!copied){const previous=document.activeElement,el=document.createElement('textarea');el.value=text;el.setAttribute('aria-label','複製修正清單');el.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(el);el.select();try{copied=document.execCommand('copy');}catch{}el.remove();previous?.focus({preventScroll:true});}
 if(copied){const pending=workspace.rows.filter(r=>!r.targetArea).length;toast(`已複製 ${workspace.rows.length} 筆${pending?`；${pending} 筆待填，保留「」`:''}。`);}else{const el=$('#workspace-preview');el.closest('details').open=true;el.focus();el.select();toast('瀏覽器未允許自動複製；已選取清單，請按 Ctrl+C 或長按複製。');}
}
function workspaceDownloadText(){const blob=new Blob(['\uFEFF'+workspaceText()+'\n'],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='RO_ATLAS_魔物分布修正清單.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('已建立修正清單 TXT。');}
function workspaceClick(action,b){
 if(!workspace.enabled)return;
 if(action==='workspace-copy'&&workspace.rows.length){void workspaceCopy();return;}
 if(action==='workspace-txt'&&workspace.rows.length){workspaceDownloadText();return;}
 if(action==='workspace-json'&&workspace.rows.length){downloadJSON({...workspacePayload(),exportedAt:new Date().toISOString()},'RO_ATLAS_魔物分布校正備份.json');return;}
 if(action==='workspace-locate'){workspaceLocate(b.dataset.key);return;}
 if(action==='workspace-remove'){workspace.rows=workspace.rows.filter(r=>r.key!==b.dataset.key);workspaceSave();workspaceRefresh();return;}
 if(action==='workspace-clear'){if(!workspace.rows.length||!confirm(`確定清空 ${workspace.rows.length} 筆校正草稿？尚未複製或匯出的內容將被移除。`))return;workspace.rows=[];workspaceSave();workspaceRefresh();toast('校正草稿已清空；正式地圖資料未變動。');return;}
 if(action==='workspace-fill'){const region=workspaceRegion($('#workspace-batch').value);if(!region){$('#workspace-batch').focus();toast('請先填寫要套用的地區名稱。');return;}workspace.batch=region;let n=0;workspace.rows.forEach(r=>{if(!r.targetArea){r.targetArea=region;n++;}});workspaceSave();workspaceRefresh();toast(`已填入 ${n} 筆空白地區；已填資料未覆蓋。`);}
}
function workspaceInput(e){
 if(!workspace.enabled)return;
 if(e.target.id==='workspace-batch'){workspace.batch=e.target.value;return;}
 const key=e.target.dataset.workspaceRegion;if(!key)return;
 const row=workspace.rows.find(r=>r.key===key);if(!row)return;
 // Do not rerender the field while an IME composition is active.
 row.targetArea=workspaceRegion(e.target.value);workspaceSave();
 e.target.closest('.workspace-row')?.classList.toggle('is-complete',!!row.targetArea);
 workspaceRefreshStats();
}
document.addEventListener('input',workspaceInput);
document.addEventListener('compositionend',workspaceInput);
window.addEventListener('storage',e=>{
 if(e.key!==workspaceKey&&e.key!==null)return;
 try{const next=workspaceRead(e.key===null?null:e.newValue);workspace.rows=next.rows;workspace.savedAt=next.savedAt;workspace.storageError='';if(workspace.enabled){const active=document.activeElement,key=active?.dataset?.workspaceRegion,start=active?.selectionStart,end=active?.selectionEnd;workspaceRefresh();if(key){const input=$$('[data-workspace-region]').find(el=>el.dataset.workspaceRegion===key);input?.focus({preventScroll:true});if(input&&start!=null)input.setSelectionRange(start,end??start);}}}catch{workspace.storageError='另一個分頁的草稿無法讀取；已保留目前清單。';workspaceRefreshStats();}
});
function renderWorldWorkspace(){
 const pool=worldPool(),points=pool.reduce((n,m)=>n+placementsForArea(m,world.area).length,0);
 return `<div class="workspace-heading">${intro('魔物點位校正工作台','','點選預放魔物，自動帶入名稱與原始座標；只要填寫正確地區。','WORLD MAP / WORKSPACE')}<a class="btn" href="#world">離開工作台 ${ic('arrowUp')}</a></div><div class="workspace-notice">${ic('info')}這是校正草稿，不會直接更改網站資料或遊戲中的魔物位置。</div><div class="filter-panel"><div class="filter-top">${select('worldArea',[['all','所有地區'],...D.areas.map(a=>[a.id,a.name])],world.area,'地區')}${select('worldMonster',[['all','所有已收錄魔物'],...visibleMonsters.filter(m=>m.placements.length).sort((a,b)=>(a.level??Infinity)-(b.level??Infinity)).map(m=>[m.id,`${m.name} · Lv.${m.level??'—'}`])],world.monster,'指定魔物')}<span class="filter-count">${num(points)} 個預放點位</span><button class="text-link" data-action="world-reset">${ic('reset')} 重設地圖篩選</button></div></div><div class="world-layout workspace-layout"><section class="world-map-panel"><div class="world-toolbar"><h2>${ic('map')} 點選圓點加入清單</h2><button data-action="zoom" data-step="-0.5" aria-label="縮小地圖" ${world.zoom<=1?'disabled':''}>${ic('minus')}</button><span class="zoom-value">${Math.round(world.zoom*100)}%</span><button data-action="zoom" data-step="0.5" aria-label="放大地圖" ${world.zoom>=3?'disabled':''}>${ic('plus')}</button></div><div class="map-viewport" id="world-map"><div class="map-surface" style="width:${world.zoom*100}%">${mapMarkup(pool,true,world.area)}</div></div><div class="map-caption"><b><i class="legend-dot grade-normal"></i> 一般</b><b><i class="legend-dot grade-boss"></i> BOSS</b><b><i class="legend-dot grade-mvp"></i> MVP</b><b class="workspace-legend"><i></i> 已加入清單</b></div><p class="map-help">可先點選十筆，再一起填寫地區。重複點選只會定位到原有紀錄，不會新增重複筆。<br>密集或重疊的圓點，可先用「指定魔物」篩選，再放大地圖選取。</p></section>${workspacePanel()}</div>`;
}
