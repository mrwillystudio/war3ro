#include <math.h>
#include <stdint.h>
static float cl(float x,float a,float b){return x<a?a:x>b?b:x;}
void draw_rgba(int W,int H,const float* xyz,const float* normal,const uint32_t* faces,int N,const float* uv,const uint8_t* tex,int tw,int th,int mode,float alpha,const float* tint,int flags,int wrap,float* rgba,float* depth){
 for(int f=0;f<N;f++){
  int i0=faces[3*f],i1=faces[3*f+1],i2=faces[3*f+2]; const float *a=xyz+3*i0,*b=xyz+3*i1,*c=xyz+3*i2;
  float den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]); if(fabsf(den)<1e-7f)continue;
  // MDX has counter-clockwise front faces; raster Y is inverted.
  if(!(flags&16)&&den>=0)continue;
  int xmin=fmaxf(0,floorf(fminf(a[0],fminf(b[0],c[0])))),xmax=fminf(W-1,ceilf(fmaxf(a[0],fmaxf(b[0],c[0]))));
  int ymin=fmaxf(0,floorf(fminf(a[1],fminf(b[1],c[1])))),ymax=fminf(H-1,ceilf(fmaxf(a[1],fmaxf(b[1],c[1]))));
  for(int y=ymin;y<=ymax;y++)for(int x=xmin;x<=xmax;x++){
   float xx=x+.5f,yy=y+.5f,w0=((b[1]-c[1])*(xx-c[0])+(c[0]-b[0])*(yy-c[1]))/den,w1=((c[1]-a[1])*(xx-c[0])+(a[0]-c[0])*(yy-c[1]))/den,w2=1-w0-w1;
   if(w0<-1e-6f||w1<-1e-6f||w2<-1e-6f)continue;
   int ix=y*W+x;float z=w0*a[2]+w1*b[2]+w2*c[2];if(!(flags&64)&&z<depth[ix]-0.0001f)continue;
   float u=w0*uv[2*i0]+w1*uv[2*i1]+w2*uv[2*i2],v=w0*uv[2*i0+1]+w1*uv[2*i1+1]+w2*uv[2*i2+1];
   u=(wrap&1)?u-floorf(u):cl(u,0,1);v=(wrap&2)?v-floorf(v):cl(v,0,1);
   float tx=u*(tw-1),ty=v*(th-1);int x0=floorf(tx),y0=floorf(ty),x1=x0+1<tw?x0+1:x0,y1=y0+1<th?y0+1:y0;float fu=tx-x0,fv=ty-y0;
   float color[4];for(int k=0;k<4;k++)color[k]=((1-fu)*(1-fv)*tex[4*(y0*tw+x0)+k]+fu*(1-fv)*tex[4*(y0*tw+x1)+k]+(1-fu)*fv*tex[4*(y1*tw+x0)+k]+fu*fv*tex[4*(y1*tw+x1)+k])/255.f;
   float aa=mode==0?alpha:color[3]*alpha;if(mode==1){if(aa<.75f)continue;}if(mode>=5&&aa<.02f)continue;if(aa<.001f)continue;
   float light=1;if(!(flags&1)){float nx=w0*normal[3*i0]+w1*normal[3*i1]+w2*normal[3*i2],ny=w0*normal[3*i0+1]+w1*normal[3*i1+1]+w2*normal[3*i2+1],nz=w0*normal[3*i0+2]+w1*normal[3*i1+2]+w2*normal[3*i2+2];float len=sqrtf(nx*nx+ny*ny+nz*nz);float dot=len>0?(nx*.25f-ny*.35f+nz*.9028f)/len:0;light=.72f+.28f*fmaxf(0,dot);}
   float* dst=rgba+4*ix;
   for(int k=0;k<3;k++){float src=cl(color[k]*tint[k]*light,0,1);if(mode==3||mode==4)dst[k]=cl(dst[k]+src*aa,0,1);else if(mode==5||mode==6){float factor=mode==6?2:1;dst[k]=dst[k]*(1-aa+factor*src*aa);}else dst[k]=src*aa+dst[k]*(1-aa);}
   if(mode==3||mode==4){
    // Transparent export: additive black contributes no coverage. Color energy
    // is retained in premultiplied RGB; keep alpha sufficient for legal RGBA.
    float energy=0;for(int k=0;k<3;k++)energy=fmaxf(energy,cl(color[k]*tint[k]*light,0,1)*aa);
    float coverage=energy+dst[3]*(1-energy);
    dst[3]=fmaxf(coverage,fmaxf(dst[0],fmaxf(dst[1],dst[2])));
   }else if(mode!=5&&mode!=6)dst[3]=aa+dst[3]*(1-aa);
   if(!(flags&128)&&mode<=1&&aa>.999f)depth[ix]=z;
  }
 }
}
