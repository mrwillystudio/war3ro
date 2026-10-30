"""Embed the approved shared item-card helper without changing game data."""
from pathlib import Path
import sys,re
root=Path(sys.argv[1] if len(sys.argv)>1 else '.')
helper=(Path(__file__).parent/'item-card-tags.js').read_text(encoding='utf-8').rstrip()
page=root/'index.html';s=page.read_text(encoding='utf-8')
if helper not in s:
    marker='/* Shared item-card labels. Keep raw stats and detail data unchanged. */'
    if s.count(marker)==1:
        start=s.index(marker);end=s.index('function itemCard(i)',start)
        s=s[:start]+helper+'\n'+s[end:]
    else:
        matches=list(re.finditer(r'^function itemStatPills\(i\)\{.*?\}$',s,re.M))
        if len(matches)!=1:raise SystemExit('Expected one known helper; refusing ambiguous patch')
        start,end=matches[0].span();s=s[:start]+helper+s[end:]
s=s.replace('小標顯示屬性與限定職業；','小標顯示屬性、限定職業與法球效果（省略無屬性）；')
s=s.replace('可依名稱、價格、職業、屬性、攻擊、防禦與武器等級查找；NPC／商店名稱也可搜尋。預設價格由低到高。','小標顯示屬性、限定職業與法球效果（省略無屬性）；可依名稱、價格、職業或屬性查找，NPC／商店名稱也可搜尋。預設價格由低到高。')
s=s.replace(",['weaponLevel','武器等級：高 → 低']",'')
page.write_text(s,encoding='utf-8')
