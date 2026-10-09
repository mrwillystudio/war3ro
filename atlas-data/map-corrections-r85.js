/* RO ATLAS R8.5 — 2026-10-10 user-verified areas, monster zones and source map pins.
   Runs after the R8.4 LowKey overlay, before catalog initialization. No changes to game data. */
(function(){
"use strict";
const d=window.RODB;
if(!d||!Array.isArray(d.monsters)||!/^R8\.4\b/.test(d.meta?.dataRevision||""))throw Error("R8.5 requires R8.4");
const M=new Map(d.monsters.map(m=>[m.id,m])), A=new Map(d.areas.map(a=>[a.id,a]));
const checked={o00S:"礦工魔",otau:"狂暴米諾斯",o00F:"狂暴米諾斯",z001:"武士火槍兵",n014:"火忍西怒畢",O00A:"元靈武士",n01E:"大腳熊",n00E:"狂暴大腳熊",O00B:"虎王"};
for(const [id,name] of Object.entries(checked))if(M.get(id)?.name!==name)throw Error("R8.5 unexpected unit "+id);
for(const id of ["zone-1","zone-4","zone-5","zone-13","zone-18","zone-20","zone-26"])if(!A.has(id))throw Error("Missing zone "+id);
if(A.has("zone-39")||A.has("zone-40"))throw Error("Zone IDs already used");
const Z=id=>A.get(id),eastName="普隆德拉東門郊區",payonName="斐楊森林";
const forest=Z("zone-5"),kunlun=Z("zone-4"),tatami=Z("zone-13"),mine=Z("zone-26"),pyramid=Z("zone-20");
const findRegion=(area,id)=>area.mapRegions.find(r=>r.id===id);
const rEast=findRegion(forest,"zone-5-r8"),rKunlun=findRegion(kunlun,"zone-4-r1"),rPayon=findRegion(tatami,"zone-13-r1");
if(!rEast||rEast.points.length!==8||!rKunlun||!rPayon)throw Error("Region source changed");
const round=x=>Math.round(x*1000)/1000;
const mid=pts=>[round(pts.reduce((s,p)=>s+p[0],0)/pts.length),round(pts.reduce((s,p)=>s+p[1],0)/pts.length)];
const inside=(p,pts)=>{if(!p||!pts||pts.length<3)return false;let yes=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
function cut(points,x,left){
 const out=[],keep=p=>left?p[0]<=x+1e-8:p[0]>=x-1e-8;
 for(let i=0;i<points.length;i++){
  const a=points[(i+points.length-1)%points.length],b=points[i],pa=keep(a),pb=keep(b);
  if(pa!==pb){const t=(x-a[0])/(b[0]-a[0]);out.push([round(x),round(a[1]+(b[1]-a[1])*t)]);}
  if(pb)out.push([round(b[0]),round(b[1])]);
 }
 const clean=[];
 for(const p of out)if(!clean.length||Math.hypot(p[0]-clean[clean.length-1][0],p[1]-clean[clean.length-1][1])>0.0001)clean.push(p);
 if(clean.length>1&&Math.hypot(clean[0][0]-clean[clean.length-1][0],clean[0][1]-clean[clean.length-1][1])<0.0001)clean.pop();
 return clean;
}
function hull(coords,pad){
 const pts=[...new Map(coords.map(p=>[p.join(","),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const lo=[],hi=[];
 for(const p of pts){while(lo.length>1&&cross(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(hi.length>1&&cross(hi[hi.length-2],hi[hi.length-1],p)<=0)hi.pop();hi.push(p);}
 lo.pop();hi.pop();const ps=lo.concat(hi),c=mid(ps);
 return ps.map(p=>[round(p[0]+(p[0]<c[0]?-pad:pad)),round(p[1]+(p[1]<c[1]?-pad:pad))]);
}
const evidence="使用者校正 2026-10-10；區域輪廓依原區域及原生出生座標近似";
const region=(id,pts)=>({id,points:pts,primary:true,center:mid(pts),placements:0,correctionSource:evidence});
function makeArea(id,name,pts){
 return {id,name,monsters:[],x:mid(pts)[0],y:mid(pts)[1],count:0,source:evidence,bounds:[0,0,0,0],
 mapRegions:[region(id+"-r1",pts)],visibleMonsters:[],gradeCounts:{},regionSource:evidence,regionConfidence:"人工校對・邊界近似"};
}
const touched=new Set(),affected=new Set(["zone-1","zone-4","zone-5","zone-12","zone-13","zone-18","zone-20","zone-26","zone-39","zone-40"]);
const eastPoly=cut(rEast.points,77.3,true),rightPoly=cut(rEast.points,77.3,false),
 tatamiPoly=cut(rKunlun.points,10.2,true),kunlunPoly=cut(rKunlun.points,10.2,false);
if([eastPoly,rightPoly,tatamiPoly,kunlunPoly].some(x=>x.length<3))throw Error("Polygon split invalid");
const east=makeArea("zone-39",eastName,eastPoly);
forest.mapRegions=forest.mapRegions.map(r=>r.id===rEast.id?{...r,points:rightPoly,center:mid(rightPoly)}:r);
kunlun.mapRegions=kunlun.mapRegions.map(r=>r.id===rKunlun.id?{...r,points:kunlunPoly,center:mid(kunlunPoly)}:r);
const bounds=d.meta.mapBounds;
const mapFromXY=p=>[round((p.x-bounds.x1)/(bounds.x2-bounds.x1)*100),round((bounds.y2-p.y)/(bounds.y2-bounds.y1)*100)];
const tiger=M.get("O00B"),samurai=M.get("O00A");
const tp=(tiger.supersededPlacementSources||[]).find(p=>p.line===3630);
if(!tp)throw Error("Original Tiger King pin unavailable");
const payonPoly=hull(rPayon.points.concat(M.get("n01E").placements.filter(p=>p.area!=="zone-5").map(p=>p.map),
 M.get("n00E").placements.map(p=>p.map),[mapFromXY(tp)]),0.45);
const payon=makeArea("zone-40",payonName,payonPoly);
tatami.mapRegions=[region("zone-13-r2",tatamiPoly)];
tatami.regionSource=evidence;kunlun.regionSource=evidence;
function setPlace(p,a){if(!p.sourceAreaBeforeR85)p.sourceAreaBeforeR85=p.area;p.area=a.id;p.areaName=a.name;}
function setZone(m,ids){m.zones=[...ids];m.locationCorrectionSource=evidence;touched.add(m.id);}
function restore(m,line,a){
 if(m.placements.some(p=>p.line===line))return;
 const original=(m.supersededPlacementSources||[]).find(p=>p.line===line);
 if(!original)throw Error("Missing superseded source pin "+m.id+" "+line);
 m.placements.push({x:original.x,y:original.y,map:mapFromXY(original),kind:"預放座標",
 line:original.line,area:a.id,areaName:a.name,sourceAreaBeforeR85:original.area,restoredFromR84:true});
}
// User's red circle is the western section of the former forest region #8.
for(const m of d.monsters){
 let n=0;
 for(const p of m.placements){
  if(p.area==="zone-5"&&inside(p.map,eastPoly)){setPlace(p,east);n++;}
 }
 if(n){
  touched.add(m.id);
  if(!m.zones.includes("zone-39"))m.zones.push("zone-39");
  if(!m.placements.some(p=>p.area==="zone-5"))m.zones=m.zones.filter(z=>z!=="zone-5");
 }
}
const miner=M.get("o00S");setZone(miner,["zone-26"]);
for(const p of miner.placements)setPlace(p,mine);
mine.mapRegions=[region("zone-26-r1",hull(mine.mapRegions[0].points.concat(miner.placements.map(p=>p.map)),0.3))];
mine.regionSource=evidence;
// Two distinct unit IDs bear the same Chinese Minotaur name.
for(const id of ["otau","o00F"]){
 const m=M.get(id);setZone(m,["zone-20"]);
 if(m.placements.length){
  m.supersededPlacementSources=[...(m.supersededPlacementSources||[]),...m.placements.map(p=>({
   x:p.x,y:p.y,map:p.map,area:p.area,areaName:p.areaName,line:p.line,
   reason:"Location correction: old coordinates contradict Pyramid-only spawn" }))];
  m.placements=[];
 }
}
pyramid.name="金字塔密穴";
for(const id of ["z001","n014"]){const m=M.get(id);setZone(m,["zone-13"]);for(const p of m.placements)setPlace(p,tatami);}
restore(samurai,3753,tatami);setZone(samurai,["zone-13"]);for(const p of samurai.placements)setPlace(p,tatami);
const big=M.get("n01E");setZone(big,["zone-40","zone-5"]);
for(const p of big.placements)if(p.area!=="zone-5")setPlace(p,payon);
const fierce=M.get("n00E");setZone(fierce,["zone-40"]);for(const p of fierce.placements)setPlace(p,payon);
restore(tiger,3630,payon);setZone(tiger,["zone-40"]);tiger.locationLabelOverride=payonName;
for(const p of tiger.placements)setPlace(p,payon);
// Add new areas BEFORE reindexing the catalog, maps and location selectors.
const insertAfter=(id,a)=>{const at=d.areas.findIndex(x=>x.id===id);if(at<0)throw Error("Cannot place new area");d.areas.splice(at+1,0,a);A.set(a.id,a);};
insertAfter("zone-1",east);insertAfter("zone-12",payon);
for(const m of d.monsters.filter(m=>touched.has(m.id))){
 for(const a of d.areas){
  const wanted=m.zones.includes(a.id);
  for(const field of ["monsters","visibleMonsters"]){
   if(!Array.isArray(a[field]))continue;
   const should=wanted&&(field!=="visibleMonsters"||!m.catalogHidden);
   if(should&&!a[field].includes(m.id))a[field].push(m.id);
   if(!should&&a[field].includes(m.id))a[field]=a[field].filter(x=>x!==m.id);
  }
  for(const sr of a.subregions||[]){
   if(!Array.isArray(sr.monsters)||wanted)continue;
   for(let i=sr.monsters.length-1;i>=0;i--)if(sr.monsters[i]===m.id){
    sr.monsters.splice(i,1);if(sr.monsterNames)sr.monsterNames.splice(i,1);
   }
  }
 }
}
for(const id of affected){
 const a=A.get(id);if(!a)continue;
 for(const field of ["monsters","visibleMonsters"])a[field]=[...new Set(a[field])].filter(x=>M.has(x));
 a.gradeCounts={};
 for(const id of a.visibleMonsters)a.gradeCounts[M.get(id).grade]=(a.gradeCounts[M.get(id).grade]||0)+1;
 const pins=d.monsters.flatMap(m=>m.placements).filter(p=>p.area===id);
 a.count=pins.length;
 const pts=pins.map(p=>p.map);
 if(pts.length){
  a.x=round(pts.reduce((s,p)=>s+p[0],0)/pts.length);a.y=round(pts.reduce((s,p)=>s+p[1],0)/pts.length);
  a.bounds=[round(Math.min(...pts.map(p=>p[0]))),round(Math.min(...pts.map(p=>p[1]))),
   round(Math.max(...pts.map(p=>p[0]))),round(Math.max(...pts.map(p=>p[1])))];
 }else if(a.mapRegions.length){
  const ps=a.mapRegions.flatMap(r=>r.points);
  [a.x,a.y]=mid(ps);
  a.bounds=[Math.min(...ps.map(p=>p[0])),Math.min(...ps.map(p=>p[1])),
   Math.max(...ps.map(p=>p[0])),Math.max(...ps.map(p=>p[1]))];
 }
 for(const r of a.mapRegions)r.placements=pins.filter(p=>inside(p.map,r.points)).length;
}
for(const a of d.areas)for(const sr of a.subregions||[]){
 if(sr.name==="MVP"&&Array.isArray(sr.monsters))sr.monsterNames=sr.monsters.map(id=>M.get(id)?.name||id);
}
d.meta.version="7.0a09 · v11 / R8.5";
d.meta.dataRevision="R8.5 · 2026-10-10";
d.meta.notes=[
 "R8.5：礦工魔只在廢棄礦坑；兩種狂暴米諾斯只在金字塔密穴；武士火槍兵、火忍西怒畢、元靈武士在榻榻米迷宮；大腳熊在斐楊森林與迷藏森林；狂暴大腳熊、虎王只在斐楊森林（虎王原始地圖點已恢復）。",
 "R8.5：紅圈位置由迷藏森林分出普隆德拉東門郊區；正確的圖鑑地區、區域索引和出生點一致。新增邊界按舊區域與原始點位估算，不代表遊戲引擎的精確邊界。",
 ...(Array.isArray(d.meta.notes)?d.meta.notes:[])
];
})();