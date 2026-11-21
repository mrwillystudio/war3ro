'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const helper=fs.readFileSync(path.join(__dirname,'item-card-tags.js'),'utf8');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const c={esc};vm.createContext(c);vm.runInContext(helper,c);
const cases=[
  [{element:'無屬性',job:'忍者'},['忍者專屬']],
  [{element:' 無 屬性 ',job:'所有職業'},[]],
  [{element:'無',description:'輔助法球效果'},['法球效果']],
  [{element:'火',job:'刺客',description:'獨立法球效果'},['火屬性','刺客專屬','法球效果']],
  [{description:'被動法球效果'},['法球效果']],
  [{description:'法球效果'},['法球效果']],
  [{description:'|cffffcc00輔助法球效果|r|n傷害 + 10'},['法球效果']],
  [{effect:'獨立法球效果',description:'獨立法球效果'},['法球效果']],
  [{descriptionOriginal:'被動法球效果'},['法球效果']],
  [{description:'已移除法球效果',descriptionOriginal:'被動法球效果'},[]],
  [{description:'無法球效果'},[]],
  [{description:'不與其他法球效果疊加'},[]],
  [{description:'法球效果：無'},[]],
  [{name:'法球效果',iconPath:'OrbOfFire.blp',description:'25%觸發火球術'},[]],
  [{description:'【合成】\n輔助法球效果材料 x2'},[]],

  [{element:'火',job:'忍者',attackValue:80,weaponLevel:4},['火屬性','忍者專屬']],
  [{element:'無',job:'忍者'},['忍者專屬']],
  [{element:null,job:'忍者'},['忍者專屬']],
  [{element:'水',job:'所有職業'},['水屬性']],
  [{element:null,job:'所有職業'},[]],
  [{element:'',job:''},[]],
  [{element:'未知',job:'未提供可解析限制'},[]],
  [{element:'風屬性',job:'忍者專屬'},['風屬性','忍者專屬']],
  [{job:'劍士 系列'},['劍士系限定']],
  [{job:'祭司 / 悟靈士 / 拳聖'},['祭司／悟靈士／拳聖限定']],
  [{job:'劍士 系列 / 商人系列'},['劍士系／商人系限定']],
  [{job:'忍者 / 忍者'},['忍者專屬']],
  [{job:'',jobTags:['忍者']},['忍者專屬']],
  [{job:'所有職業',jobTags:['忍者']},[]],
  [{job:'職業限制：忍者'},['忍者專屬']],
  [{element:undefined,jobTags:null,attackValue:400,defenseValue:10,weaponLevel:3},[]]
];
for(const [item,expected] of cases){assert.deepEqual(Array.from(c.itemCardLabels(item),x=>x.text),expected);assert(!/ATK|DEF|武器|Lv\./.test(c.itemStatPills(item)));}
const html=c.itemStatPills({element:'<script>alert(1)</script>',job:'<img onerror=1>'});assert(!html.includes('<script>'));assert(!html.includes('<img'));
const root=process.argv[2]||'.';const ctx={window:{},console};vm.createContext(ctx);
const siteHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
// Follow the production load order, including future data overlays. A fixed
// filename list silently tested the old dataset after a map refresh.
for(const m of siteHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  const src=m[1].match(/src=["']([^"']+)["']/i);
  const code=src?fs.readFileSync(path.join(root,src[1].split('?')[0]),'utf8'):m[2];
  if(!src&&code.includes('document.getElementById'))break;
  vm.runInContext(code,ctx,{filename:src?.[1]||'inline',timeout:10000});
}
const d=ctx.window.RODB;assert(d?.items?.length);assert(siteHtml.includes(d.meta.version));
for(const i of d.items){const before=JSON.stringify(i);const h=c.itemStatPills(i);assert(!/ATK|DEF|武器|Lv\.|無屬性/.test(h));assert.equal(JSON.stringify(i),before);}
const byId=new Map(d.items.map(i=>[i.id,i]));
assert.deepEqual(Array.from(c.itemCardLabels(byId.get('I063')),x=>x.text),['忍者專屬']);
assert.deepEqual(Array.from(c.itemCardLabels(byId.get('IFXM')),x=>x.text),['忍者專屬']);
assert.deepEqual(Array.from(c.itemCardLabels(byId.get('totw')),x=>x.text),['神槍手專屬']);
assert.deepEqual(Array.from(c.itemCardLabels(byId.get('I06G')),x=>x.text),['水屬性','法球效果']);
assert.deepEqual(Array.from(c.itemCardLabels(byId.get('I01P')),x=>x.text),['法球效果']);
assert.deepEqual(Array.from(c.itemCardLabels(byId.get('I074')),x=>x.text),['刺客專屬','法球效果']);
const orbItems=d.items.filter(i=>c.itemHasOrbEffect(i)).map(i=>({id:i.id,name:i.name,labels:Array.from(c.itemCardLabels(i),x=>x.text)}));
const s=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(s.includes(helper.trim()));
for(const [n,m] of [...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries())new vm.Script(m[1],{filename:'inline-'+n});
console.log(JSON.stringify({passed:true,edgeCases:cases.length,xssEscaped:true,itemCount:d.items.length,allCardsNoNumericPills:true,neutralPillsHidden:true,orbItemCount:orbItems.length,orbItems,sourceDataUnchanged:true,version:d.meta.version},null,2));
