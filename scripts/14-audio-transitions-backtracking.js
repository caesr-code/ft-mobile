/* Faded Thread module: 14-audio-transitions-backtracking.js | build 03 Oct 2026 */
// Persistent three-channel volume mixer.
    const FT_AUDIO_SETTINGS_KEY='fadedThreadAudioSettingsV1';
    let ftAudioSettings={master:.80,music:.48,sfx:.78};
    try { ftAudioSettings=Object.assign(ftAudioSettings,JSON.parse(localStorage.getItem(FT_AUDIO_SETTINGS_KEY)||'{}')); } catch(e){}
    function ftApplyVolumes(){
      const master=Math.max(0,Math.min(1,ftAudioSettings.master));
      const music=Math.max(0,Math.min(1,ftAudioSettings.music));
      const sfx=Math.max(0,Math.min(1,ftAudioSettings.sfx));
      if(typeof ftThemeAudio!=='undefined') ftThemeAudio.volume=master*music;
      if(typeof masterGain!=='undefined' && masterGain) masterGain.gain.value=master*sfx*.35;
      document.querySelectorAll('[id$="-master-volume"]').forEach(el=>el.value=Math.round(master*100));
      document.querySelectorAll('[id$="-music-volume"]').forEach(el=>el.value=Math.round(music*100));
      document.querySelectorAll('[id$="-sfx-volume"]').forEach(el=>el.value=Math.round(sfx*100));
      document.querySelectorAll('[id$="-master-value"]').forEach(el=>el.textContent=Math.round(master*100));
      document.querySelectorAll('[id$="-music-value"]').forEach(el=>el.textContent=Math.round(music*100));
      document.querySelectorAll('[id$="-sfx-value"]').forEach(el=>el.textContent=Math.round(sfx*100));
    }
    function ftSetVolume(channel,value){ ftAudioSettings[channel]=Number(value)/100; localStorage.setItem(FT_AUDIO_SETTINGS_KEY,JSON.stringify(ftAudioSettings)); ftApplyVolumes(); }
    ['home','game'].forEach(prefix=>['master','music','sfx'].forEach(channel=>{
      const el=document.getElementById(`${prefix}-${channel}-volume`); if(el) el.addEventListener('input',()=>ftSetVolume(channel,el.value));
    }));
    const audioToggle=document.getElementById('audio-toggle'), audioPanel=document.getElementById('audio-panel');
    if(audioToggle&&audioPanel) audioToggle.addEventListener('click',()=>audioPanel.classList.toggle('show'));
    // SFX clones use the current mixer values at playback time.
    ftPlaySfx = function(key, volume=0.72) { const base=ftSfx[key]; if(!base)return; const a=base.cloneNode(); a.volume=Math.max(0,Math.min(1,volume*ftAudioSettings.master*ftAudioSettings.sfx)); a.play().catch(()=>{}); };
    const ftEnsureAudioPreMixer=ensureAudioContext;
    ensureAudioContext=function(){ const ac=ftEnsureAudioPreMixer(); ftApplyVolumes(); return ac; };
    ftApplyVolumes();



    // Realm-local, reversible full-frame crossfade. The incoming realm remains
    // completely invisible until the player reaches the physical position of
    // the tenth-to-last platform in the current realm.
    (function installRealmLocalCrossfade(){
      const drawBackgroundBase=drawRealmBackground;
      const currentLayer=document.createElement('canvas'),incomingLayer=document.createElement('canvas');
      const layerCtxA=currentLayer.getContext('2d'),layerCtxB=incomingLayer.getContext('2d');
      let smoothMix=0,lastTime=performance.now(),lastRealm=currentRealm;
      window.ftRealmBlendState={mix:0,target:0,direction:1,nextRealm:null};
      function ensureSize(W,H){for(const c of [currentLayer,incomingLayer])if(c.width!==W||c.height!==H){c.width=W;c.height=H;}}
      function activeTravelEntry(){
        return (window.ftRealmTravel && window.ftRealmTravel.entries && window.ftRealmTravel.entries[window.ftRealmTravel.cursor]) || null;
      }
      function realmPlatformRange(){
        if(boss.active||!(targetProgress>0)||!platforms||!platforms.length)return null;

        // Platform indices are global, while realmProgress is local. Their
        // difference gives the exact index immediately before this realm began.
        // This prevents platforms from earlier/later realms contaminating the
        // blend calculation, even after unlimited backtracking.
        const entry=activeTravelEntry();
        let beforeRealmIndex=Number.isFinite(entry&&entry.beforeRealmPlatformIndex)
          ? entry.beforeRealmPlatformIndex
          : (highestPlatformTouchedIndex-realmProgress);
        if(!Number.isFinite(beforeRealmIndex)) beforeRealmIndex=-1;

        const list=ftPlatformsAfterIndex(beforeRealmIndex,targetProgress);
        if(!list.length)return null;

        // A 24-platform realm begins blending on platform 14:
        // one-based ordinal = targetProgress - 10, array index = ordinal - 1.
        const startOrdinal=Math.max(1,targetProgress-10);
        const startIndex=startOrdinal-1;
        const endIndex=targetProgress-1;
        const startP=list[startIndex],endP=list[endIndex];

        // Do not estimate or begin early. Wait until both exact realm-local
        // platform positions have actually been generated.
        if(!startP||!endP)return null;
        return {startX:startP.x,endX:Math.max(startP.x+1,endP.x)};
      }
      function desiredMix(){
        const r=realmPlatformRange();
        if(!r||player.worldX<r.startX)return 0;
        const raw=Math.max(0,Math.min(1,(player.worldX-r.startX)/(r.endX-r.startX)));
        const eased=raw*raw*(3-2*raw);
        // Keep a visible trace of the current realm until the actual boundary.
        return Math.min(0.88,eased*0.88);
      }
      function nextRealm(){const i=realmIndex(currentRealm);return i>=0?REALM_FLOW[i+1]:null;}
      function capture(c,W,H){c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.clearRect(0,0,W,H);c.drawImage(canvas,0,0,W,H);}
      drawRealmBackground=function drawRealmBackgroundRealmLocal(W,H,t){
        const now=performance.now(),dt=Math.min(.05,Math.max(.001,(now-lastTime)/1000));lastTime=now;
        if(currentRealm!==lastRealm){
          const requested=window.ftRealmBlendState&&window.ftRealmBlendState.boundarySeed;
          smoothMix=Number.isFinite(requested)?requested:0;
          if(window.ftRealmBlendState) window.ftRealmBlendState.boundarySeed=null;
          lastRealm=currentRealm;
        }
        const wanted=desiredMix();
        // Before the exact start position, the incoming realm must be entirely
        // absent. Once inside the blend zone, progress remains smoothly
        // reversible in either direction.
        if(wanted<=0){
          const factor=1-Math.exp(-dt*15); smoothMix+=(0-smoothMix)*factor;
          if(smoothMix<.0002)smoothMix=0;
        }else{
          // Slightly faster when retreating so reverse travel tracks the player
          // cleanly without stepping or lagging behind the camera.
          const rate=wanted<smoothMix?13.5:8.5;
          const factor=1-Math.exp(-dt*rate); smoothMix+=(wanted-smoothMix)*factor;
          if(Math.abs(wanted-smoothMix)<.0002)smoothMix=wanted;
        }
        const next=nextRealm();
        if(window.ftRealmBlendState){window.ftRealmBlendState.mix=smoothMix;window.ftRealmBlendState.target=wanted;window.ftRealmBlendState.nextRealm=next;}
        if(typeof ftUpdateMusicCrossfade==='function')ftUpdateMusicCrossfade();
        if(!next||smoothMix<=.0005){drawBackgroundBase(W,H,t);return;}
        ensureSize(W,H);const oldRealm=currentRealm,oldActive=boss.active,oldKind=boss.kind,oldName=boss.name;
        ctx.clearRect(0,0,W,H);drawBackgroundBase(W,H,t);capture(layerCtxA,W,H);
        currentRealm=next.id;if(next.boss){boss.active=true;boss.kind=next.boss;const d=BOSS_DEFS[next.boss];if(d)boss.name=d.name;}else boss.active=false;
        ctx.clearRect(0,0,W,H);drawBackgroundBase(W,H,t);capture(layerCtxB,W,H);
        currentRealm=oldRealm;boss.active=oldActive;boss.kind=oldKind;boss.name=oldName;
        ctx.clearRect(0,0,W,H);ctx.globalAlpha=1;ctx.drawImage(currentLayer,0,0);ctx.globalAlpha=smoothMix;ctx.drawImage(incomingLayer,0,0);ctx.globalAlpha=1;
      };
    })();


    // Persistent multi-realm travel history. Re-entering a prior realm restores
    // its UI, music and saved platform progress without deleting progress from
    // any other realm.
    (function installRealmBacktracking(){
      const originalAdvanceRealm=advanceRealm;
      const originalResetGame=resetGame;
      const originalUpdate=update;
      const travel={entries:[],cursor:0,switching:false};
      window.ftRealmTravel=travel;

      function snapshotCurrent(){
        const e=travel.entries[travel.cursor]; if(!e)return;
        e.realmId=currentRealm;e.realmProgress=realmProgress;e.targetProgress=targetProgress;
        e.highestPlatformTouchedIndex=highestPlatformTouchedIndex;e.scoreAtLastVisit=score;
        e.endX=Math.max(e.endX||e.startX,player.worldX);
      }
      function makeEntry(startX,beforeRealmPlatformIndex){
        const derivedBefore=highestPlatformTouchedIndex-realmProgress;
        return {realmId:currentRealm,startX:Number(startX)||0,endX:Number(startX)||0,
          realmProgress:realmProgress,targetProgress:targetProgress,
          highestPlatformTouchedIndex:highestPlatformTouchedIndex,
          beforeRealmPlatformIndex:Number.isFinite(beforeRealmPlatformIndex)?beforeRealmPlatformIndex:derivedBefore,
          flowIndex:realmIndex(currentRealm),completed:false};
      }
      function applyEntry(index){
        if(index<0||index>=travel.entries.length||index===travel.cursor)return;
        snapshotCurrent();const oldCursor=travel.cursor;travel.cursor=index;const e=travel.entries[index];travel.switching=true;
        if(window.ftRealmBlendState) window.ftRealmBlendState.boundarySeed=index<oldCursor?0.88:0;
        currentRealm=e.realmId;realmProgress=e.realmProgress||0;targetProgress=e.targetProgress||0;
        highestPlatformTouchedIndex=(e.highestPlatformTouchedIndex??-1);
        // Previously defeated boss realms remain cleared when revisited.
        boss.active=false;bossAttacks=[];setBgThemeIntensified(false);
        updateUI();
        if(typeof ftSyncTheme==='function')ftSyncTheme(true);
        travel.switching=false;
      }
      function maybeChangeRealmFromPosition(){
        if(travel.switching||travel.entries.length<2)return;
        // Unlimited backward travel through every recorded realm boundary.
        while(travel.cursor>0 && player.worldX<travel.entries[travel.cursor].startX-10)applyEntry(travel.cursor-1);
        // Walking forward across an existing boundary re-enters that realm and
        // restores its own saved progress instead of resetting it.
        while(travel.cursor<travel.entries.length-1 && player.worldX>=travel.entries[travel.cursor+1].startX+6)applyEntry(travel.cursor+1);
      }
      resetGame=function resetGameWithRealmHistory(){
        originalResetGame();travel.entries=[makeEntry(player.worldX)];travel.cursor=0;
      };
      advanceRealm=function advanceRealmWithHistory(fromSkip=false){
        if(travel.switching)return;
        snapshotCurrent();const current=travel.entries[travel.cursor];if(current)current.completed=true;
        // If this boundary was visited before, simply restore the next realm.
        if(travel.cursor<travel.entries.length-1){applyEntry(travel.cursor+1);return;}
        const boundaryX=player.worldX;
        const boundaryPlatformIndex=highestPlatformTouchedIndex;
        originalAdvanceRealm(fromSkip);
        travel.entries.push(makeEntry(boundaryX,boundaryPlatformIndex));travel.cursor=travel.entries.length-1;
        if(typeof ftSyncTheme==='function')ftSyncTheme(true);
      };
      update=function updateWithRealmBacktracking(){
        maybeChangeRealmFromPosition();originalUpdate();snapshotCurrent();
      };
    })();


    // Unified transition presentation: scenery, platforms, floor/water and
    // music all use the exact same reversible blend amount.
    (function installUnifiedRealmTransitionPresentation(){
      function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0));}
      function hexRgb(hex){const c=hexToRgb(hex||'#000000');return [c.r,c.g,c.b];}
      function rgbHex(a){return `rgb(${Math.round(a[0])},${Math.round(a[1])},${Math.round(a[2])})`;}
      function mixColor(a,b,t){const A=hexRgb(a),B=hexRgb(b);return rgbHex([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t]);}
      function flowNext(){const i=realmIndex(currentRealm);return i>=0?REALM_FLOW[i+1]:null;}
      function paletteFor(id){
        if(id==='sadness')return {top:'#d0daf0',bottom:'#b8c8e0'};
        if(id==='hell')return {top:'#300808',bottom:'#0e0202'};
        if(id==='storm')return {top:'#092a34',bottom:'#021016'};
        if(id==='void')return {top:'#21092f',bottom:'#07020c'};
        const old=currentRealm; currentRealm=id; const a=realmAccent(); currentRealm=old;
        const c=`rgb(${a.r},${a.g},${a.b})`;
        return {top:mixColor('#120a22',c,.18),bottom:mixColor('#060212',c,.09)};
      }
      window.ftGetBlendedFloorPalette=function(){
        const st=window.ftRealmBlendState||{},m=clamp01(st.mix),next=st.nextRealm||flowNext();
        const A=paletteFor(currentRealm); if(!next||m<=0)return A;
        const B=paletteFor(next.id); return {top:mixColor(A.top,B.top,m),bottom:mixColor(A.bottom,B.bottom,m)};
      };

      // Draw each platform twice with complementary alpha, so its cloth,
      // outline and glow gradually inherit the next realm instead of popping.
      const platformBase=drawClothPlatform;
      drawClothPlatform=function drawTransitionPlatform(p,screenX){
        const st=window.ftRealmBlendState||{},rawMix=clamp01(st.mix),next=st.nextRealm||flowNext();
        // Smootherstep removes the harsh visual handoff between platform styles.
        const m=rawMix*rawMix*rawMix*(rawMix*(rawMix*6-15)+10);
        if(!next||m<.002){platformBase(p,screenX);return;}
        const old=currentRealm,oldActive=boss.active,oldKind=boss.kind,oldName=boss.name;
        ctx.save();ctx.globalAlpha=1-m;platformBase(p,screenX);ctx.restore();
        currentRealm=next.id;
        if(next.boss){boss.active=true;boss.kind=next.boss;const d=BOSS_DEFS[next.boss];if(d)boss.name=d.name;}else boss.active=false;
        ctx.save();ctx.globalAlpha=m;platformBase(p,screenX);ctx.restore();
        currentRealm=old;boss.active=oldActive;boss.kind=oldKind;boss.name=oldName;
      };

      // True two-track music crossfade. The old realm remains audible until the
      // boundary while the incoming theme rises smoothly with the visual blend.
      const incoming=new Audio();incoming.loop=true;incoming.preload='auto';
      let incomingKey='';
      window.ftStopIncomingRealmTrack=function(){
        incoming.pause();
        incoming.currentTime=0;
        incoming.volume=0;
        incomingKey='';
      };
      function resolveForEntry(entry){
        if(!entry)return null;
        const old=currentRealm,oldActive=boss.active,oldKind=boss.kind,oldName=boss.name;
        currentRealm=entry.id;
        if(entry.boss){boss.active=true;boss.kind=entry.boss;const d=BOSS_DEFS[entry.boss];if(d)boss.name=d.name;}else boss.active=false;
        const src=ftResolveTheme();
        currentRealm=old;boss.active=oldActive;boss.kind=oldKind;boss.name=oldName;
        return src;
      }
      function ensureTrack(audio,src,keySetter,currentKey){
        if(!src||src===currentKey)return currentKey;
        audio.pause();audio.src=src;audio.currentTime=0;audio.play().catch(()=>{});keySetter(src);return src;
      }
      window.ftUpdateMusicCrossfade=function(){
        const st=window.ftRealmBlendState||{},m=clamp01(st.mix),next=st.nextRealm||flowNext();
        const currentSrc=ftResolveTheme();
        if(currentSrc&&currentSrc!==ftThemeKey){ftThemeKey=currentSrc;ftThemeAudio.pause();ftThemeAudio.src=currentSrc;ftThemeAudio.currentTime=0;ftThemeAudio.play().catch(()=>{});}
        const nextSrc=resolveForEntry(next);
        if(nextSrc&&nextSrc!==incomingKey){incomingKey=nextSrc;incoming.pause();incoming.src=nextSrc;incoming.currentTime=0;incoming.play().catch(()=>{});}
        const base=Math.max(0,Math.min(1,(ftAudioSettings?.master??.8)*(ftAudioSettings?.music??.48)));
        // Sequential realm handoff: fade the current theme fully to silence,
        // then fade the incoming theme up. The tracks never overlap audibly.
        const smoothstep=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
        const fadeOut=1-smoothstep(m/0.48);
        const fadeIn=smoothstep((m-0.52)/0.48);
        ftThemeAudio.volume=base*fadeOut;
        incoming.volume=nextSrc?base*fadeIn:0;
        if(m<.001&&incomingKey){incoming.pause();incoming.currentTime=0;incomingKey='';}
      };
      ftSyncTheme=function(){ftUpdateMusicCrossfade();};
      const applyVolumesBase=ftApplyVolumes;
      ftApplyVolumes=function(){applyVolumesBase();ftUpdateMusicCrossfade();};
    })();


    // Boundary-timed music handoff and post-boundary colour carry.
    // The outgoing theme stays at full volume until the second-last platform,
    // fades to silence over three seconds, then the incoming theme fades up
    // over three seconds after the realm boundary has actually been crossed.
    (function installBoundaryTimedFadeAndColourCarry(){
      const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));
      const ease=v=>{v=clamp01(v);return v*v*(3-2*v);};
      const FADE_MS=3000;

      function activeTravelEntry(){
        return (window.ftRealmTravel&&window.ftRealmTravel.entries&&window.ftRealmTravel.entries[window.ftRealmTravel.cursor])||null;
      }
      function localPlatformsForCurrentRealm(){
        if(!platforms||!platforms.length||boss.active||!(targetProgress>0))return [];
        const entry=activeTravelEntry();
        let before=Number.isFinite(entry&&entry.beforeRealmPlatformIndex)
          ? entry.beforeRealmPlatformIndex
          : (highestPlatformTouchedIndex-realmProgress);
        if(!Number.isFinite(before))before=-1;
        return ftPlatformsAfterIndex(before,targetProgress);
      }
      function secondLastX(){
        const list=localPlatformsForCurrentRealm();
        // The fade point is only valid after every mandatory platform for this
        // realm has been generated. Using the second-last currently generated
        // platform made the target move forward as the world extended, which
        // caused repeated fade-out / restore cycles and apparent stop-start audio.
        if(!(targetProgress>1) || list.length < targetProgress) return Infinity;
        const p=list[targetProgress-2];
        return p ? p.x : Infinity;
      }
      function nextEntry(){
        const i=realmIndex(currentRealm);return i>=0?REALM_FLOW[i+1]:null;
      }
      function resolveThemeFor(entry){
        if(!entry)return null;
        const oldRealm=currentRealm,oldActive=boss.active,oldKind=boss.kind,oldName=boss.name;
        currentRealm=entry.id;
        if(entry.boss){boss.active=true;boss.kind=entry.boss;const d=BOSS_DEFS[entry.boss];if(d)boss.name=d.name;}else boss.active=false;
        const src=ftResolveTheme();
        currentRealm=oldRealm;boss.active=oldActive;boss.kind=oldKind;boss.name=oldName;
        return src;
      }

      const musicState={phase:'idle',start:0,fromRealm:currentRealm,toRealm:null,fromSrc:'',toSrc:'',crossed:false,restoreStart:0,restoreFrom:1};
      window.ftBoundaryMusicState=musicState;
      function baseVolume(){return clamp01((ftAudioSettings?.master??.8)*(ftAudioSettings?.music??.48));}
      function playSrc(src,reset=true){
        if(!src)return;
        if(ftThemeAudio.src.endsWith(src.replace(/^.*\//,''))||ftThemeKey===src){
          ftThemeKey=src;
          if(reset) ftThemeAudio.currentTime=0;
          if(ftThemeAudio.paused) ftThemeAudio.play().catch(()=>{});
          return;
        }
        ftThemeAudio.pause();ftThemeAudio.src=src;if(reset)ftThemeAudio.currentTime=0;ftThemeKey=src;ftThemeAudio.play().catch(()=>{});
      }
      function beginFadeOut(now){
        const next=nextEntry(),toSrc=resolveThemeFor(next),fromSrc=ftResolveTheme();
        if(!next||!toSrc||!fromSrc)return;
        playSrc(fromSrc,false);
        musicState.phase='fadeOut';musicState.start=now;musicState.fromRealm=currentRealm;musicState.toRealm=next.id;
        musicState.fromSrc=fromSrc;musicState.toSrc=toSrc;musicState.crossed=false;
      }
      function beginRestore(now){
        musicState.phase='restore';musicState.restoreStart=now;
        musicState.restoreFrom=baseVolume()>0?ftThemeAudio.volume/baseVolume():0;
      }
      function updateBoundaryMusic(){
        if(typeof onHomeScreen!=='undefined'&&onHomeScreen){
          ftThemeAudio.pause();
          if(typeof window.ftStopIncomingRealmTrack==='function')window.ftStopIncomingRealmTrack();
          return;
        }
        const now=performance.now(),base=baseVolume(),sx=secondLastX();
        if(musicState.phase==='idle'){
          const currentSrc=ftResolveTheme();
          playSrc(currentSrc,false);ftThemeAudio.volume=base;
          if(player.worldX>=sx&&Number.isFinite(sx))beginFadeOut(now);
          return;
        }
        if(musicState.phase==='fadeOut'){
          if(currentRealm===musicState.fromRealm&&player.worldX<sx-8){beginRestore(now);return;}
          if(currentRealm===musicState.toRealm)musicState.crossed=true;
          const q=clamp01((now-musicState.start)/FADE_MS);
          ftThemeAudio.volume=base*(1-ease(q));
          if(q>=1){
            ftThemeAudio.volume=0;
            if(musicState.crossed||currentRealm===musicState.toRealm){
              playSrc(musicState.toSrc,true);musicState.phase='fadeIn';musicState.start=now;
            }
          }
          return;
        }
        if(musicState.phase==='restore'){
          const q=clamp01((now-musicState.restoreStart)/FADE_MS);
          ftThemeAudio.volume=base*(musicState.restoreFrom+(1-musicState.restoreFrom)*ease(q));
          if(q>=1){musicState.phase='idle';musicState.fromRealm=currentRealm;musicState.toRealm=null;}
          return;
        }
        if(musicState.phase==='fadeIn'){
          const q=clamp01((now-musicState.start)/FADE_MS);
          ftThemeAudio.volume=base*ease(q);
          if(q>=1){ftThemeAudio.volume=base;musicState.phase='idle';musicState.fromRealm=currentRealm;musicState.toRealm=null;}
        }
      }
      window.ftUpdateMusicCrossfade=updateBoundaryMusic;
      ftSyncTheme=function(){updateBoundaryMusic();};
      const oldApply=ftApplyVolumes;
      ftApplyVolumes=function(){oldApply();updateBoundaryMusic();};

      // Smoothly carry the outgoing realm palette across the exact boundary.
      const previousDraw=drawRealmBackground;
      let seenRealm=currentRealm,carry=null;
      function accentFor(id){
        const old=currentRealm;currentRealm=id;const c=realmAccent();currentRealm=old;return c;
      }
      drawRealmBackground=function drawRealmBackgroundWithBoundaryCarry(W,H,t){
        if(currentRealm!==seenRealm){
          carry={realmId:seenRealm,start:performance.now(),duration:1800};
          seenRealm=currentRealm;
        }
        previousDraw(W,H,t);
        if(carry){
          const q=clamp01((performance.now()-carry.start)/carry.duration);
          if(q>=1){carry=null;return;}
          const c=accentFor(carry.realmId),a=(1-ease(q))*0.16;
          const g=ctx.createLinearGradient(0,0,0,H);
          g.addColorStop(0,`rgba(${c.r},${c.g},${c.b},${a*0.75})`);
          g.addColorStop(0.55,`rgba(${c.r},${c.g},${c.b},${a})`);
          g.addColorStop(1,`rgba(${c.r},${c.g},${c.b},${a*0.45})`);
          ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
        }
      };

      const ui=document.getElementById('ui');
      if(ui)ui.style.transition='color 1.8s ease, text-shadow 1.8s ease';
    })();

        // Boss-to-realm recovery. A boss realm has no traversal target of its
        // own, so stale boundary state can otherwise leave the following
        // realm muted or already fading toward the realm after it. This also
        // repairs saves made by older builds where boss realms stored -1 as
        // their last reached global platform index.
        window.ftRecoverRealmAfterBoss = function ftRecoverRealmAfterBoss() {
            const reachedPlatformIndex = (platforms || []).reduce((best, p) => {
                if (!p || !Number.isFinite(p.index) || !Number.isFinite(p.x)) return best;
                return p.x <= player.worldX + Math.max(40, player.width || 40) ? Math.max(best, p.index) : best;
            }, -1);
            if (targetProgress > 0 && reachedPlatformIndex >= 0) {
                highestPlatformTouchedIndex = Math.max(highestPlatformTouchedIndex, reachedPlatformIndex);
            }

            const travel = window.ftRealmTravel;
            const entry = travel && travel.entries && travel.entries[travel.cursor];
            if (entry) {
                entry.realmId = currentRealm;
                entry.realmProgress = realmProgress;
                entry.targetProgress = targetProgress;
                entry.highestPlatformTouchedIndex = highestPlatformTouchedIndex;
                const derivedBefore = highestPlatformTouchedIndex - realmProgress;
                if (!Number.isFinite(entry.beforeRealmPlatformIndex) || entry.beforeRealmPlatformIndex < 0) {
                    entry.beforeRealmPlatformIndex = Number.isFinite(derivedBefore) ? derivedBefore : reachedPlatformIndex;
                }
            }

            const blend = window.ftRealmBlendState;
            if (blend) {
                blend.mix = 0;
                blend.target = 0;
                blend.nextRealm = null;
                blend.boundarySeed = null;
            }
            const state = window.ftBoundaryMusicState;
            if (state) {
                state.phase = 'idle';
                state.start = 0;
                state.fromRealm = currentRealm;
                state.toRealm = null;
                state.fromSrc = '';
                state.toSrc = '';
                state.crossed = false;
                state.restoreStart = 0;
                state.restoreFrom = 1;
            }
            if (typeof window.ftStopIncomingRealmTrack === 'function') {
                window.ftStopIncomingRealmTrack();
            }

            const src = ftResolveTheme();
            const base = Math.max(0, Math.min(1, (ftAudioSettings?.master ?? .8) * (ftAudioSettings?.music ?? .48)));
            if (src) {
                ftThemeAudio.pause();
                ftThemeKey = src;
                ftThemeAudio.src = src;
                ftThemeAudio.currentTime = 0;
                ftThemeAudio.volume = base;
                ftThemeAudio.play().catch(() => {});
            }
            updateUI();
        };

        // A new world must also reset the timed realm-music handoff. Without
        // this, a previous run can leave the soundtrack paused at zero volume.
        const ftResetGameBeforeMusicRecovery = resetGame;
        resetGame = function resetGameAndRestartMusic() {
            ftResetGameBeforeMusicRecovery();
            const state = window.ftBoundaryMusicState;
            if (state) {
                state.phase = 'idle';
                state.start = 0;
                state.fromRealm = currentRealm;
                state.toRealm = null;
                state.fromSrc = '';
                state.toSrc = '';
                state.crossed = false;
                state.restoreStart = 0;
                state.restoreFrom = 1;
            }
            const src = ftResolveTheme();
            const base = Math.max(0, Math.min(1, (ftAudioSettings?.master ?? .8) * (ftAudioSettings?.music ?? .48)));
            if (src) {
                ftThemeAudio.pause();
                ftThemeKey = src;
                ftThemeAudio.src = src;
                ftThemeAudio.currentTime = 0;
                ftThemeAudio.volume = base;
                ftThemeAudio.play().catch(() => {});
            }
        };


    // Reload stability and enemy movement intent repair.
    (function installReloadAndFlightPatrolRepair(){
      const FREE_AIR_TYPES = new Set([2,11,12,24,27,28,33,40,43,47,49,52,53,55]);
      const AIR_FLAGS = new Set(['floating','flying','homing','phase_drift','sine_wave','fast_swimmer','projector','teleport','ambush','spiral_shot','tracking_beam','recursive_clone']);
      const PATROL_FLAGS = new Set(['patrol','slow_patrol','air_patrol','flying_patrol','horizontal_patrol','dash_lane','boomerang_path']);

      function enemyIsAirborne(e){
        const flags=e.behaviorFlags||[];
        return FREE_AIR_TYPES.has(Number(e.type)) || flags.some(f=>AIR_FLAGS.has(f));
      }
      function enemyHasDesignedPatrol(e){
        const flags=e.behaviorFlags||[];
        return flags.some(f=>PATROL_FLAGS.has(f));
      }

      // Platform edge restriction is ground-only. Airborne enemies that have a
      // patrol still use their own startX/radius movement, never platform walls.
      clampEnemyToPlatform=function clampEnemyToPlatformIntentAware(e){
        if(!e || enemyIsAirborne(e)) return;
        const plat=enemyHomePlatform(e);
        if(!plat)return;
        const minX=plat.x+4,maxX=plat.x+plat.width-e.width-4;
        if(maxX<=minX)return;
        if(e.x<minX){e.x=minX;e.dir=1;}
        else if(e.x>maxX){e.x=maxX;e.dir=-1;}
      };

      // Give free airborne enemies a clear marker so later movement systems do
      // not accidentally attach them to a platform. Designed air patrols retain
      // their existing startX patrol radius.
      function normaliseEnemyMovementIntent(){
        for(const e of enemies||[]){
          if(!enemyIsAirborne(e))continue;
          e._platform=null;
          e._ignorePlatformBounds=true;
          e._airPatrol=enemyHasDesignedPatrol(e);
        }
      }

      function rebuildCurrentRealmTravelEntry(){
        if(!window.ftRealmTravel)return;
        let before=highestPlatformTouchedIndex-realmProgress;
        if(!Number.isFinite(before))before=-1;
        const local=(platforms||[]).filter(q=>q.index>before).sort((a,b)=>a.index-b.index).slice(0,Math.max(0,targetProgress||0));
        const startX=local.length?local[0].x:Math.max(0,player.worldX-100);
        const endX=local.length?local[local.length-1].x:player.worldX;
        window.ftRealmTravel.entries=[{
          realmId:currentRealm,startX,endX,
          realmProgress:realmProgress||0,targetProgress:targetProgress||0,
          highestPlatformTouchedIndex:highestPlatformTouchedIndex,
          beforeRealmPlatformIndex:before,flowIndex:realmIndex(currentRealm),completed:false
        }];
        window.ftRealmTravel.cursor=0;
        window.ftRealmTravel.switching=false;
      }

      function sanitiseLegacyPlatformState(){
        if(!Array.isArray(platforms)) { platforms=[]; return; }
        platforms=platforms.filter(p=>p && !p.hidden && p.index!==-1 && Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.width));
        const ordered=[...platforms].sort((a,b)=>a.x-b.x);
        let last=-Infinity, broken=false;
        for(const p of ordered){ if(!Number.isFinite(p.index) || p.index<=last){broken=true;break;} last=p.index; }
        if(broken){
          ordered.forEach((p,i)=>p.index=i);
          platforms=ordered;
          const reached=ordered.filter(p=>p.x<=player.worldX+Math.max(40,player.width||40));
          highestPlatformTouchedIndex=Math.max(0,reached.length-1);
          realmProgress=Math.max(0,Math.min(targetProgress||0,realmProgress||0));
        }
        if(platforms.length){
          const furthest=platforms.reduce((a,b)=>a.x+a.width>b.x+b.width?a:b);
          maxReachedX=Math.max(maxReachedX||0,furthest.x+furthest.width);
        }
      }

      function resetLoadedTransitionState(){
        sanitiseLegacyPlatformState();
        normaliseEnemyMovementIntent();
        rebuildCurrentRealmTravelEntry();
        const blend=window.ftRealmBlendState;
        if(blend){
          blend.mix=0; blend.target=0; blend.direction=1; blend.nextRealm=null;
          blend.boundarySeed=null;
        }
        const music=window.ftBoundaryMusicState;
        if(music){
          music.phase='idle'; music.start=0; music.fromRealm=currentRealm;
          music.toRealm=null; music.fromSrc=''; music.toSrc=''; music.crossed=false;
          music.restoreStart=0; music.restoreFrom=1;
        }
        const src=typeof ftResolveTheme==='function'?ftResolveTheme():null;
        const base=Math.max(0,Math.min(1,(ftAudioSettings?.master??.8)*(ftAudioSettings?.music??.48)));
        if(src){
          ftThemeAudio.pause(); ftThemeAudio.src=src; ftThemeKey=src;
          ftThemeAudio.currentTime=0; ftThemeAudio.volume=base;
          ftThemeAudio.play().catch(()=>{});
        }
        if(typeof updateUI==='function')updateUI();
      }
      window.ftResetLoadedTransitionState=resetLoadedTransitionState;

      const loadGameBeforeReloadRepair=loadGame;
      loadGame=function loadGameWithStableAudioAndBlend(slot){
        loadGameBeforeReloadRepair(slot);
        resetLoadedTransitionState();
      };

      const resetGameBeforeMovementRepair=resetGame;
      resetGame=function resetGameWithMovementRepair(){
        resetGameBeforeMovementRepair();
        normaliseEnemyMovementIntent();
        const blend=window.ftRealmBlendState;
        if(blend){blend.mix=0;blend.target=0;blend.nextRealm=null;blend.boundarySeed=null;}
      };

      // New enemies spawned after load are normalised continuously at negligible
      // cost, preserving the difference between free flight and intentional patrol.
      const updateBeforeMovementIntent=update;
      update=function updateWithMovementIntent(){
        normaliseEnemyMovementIntent();
        updateBeforeMovementIntent();
      };
    })();
