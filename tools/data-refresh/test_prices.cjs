const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=path.resolve(process.argv[2]||path.join(__dirname,'../..'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(!m[1].includes('src='))new vm.Script(m[2]);}
const start=html.indexOf('const knownPrice='),end=html.indexOf('const broadSlot=',start);
assert.ok(start>=0&&end>start,'Price helper block must exist before testing');
const code=html.slice(start,end);
const ctx={D:{meta:{priceRule:{mvpToZeny:10000}}},num:v=>Number(v).toLocaleString('zh-TW')};vm.createContext(ctx);
vm.runInContext(code+';Object.assign(globalThis,{priceAmount,priceValue,sortPrice,priceText,shopPriceText,priceLabel});',ctx);
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS',name);}
test('Cloak ignores stale converted price',()=>{const i={gold:5000,mvpCost:0,priceEquivalent:155000,buyPrice:{gold:5000,mvpCost:0,equivalent:155000}};assert.equal(ctx.priceValue(i),5000);assert.equal(ctx.priceLabel(i),'商店價格 5,000 Zeny');});
test('Purchase menu price takes priority over object valuation',()=>{const i={gold:5000,mvpCost:15,shopSources:[{gold:5000,mvpCost:0}]};assert.equal(ctx.priceValue(i),5000);assert.equal(ctx.priceLabel(i),'商店價格 5,000 Zeny');});
test('Object price is not presented as shop price',()=>assert.equal(ctx.priceLabel({gold:23000,mvpCost:0,shopSources:[]}),'物件定價 23,000 Zeny'));
test('Zero object setting does not imply free or sort first',()=>{const i={gold:0,mvpCost:0};assert.equal(ctx.priceLabel(i),'尚未確認商店販售');assert.equal(ctx.sortPrice(i),Infinity);});
test('Unknown numeric components stay unknown',()=>{assert.equal(ctx.priceAmount({gold:null,mvpCost:0}),null);assert.equal(ctx.priceAmount({gold:5000,mvpCost:null}),null);assert.equal(ctx.priceAmount({gold:5000}),null);assert.equal(ctx.priceAmount({gold:'',mvpCost:0}),null);});
test('Known shop with unknown offer does not substitute object value',()=>{const i={gold:5000,mvpCost:15,shopSources:[{unit:'x'}]};assert.equal(ctx.priceValue(i),null);assert.equal(ctx.priceLabel(i),'商店價格 待確認');});
test('Confirmed zero shop price is preserved',()=>{const i={buyPrice:{gold:0,mvpCost:0}};assert.equal(ctx.priceValue(i),0);assert.equal(ctx.priceLabel(i),'商店價格 0 Zeny');});
test('MVP conversion is recalculated from components',()=>{const i={buyPrice:{gold:5000,mvpCost:3,equivalent:9999}};assert.equal(ctx.priceValue(i),35000);assert.equal(ctx.priceLabel(i),'商店價格 3 MVP + 5,000 Zeny · 換算 35,000 Zeny');});
test('Multiple purchase offers are disclosed and sorted by minimum',()=>{const i={shopSources:[{gold:5000,mvpCost:0},{gold:10000,mvpCost:0}]};assert.equal(ctx.priceValue(i),5000);assert.equal(ctx.shopPriceText(i),'依 NPC 而異，請查看取得方式');});
test('Different currencies at same equivalent still count as varying offers',()=>assert.equal(ctx.shopPriceText({shopSources:[{gold:10000,mvpCost:0},{gold:0,mvpCost:1}]}),'依 NPC 而異，請查看取得方式'));
test('Partial price coverage remains explicit',()=>assert.equal(ctx.shopPriceText({shopSources:[{gold:5000,mvpCost:0},{gold:null,mvpCost:null}]}),'已確認 5,000 Zeny（其他 NPC 待確認）'));
test('Negative and nonfinite costs rejected',()=>{assert.equal(ctx.priceAmount({gold:-1,mvpCost:0}),null);assert.equal(ctx.priceAmount({gold:Infinity,mvpCost:0}),null);assert.equal(ctx.priceAmount({gold:'abc',mvpCost:0}),null);});
assert.ok(html.includes('<small>商店價格：${esc(priceText(s.buyPrice||s))}</small>'));
assert.ok(html.includes("(priceValue(b)??-1)-(priceValue(a)??-1)"));
console.log(JSON.stringify({passed,inlineScriptsCompile:true,perShopPrices:true,sortingUsesCurrentComponents:true}));
