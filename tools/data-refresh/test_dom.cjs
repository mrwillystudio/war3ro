'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.resolve(process.argv[2]||path.join(__dirname,'../..')),output=path.resolve(process.argv[3]||'dom-verification.json'),errors=[],checks=[];
class LocalResources extends ResourceLoader{fetch(url){const u=new URL(url);if(u.origin!=='https://atlas.test')return null;const p=path.join(root,decodeURIComponent(u.pathname));if(!fs.existsSync(p)){errors.push('Missing resource: '+u.pathname);return null;}return Promise.resolve(fs.readFileSync(p));}}
const virtualConsole=new VirtualConsole();
virtualConsole.on('jsdomError',e=>{if(!/Could not parse CSS stylesheet|Not implemented: window\.(scrollTo|scrollBy)/.test(e.message))errors.push(e.stack||e.message);});
const storage={};
function make(url,width=1440){return new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url,runScripts:'dangerously',resources:new LocalResources(),pretendToBeVisual:true,virtualConsole,beforeParse(w){
  Object.defineProperty(w,'innerWidth',{value:width});w.matchMedia=q=>({matches:(!q.includes('prefers-reduced-motion'))&&(!/min-width:(\d+)px/.test(q)||width>=Number(q.match(/min-width:(\d+)px/)[1]))&&(!/max-width:(\d+)px/.test(q)||width<=Number(q.match(/max-width:(\d+)px/)[1]))&&(!q.includes('pointer:fine')||width>760),addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.scrollBy=()=>{};
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
  Object.entries(storage).forEach(([k,v])=>w.localStorage.setItem(k,v));
}});}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(dom){for(let n=0;n<150;n++){if(dom.window.RODB?.meta.version==='Ro-Online 7.0c08'&&dom.window.document.querySelector('#main')?.textContent.trim())return;await delay(20);}throw Error('site did not initialize: '+errors.join('\n'));}
(async()=>{
 let dom=make('https://atlas.test/#items/i/I05U');await ready(dom);let w=dom.window,d=w.document;
 const text=()=>d.querySelector('#detail-inner').textContent;
 assert(text().includes('5,000 Zeny'));assert(!text().includes('15 MVP'));checks.push('cloak verified shop price');
 d.querySelector('#detail-inner [data-action="favorite"]').click();
 for(let n=0;n<w.localStorage.length;n++){const k=w.localStorage.key(n);storage[k]=w.localStorage.getItem(k);}
 dom.window.close();dom=make('https://atlas.test/#items/i/I05U');await ready(dom);w=dom.window;d=w.document;
 assert.equal(d.querySelector('#detail-inner [data-action="favorite"]').getAttribute('aria-pressed'),'true');checks.push('favorites survive reload with old rawcode');
 async function route(hash){w.location.hash=hash;await delay(50);assert(d.querySelector('#main').textContent.trim());}
 for(const [id,price] of [['I06F','12,000 Zeny'],['I088','23,000 Zeny'],['I02H','800 Zeny'],['I0NO','150,000 Zeny']]){await route('#items/i/'+id);assert(text().includes(price),id+': '+price);checks.push('price '+id);}
 await route('#items');const search=d.querySelector('.local-search input');search.value='斗篷';search.dispatchEvent(new w.Event('input',{bubbles:true}));await delay(200);assert(d.querySelectorAll('.item-card').length>2);assert(d.querySelector('#main').textContent.includes('斗篷（1洞）'));checks.push('item search updates actual DOM');
 for(const id of ['OKP1','O0NT','n0DK']){await route('#monsters/m/'+id);assert(d.querySelector('#detail-inner h1').textContent);assert(!text().includes('NaN'));checks.push('new monster '+id);}
 await route('#monsters/m/O0NT');assert(text().includes('暈眩後霸體反制'));assert(text().includes('共 5 隻暗夜龜'));
 await route('#monsters/m/unec');assert(text().includes('黑暗之王'));assert(text().includes('600'));checks.push('current trigger mechanics and indirect summon guide');
 await route('#items/i/I0JX');d.querySelector('#detail-inner [data-action="detail-tab"][data-value="sources"]').click();assert(text().includes('人魚之心 ×30'));checks.push('quest exchange 30 hearts');
 await route('#craft');assert(d.querySelector('.recipe-card'));d.querySelector('[data-action="recipe-add"]').click();await route('#plan');assert(d.querySelector('#main').textContent.includes('草帽'));checks.push('existing recipe-1 plan compatibility');
 for(const hash of ['#cards','#sockets','#sets','#world','#world?p=workspace','#about']){await route(hash);checks.push('route '+hash);}
 await route('#world?p=workspace');assert(d.querySelector('.workspace-heading'));checks.push('hidden workspace available');
 const point=d.querySelector('#world-map [data-action="map-point"]');
 assert(point,'actual world map point');point.click();await delay(30);
 assert.equal(d.querySelectorAll('.workspace-row').length,1);
 point.click();assert.equal(d.querySelectorAll('.workspace-row').length,1);
 const field=d.querySelector('[data-workspace-region]');field.value='普隆德拉';field.dispatchEvent(new w.Event('input',{bubbles:true}));
 assert(d.querySelector('#workspace-preview').value.includes('普隆德拉'));
 checks.push('workspace point click, deduplication and correction editing');
 await route('#monsters/m/ucsB');d.querySelector('#detail-inner [data-action="detail-tab"][data-value="overview"]').click();assert(text().includes('無一般攻擊'));
 await route('#monsters/m/ngrd');assert(text().includes('第二組攻擊'));assert(text().includes('48–72'));
 checks.push('disabled and secondary monster attacks');
 for(let n=0;n<w.localStorage.length;n++){const k=w.localStorage.key(n);storage[k]=w.localStorage.getItem(k);}
 w.close();dom=make('https://atlas.test/#world?p=workspace',390);await ready(dom);w=dom.window;d=w.document;
 assert.equal(w.innerWidth,390);assert.equal(d.querySelector('[data-workspace-region]').value,'普隆德拉');
 d.querySelector('[data-action="workspace-locate"]').click();await delay(30);
 checks.push('mobile interaction mode restores and locates correction draft');
 await route('#items/i/I05U');assert(text().includes('5,000 Zeny'));
 assert.equal(d.querySelector('#detail-inner [data-action="favorite"]').getAttribute('aria-pressed'),'true');
 checks.push('mobile item detail and persisted favorite');
 assert(d.querySelector('title').textContent.includes('7.0c08'));
 assert.equal(w.RODB.items.length,988);assert.equal(w.RODB.monsters.length,189);checks.push('production loader uses current dataset');
 const report={passed:errors.length===0,environment:'isolated DOM execution of actual production scripts',visualLayoutTested:false,checks,errors};fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));w.close();assert(report.passed);
})().catch(e=>{console.error(e);process.exitCode=1;});
