from pathlib import Path
import json,hashlib,re,os
R=Path(os.environ.get('ATLAS_BUILD_DIR','/tmp/atlas-build')); site=Path(os.environ.get('ATLAS_SITE_ROOT','.'));D=json.loads((R/'updated.json').read_text());P=json.loads((R/'patch.json').read_text())
js='''/* Ro-Online 7.0b07 — map SHA-256: ec9ffd6c97bfefb647f1498e1b21f409c17068784855138ebdc53a15405fb057 */
(function(){'use strict';const D=window.RODB;if(!D||D.areas.length!==40)throw new Error('Atlas baseline/correction layer missing');
const P='''+json.dumps(P,ensure_ascii=False,separators=(',',':'))+''';
for(const [kind,change] of Object.entries(P.records)){const removed=new Set(change.remove),byId=new Map(D[kind].filter(x=>!removed.has(x.id)).map(x=>[x.id,x]));for(const [id,fields] of Object.entries(change.changes)){if(byId.has(id))Object.assign(byId.get(id),fields);else byId.set(id,fields);}D[kind]=[...byId.values()];}
Object.assign(D,P.replace);D.meta=P.meta;Object.assign(D.assets,P.assets);
const items=new Set(D.items.map(x=>x.id)),monsters=new Set(D.monsters.map(x=>x.id));if(D.drops.some(x=>!items.has(x.item)||!monsters.has(x.monster)))throw new Error('Atlas drop reference mismatch');if(D.meta.version!=='Ro-Online 7.0b07')throw new Error('Atlas version mismatch');
})();
'''
(site/'atlas-data/update-70b07.js').write_text(js)
s=(site/'index.html').read_text()
s=s.replace('RO ATLAS 7.0a09-v11','RO ATLAS — Ro-Online 7.0b07').replace('RO-ONLINE 7.0a09-v11','Ro-Online 7.0b07').replace('RO-Online 7.0a09-v11','Ro-Online 7.0b07').replace('地圖 7.0a09-v11','Ro-Online 7.0b07')
s=s.replace('<script src="./atlas-data/map-corrections-r85.js"></script>','<script src="./atlas-data/map-corrections-r85.js"></script><script src="./atlas-data/update-70b07.js?v=70b07-ec9ffd6c"></script>')
s=s.replace('<dt>資料建置</dt><dd>${esc(D.meta.mapBuild||\'—\')}</dd>','')
s=s.replace('<dt>本次補全</dt>','<dt>資料涵蓋</dt>')
s=s.replace('四個原生 MPQ、地圖物件覆寫、JASS 生成等級、STR 生命係數、MVP 觸發器、傳送區域說明與預放座標。沒有套用官方 RO 數值。','本版地圖物件覆寫、JASS 生成等級、STR 生命係數、掉落與合成表；原生基底沿用前版四個 MPQ 的解析結果。人工區域校正保留，沒有套用官方 RO 數值。')
s=s.replace('種魔物配有全身 MDX 模型靜態預覽；其中','種魔物沿用前版全身 MDX 模型靜態預覽（本次未重新渲染）；其中')
s=s.replace("pane=`${calculationPanel(m)}", "pane=`${m.locationNote?note(m.locationNote):''}${m.skillReferenceNote?note(m.skillReferenceNote):''}${calculationPanel(m)}")
s=s.replace("<summary>模型圖片與貼圖來源</summary><pre>","<summary>模型圖片與貼圖來源</summary>${m.previewReferenceNote?note(m.previewReferenceNote):''}<pre>")
s=s.replace("<small>${esc(m.id)} · 原始模型預覽</small>","<small>${esc(m.id)} · ${m.portrait?'前版模型預覽':'模型預覽待補'}</small>")
s=s.replace("${m.summonGuide?summonGuidePanel(m):`<p>","${m.summonGuide?summonGuidePanel(m):`${m.locationNote?note(m.locationNote):''}<p>")
s=s.replace("function sourceBlock(record,file='war3map.j'){const code=", "function sourceBlock(record,file='war3map.j'){if(record.sourceVersion)return `<details class=\"source-block\"><summary>${ic('code')} ${esc(record.sourceVersion)}</summary><pre>${esc(record.function||'')}\n來源版本：${esc(record.sourceVersion)}；歷史行號 ${record.line||'—'}，不作為本版行號。</pre></details>`;const code=")
s=s.replace('在 ${triggers.length} 段正式觸發程式中找到建立或給予此物品的指令。','前版於 ${triggers.length} 段觸發程式中找到建立或給予此物品的指令；本次未逐條重驗任務條件。')
s=s.replace('7.0a09-v11','7.0b07')
assert '7.0a09-v11' not in s
assert s.count('update-70b07.js')==1
(site/'index.html').write_text(s)
print('overlay',len(js.encode()),'index',len(s.encode()))
