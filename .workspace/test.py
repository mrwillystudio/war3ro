"""Browser regression tests for the inline, local-only correction workspace.
WORKSPACE_IN_MEMORY=1 runs offline UI tests with a storage stub; CI uses real HTTP.
"""
import contextlib
import http.server
import json
import os
from pathlib import Path
import re
import shutil
import threading
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.workspace/review'
OUT.mkdir(exist_ok=True)
MEMORY=os.environ.get('WORKSPACE_IN_MEMORY')=='1'
KEY='ROATLAS-world-corrections-v1'
HTML=(ROOT/'index.html').read_text(encoding='utf-8')
INLINE=re.sub(r'<script src="(\./atlas-data/[^"]+)"></script>',lambda m:'<script>'+(ROOT/m[1]).read_text(encoding='utf-8').replace('</script','<\\/script')+'</script>',HTML) if MEMORY else None
checks=[]
def check(name,condition=True):
 assert condition,name
 checks.append(name);print('PASS',name,flush=True)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
 def log_message(self,*a):pass

with contextlib.ExitStack() as stack:
 if not MEMORY:
  server=http.server.ThreadingHTTPServer(('127.0.0.1',0),QuietHandler)
  threading.Thread(target=server.serve_forever,daemon=True).start()
  stack.callback(server.shutdown)
  BASE=f'http://127.0.0.1:{server.server_port}/'
 with sync_playwright() as pw:
  options={'headless':True}
  if MEMORY:options.update(executable_path=shutil.which('chromium'),args=['--no-sandbox'])
  browser=pw.chromium.launch(**options)
  context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
  errors=[]
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  def load(p,hash='world?p=workspace',stored=None):
   if MEMORY:
    p.evaluate('''({hash,stored,key})=>{const values={};if(stored)values[key]=stored;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>values[k]??null,setItem:(k,v)=>values[k]=v,removeItem:k=>delete values[k],clear:()=>{for(const k in values)delete values[k]}}});location.hash=hash;}''',{'hash':hash,'stored':stored,'key':KEY})
    p.set_content(INLINE,wait_until='load')
   else:p.goto(BASE+'#'+hash,wait_until='load')
   p.wait_for_function('!!window.RODB && !!document.querySelector("h1")')
  def rows():return page.locator('[data-workspace-region]')
  def snapshot():return page.evaluate('JSON.stringify(RODB.monsters.map(m=>({id:m.id,zones:m.zones,placements:m.placements})))')
  def data():return json.loads(page.evaluate('(key)=>localStorage.getItem(key)',KEY))
  def go(hash):
   page.evaluate('(h)=>{location.hash=h}',hash)
   page.wait_for_timeout(80)

  load(page)
  check('direct workspace URL',page.locator('h1').inner_text()=='魔物點位校正工作台')
  check('all 836 actual preplaced points accessible',page.locator('#world-map .map-point').count()==836)
  check('empty copy disabled',page.locator('[data-action=workspace-copy]').is_disabled())
  original=snapshot()
  page.screenshot(path=str(OUT/'workspace-empty.png'),full_page=True)
  page.select_option('[data-filter=worldMonster]','hmtm')
  page.locator('#world-map .map-point').click()
  check('real click adds without opening monster modal',rows().count()==1 and page.locator('dialog[open]').count()==0)
  rows().first.fill('波利島嶼')
  expected='[世界地圖 魔物分布修正清單]：\n波利之王 (9199.7, -2703.9) 修正為「波利島嶼」'
  check('exact output and unrounded original coordinates',page.locator('#workspace-preview').input_value()==expected)
  check('canonical source ID and source line retained',data()['rows'][0]['monsterId']=='hmtm' and data()['rows'][0]['sourceLine']==3348)
  page.locator('#world-map .map-point').click()
  check('same point not added twice and existing input preserved',rows().count()==1 and rows().first.input_value()=='波利島嶼')
  check('selected point is highlighted',page.locator('#world-map .is-queued.is-complete').count()==1)
  page.screenshot(path=str(OUT/'workspace-filled.png'),full_page=True)

  # Area-filter index 0 must resolve to the canonical placement, not placements[0].
  page.select_option('[data-filter=worldMonster]','n001')
  page.select_option('[data-filter=worldArea]','zone-29')
  marker=page.locator('#world-map [data-id=n001]').first
  idx=int(marker.get_attribute('data-placement'))
  point=page.evaluate('(i)=>RODB.monsters.find(m=>m.id==="n001").placements[i]',idx)
  marker.dispatch_event('click')
  r=data()['rows'][-1]
  check('area-filter index maps to canonical placement',idx!=0 and r['placementIndex']==idx and r['x']==point['x'] and r['y']==point['y'] and r['originalAreaId']=='zone-29')
  page.select_option('[data-filter=worldArea]','all')
  for i in range(9):page.locator(f'#world-map [data-id=n001][data-placement="{i}"]').dispatch_event('click')
  check('ten distinct points produce ten rows',rows().count()==10)
  check('same monster different coordinates remains distinct',len(set(r['key'] for r in data()['rows']))==10)
  check('unfilled rows retain empty quotation marks',page.locator('#workspace-preview').input_value().count('修正為「」')==9)
  page.locator('#workspace-batch').fill('測試地區')
  page.locator('[data-action=workspace-fill]').click()
  check('batch fills only blank fields',rows().first.input_value()=='波利島嶼' and sum(v=='測試地區' for v in rows().evaluate_all('(els)=>els.map(e=>e.value)'))==9)
  # IME composition does not replace the input element or lose its cursor.
  el=rows().nth(1).element_handle()
  el.evaluate('(e)=>e.dispatchEvent(new CompositionEvent("compositionstart",{bubbles:true}))')
  rows().nth(1).fill('斐楊森林')
  el.evaluate('(e)=>e.dispatchEvent(new CompositionEvent("compositionend",{bubbles:true}))')
  check('Chinese composition keeps input attached',el.evaluate('(e)=>e.isConnected') and rows().nth(1).input_value()=='斐楊森林')
  page.locator('[data-action=zoom][data-step="0.5"]').click()
  check('zoom keeps workspace and draft',page.locator('.zoom-value').inner_text()=='150%' and rows().count()==10)
  page.locator('[data-action=world-reset]').click()
  check('reset only resets map filters, not correction draft',rows().count()==10 and page.locator('.zoom-value').inner_text()=='100%')
  page.locator('[data-action=workspace-locate]').first.click()
  check('locate uses original placement',page.locator('#world-map [data-id=hmtm]').evaluate('(e)=>e===document.activeElement'))
  page.locator('[data-action=workspace-remove]').last.click()
  check('remove exactly one row',rows().count()==9)

  # Browser-native clipboard on the real origin, deterministic adapter offline.
  if MEMORY:page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.__copied=t}}})")
  else:context.grant_permissions(['clipboard-read','clipboard-write'],origin=BASE.rstrip('/'))
  page.locator('[data-action=workspace-copy]').click()
  if MEMORY:copied=page.evaluate('window.__copied')
  else:copied=page.evaluate('navigator.clipboard.readText()')
  check('copy writes exact displayed text',copied==page.locator('#workspace-preview').input_value())
  for action,ext in [('workspace-txt','txt'),('workspace-json','json')]:
   with page.expect_download() as download:page.locator('[data-action='+action+']').click()
   path=OUT/('export.'+ext);download.value.save_as(path)
   content=path.read_text(encoding='utf-8-sig')
   if ext=='txt':check('TXT export matches exact output',content.rstrip('\n')==copied)
   else:
    exported=json.loads(content)
    check('JSON backup contains precise IDs and source metadata',len(exported['rows'])==9 and exported['rows'][0]['sourceLine']==3348 and exported['rows'][0]['x']==9199.7 and exported['datasetSHA'])
  stored=page.evaluate('(key)=>localStorage.getItem(key)',KEY)
  if MEMORY:
   page.close();page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));load(page,stored=stored)
  else:page.reload(wait_until='load')
  check('draft survives page reload',rows().count()==9 and rows().first.input_value()=='波利島嶼')
  go('world')
  check('exit restores normal world map',page.locator('.workspace-panel').count()==0 and page.locator('h1').inner_text()=='世界地圖')
  page.select_option('[data-filter=worldMonster]','hmtm')
  page.locator('#world-map .map-point').click()
  page.wait_for_function('!!document.querySelector("dialog[open]")')
  check('normal mode still opens monster detail',page.locator('dialog[open]').count()==1)
  page.locator('[data-action=detail-close]').click()
  go('world?p=workspace')
  check('reenter workspace restores rows',rows().count()==9)
  go('world/m/hmtm?p=workspace')
  check('detail route preserves workspace query',page.locator('dialog[open]').count()==1 and page.locator('.workspace-panel').count()==1)
  page.locator('[data-action=detail-close]').click();page.wait_for_timeout(80)
  check('detail close returns to workspace URL',page.evaluate('location.hash')=='#world?p=workspace')
  go('items')
  check('unrelated catalog unaffected',page.locator('.workspace-panel').count()==0 and page.locator('.item-card').count()>0)
  go('world?p=workspace')
  check('source placements remain byte-for-byte unchanged',original==snapshot())
  page.screenshot(path=str(OUT/'workspace-batch.png'),full_page=True)

  # Untrusted input must remain text, including after a rerender/reload.
  rows().nth(1).fill('<img src=x onerror="window.__unsafe=1">')
  page.locator('[data-action=world-reset]').click()
  check('region text is HTML-escaped',page.locator('.workspace-row img').count()==0 and page.evaluate('window.__unsafe===undefined'))
  rows().nth(1).fill('斐楊森林')
  if not MEMORY:
   other=context.new_page();load(other)
   other.locator('[data-workspace-region]').nth(1).fill('同步測試地區')
   expect(rows().nth(1)).to_have_value('同步測試地區')
   check('real cross-tab localStorage synchronization')
   other.close()
  # Locked storage does not lose the current in-memory editing functionality.
  page.evaluate("() => { Storage.prototype.setItem=function(){throw new DOMException('blocked','SecurityError')} }" if not MEMORY else "() => { localStorage.setItem=function(){throw new Error('blocked')} }")
  rows().nth(2).fill('不能儲存測試')
  check('storage failure explicitly shown',page.locator('#workspace-save.has-error').count()==1 and '未能儲存' in page.locator('#workspace-save').inner_text())
  check('copy still available when storage denied',page.locator('[data-action=workspace-copy]').is_enabled())
  check('no JavaScript runtime errors',not errors)

  # Fresh context: cancellation and final clearing, plus mobile layout.
  mobile_context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  mobile=mobile_context.new_page();mobile.on('pageerror',lambda e:errors.append(str(e)));load(mobile)
  mobile.select_option('[data-filter=worldMonster]','hmtm')
  mobile.locator('#world-map .map-point').click()
  mobile.locator('[data-workspace-region]').fill('波利島嶼')
  check('mobile collects and edits a point',mobile.locator('[data-workspace-region]').count()==1)
  check('mobile has no horizontal page overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
  mobile.screenshot(path=str(OUT/'workspace-mobile.png'),full_page=True)
  def cancel(dialog):dialog.dismiss()
  mobile.once('dialog',cancel);mobile.locator('[data-action=workspace-clear]').click()
  check('clear requires confirmation',mobile.locator('[data-workspace-region]').count()==1)
  mobile.once('dialog',lambda d:d.accept());mobile.locator('[data-action=workspace-clear]').click()
  check('confirmed clear empties and persists draft',mobile.locator('[data-workspace-region]').count()==0 and json.loads(mobile.evaluate('(key)=>localStorage.getItem(key)',KEY))['rows']==[])
  if not MEMORY:
   mobile.reload(wait_until='load')
   check('cleared draft remains empty after reload',mobile.locator('[data-workspace-region]').count()==0)
   mobile.evaluate('(key)=>localStorage.setItem(key,"{broken")',KEY)
   mobile.reload(wait_until='load')
   check('corrupt storage handled without breaking workspace',mobile.locator('.workspace-panel').count()==1 and mobile.locator('#workspace-save.has-error').count()==1)
  check('all tested pages remain free of script errors',not errors)
  mobile_context.close();context.close();browser.close()
(OUT/'test-results.json').write_text(json.dumps({'mode':'offline UI with storage stub' if MEMORY else 'real Chromium browser / HTTP / localStorage','passed':len(checks),'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(checks)} checks passed',flush=True)
