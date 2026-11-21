from pathlib import Path
import struct,re,json
def parse_wts(path):
 text=Path(path).read_text('utf-8-sig')
 return {int(n):s for n,s in re.findall(r'STRING\s+(\d+)\s*\n(?:[^\n]*\n)*?\{\n(.*?)\n\}',text,re.S)}
def resolve(v,wts):
 if isinstance(v,str) and re.fullmatch(r'TRIGSTR_\d+',v):return wts.get(int(v[8:]),v)
 return v
def parse(path,wts=None):
 path=Path(path);wts=wts if wts is not None else parse_wts(path.with_name('war3map.wts'))
 b=path.read_bytes(); p=0
 def read(fmt):
  nonlocal p
  n=struct.calcsize(fmt);v=struct.unpack_from(fmt,b,p);p+=n;return v[0] if len(v)==1 else v
 def cstr():
  nonlocal p
  e=b.index(0,p);s=b[p:e].decode('utf-8','replace');p=e+1;return s
 version=read('<i');obj=[]
 for section in ('original','custom'):
  n=read('<i')
  for _ in range(n):
   old=read('<4s').decode('latin1');new=read('<4s').decode('latin1');count=read('<i');fields={};raw_fields={};mods=[]
   for m in range(count):
    key=read('<4s').decode('latin1');typ=read('<i');level=None;column=None
    if path.suffix in ('.w3a','.w3d','.w3q'):level=read('<i');column=read('<i')
    v=read('<i') if typ==0 else read('<f') if typ in (1,2) else cstr() if typ==3 else (_ for _ in ()).throw(ValueError(typ))
    end=read('<4s').decode('latin1');rv=resolve(v,wts);fk=key if level is None else key+':'+str(level)+':'+str(column)
    fields[fk]=rv;raw_fields[fk]=v;mods.append({'key':key,'type':typ,'level':level,'column':column,'value':rv,'raw_value':v,'end':end})
   obj.append({'id':new if new!='\0'*4 else old,'base_id':old,'custom_id':new,'section':section,'fields':fields,'raw_fields':raw_fields,'modifications':mods})
 assert p==len(b),(path,p,len(b))
 return {'version':version,'byte_length':len(b),'objects':obj}
