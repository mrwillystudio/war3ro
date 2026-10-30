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
const root=process.argv[2]||'.';const ctx={window:{__atlasParts:[]},console};vm.createContext(ctx);
for(const f of fs.readdirSync(path.join(root,'atlas-data')).filter(f=>/^part-\d+\.js$/.test(f)).sort())vm.runInContext(fs.readFileSync(path.join(root,'atlas-data',f),'utf8'),ctx);
ctx.window.RODB=JSON.parse(ctx.window.__atlasParts.join(''));
for(const f of ['model-previews-v11.js','model-previews-lowkey.js','map-corrections-r85.js','update-70b07.js','model-previews-front-70b07.js'])vm.runInContext(fs.readFileSync(path.join(root,'atlas-data',f),'utf8'),ctx);
const d=ctx.window.RODB;assert.equal(d.meta.version,'Ro-Online 7.0b07');
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
