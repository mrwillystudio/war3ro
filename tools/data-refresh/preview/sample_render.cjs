// Read-only MDX800 static sampler. Original source model is never changed.
const fs=require('fs'),crypto=require('crypto');
const {Model,createSkeletalNodes,math:{mat4,mat3,quat,vec3}}=require('./viewer_parser.cjs');
const [input,output,timeText,yawText,pitchText]=process.argv.slice(2),bytes=fs.readFileSync(input),m=new Model();m.load(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const sequence=m.sequences.find(s=>/^stand$/i.test(s.name))||m.sequences.find(s=>/^stand/i.test(s.name))||m.sequences[0]||{name:'(static)',interval:[0,0]};
const t=timeText===undefined?sequence.interval[0]:Number(timeText),arr=x=>typeof x==='number'?[x]:Array.from(x);
// Defaults are per animated property when a track exists but the selected clip has no keys.
// MDX static fields are used only when the corresponding track does not exist.
const trackDefaults={KMTF:[0],KMTA:[1],KTAT:[0,0,0],KTAR:[0,0,0,1],KTAS:[1,1,1],KGAO:[1],KGAC:[0,0,0],KGTR:[0,0,0],KGRT:[0,0,0,1],KGSC:[1,1,1],KATV:[1]};
function sample(a,time,def,isQuat=false){
 if(!a||!m.sequences.length)return def;
 const fallback=trackDefaults[a.name]??def;
 if(!a.frames.length)return fallback;
 let bounds=sequence.interval;const global=a.globalSequenceId>=0;
 if(global){const duration=m.globalSequences[a.globalSequenceId];if(!duration)return fallback;time=time%duration;bounds=[0,duration];if(a.frames[0]>duration)return arr(a.values[0]);}
 const ix=a.frames.flatMap((f,i)=>f>=bounds[0]&&f<=bounds[1]?[i]:[]);if(!ix.length)return fallback;
 if(ix.length===1||time<bounds[0])return arr(a.values[ix[0]]);
 let l,r;
 if(time<a.frames[ix[0]]||time>=a.frames[ix.at(-1)]){l=ix.at(-1);r=ix[0];}
 else{const rr=ix.findIndex(i=>a.frames[i]>time);l=ix[rr-1];r=ix[rr];}
 let start=a.frames[l],end=a.frames[r],span=end-start;
 if(span<0){span+=bounds[1]-bounds[0];if(time<start)start=end;}
 const u=span===0?0:(time-start)/span,v=arr(a.values[l]),w=arr(a.values[r]);if(a.interpolationType===0||a.name==='KATV'||u===0)return v;
 if(isQuat){if(a.interpolationType>1)return [...quat.sqlerp(quat.create(),v,arr(a.outTans[l]),arr(a.inTans[r]),w,u)];return [...quat.slerp(quat.create(),v,w,u)];}
 if(a.interpolationType===1)return v.map((x,i)=>x+(w[i]-x)*u);
 const o=arr(a.outTans[l]),it=arr(a.inTans[r]);
 if(a.interpolationType===2){const a0=2*u*u*u-3*u*u+1,b0=u*u*u-2*u*u+u,c0=-2*u*u*u+3*u*u,d0=u*u*u-u*u;return v.map((x,i)=>a0*x+b0*o[i]+c0*w[i]+d0*it[i]);}
 return v.map((x,i)=>(1-u)**3*x+3*u*(1-u)**2*o[i]+3*u*u*(1-u)*it[i]+u**3*w[i]);
}
const nodeKinds=['bones','helpers','attachments','lights','particleEmitters','particleEmitters2','ribbonEmitters','eventObjects','collisionShapes'];
const all=nodeKinds.flatMap(k=>m[k]||[]),ids=new Map(all.map(n=>[n.objectId,n])),ordered=[],seen=new Set();
function visit(n){if(seen.has(n.objectId))return;if(n.parentId>=0&&ids.has(n.parentId))visit(ids.get(n.parentId));seen.add(n.objectId);ordered.push(n);}all.forEach(visit);
const yaw=Number(yawText??12)*Math.PI/180,pitch=Number(pitchText??16)*Math.PI/180,toward=[Math.cos(yaw)*Math.cos(pitch),Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch)],right=[-Math.sin(yaw),Math.cos(yaw),0],up=[-Math.cos(yaw)*Math.sin(pitch),-Math.sin(yaw)*Math.sin(pitch),Math.cos(pitch)],cameraInverse=quat.fromMat3(quat.create(),[...right,...up,...toward]);
const GenericNode=createSkeletalNodes(1).nodes[0].constructor;class MdxNode extends GenericNode{convertBasis(rotation){quat.rotateY(rotation,rotation,-Math.PI/2);quat.rotateX(rotation,rotation,-Math.PI/2);}}
const {nodes}=createSkeletalNodes(m.pivotPoints.length,MdxNode),root={worldMatrix:mat4.create(),worldRotation:quat.create(),worldScale:vec3.fromValues(1,1,1),inverseWorldRotation:quat.create(),inverseWorldScale:vec3.fromValues(1,1,1)},scene={camera:{inverseRotation:cameraInverse}};
for(const n of ordered){const x=nodes[n.objectId];x.parent=n.parentId>=0&&ids.has(n.parentId)?nodes[n.parentId]:root;x.pivot.set(m.pivotPoints[n.objectId]);x.dontInheritTranslation=!!(n.flags&1);x.dontInheritRotation=!!(n.flags&2);x.dontInheritScaling=!!(n.flags&4);x.billboarded=!!(n.flags&8);x.localLocation.set(sample(n.animations.find(a=>a.name==='KGTR'),t,[0,0,0]));x.localRotation.set(sample(n.animations.find(a=>a.name==='KGRT'),t,[0,0,0,1],true));x.localScale.set(sample(n.animations.find(a=>a.name==='KGSC'),t,[1,1,1]));if(x.dontInheritRotation&&!x.billboarded)quat.multiply(x.localRotation,x.parent.inverseWorldRotation,x.localRotation);x.recalculateTransformation(scene);}
const geosets=m.geosets.map((g,gi)=>{let off=0;const groups=Array.from(g.matrixGroups,c=>{const out=Array.from(g.matrixIndices.slice(off,off+c));off+=c;return out;});const matrices=groups.map(group=>{const x=new Float32Array(16);for(const id of group)for(let k=0;k<16;k++)x[k]+=(nodes[id]?.worldMatrix||root.worldMatrix)[k]/group.length;return x;});
 const verts=[],norms=[];for(let i=0;i<g.vertexGroups.length;i++){const mx=matrices[g.vertexGroups[i]],v=g.vertices.slice(i*3,i*3+3),n=g.normals.slice(i*3,i*3+3);verts.push([mx[0]*v[0]+mx[4]*v[1]+mx[8]*v[2]+mx[12],mx[1]*v[0]+mx[5]*v[1]+mx[9]*v[2]+mx[13],mx[2]*v[0]+mx[6]*v[1]+mx[10]*v[2]+mx[14]]);const nm=mat3.normalFromMat4(mat3.create(),mx)||mat3.create(),nn=vec3.transformMat3(vec3.create(),n,nm);vec3.normalize(nn,nn);norms.push([...nn]);}
 const ga=m.geosetAnimations.find(a=>a.geosetId===gi),alpha=sample(ga?.animations.find(a=>a.name==='KGAO'),t,[ga?.alpha??1])[0],color=sample(ga?.animations.find(a=>a.name==='KGAC'),t,ga?Array.from(ga.color).reverse():[1,1,1]);
 return {id:gi,vertices:verts,normals:norms,faces:Array.from(g.faces),uv:Array.from(g.uvSets[0]),materialId:g.materialId,alpha,color};});
const textureAnimationSamples=m.textureAnimations.map(a=>({translation:sample(a.animations.find(x=>x.name==='KTAT'),t,[0,0,0]),rotation:sample(a.animations.find(x=>x.name==='KTAR'),t,[0,0,0,1],true),scale:sample(a.animations.find(x=>x.name==='KTAS'),t,[1,1,1])}));
const materials=m.materials.map(mat=>({priorityPlane:mat.priorityPlane,layers:mat.layers.map(l=>({filterMode:l.filterMode,flags:l.flags,textureId:Math.round(sample(l.animations.find(a=>a.name==='KMTF'),t,[l.textureId])[0]),alpha:sample(l.animations.find(a=>a.name==='KMTA'),t,[l.alpha])[0],textureAnimationId:l.textureAnimationId,uvAnimation:l.textureAnimationId>=0?textureAnimationSamples[l.textureAnimationId]:null,coordId:l.coordId}))}));
const out={path:input,modelSha256:crypto.createHash('sha256').update(bytes).digest('hex'),sequence:sequence.name,hasSequences:m.sequences.length>0,interval:Array.from(sequence.interval),frame:t,poseCamera:{yaw:Number(yawText??12),pitch:Number(pitchText??16)},geosetColorOrder:'BGR (static RGB normalized; animated KGAC is native BGR)',textures:m.textures,materials,geosets,limits:{particlesOmitted:all.filter(n=>m.particleEmitters.includes(n)||m.particleEmitters2.includes(n)||m.ribbonEmitters.includes(n)).length,billboardNodes:all.filter(n=>n.flags&8).length,textureAnimations:m.textureAnimations.length,textureAnimationsSampled:true,billboardCameraApplied:true},attachments:m.attachments.map(a=>({name:a.name,id:a.objectId,path:a.path,visibility:sample(a.animations.find(x=>x.name==='KATV'),t,[1])[0],worldLocation:Array.from(nodes[a.objectId].worldLocation),worldRotation:Array.from(nodes[a.objectId].worldRotation),worldScale:Array.from(nodes[a.objectId].worldScale),worldMatrix:Array.from(nodes[a.objectId].worldMatrix)}))};
fs.writeFileSync(output,JSON.stringify(out));console.log(JSON.stringify({output,sequence:out.sequence,frame:t,geosets:geosets.length,vertices:geosets.reduce((n,g)=>n+g.vertices.length,0),triangles:geosets.reduce((n,g)=>n+g.faces.length/3,0),limits:out.limits}));
