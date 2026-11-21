"""Read-only MPQ extraction; table primitives supplied by mpyq 0.2.5."""
from pathlib import Path
import io,struct,zlib,bz2,math
from mpyq import MPQArchive
class Archive(MPQArchive):
 def __init__(self,filename):
  data=Path(filename).read_bytes();start=data.find(b'MPQ\x1a');assert start>=0
  super().__init__(io.BytesIO(data[start:]),listfile=False)
 def decrypt(self,b,key):
  n=len(b)//4*4
  return self._decrypt(b[:n],key)+b[n:]
 def read_file(self,name):
  e=self.get_hash_table_entry(name)
  if e is None:return None
  r=self.block_table[e.block_table_index]
  if not r.flags&0x80000000:return None
  self.file.seek(r.offset);b=self.file.read(r.archived_size)
  def decompress(b,expected):
   if len(b)>=expected:return b
   typ=b[0]
   if typ==2:return zlib.decompress(b[1:])
   if typ==16:return bz2.decompress(b[1:])
   raise ValueError(('unsupported compression',name,typ))
  enc=bool(r.flags&0x10000);comp=bool(r.flags&0x200)
  s=name.decode() if isinstance(name,bytes) else name
  key=self._hash(s.replace('/','\\').rsplit('\\',1)[-1],'TABLE')
  if r.flags&0x20000:key=((key+r.offset)^r.size)&0xffffffff
  if r.flags&0x1000000:
   if enc:b=self.decrypt(b,key)
   out=decompress(b,r.size) if comp else b
  else:
   size=512<<self.header['sector_size_shift'];count=(r.size+size-1)//size
   if comp:
    table=b[:4*(count+1+(1 if r.flags&0x4000000 else 0))]
    if enc:table=self.decrypt(table,(key-1)&0xffffffff)
    pos=struct.unpack('<'+'I'*(len(table)//4),table)
   else:pos=list(range(0,r.size,size))+[r.size]
   pieces=[]
   for i in range(count):
    part=b[pos[i]:pos[i+1]]
    if enc:part=self.decrypt(part,(key+i)&0xffffffff)
    expected=min(size,r.size-i*size)
    if comp:part=decompress(part,expected)
    assert len(part)==expected,(name,i,len(part),expected)
    pieces.append(part)
   out=b''.join(pieces)
  assert len(out)==r.size,(name,len(out),r.size)
  return out
 def names(self):return self.read_file('(listfile)').decode('utf-8','replace').splitlines()
