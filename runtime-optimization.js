/* Faded Thread late-game runtime optimisation, backtracking-safe. 03 Oct 2026. */
(function installFTRuntimeOptimisation(){
  'use strict';

  // Keep the complete generated route and all historical entities so backtracking
  // remains real. Only nearby entities are handed to update/draw each frame.
  const baseUpdate = update;
  const baseDraw = draw;
  const ACTIVE_RADIUS = 2300;
  const PICKUP_RADIUS = 2100;
  const REFRESH_DISTANCE = 320;
  const REFRESH_MS = 180;

  const cache = {
    enemies:{source:null,len:-1,anchor:NaN,time:0,active:[]},
    heals:{source:null,len:-1,anchor:NaN,time:0,active:[]},
    magicItems:{source:null,len:-1,anchor:NaN,time:0,active:[]},
    cosmeticItems:{source:null,len:-1,anchor:NaN,time:0,active:[]}
  };

  function playerX(){
    return player && Number.isFinite(player.worldX) ? player.worldX : (Number.isFinite(worldX) ? worldX : 0);
  }

  function refreshActive(name,list,radius,force){
    const c=cache[name], px=playerX(), now=performance.now();
    const needs = force || c.source!==list || c.len!==list.length || !Number.isFinite(c.anchor) ||
      Math.abs(px-c.anchor)>REFRESH_DISTANCE || now-c.time>REFRESH_MS;
    if(!needs) return c.active;
    const active=[];
    for(let i=0;i<list.length;i++){
      const e=list[i]; if(!e) continue;
      const x=Number.isFinite(e.x)?e.x:px;
      if(Math.abs(x-px)<=radius || e._ftTutorialTarget || e._ftAlwaysActive) active.push(e);
    }
    c.source=list; c.len=list.length; c.anchor=px; c.time=now; c.active=active;
    return active;
  }

  function virtualise(name,list,radius){
    const active=refreshActive(name,list,radius,false);
    return {name,all:list,active,original:active.slice()};
  }

  function reconcile(v){
    const before=v.original, after=v.active;
    let changed=before.length!==after.length;
    if(!changed){for(let i=0;i<before.length;i++){if(before[i]!==after[i]){changed=true;break;}}}
    if(!changed) return v.all;
    const touched=new Set(before), alive=new Set(after), merged=[];
    for(const e of v.all) if(!touched.has(e) || alive.has(e)) merged.push(e);
    const known=new Set(v.all);
    for(const e of after) if(!known.has(e)) merged.push(e);
    const c=cache[v.name]; c.source=null; c.len=-1; c.time=0;
    return merged;
  }

  update=function updateWithCachedActiveWorld(){
    const ev=virtualise('enemies',enemies,ACTIVE_RADIUS);
    const hv=virtualise('heals',heals,PICKUP_RADIUS);
    const mv=virtualise('magicItems',magicItems,PICKUP_RADIUS);
    const cv=virtualise('cosmeticItems',cosmeticItems,PICKUP_RADIUS);
    enemies=ev.active; heals=hv.active; magicItems=mv.active; cosmeticItems=cv.active;
    try { baseUpdate(); }
    finally {
      enemies=reconcile(ev); heals=reconcile(hv); magicItems=reconcile(mv); cosmeticItems=reconcile(cv);
    }
  };

  draw=function drawWithCachedVisibleWorld(){
    const fullEnemies=enemies, fullHeals=heals, fullMagic=magicItems, fullCosmetic=cosmeticItems;
    enemies=refreshActive('enemies',fullEnemies,ACTIVE_RADIUS,false);
    heals=refreshActive('heals',fullHeals,PICKUP_RADIUS,false);
    magicItems=refreshActive('magicItems',fullMagic,PICKUP_RADIUS,false);
    cosmeticItems=refreshActive('cosmeticItems',fullCosmetic,PICKUP_RADIUS,false);
    try { return baseDraw(); }
    finally { enemies=fullEnemies; heals=fullHeals; magicItems=fullMagic; cosmeticItems=fullCosmetic; }
  };

  // Backgrounds in later realms contain many animated decorative particles. They
  // now animate at 30 Hz while player/enemy/platform rendering remains full-rate.
  // This roughly halves the expensive background particle work without changing
  // the artwork or affecting collision/backtracking.
  const baseBackgroundDraw=drawRealmBackground;
  const bgCache=document.createElement('canvas');
  const bgCacheCtx=bgCache.getContext('2d',{alpha:false});
  let bgFrame=0, bgRealm='', bgBoss=false, bgW=0, bgH=0, bgWorldX=NaN;
  drawRealmBackground=function drawRealmBackgroundCached(W,H,t){
    const realmKey=String(currentRealm||'')+'|'+String(boss&&boss.kind||'');
    const bossKey=!!(boss&&boss.active);
    const moved=!Number.isFinite(bgWorldX)||Math.abs(worldX-bgWorldX)>180;
    const mustRefresh=bgCache.width!==W || bgCache.height!==H || realmKey!==bgRealm || bossKey!==bgBoss || moved || ((bgFrame++&1)===0);
    if(mustRefresh){
      baseBackgroundDraw(W,H,t);
      if(bgCache.width!==W) bgCache.width=W;
      if(bgCache.height!==H) bgCache.height=H;
      bgCacheCtx.setTransform(1,0,0,1,0,0);
      bgCacheCtx.globalAlpha=1;
      bgCacheCtx.globalCompositeOperation='copy';
      bgCacheCtx.drawImage(canvas,0,0,W,H);
      bgCacheCtx.globalCompositeOperation='source-over';
      bgRealm=realmKey; bgBoss=bossKey; bgW=W; bgH=H; bgWorldX=worldX;
      return;
    }
    ctx.save();
    ctx.globalAlpha=1;
    ctx.globalCompositeOperation='source-over';
    ctx.drawImage(bgCache,0,0,W,H);
    ctx.restore();
  };

  // Replace the old destination-out edge mask. That mask erased the already-drawn
  // background too, creating the ugly dark/clear rectangles shown in the report.
  // These are true soft platform ends: the solid cloth stops slightly inboard and
  // dissolves through translucent cloth/thread wisps only at the physical ends.
  const basePlatformDraw=drawClothPlatform;
  drawClothPlatform=function drawPlatformWithSoftEnds(p,screenX){
    const w=Math.max(0,Number(p.width)||0);
    if(w<42){ basePlatformDraw(p,screenX); return; }
    const feather=Math.min(28,Math.max(18,w*0.07));

    // Draw the normal platform only through the solid centre.
    ctx.save();
    ctx.beginPath();
    ctx.rect(screenX+feather,p.y-24,Math.max(1,w-feather*2),p.height+74);
    ctx.clip();
    basePlatformDraw(p,screenX);
    ctx.restore();

    // Rebuild each end with a single transparent horizontal gradient and a few
    // cloth wisps. This is much cheaper than redrawing the whole platform many
    // times and still gives the physical edge a real alpha fade.
    for(let side=0;side<2;side++){
      const leftSide=side===0;
      const x0=leftSide?screenX:screenX+w-feather;
      const x1=leftSide?screenX+feather:screenX+w;
      const g=ctx.createLinearGradient(x0,0,x1,0);
      if(leftSide){
        g.addColorStop(0,'rgba(20,14,34,0)');
        g.addColorStop(.48,'rgba(28,20,48,.28)');
        g.addColorStop(1,'rgba(32,24,54,.86)');
      }else{
        g.addColorStop(0,'rgba(32,24,54,.86)');
        g.addColorStop(.52,'rgba(28,20,48,.28)');
        g.addColorStop(1,'rgba(20,14,34,0)');
      }
      ctx.save();
      ctx.fillStyle=g;
      ctx.beginPath();
      if(leftSide){
        ctx.moveTo(screenX,p.y+2);
        ctx.lineTo(screenX+feather,p.y);
        ctx.lineTo(screenX+feather,p.y+p.height+14);
        ctx.lineTo(screenX+feather*.55,p.y+p.height+8);
        ctx.lineTo(screenX,p.y+8);
      }else{
        ctx.moveTo(screenX+w-feather,p.y);
        ctx.lineTo(screenX+w,p.y+2);
        ctx.lineTo(screenX+w,p.y+8);
        ctx.lineTo(screenX+w-feather*.55,p.y+p.height+8);
        ctx.lineTo(screenX+w-feather,p.y+p.height+14);
      }
      ctx.closePath(); ctx.fill();
      const edge=ctx.createLinearGradient(x0,0,x1,0);
      if(leftSide){edge.addColorStop(0,accentRgba(0));edge.addColorStop(1,accentRgba(.62));}
      else{edge.addColorStop(0,accentRgba(.62));edge.addColorStop(1,accentRgba(0));}
      ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.shadowBlur=0;
      ctx.beginPath();ctx.moveTo(x0,p.y+2);ctx.lineTo(x1,p.y);ctx.stroke();
      ctx.restore();
    }
  };

  // Keep transient combat particles bounded and cheaper. The same particle events
  // still fire, but old invisible particles cannot accumulate during long saves.
  const baseAddParticles=typeof addParticles==='function'?addParticles:null;
  if(baseAddParticles){
    addParticles=function boundedParticles(x,y,color){
      if(particles.length>60) particles.splice(0,particles.length-60);
      const before=particles.length;
      baseAddParticles(x,y,color);
      // 12 particles per burst is visually dense but materially cheaper than 18.
      if(particles.length-before>12) particles.splice(before+12,particles.length-(before+12));
    };
  }

  let housekeepingFrame=0;
  const updateBeforeHousekeeping=update;
  update=function updateWithLightweightHousekeeping(){
    updateBeforeHousekeeping();
    if((++housekeepingFrame%90)!==0) return;
    if(player && Array.isArray(player.monarchAfterimages) && player.monarchAfterimages.length>16)
      player.monarchAfterimages.splice(0,player.monarchAfterimages.length-16);
    if(Array.isArray(bossAttacks) && bossAttacks.length>80)
      bossAttacks.splice(0,bossAttacks.length-80);
    if(Array.isArray(particles) && particles.length>72)
      particles.splice(0,particles.length-72);
  };
})();
