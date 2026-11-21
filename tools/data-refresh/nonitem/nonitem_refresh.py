#!/usr/bin/env python3
"""Rebuild non-item RO Atlas data from one immutable map extraction.

Native object inheritance is always native[base_id] + object's own modifications.
Existing hand-authored areas are kept byte-for-byte; source line references are renewed.
"""
import argparse, collections, copy, hashlib, json, math, re, struct
from pathlib import Path

VERSION='Ro-Online 7.0c08'
UNIT_FIELDS={'unam':'name','unsf':'editorsuffix','upro':'propernames','uabi':'abillist','uhab':'heroabillist','uhpm':'hp','ua1b':'dmgplus1','ua1d':'dice1','ua1s':'sides1','ua1r':'rangen1','ua1c':'cool1','ua2b':'dmgplus2','ua2d':'dice2','ua2s':'sides2','ua2r':'rangen2','uaen':'weapson','udef':'def','udty':'deftype','umvs':'spd','ulev':'level','ustr':'str','uagi':'agi','uint':'int','ustp':'strplus','uagp':'agiplus','uinp':'intplus','upra':'primary','uico':'art','umdl':'file','uclr':'red','uclg':'green','uclb':'blue','usei':'sellitems','usca':'modelscale','utco':'teamcolor','urac':'race','umvt':'movetp','umpm':'manaN','umpi':'mana0'}
UNIT_FIELDS.update({'ua1g':'targs1','ua2g':'targs2','ua2c':'cool2'})
ABILITY_FIELDS={'anam':'name','ansf':'editorsuffix','aart':'art','aret':'researchtip','arut':'researchubertip','alev':'levels','aher':'hero','aite':'item','areq':'requires','arqa':'requiresamount','atp1':'tip','aub1':'ubertip','aut1':'untip','auu1':'unubertip','acdn':'cool','amcs':'cost','aran':'rng','aare':'area','acas':'cast','adur':'dur','ahdu':'herodur','atar':'targs','abuf':'buffid','aeff':'efctid','arhk':'researchhotkey','ahky':'hotkey','alig':'lightningeffect'}
ABILITY_FIELDS.update({'Hwe1':'unitid','Osf1':'unitid'})
ARMORS={'normal':('普通裝甲','所有攻擊對普通裝甲都具有百分之百的效果。'),'none':('不死系裝甲','本圖以不死系機制呈現；受到「治癒術」會造成神聖屬性傷害。'),'fort':('城防裝甲',''),'large':('重型裝甲',''),'medium':('中型裝甲',''),'small':('輕型裝甲',''),'hero':('英雄裝甲',''),'divine':('神聖裝甲','')}

def load(p): return json.loads(Path(p).read_text())
def dump(p,v): Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def clean(s):
    s=re.sub(r'\|c[0-9a-fA-F]{8}','',str(s or ''),flags=re.I)
    return re.sub(r'\|r','',s,flags=re.I).replace('|n','\n').strip()
def compact(v):
    if isinstance(v,float): return int(v) if v.is_integer() else round(v,6)
    return v
def objmap(o): return {x['id']:x for x in o['objects']}

def resolve_objects(native,mods,mapping,ability=False):
    out=copy.deepcopy(native)
    for rid,obj in mods.items():
        v=copy.deepcopy(native.get(obj['base_id'],{}))
        for m in obj['modifications']:
            key=mapping.get(m['key'])
            if ability and m.get('column',0)>0: key='data'+chr(96+m['column'])
            if not key: continue
            value=m['value']; level=m.get('level',0)
            if ability and level>0:
                arr=v.get(key,[])
                if not isinstance(arr,list): arr=[arr]
                arr=arr[:]
                while len(arr)<level: arr.append(None)
                arr[level-1]=value;v[key]=arr
            else: v[key]=value
        v['_id']=rid;v['_parent']=obj['base_id'];v['_mapFields']=list(obj['fields'])
        out[rid]=v
    return out

def getlevel(v,key,level=1,default=None):
    a=v.get(key,default)
    if isinstance(a,list): return a[min(level,len(a))-1] if a else default
    return a

def resolve_text(s,abilities):
    def replace(m):
        rid,key,percent=m.groups();v=abilities.get(rid)
        if not v:return m.group(0)
        match=re.fullmatch(r'([a-zA-Z_]+)(\d+)?',key)
        if not match:return m.group(0)
        k,n=match.groups();k=k.lower();level=int(n or 1)
        aliases={'cooldown':'cool','areah':'area','castRange':'rng'}
        k=aliases.get(k,k);num=getlevel(v,k,level,None)
        if not isinstance(num,(int,float)): return m.group(0)
        if percent: num*=100
        return str(compact(num))
    return re.sub(r'<([^,<>]+),([^,<>]+)(?:,(%))?>',replace,str(s or ''))

class Refresh:
    def __init__(self,work):
        self.work=Path(work);self.mx=self.work/'map_extract';self.out=self.work/'data_audit';self.out.mkdir(exist_ok=True)
        self.old=load(self.work/'current_rodb.json');self.j=(self.mx/'extracted/war3map.j').read_text();self.lines=self.j.splitlines()
        self.um=objmap(load(self.mx/'objects_w3u.json'));self.am=objmap(load(self.mx/'objects_w3a.json'));self.im=objmap(load(self.mx/'objects_w3t.json'))
        self.units=resolve_objects(load(self.mx/'native_unit_127.json'),self.um,UNIT_FIELDS)
        self.abilities=resolve_objects(load(self.mx/'native_ability_127.json'),self.am,ABILITY_FIELDS,True)
        dump(self.out/'resolved_abilities.json',self.abilities);dump(self.out/'resolved_units.json',self.units)
        self.funcs={m.group(1):(self.j.count('\n',0,m.start())+1,m.group(0)) for m in re.finditer(r'^function (\w+)\b.*?^endfunction',self.j,re.M|re.S)}
        self.linefunc={};f=None
        for n,l in enumerate(self.lines,1):
            if l.startswith('function '):f=l.split()[1]
            self.linefunc[n]=f
        self.sources={};self.audit={};self.placements=collections.defaultdict(list);self.levels=collections.defaultdict(list);self.creation=collections.defaultdict(lambda:collections.defaultdict(list))
        self.icon_by_path={}
        for m in self.old['monsters']:
            if m.get('iconPath'):self.icon_by_path[m['iconPath'].lower()]=m.get('icon')
            for a in m.get('abilities',[]):
                if a.get('iconPath'): self.icon_by_path[a['iconPath'].lower()]=a.get('icon')
        for i in self.old['items']:
            if i.get('iconPath'):self.icon_by_path[i['iconPath'].lower()]=i.get('icon')
        self.parse_creations()

    def source(self,line,radius=8):
        self.sources[str(line)]='\n'.join(f'{n+1}: {self.lines[n]}' for n in range(max(0,line-2),min(len(self.lines),line+radius)))

    def xy(self,x,y):return [round((x+14336)/32768*100,3),round((14336-y)/32768*100,3)]

    def parse_creations(self):
        env={};last=None
        for n,l in enumerate(self.lines,1):
            f=self.linefunc[n]
            if l.startswith('function '):env={};last=None
            m=re.search(r"set\s+(\w+)\s*=\s*CreateUnit\(\s*([^,]+),\s*'(.{4})',\s*(-?[\d.]+),\s*(-?[\d.]+),",l)
            if m:
                var,player,rid,x,y=m.groups();env[var]=rid;last=rid
                if f=='CreateUnitsForPlayer10' or f=='CreateNeutralHostile':
                    x=float(x);y=float(y);self.placements[rid].append({'x':x,'y':y,'map':self.xy(x,y),'kind':'預放座標','line':n})
                continue
            m=re.search(r"CreateNUnitsAtLoc\(\s*\d+,\s*'(.{4})',",l)
            if m:last=m.group(1);env['GetLastCreatedUnit()']=last
            m=re.search(r'set\s+(\S+)\s*=\s*GetLastCreatedUnit\(\)',l)
            if m and last:env[m.group(1)]=last
            m=re.search(r'SetHeroLevel(?:BJ)?\(\s*([^,]+),\s*(\d+)',l)
            if m:
                var,lv=m.groups();rid=env.get(var.strip())
                if rid:self.levels[rid].append({'line':n,'function':f,'level':int(lv)})
            m=re.search(r"SelectHeroSkill\(\s*([^,]+),\s*'(.{4})'",l)
            if m:
                var,aid=m.groups();rid=env.get(var.strip())
                if rid:self.creation[rid][aid].append(n)
            # RONT replaces the normal turtle when its verified ritual completes.
            if 'set b = CreateUnit(udg_NPC_PLAYER, RONT_Id()' in l:env['b']='O0NT';last='O0NT'

    def regular_drops(self):
        f='Trig_Npc_Drop_Item_Initialization_Actions';start,body=self.funcs[f];out=[];unit=None;item=None;group='';itemline=None
        for off,l in enumerate(body.splitlines()):
            n=start+off
            if l.strip().startswith('//'):
                note=l.strip()[2:].strip()
                if note and not re.fullmatch(r'[-=/<> ]+',note) and not any(t in note for t in ['Variables','Actions','End','總數','變數']): group=note
            m=re.search(r"set udg_ut_npcDrop\[udg_a\] = '(.{4})'",l)
            if m:unit=m.group(1)
            m=re.search(r"set udg_it_npcDropItem\[udg_a\] = '(.{4})'",l)
            if m:item=m.group(1);itemline=n
            m=re.search(r'set udg_i_npcDropRate\[udg_a\] = (.*)',l)
            if m:
                expr=m.group(1).strip();mult='udg_const_i_DropRateMult' in expr
                e=expr.replace('udg_const_i_DropRateMult','1')
                if not re.fullmatch(r'[\d. ()*+\-/]+',e):raise ValueError(('drop expr',n,expr))
                rate=float(eval(e,{'__builtins__':{}},{}))/10
                out.append({'monster':unit,'item':item,'rate':compact(rate),'group':group,'kind':'一般掉落','line':itemline,'function':f,'rateExpression':expr,'rateVariable':mult,'id':f'c08-reg-{len(out)+1}','conditionNote':'休閒模式掉落倍率為 2 倍。' if mult else None})
                self.source(itemline)
        return out

    def mvp_drops(self):
        active=set(re.findall(r'ExecuteFunc\("(RODrop_Config_\w+)"\)',self.j));pools=[];drops=[];boss_bounty={};rawpools=[]
        for fn,(start,body) in self.funcs.items():
            if fn not in active:continue
            um=re.search(r"local integer u = '(.{4})'",body)
            unit=um.group(1) if um else None
            if not unit: continue # UID=0 fallback pools are not one catalog monster.
            bm=re.search(r'RODrop_Boss\(u,\s*(\d+),\s*(\d+)\)',body)
            if bm:boss_bounty[unit]={'normal':int(bm.group(1)),'chill':int(bm.group(2))}
            cur=None
            for off,l in enumerate(body.splitlines()):
                n=start+off
                p=re.search(r'RODrop_Pool\(u,\s*([^,]+),\s*([\d.-]+),\s*([\d.-]+),\s*(\d+),\s*(\d+)\)',l)
                if p:
                    if cur:rawpools.append(cur)
                    kind,norm,chill,death,expected=p.groups();cur={'monster':unit,'fn':fn,'line':n,'kind':kind.strip(),'normal':float(norm),'chill':float(chill),'minDeath':int(death),'expected':int(expected),'candidates':[]}
                c=re.search(r"RODrop_Candidate\(p,\s*'(.{4})',\s*(\d+),\s*\"([^\"]*)\",\s*\"([^\"]*)\",\s*(true|false)\)",l)
                if c and cur:
                    iid,w,cat,label,announce=c.groups();cur['candidates'].append({'id':iid,'weight':int(w),'line':n,'category':cat})
            if cur:rawpools.append(cur)
        for p in rawpools:
            if len(p['candidates'])!=p['expected']: raise AssertionError(('pool count',p))
            total=sum(c['weight'] for c in p['candidates']);assert total>0
            for field,label in [('normal','一般模式'),('chill','休閒模式')]:
                rate=p[field]
                if rate<0:continue
                poolid=f'c08-pool-{p["monster"]}-{p["line"]}-{label}';lines=[p['line']]+[c['line'] for c in p['candidates']]
                cat='卡片' if p['kind']=='udg_ROTypeCard' else '轉蛋' if p['kind']=='udg_ROTypeCapsule' else '裝備／道具'
                rolls=2 if p['monster']=='UNMR' and field=='chill' and p['kind']!='udg_ROTypeCapsule' else 1
                pools.append({'id':poolid,'monster':p['monster'],'mode':'MVP・'+label,'roll':rolls,'pick':1,'items':[c['id'] for c in p['candidates']],'rate':compact(rate),'minDeath':p['minDeath'],'lines':lines,'source':p['fn'],'category':cat})
                for c in p['candidates']:
                    note=[]
                    if len(p['candidates'])>1:note.append(f'同池 {len(p["candidates"])} 選 1，候選權重 {c["weight"]}/{total}；此百分比已乘上池啟動機率。')
                    if p['minDeath']>1:note.append(f'第 {p["minDeath"]} 次死亡起才會抽取。')
                    if rolls>1:note.append('本版休閒模式會執行此掉落獎勵兩次；顯示為每次抽取機率。')
                    drops.append({'monster':p['monster'],'item':c['id'],'rate':compact(rate*c['weight']/total),'group':'MVP 戰利品','kind':'MVP・'+label,'line':c['line'],'function':p['fn'],'conditional':True,'conditionNote':' '.join(note) or None,'id':f'c08-mvp-{c["line"]}-{label}','rateDerived':True,'rateSource':VERSION+' war3map.j RODrop_Config / Pool / Candidate','minDeath':p['minDeath'],'poolId':poolid})
                    drops[-1]['rolls']=rolls
                    if len(p['candidates'])>1:drops[-1].update({'exclusivePool':poolid,'exclusivePick':1,'exclusiveOf':len(p['candidates'])})
                    self.source(c['line'])
        self.audit['mvpBounty']=boss_bounty
        return drops,pools

    def recipes(self):
        out=[]
        for kind,var in [('Merge','MERGE'),('Forging','FORGING')]:
            fn=f'Trig_{kind}_Initialization_Actions';start,body=self.funcs[fn];cur=None;material=None
            for off,l in enumerate(body.splitlines()):
                n=start+off;m=re.search(r"set udg_it_"+var+r"_ITEM\[udg_a\] = '(.{4})'",l)
                if m:
                    if cur:out.append(cur)
                    idx=sum(1 for r in out if r['function']==fn)+1
                    cur={'id':('recipe-' if kind=='Merge' else 'forge-')+str(idx),'result':m.group(1),'materials':[],'line':n,'function':fn,'kind':'合成' if kind=='Merge' else '鍛造','sourceVersion':VERSION}
                    if kind=='Forging':cur['note']='透過鍛造術（A0I6）製作。材料齊全後消耗材料並產出；來源程式未設定失敗擲骰。'
                    self.source(n)
                m=re.search(r"set udg_keyMaterial = '(.{4})'",l)
                if m:material=m.group(1)
                m=re.search(r'call SaveRealBJ\(\s*([\d.]+),\s*udg_b,\s*udg_a,\s*udg_'+var+'_h',l)
                if m and cur:
                    q=float(m.group(1));cur['materials'].append({'id':material,'quantity':compact(max(q,1)),'measure':'件' if q==0 else '份','rawCharge':compact(q)})
            if cur:out.append(cur)
        return out

    def regions(self):
        out=[];oldbykey={x['key']:x for x in self.old['regions']}
        for n,l in enumerate(self.lines,1):
            m=re.search(r'set (gg_rct_\w+)\s*=\s*Rect\(\s*([\d.-]+),\s*([\d.-]+),\s*([\d.-]+),\s*([\d.-]+)',l)
            if m:
                k,*v=m.groups();r=copy.deepcopy(oldbykey.get(k,{'id':k,'key':k,'name':k[7:].replace('_',' '),'displayName':k[7:].replace('_',' ')}))
                r.update(dict(zip(['x1','y1','x2','y2'],map(float,v))));r['line']=n;r['sourceVersion']=VERSION;out.append(r)
        return out

    def ability(self,aid,level=1,old=None):
        v=self.abilities.get(aid,{})
        if not v:return None
        old=old or {};am=self.am.get(aid,{});native=not am
        desc=clean(resolve_text(getlevel(v,'ubertip',level,''),self.abilities));name=clean(v.get('name',aid))
        if old and not any(k.startswith('anam:') for k in am.get('fields',{})):name=old.get('name',name)
        if old and not any(k.startswith('aub1:') for k in am.get('fields',{})):desc=old.get('description',desc)
        req=v.get('requires') or None;iconpath=v.get('art','');out={'id':aid,'name':name,'description':desc,'cooldown':compact(getlevel(v,'cool',level,None)),'mana':compact(getlevel(v,'cost',level,None)),'icon':self.icon_by_path.get(str(iconpath).lower()),'iconPath':iconpath,'internal':old.get('internal',False),'level':level,'base':am.get('base_id',aid),'code':v.get('_code',am.get('base_id',aid)),'source':'war3map.w3a + Warcraft III 1.27.1 Custom native · '+VERSION,'descriptionStatus':'unresolved' if re.search(r'<[^>]+>',desc) else 'ok' if desc else 'empty','castRange':compact(getlevel(v,'rng',level,None)),'area':compact(getlevel(v,'area',level,None)),'requirements':req,'modeLabel':'狂暴模式' if 'Rhpm' in str(req) else '一般模式','modeReason':'Requires=Rhpm' if 'Rhpm' in str(req) else '未要求 Rhpm'}
        return out

    def monsters(self):
        out=[];oldbyid={m['id']:m for m in self.old['monsters']};oldpoint={}
        for m in self.old['monsters']:
            for p in m.get('placements',[]):oldpoint[(m['id'],round(p['x'],1),round(p['y'],1))]=p
        selected=list(oldbyid)+['OKP1','O0NT','n0DK']
        changed=[];missing=[]
        for rid in selected:
            old=oldbyid.get(rid,{});m=copy.deepcopy(old);u=self.units[rid];mod=self.um[rid];hero=rid[0].isupper();levels=self.levels[rid]
            if not levels and old.get('heroLevelEvidence'):
                # Keep only evidence independently relocated by exact source function.
                for evidence in old['heroLevelEvidence']:
                    f=self.funcs.get(evidence.get('function'))
                    if f and re.search(r'SetHeroLevel(?:BJ)?\([^\n]+,\s*'+str(evidence['level'])+r'\s*,',f[1]):levels.append({'line':f[0],'function':evidence['function'],'level':evidence['level'],'scope':'function-level reference; dynamic recipient checked separately'})
            rawname=clean(u.get('name',old.get('name',rid)));name=re.sub(r'\s*[（(]Lv\.?\s*\d+[）)]\s*','',rawname).strip()
            stated_level=re.search(r'Lv\.?\s*(\d+)',rawname,re.I)
            level=max([e['level'] for e in levels] or [1]) if hero else int(stated_level.group(1)) if stated_level else u.get('level',1)
            hpbase=u.get('hp');atkbase=u.get('dmgplus1');dice=u.get('dice1');sides=u.get('sides1');defbase=u.get('def');armor=u.get('deftype','normal');attrs={};afinal={}
            if hero:
                for full,key in [('strength','str'),('agility','agi'),('intelligence','int')]:
                    base=u.get(key);growth=u.get(key+'plus',0);final=math.floor(base+(level-1)*growth+1e-5) if base is not None else None
                    attrs.update({full+'Base':base,full+'Growth':compact(growth),full+'Final':final});afinal[key.upper()]=final
            primary=str(u.get('primary','')).upper() if hero else None;patk=afinal.get(primary,0) if hero else 0;hpbonus=afinal.get('STR',0)*25 if hero else 0;defbonus=afinal.get('AGI',0)*.01 if hero else 0
            hp=hpbase+hpbonus if hpbase is not None else None;core=atkbase+patk if atkbase is not None else None;amin=core+dice if core is not None and dice is not None else None;amax=core+dice*sides if core is not None and dice is not None and sides is not None else None
            attack=(amin+amax)/2 if amin is not None and amax is not None else None
            m.update({'id':rid,'base':mod['base_id'],'name':name,'rawName':rawname,'level':level,'objectLevel':u.get('level'),'isHero':hero,'source':'war3map.w3u + Warcraft III 1.27.1 Custom native · '+VERSION,'hpBase':hpbase,'hpStrength':hpbonus,'hp':hp,'attackBase':atkbase,'attackCore':core,'attackAttribute':patk,'attackDice':dice,'attackSides':sides,'attackMin':amin,'attackMax':amax,'attack':compact(attack),'attackDisplay':f'{amin:,}–{amax:,}' if amin is not None else '待確認','attackVerified':amin is not None and amax is not None,'attackWeapon':1,'attackRange':u.get('rangen1'),'attackRangeSource':'war3map.w3u + verified native rangen1','defenseBase':defbase,'defenseAttribute':compact(defbonus),'defense':compact(defbase+defbonus) if defbase is not None else None,'speed':u.get('spd'),'armor':armor,'armorName':ARMORS.get(armor,(armor,''))[0],'armorTip':ARMORS.get(armor,(armor,''))[1],'iconPath':u.get('art',''),'modelPath':u.get('file',''),'modelColor':[u.get(c,255) for c in ['red','green','blue']],'statsMode':'未受外部增益的生成值','statsSources':{'native':'Warcraft III 1.27.1 Custom native；不套用其他物件的地圖覆寫','map':'7.0c08 war3map.w3u','constants':'7.0c08 war3mapMisc.txt','level':'7.0c08 war3map.j'},'dropStatus':'parsed-7.0c08','heroLevels':sorted(set(e['level'] for e in levels)),'suffix':clean(u.get('editorsuffix',''))})
            m['icon']=self.icon_by_path.get(str(m['iconPath']).lower())
            if hero:m.update(attrs);m.update({'heroLevel':level,'heroLevelEvidence':levels,'primaryAttribute':primary,'hpPerStrength':25})
            m['hpFormula']=f'{hpbase:,} + {afinal.get("STR",0):,} × 25 = {hp:,}' if hero and hp is not None else str(hpbase)
            m['attackFormula']=f'{atkbase:,} + {patk:,} + {dice}d{sides} = {amin:,}–{amax:,}' if amin is not None else '待確認'
            m['attackFormulaPlain']=f'物件基礎傷害 {atkbase} + 主屬性 {patk} + 傷害骰 {dice}d{sides}'
            m.setdefault('grade','MVP' if hero else '一般');m.setdefault('regions',[]);m.setdefault('zones',[])
            points=[]
            for p in self.placements[rid]:
                key=(rid,round(p['x'],1),round(p['y'],1));prev=oldpoint.get(key,{})
                p={**p,'area':prev.get('area'),'areaName':prev.get('areaName')};points.append(p)
            # Keep the current semantic suppression for encounter units, but revalidate coordinates separately.
            if old.get('locationStatus') or old.get('hiddenEncounter') or old.get('supersededPlacementSources'):
                oldkeys={(round(p['x'],1),round(p['y'],1)) for p in old.get('placements',[])}
                points=[p for p in points if (round(p['x'],1),round(p['y'],1)) in oldkeys]
            m['placements']=points
            if points:m['zones']=list(dict.fromkeys(p['area'] for p in points if p.get('area')))
            ids=list(dict.fromkeys(filter(None,str(u.get('abillist','')).split(','))))
            oldabs={a['id']:a for a in old.get('abilities',[])};oldvisible=set(oldabs)
            oldrawvisible=set(oldvisible)
            # Keep technical inventory/detection/death-control abilities out of the skills list.
            technical={'Aion','AInv','AIfo','AIx3','Aien','Aneu','Avul','Aloc','A0BH','A0JB','A0FC','A0FD','A0FE','A0FF'}
            visible=[aid for aid in ids if aid in oldvisible or (aid not in technical and aid in self.am and not any(w in clean(self.abilities[aid].get('name','')) for w in ['物品欄','商店','屍體','無敵','不可復活','定位','等級數值','模型','標籤','護甲類型','物品－Trigger']))]
            creation=[]
            for aid,lines in self.creation[rid].items():
                levelsbyfn=collections.Counter(self.linefunc[n] for n in lines);lv=max(levelsbyfn.values())
                creation.append({'id':aid,'name':clean(self.abilities.get(aid,{}).get('name',aid)),'level':lv,'lines':lines})
                if aid not in visible:visible.append(aid)
            clevels={x['id']:x['level'] for x in creation};abs=[]
            for aid in visible:
                if aid not in self.abilities:missing.append({'monster':rid,'ability':aid});continue
                a=self.ability(aid,clevels.get(aid,1),oldabs.get(aid));
                if a:abs.append(a)
            m['abilities']=abs;m['creationAbilities']=creation
            if hero:
                extra=copy.deepcopy(old.get('mvpSkills',{}).get('mechanics',[]))
                for a in extra:
                    a['verificationStatus']='前版機制說明；本次未完整驗證全部觸發分支'
                m['mvpSkills']={'general':[a for a in abs if a['modeLabel']=='一般模式'],'rage':[a for a in abs if a['modeLabel']=='狂暴模式'],'mechanics':extra}
            for ev in m.get('dynamicSpawnSources',[]):
                ff=self.funcs.get(ev.get('function'))
                if ff:
                    hits=[ff[0]+i for i,ll in enumerate(ff[1].splitlines()) if "'"+rid+"'" in ll and ('Create' in ll or ' = ' in ll)]
                    ev['line']=hits[0] if hits else ff[0];ev['verificationStatus']='生成函數存在；觸發前置條件沿用前版說明';ev['sourceVersion']=VERSION
            m['skillReferenceNote']='技能物件、冷卻、消耗及 Rhpm 模式條件已重讀本版；未逐條重驗的機制文字另列為前版參考。'
            changedfields={k:{'old':old.get(k),'new':m.get(k)} for k in ['name','hp','attackMin','attackMax','defense','speed','level','modelPath','attackRange'] if old.get(k)!=m.get(k)}
            if changedfields:changed.append({'id':rid,'name':name,'fields':changedfields})
            out.append(m)
        self.audit['monsterChangedFields']=changed;self.audit['missingAbilityObjects']=missing
        self.decorate_new_monsters(out)
        for m in out:
            rid=m['id'];abilities=set(str(self.units[rid].get('abillist','')).split(','))
            if rid=='otau':m['respawn']={'type':'instance','label':'副本機制','note':'本版具有 AIx3，不適用一般魔物 45 秒復活；副本與事件生成另依觸發條件。','source':'7.0c08 war3map.w3u uabi / Trig_Npc_Unit_Revive_Actions'}
            elif rid=='URgd':m['respawn']={'type':'phase','label':'接續最終形態','note':'本版沒有 AIfo，不進入通用 MVP 復活；初代死亡後等待 20 秒，生成 Lv.99 蘭特克利斯最終形態，該接續觸發只執行一次。','source':'7.0c08 Trig_Randgris_Final_Arrival_Actions','phaseDelay':20,'nextForm':'Ulic'}
            elif rid=='Ulic':m['respawn']={'type':'phase','label':'最終形態','note':'由初代巴基力 蘭特克利斯死亡後等待 20 秒生成。本版沒有 AIfo，不適用通用 MVP 的 900／600 秒復活。','source':'7.0c08 Trig_Randgris_Final_Arrival_Actions / war3map.w3u uabi'}
            elif m.get('isHero') and 'AIfo' in abilities and rid!='O0NT':
                m['respawn']={'type':'timer','normal':900,'chill':600,'label':'會復活','note':'本版具有 AIfo，死亡後進入通用 MVP 復活計時：一般 900 秒、休閒模式 600 秒。','source':'7.0c08 Trig_Mvp_Boss_Revive_Actions'}
            guidefn={'Ulic':'Trig_Randgris_Final_Arrival_Actions','UKrk':'ROKr_TrySummon','Udth':'ROTm_TrySummon'}.get(rid)
            if guidefn and m.get('summonGuide'):
                first,body=self.funcs[guidefn];guide=m['summonGuide'];guide['source']='7.0c08 war3map.j / '+guidefn
                guide['lines']=[first+i for i,l in enumerate(body.splitlines()) if any(w in l for w in ['CreateUnit','SetHeroLevel','PolledWait','GetItemOfType','RemoveItem','SaveBoolean','LoadBoolean'])]
                guide['verificationStatus']='本版召喚入口、消耗、延遲、等級與防重複條件已核對'
                guide['verified']=True
                if rid=='Ulic':guide['steps']=['擊敗奧丁神殿的巴基力 蘭特克利斯。','等待 20 秒後，在原 MVP 登記位置生成 Lv.99 最終形態；此階段接續只執行一次。']
                elif rid=='UKrk':guide['steps']=['由存活、非幻象的玩家英雄攜帶「海洋之聲」，進入魔鬼大烏賊的深邃祭壇區域。','消耗一份海洋之聲；一般模式等待 20 秒，休閒模式略過此等待。','在 (-2176, 7552) 生成 Lv.99 魔鬼大烏賊，同一場只接受一次召喚。']
                elif rid=='Udth':guide['steps']=['由存活、非幻象的玩家英雄攜帶至少 1 次數的「扭曲的時間鑰匙」，站在封印的有效召喚區域內，攻擊 (-5376, -4480) 的飛行魔書。','接受召喚後消耗 1 次數鑰匙，等待 20 秒，在初始錨點 (-5232, -5136) 生成 Lv.99 時間支配者；同場不可重複召喚。']
                extras={'Ulic':['Trig_Randgris_Final_Arrival_Conditions','InitTrig_Randgris_Final_Arrival'],'UKrk':['Trig_MVP_35_Kraken_Summon_Actions','InitTrig_MVP_35_Kraken_Summon'],'Udth':['Trig_MVP_34_TimeRuler_Summon_Conditions','Trig_MVP_34_TimeRuler_Summon_Actions','InitTrig_MVP_34_TimeRuler_Summon']}[rid]
                for fn in extras:
                    n,b=self.funcs[fn];guide['lines']+=[n+i for i,l in enumerate(b.splitlines()) if i==0 or any(s in l for s in ['return ','if ','TrySummon','TriggerRegister'])]
                cn,cb=self.funcs['Trig_Npc_Initialization_Actions'];guide['lines']+=[cn+i for i,l in enumerate(cb.splitlines()) if 'set udg_const_r_npcMVPTime = 20.00' in l]
                guide['lines']=sorted(set(guide['lines']));guide['source']+=' / '+' / '.join(extras)+' / Trig_Npc_Initialization_Actions'
                self.source(first,12)
        self.audit['respawnCorrections']=['otau: AIx3 excludes generic45s','URgd: one-time phase transition20s, noAIfo','Ulic: finalform noAIfo; remove900/600s claim','O0NT: both modes900s then returns normal O004']
        self.refresh_summon_guides(out)
        for m in out:
            u=self.units[m['id']];enabled=int(u.get('weapson',0));m['attackEnabled']=bool(enabled & 1);m['attackTargets']=u.get('targs1','');m['attackCooldown']=compact(u.get('cool1'))
            if enabled == 0:m['attackNote']='此物件未啟用普通攻擊。'
            if enabled & 2:
                core=u.get('dmgplus2',0)+m.get('attackAttribute',0);low=core+u.get('dice2',0);high=core+u.get('dice2',0)*u.get('sides2',0)
                m['secondaryAttack']={'weapon':2,'min':low,'max':high,'range':u.get('rangen2'),'cooldown':compact(u.get('cool2')),'targets':u.get('targs2',''),'source':'war3map.w3u + unmodified native parent'}
                m['attackNote']='此物件同時啟用兩組攻擊；主要數值列第一組，另列第二組攻擊的目標與數值。'
        return out

    def decorate_new_monsters(self,monsters):
        by={m['id']:m for m in monsters}
        for rid in ['OKP1','O0NT','n0DK']:
            m=by[rid];m['portrait']=None;m['portraitSource']=None;m['previewReferenceNote']='本版新增模型，等待以實際模型重新渲染。';m['modelChanged']=True
            m['placements']=[];m['dynamicSpawnSources']=[];m['locationStatus']='dynamic'
        m=by['OKP1'];m['locationLabelOverride']='限時事件隨機區域';m['locationNote']='由 Trig_EGT1200s_Actions 事件流程生成；不屬於固定預放魔物。';m['dynamicSpawnSources']=[{'function':'Trig_EGT1200s_Actions','line':36075,'summary':'計時事件依進度在指定區域動態生成國王波利，生成等級 99。'}];m['respawn']={'type':'event','label':'事件生成','note':m['locationNote']};m['zones']=[]
        m=by['O0NT'];m['locationLabelOverride']='烏龜島二樓儀式';m['locationNote']='普通烏龜將軍死亡等候復活時，將四種靈原石放在各自對應的地面祭壇，集齊後完成儀式；普通復活倒數結束，再等待 20 秒生成不祥形態。死亡後交回普通烏龜將軍。';m['dynamicSpawnSources']=[{'function':'RONT_ResolveReviver','line':56671,'summary':m['locationNote']}];m['zones']=by.get('O004',{}).get('zones',[]);m['respawn']={'type':'event','label':'祭壇儀式生成','note':'不祥形態死亡後，一般與休閒模式皆等待 900 秒，再交回普通烏龜將軍；不祥形態需祭壇儀式生成。','source':'7.0c08 Trig_Mvp_Boss_Revive_Actions / RONT_ResolveReviver','returnForm':'O004','normal':900,'chill':900}
        m=by['n0DK'];m['locationLabelOverride']='不祥烏龜將軍召喚';m['locationNote']='不祥烏龜將軍召喚一隻暗夜龜後，程式再生成四隻，共五隻；戰鬥機制結束時清除。';m['dynamicSpawnSources']=[{'function':'RONT_SummonNightTurtle','line':56246,'summary':m['locationNote']}];m['zones']=by.get('O004',{}).get('zones',[]);m['respawn']={'type':'summon','label':'由首領召喚','note':'具有 AIx3，不進入一般復活。'}

    def refresh_summon_guides(self,monsters):
        """Rebind every displayed guide citation and fully refresh the changed encounters."""
        by={m['id']:m for m in monsters}
        def evidence(fns):
            lines=[]
            for fn,needles in fns.items():
                first,body=self.funcs[fn];lines.append(first)
                for needle in needles:
                    matches=[first+i for i,l in enumerate(body.splitlines()) if needle in l]
                    if not matches:raise AssertionError(('summon evidence missing',fn,needle))
                    lines.extend(matches)
            return sorted(set(lines))
        def guide(rid,kind,summary,steps,fns):
            g={'kind':kind,'title':by[rid]['name'],'summary':summary,'steps':steps,'source':'7.0c08 war3map.j / '+' / '.join(fns),'lines':evidence(fns),'verificationStatus':'本版召喚條件、時間與生成結果已核對','verified':True}
            by[rid]['summonGuide']=g
        guide('UNMR','神器隱藏分支','由非幻象的攻擊者攜帶四件強化神器攻擊金字塔封印，觸發夢魘分支。',[
            '同一名非幻象攻擊者需同時持有「鍛爐．雷神腰帶」「加冕．女神頸鍊」「諸神．雷神之鎚」「加護．史雷普尼爾之靴」。',
            '使用該角色攻擊金字塔內的封印目標；四件強化神器會保留，不會因召喚而被消耗。',
            '封印移除後，一般模式等待 20 秒；休閒模式略過此等待。隨後在 (-3008, 1568) 生成 Lv.99 古埃及王﹡夢魘。',
            '此封印召喚只執行一次；若四組神器中包含原版而非四件全強化，則走普通古埃及王分支。'],{
            'Trig_MVP_21_AmonRa_Conditions':['gg_unit_nico_0456','IsUnitIllusionBJ'],
            'Trig_MVP_21_AmonRa_Actions':["'I0EK'",'NMR_Summon()','DestroyTrigger'],
            'NMR_Summon':['RemoveUnit','udg_const_b_ChillMode','PolledWait',"'UNMR'",'SetHeroLevel','SetUnitVertexColor'],
            'Trig_Npc_Initialization_Actions':['set udg_const_r_npcMVPTime = 20.00']})
        by['UNMR']['previewColor']=[85,110,230];by['UNMR']['previewAlpha']=217/255
        by['UNMR']['previewColorSource']={'function':'NMR_Summon','line':59442,'rgba':[85,110,230,217]}
        guide('O0NT','四靈祭壇儀式','在普通烏龜將軍等待復活期間，將四種靈原石放到烏龜島二樓的對應地面祭壇。',[
            '先擊敗普通烏龜將軍，在其等待復活期間，由非幻象的玩家英雄進行祭壇投放。',
            '左上祭壇放「火靈原石」（-3904, 6208）；右上祭壇放「地靈原石」（-2240, 6208）。',
            '左下祭壇放「風靈原石」（-3904, 3776）；右下祭壇放「水靈原石」（-2240, 3776）。原石必須在地面，距各祭壇中心的水平與垂直偏差各不超過 192。',
            '四個祭壇各有正確原石時完成儀式，投放先後順序不限；程式會移除四個被選中的地面物品，若是堆疊物品會連同該堆疊移除。',
            '等待普通烏龜將軍的復活倒數結束（一般模式從死亡起 900 秒、休閒模式 600 秒），再經 20 秒預告，於原 MVP 復活位置生成 Lv.99 不祥烏龜將軍。',
            '不祥形態死亡後，一般與休閒模式皆等待 900 秒，再交回普通烏龜將軍。'],{
            'RONT_IsOffering':['IsItemOwned',"'I08X'","'tdex'","'I07D'","'I08S'"],
            'RONT_RecountAltars':['IsUnitInGroup','if n == 4','RemoveItem','RONT_CommitIslandScene'],
            'RONT_TryOffering':['IsUnitIllusion'],
            'RONT_Preannounce':['SaveReal'],
            'RONT_ResolveReviver':['CreateUnit','SetHeroLevel','gg_unit_O004_0021'],
            'Trig_Mvp_Boss_Revive_Actions':['900.','600.'],
            'Trig_Mvp_Boss_Revive_Timer_AIjass_Func003A':['t <= 1','RONT_Preannounce','RONT_ResolveReviver'],
            'Trig_Npc_Initialization_Actions':['set udg_const_r_npcMVPTime = 20.00']})
        by['O0NT']['hiddenEncounter']=True
        guide('n0DK','首領召喚','不祥烏龜將軍施展召喚時一次產生五隻暗夜龜。',[
            '先完成四靈祭壇儀式，遭遇不祥烏龜將軍。',
            '首領召喚一隻暗夜龜時，程式會在附近追加四隻，合計五隻，並補滿其法力。',
            '再次召喚前會清除上一批暗夜龜；首領死亡或移除時也會清除。暗夜龜本身具有不可復活能力。'],{
            'RONT_SummonNightTurtle':["GetUnitTypeId(b) == 'n0DK'",'RONT_ClearNightTurtle','exitwhen i > 4',"CreateUnit(udg_NPC_PLAYER, 'n0DK'"],
            'RONT_EndBloodTide':['RONT_ClearNightTurtle'],
            'RONT_BloodDeath':['RONT_EndBloodTide'],
            'RONT_BloodIndex':['RONT_EndBloodTide']})
        guide('OKP1','時間隨機事件','遊戲時間達 20 分鐘、未啟用 MVP 劇情分支時，有機會出現國王波利。',[
            '遊戲時間達 1200 秒（20 分鐘）時執行一次此事件。',
            '未啟用 MVP 劇情分支時，事件會從三個分支中等機率抽取；抽到第三個分支才會嘗試生成國王波利。',
            '系統在四個指定事件區域中隨機選一處並抽取位置；若位置不可行走，改依序嘗試各事件區域中心。',
            '找到可行走位置後生成 Lv.99 國王波利，並顯示事件提示與小地圖標記；此事件觸發器執行後即移除。'],{
            'InitTrig_EGT1200s':['1200.00'],
            'Trig_EGT1200s_Func003C':['udg_MVPStory'],
            'Trig_EGT1200s_Actions':['GetRandomInt(1, 3)','GetRandomInt(1, 4)',"'OKP1'",'SetHeroLevelBJ','DestroyTrigger']})
        by['OKP1']['hiddenEncounter']=True
        by['OKP1']['locationNote']='遊戲時間達 20 分鐘、未啟用 MVP 劇情分支時的隨機事件；在事件區域動態生成，沒有固定預放座標。'
        reviewed=load(Path(__file__).with_name('reviewed_summon_guides.json'))
        actual_hash=hashlib.sha256((self.mx/'extracted/war3map.j').read_bytes()).hexdigest()
        if reviewed['jassSha256']!=actual_hash:raise AssertionError('Reviewed summon guide snapshot belongs to another JASS source; review the displayed conditions before reusing it.')
        for rid,record in reviewed['monsters'].items():by[rid].update(copy.deepcopy(record))
        # Existing explanatory text is retained honestly, while every visible citation
        # points to the current function, not an unrelated old absolute line number.
        for m in monsters:
            g=m.get('summonGuide')
            if not g:continue
            if not g.get('verified') and not g.get('reviewed'):
                fns=[f for f in re.findall(r'\b(?:Trig_\w+|RO\w+|NMR_\w+)\b',g.get('source','')) if f in self.funcs]
                if m['id']=='Ucrl':fns=['Trig_MVP_21_AmonRa_Conditions','Trig_MVP_21_AmonRa_Actions']
                if fns:
                    g['lines']=evidence({f:["'"+m['id']+"'"] if "'"+m['id']+"'" in self.funcs[f][1] else [] for f in fns})
                    fully=m['id'] in ['Ulic','UKrk','Udth']
                    g['source']=('7.0c08 war3map.j / ' if fully else '前版條件說明；7.0c08 已重新定位相關函數：')+' / '.join(fns)
                    if not fully:g['verificationStatus']='相關函數與生成物件已重定位；召喚前置條件文字沿用前版，尚未逐項重驗'
                elif m['id']=='unec':
                    g['lines']=[i+1 for i,l in enumerate(self.lines) if "set udg_ut_npcDrop[udg_a] = 'unec'" in l]
                    g['source']='7.0c08 war3map.j 一般掉落表；未確認可用召喚入口';g['verificationStatus']='已確認掉落表物件引用，未確認生成來源'
                else:raise AssertionError(('summon guide without current evidence',m['id'],g))
            g['evidence']=[{'line':n,'function':self.linefunc[n],'text':self.lines[n-1]} for n in g['lines']]
            for n in g['lines']:self.source(n,5)
            if g.get('verified'):
                for s in m.get('dynamicSpawnSources',[]):s['verificationStatus']='本版生成來源與召喚指南所列前置條件已核對'
        self.audit['summonGuideEvidence']={m['id']:{'lines':m['summonGuide']['lines'],'status':m['summonGuide'].get('verificationStatus')} for m in monsters if m.get('summonGuide')}

    def sets(self):
        out=[];fn='Trig_SET_Actions';start,body=self.funcs[fn];blocks=list(re.finditer(r'// (\d+)：([^\n]+)\n(.*?)(?=// \d+：|\Z)',body,re.S))
        blockmap={int(m.group(1)):(start+body.count('\n',0,m.start()),m.group(3)) for m in blocks}
        for old in self.old['sets']:
            s=copy.deepcopy(old);n=int(s['id'].split('-')[-1]);line,block=blockmap[n];keys=re.findall(r'UnitHasItemLevel\(udg_u_itemtrigger,\s*(\d+)\)',block);keys+=re.findall(r"UnitHasItemOfTypeBJ\(udg_u_itemtrigger,\s*'(.{4})'",block)
            for fn2 in re.findall(r'\b(Trig_SET_Func\w+)\(',block):
                if fn2 in self.funcs:keys+=re.findall(r"UnitHasItemOfTypeBJ\(udg_u_itemtrigger,\s*'(.{4})'",self.funcs[fn2][1])
            keys=list(dict.fromkeys(keys));expected=[g['key'] for g in old['groups']]
            s.update({'line':line,'sourceVersion':VERSION,'verificationStatus':'verified-group-membership','note':'套裝成員條件已比對本版 Trig_SET_Actions；物品文案為本版說明。程式內部數值不直接等同顯示單位。'})
            self.audit.setdefault('setsMembership',[]).append({'id':s['id'],'keysFromJass':keys,'previousKeys':expected,'match':set(keys)==set(expected)})
            if set(keys)!=set(expected):s['verificationStatus']='review-required'
            deltas=[]
            for mm in re.finditer(r'LoadIntegerBJ\(udg_key(\w+),[^\n]+?\)\s*\+\s*([\d.]+)',block):
                text=f'{mm.group(1)} + {mm.group(2)}（內部值）'
                if text not in deltas:deltas.append(text)
            for mm in re.finditer(r'SetUnitAbilityLevelSwapped\(\s*udg_a_attr(\w+),[^\n]+?\+\s*([\d.]+)',block):
                text=f'{mm.group(1)} 技能等級 + {mm.group(2)}（內部值）'
                if text not in deltas:deltas.append(text)
            self.audit.setdefault('setNumericChanges',[]).append({'id':s['id'],'old':s.get('triggerChanges',[]),'current':deltas,'sourceFunction':fn,'sourceLine':line})
            s['triggerChanges']=deltas;s['verificationStatus']='verified-membership-and-direct-deltas' if set(keys)==set(expected) else 'review-required'
            if n==8:s['note']+=' 本段僅記錄套裝件數；其他戰鬥觸發對此件數的使用尚未完整重驗。'
            # Deduplicate set text; card variants must not bloat the set effect description.
            desc=[]
            for group in s['groups']:
                for iid in group['items']:
                    if iid in self.im:
                        text=clean(resolve_text(self.im[iid]['fields'].get('utub',''),self.abilities))
                        if '套裝屬性' in text:
                            text=text.split('套裝屬性',1)[1].split('卡片屬性',1)[0].strip()
                            if text and text not in desc:desc.append(text)
            if desc:s['description']='套裝屬性\n'+'\n\n'.join(desc)
            self.source(line,20);out.append(s)
        return out

    def shops(self):
        fn='Trig_Set_Item_Actions';start,body=self.funcs[fn];buy={};index=0
        for off,l in enumerate(body.splitlines()):
            m=re.search(r'set udg_a = (\d+)\s*$',l)
            if m:index=int(m.group(1))
            elif 'set udg_a = ( udg_a + 1 )' in l:index+=1
            m=re.search(r"set udg_it_BUY_ITEM\[udg_a\] = '(.{4})'",l)
            if m:buy[index]={'id':m.group(1),'line':start+off}
        oldby={s['unit']:s for s in self.old['shops']};positions=collections.defaultdict(list)
        for n,l in enumerate(self.lines,1):
            if self.linefunc[n] not in ['CreateNeutralPassiveBuildings','CreateNeutralPassive']:continue
            m=re.search(r"CreateUnit\(\s*p,\s*'(.{4})',\s*(-?[\d.]+),\s*(-?[\d.]+)",l)
            if m:
                rid,x,y=m.groups();x=float(x);y=float(y);positions[rid].append({'x':x,'y':y,'line':n,'map':self.xy(x,y)})
        out=[];nativeitems=load(self.mx/'native_item_127.json');candidates=[]
        for rid,u in self.units.items():
            sells=[i for i in str(u.get('sellitems','')).split(',') if i]
            if sells and rid not in oldby and positions.get(rid): candidates.append({'unit':rid,'name':clean(u.get('name')),'menuItems':sells,'positions':positions[rid]})
        self.audit['otherPlacedUnitMenus']=candidates
        itemfile=self.work/'items_patch.json'
        knownitems={i['id'] for i in (load(itemfile)['items'] if itemfile.exists() else self.old['items'])}
        added=[]
        for c in candidates:
            rid=c['unit']
            if rid=='h01M':continue # Explicit GM shop must never become a public acquisition source.
            usable=[]
            for sold in c['menuItems']:
                mo=self.im.get(sold);f=mo['fields'] if mo else {};base=nativeitems.get(mo['base_id'] if mo else sold,{})
                cls=f.get('icla',base.get('class'));hp=f.get('ihtp',base.get('hp'));target=buy.get(hp,{}).get('id') if cls=='Purchasable' else sold
                if target in knownitems:usable.append(sold)
            if usable:
                oldby[rid]={'unit':rid,'name':c['name'],'positions':[],'allowedOffers':usable}
                added.append({'unit':rid,'name':c['name'],'soldItems':usable})
        self.audit['newVerifiedVendorLists']=added
        for rid,old in oldby.items():
            u=self.units[rid];offers=[];missing=[]
            for sold in filter(None,str(u.get('sellitems','')).split(',')):
                if old.get('allowedOffers') and sold not in old['allowedOffers']:continue
                mo=self.im.get(sold);f=mo['fields'] if mo else {};base=nativeitems.get(mo['base_id'] if mo else sold,{})
                cls=f.get('icla',base.get('class'));hp=f.get('ihtp',base.get('hp'))
                target=sold;offer={'soldItem':sold,'item':target,'mappingSource':'war3map.w3u usei（直接出售實體物品）'}
                if cls=='Purchasable':
                    mapping=buy.get(hp)
                    if not mapping:missing.append({'soldItem':sold,'index':hp});continue
                    target=mapping['id'];offer.update({'item':target,'mappingSource':'Purchasable ihtp → udg_it_BUY_ITEM','function':fn,'line':mapping['line'],'purchaseIndex':hp})
                if target not in knownitems:
                    self.audit.setdefault('nonCatalogNpcMenus',[]).append({'unit':rid,'soldItem':sold,'name':clean(f.get('unam',base.get('name'))),'class':cls})
                    continue
                if rid in {'nssn','nvde','edoc','hmil','hrif','h01E','h00V'}:offer['conditionNote']='NPC 出售清單已確認；解鎖／任務條件另依遊戲判定。'
                offers.append(offer)
            oldpositions={(round(p['x'],1),round(p['y'],1)):p for p in old['positions']};pout=[]
            for p in positions[rid]:
                prev=oldpositions.get((round(p['x'],1),round(p['y'],1)),{})
                pout.append({**p,'area':prev.get('area'),'areaName':prev.get('areaName'),'label':prev.get('label','地圖位置')})
            out.append({'unit':rid,'name':clean(u.get('name',old['name'])),'positions':pout,'items':list(dict.fromkeys(o['item'] for o in offers)),'menuItems':[o['soldItem'] for o in offers],'offers':offers,'source':'7.0c08 war3map.j CreateUnit + war3map.w3u usei（購買選單依本版初始化表對應實體物品）'})
            if rid in {'nssn','nvde','edoc'}:out[-1]['availabilityNote']='NPC 出售清單已確認；任務解鎖條件尚未完整重驗。'
            if missing:self.audit.setdefault('unresolvedShopOffers',[]).append({'unit':rid,'offers':missing})
        dump(self.out/'purchase_aliases.json',buy)
        return out

    def run(self):
        regular=self.regular_drops();mvp,pools=self.mvp_drops();recipes=self.recipes();regions=self.regions();monsters=self.monsters();sets=self.sets();shops=self.shops()
        patch={'monsters':monsters,'drops':regular+mvp,'recipes':recipes,'mvpDropPools':pools,'regions':regions,'sets':sets,'shops':shops,'sources':self.sources}
        self.audit['counts']={k:len(v) for k,v in patch.items()};self.audit['regularDrops']=len(regular);self.audit['mvpDrops']=len(mvp);self.audit['areasPreserved']=len(self.old['areas'])
        self.audit['missingMonsterDropReferences']=sorted(set(d['monster'] for d in patch['drops'])-{m['id'] for m in monsters})
        self.audit['newItemReferences']=sorted(({d['item'] for d in patch['drops']}|{r['result'] for r in recipes}|{i['id'] for r in recipes for i in r['materials']})-{i['id'] for i in self.old['items']})
        dump(self.out/'nonitem_patch.json',patch);dump(self.out/'nonitem_audit.json',self.audit)
        print(json.dumps({'counts':self.audit['counts'],'newItemReferences':self.audit['newItemReferences'],'missingMonsterDropReferences':self.audit['missingMonsterDropReferences']},ensure_ascii=False))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--work',required=True,help='Work directory containing current_rodb.json and map_extract/');a=p.parse_args();Refresh(a.work).run()
