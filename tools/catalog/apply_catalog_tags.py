"""Apply card labels only; never modify game data or model assets."""
from pathlib import Path
import sys,re
root=Path(sys.argv[1] if len(sys.argv)>1 else '.')
code=Path(__file__).parent;page=root/'index.html';s=page.read_text(encoding='utf-8')
helper=(code/'item-card-tags.js').read_text(encoding='utf-8').rstrip()
if helper in s:
    print('Approved labels already installed');raise SystemExit(0)
matches=list(re.finditer(r'^function itemStatPills\(i\)\{.*?\}$',s,re.M))
if len(matches)!=1:raise SystemExit('Expected one original function; refusing ambiguous patch')
start,end=matches[0].span();s=s[:start]+helper+s[end:]
old='可依名稱、價格、職業、屬性、攻擊、防禦與武器等級查找；NPC／商店名稱也可搜尋。預設價格由低到高。'
new='小標顯示屬性與限定職業；可依名稱、價格、職業或屬性查找，NPC／商店名稱也可搜尋。預設價格由低到高。'
if old not in s:raise SystemExit('Expected warehouse introduction missing')
s=s.replace(old,new,1).replace(",['weaponLevel','武器等級：高 → 低']",'',1)
page.write_text(s,encoding='utf-8')
