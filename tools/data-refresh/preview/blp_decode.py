"""Classic BLP1 codec. JPEG channels are BGRA, not CMYK color conversion.
Pillow JPEG CMYK output is inverted; undo inversion before BGRA swizzle.
Read-only level decoding; no source texture is changed.
"""
import struct,io
from pathlib import Path
import numpy as np
from PIL import Image

def decode(path,level=0):
    b=Path(path).read_bytes();assert b[:4]==b'BLP1'
    comp,flags,w,h,typ,has=struct.unpack_from('<6I',b,4)
    offsets=struct.unpack_from('<16I',b,28);sizes=struct.unpack_from('<16I',b,92)
    off,size=offsets[level],sizes[level];assert off and off+size<=len(b)
    if comp==0:
        n=struct.unpack_from('<I',b,156)[0]
        im=Image.open(io.BytesIO(b[160:160+n]+b[off:off+size]))
        assert im.mode=='CMYK'
        args=im.tile[0].args;im.tile=[im.tile[0]._replace(args=(args[0],'CMYK'))]
        a=255-np.array(im)
        return a[:,:,[2,1,0,3]]
    assert comp==1 and typ in (3,4,5)
    ww,hh=max(1,w>>level),max(1,h>>level);count=ww*hh
    palette=np.frombuffer(b[156:1180],np.uint8).reshape(256,4)
    idx=np.frombuffer(b[off:off+count],np.uint8).reshape(hh,ww)
    rgba=palette[idx][:,:,[2,1,0,3]].copy()
    if typ==5:rgba[:,:,3]=255-rgba[:,:,3]
    elif flags==8:
        assert size==2*count;rgba[:,:,3]=np.frombuffer(b[off+count:off+2*count],np.uint8).reshape(hh,ww)
    else:raise ValueError('Unsupported paletted alpha depth')
    return rgba
