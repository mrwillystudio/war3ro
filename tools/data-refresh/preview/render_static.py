"""Read-only exact MDX/BLP static RGBA renderer for RO Atlas. No game assets are changed."""
from pathlib import Path
import sys,json,math,hashlib,ctypes,argparse
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
from blp_decode import decode as decode_legacy
lib=ctypes.CDLL(str(ROOT/'raster_rgba.so'))
ptr=ctypes.c_void_p
lib.draw_rgba.argtypes=[ctypes.c_int,ctypes.c_int,ptr,ptr,ptr,ctypes.c_int,ptr,ptr,ctypes.c_int,ctypes.c_int,ctypes.c_int,ctypes.c_float,ptr,ctypes.c_int,ctypes.c_int,ptr,ptr]
def decode(p):
 try:
  return np.asarray(decode_legacy(p),dtype=np.uint8)
 except Exception:
  with Image.open(p) as im:im.load();return np.array(im.convert('RGBA'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def render(scene,texture_root,out,yaw=12,pitch=16,size=512,supersample=2,unit_color=(255,255,255),allow_missing=False,hide_geosets=()):
 m=json.loads(Path(scene).read_text()); texture_root=Path(texture_root); paths={str(p.relative_to(texture_root)).replace('\\','/').lower():p for p in texture_root.rglob('*') if p.is_file()}
 textures=[];texture_report=[];missing=[]
 for i,t in enumerate(m['textures']):
  p=paths.get(t['path'].replace('\\','/').lower()); tex=None
  if p:tex=np.ascontiguousarray(decode(p),dtype=np.uint8)
  textures.append(tex);texture_report.append({**t,'index':i,'found':p is not None,'sha256':sha(p) if p else None,'size':[int(tex.shape[1]),int(tex.shape[0])] if tex is not None else None})
 used={l['textureId'] for g in m['geosets'] if g['alpha']>.001 for l in m['materials'][g['materialId']]['layers'] if l['alpha']>.001}
 for i in used:
  if textures[i] is None:missing.append(m['textures'][i]['path'] or 'ReplaceableId:'+str(m['textures'][i]['replaceableId']))
 # Only grounded hero/team glow surfaces may be omitted; keep all body and equipment geometry.
 allv=np.concatenate([np.asarray(g['vertices']) for g in m['geosets'] if len(g['vertices'])]);base=allv[:,2].min();height=max(np.ptp(allv[:,2]),1);hidden=[];usable=[]
 for g in m['geosets']:
  z=np.asarray(g['vertices'])[:,2]; layers=m['materials'][g['materialId']]['layers']; ts=[m['textures'][l['textureId']] for l in layers]
  glow=all(t['replaceableId']==2 or any(w in t['path'].lower() for w in ['heroglow','teamglow']) for t in ts) and z.max()<base+height*.3
  if glow or g['id'] in hide_geosets:hidden.append({'geoset':g['id'],'reason':'foot-level hero/team glow' if glow else 'explicit verified preview exclusion','zMin':float(z.min()),'zMax':float(z.max())});continue
  if g['alpha']>.001 and any(l['alpha']>.001 for l in layers):usable.append(g)
 missing=[p for p in missing if any((m['textures'][l['textureId']]['path'] or 'ReplaceableId:'+str(m['textures'][l['textureId']]['replaceableId']))==p for g in usable for l in m['materials'][g['materialId']]['layers'] if l['alpha']>.001)]
 if missing and not allow_missing:raise ValueError('Missing visible texture dependencies: '+str(missing))
 yaw0,pitch0=math.radians(yaw),math.radians(pitch);z=np.array([math.cos(yaw0)*math.cos(pitch0),math.sin(yaw0)*math.cos(pitch0),math.sin(pitch0)]);right=np.cross([0,0,1],z);right/=np.linalg.norm(right);up=np.cross(z,right);basis=np.array([right,up,z]);cloud=np.concatenate([np.asarray(g['vertices']) for g in usable]);framing_cloud=cloud[cloud[:,2]>=m['framingMinZ']] if 'framingMinZ' in m else cloud;
 if not len(framing_cloud):raise ValueError('Empty camera framing cloud')
 pr=framing_cloud@basis.T;lo,hi=pr[:,:2].min(0),pr[:,:2].max(0);center=(lo+hi)/2;S=size*supersample;scale=min((S*.84)/max(1,hi[0]-lo[0]),(S*.84)/max(1,hi[1]-lo[1]));rgba=np.zeros((S,S,4),np.float32);depth=np.full((S,S),-np.inf,np.float32);calls=[]
 for g in usable:
  verts=np.array(g['vertices']);pp=verts@basis.T;pp[:,:2]-=center;pp[:,0]=pp[:,0]*scale+S/2;pp[:,1]=S/2-pp[:,1]*scale;pp=np.ascontiguousarray(pp,dtype=np.float32);nn=np.ascontiguousarray(g['normals'],dtype=np.float32);uv=np.ascontiguousarray(g['uv'],dtype=np.float32)
  mat=m['materials'][g['materialId']];faces=np.array(g['faces'],np.uint32).reshape(-1,3)
  for li,l in enumerate(mat['layers']):
   a=l['alpha']*g['alpha'];tex=textures[l['textureId']]
   if a<=.001 or tex is None:continue
   fs=faces
   if l['filterMode']>=2:fs=fs[np.argsort(pp[fs,2].mean(1))]
   tint=np.asarray(g['color'][::-1],dtype=np.float32)*np.asarray(unit_color,dtype=np.float32)/255
   layer_uv=uv
   if l.get('uvAnimation'):
    anim=l['uvAnimation'];q=np.asarray(uv,dtype=np.float32).reshape(-1,2)+np.asarray(anim['translation'][:2]);q-=.5;rz,rw=anim['rotation'][2:4];angle=2*math.atan2(rz,rw);rot=np.array([[math.cos(angle),-math.sin(angle)],[math.sin(angle),math.cos(angle)]]);q=q@rot.T;q=q*anim['scale'][0]+.5;layer_uv=np.ascontiguousarray(q.reshape(-1),dtype=np.float32)
   calls.append((0 if l['filterMode']<=1 else 1,mat['priorityPlane'],li,float(pp[:,2].mean()),pp,nn,np.ascontiguousarray(fs),layer_uv,tex,l,a,np.ascontiguousarray(tint),m['textures'][l['textureId']]['flags']))
 for _,_,_,_,pp,nn,fs,uv,tex,l,a,tint,wrap in sorted(calls,key=lambda c:c[:4]):
  lib.draw_rgba(S,S,pp.ctypes.data,nn.ctypes.data,fs.ctypes.data,len(fs),uv.ctypes.data,tex.ctypes.data,tex.shape[1],tex.shape[0],l['filterMode'],a,tint.ctypes.data,l['flags'],wrap,rgba.ctypes.data,depth.ctypes.data)
 # C raster stores premultiplied RGB. PIL resizing expects straight RGBA.
 alpha=rgba[:,:,3:4];rgb=np.divide(rgba[:,:,:3],alpha,out=np.zeros_like(rgba[:,:,:3]),where=alpha>0)
 pixels=np.dstack((np.clip(rgb,0,1),np.clip(alpha,0,1)));im=Image.fromarray(np.uint8(np.clip(pixels*255,0,255)),'RGBA');im=im.resize((size,size),Image.Resampling.LANCZOS);Path(out).parent.mkdir(parents=True,exist_ok=True);im.save(out,format='WEBP',lossless=True,method=6)
 al=np.array(im)[:,:,3];ys,xs=np.where(al>0);bounds=[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())] if len(xs) else None
 report={'sourceModel':m['path'],'modelSha256':m['modelSha256'],'sequence':m['sequence'],'frame':m['frame'],'camera':{'yaw':yaw,'pitch':pitch,'projection':'orthographic'},'size':[size,size],'modelColor':list(unit_color),'textureSources':texture_report,'missingVisibleTextures':missing,'hiddenGeosets':hidden,'limits':m['limits'],'alphaBounds':bounds,'alphaPixels':int((al>0).sum()),'previewSha256':sha(out),'preview':str(out),'renderer':'MDX800 CPU skinning + layer blend/alpha + exact BLP texture sampling; static only','unsupportedTextureAnimation':bool(m['limits']['textureAnimations']) and not m['limits'].get('textureAnimationsSampled',False),'poseCamera':m.get('poseCamera'),'geosetColorOrder':'BGR converted to RGB per MDX shader','textureDecoder':'BLP1 JPEG alpha-preserving legacy decoder first; Pillow fallback','additiveAlphaExport':'additive color energy represented as transparent RGBA coverage','framingMinZ':m.get('framingMinZ'),'framingException':m.get('framingException')}
 Path(str(out)+'.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));return report
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('scene');a.add_argument('texture_root');a.add_argument('output');a.add_argument('--yaw',type=float,default=12);a.add_argument('--pitch',type=float,default=16);a.add_argument('--size',type=int,default=512);a.add_argument('--allow-missing',action='store_true');a.add_argument('--color',default='255,255,255');args=a.parse_args();r=render(args.scene,args.texture_root,args.output,args.yaw,args.pitch,args.size,unit_color=tuple(map(int,args.color.split(','))),allow_missing=args.allow_missing);print(json.dumps({k:r[k] for k in ['preview','alphaBounds','alphaPixels','hiddenGeosets','missingVisibleTextures']}))
