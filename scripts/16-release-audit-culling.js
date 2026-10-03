/* Faded Thread module: 16-release-audit-culling.js | build 03 Oct 2026 */
// =====================================================================
    // FINAL RELEASE AUDIT PATCH
    // Loot probability, equipment fidelity, hidden platforms, dash physics,
    // UI contrast/layout, Cosmic Desolation, and unique equipment silhouettes.
    // =====================================================================
    (function installFinalReleaseAudit(){
      'use strict';

      // ---------- UI layout and contrast ----------
      const releaseStyle=document.createElement('style');
      releaseStyle.textContent=`
        #home-settings-drawer{right:auto!important;left:0!important;border-left:0!important;border-right:1px solid rgba(210,225,255,.18)!important;box-shadow:24px 0 70px rgba(0,0,0,.5)!important;transform:translateX(-102%)!important;color:#fff!important}
        #home-settings-drawer.show{transform:translateX(0)!important}
        #home-settings-drawer *,#death-screen *,#death-screen .death-card{color:#ffffff!important}
        .death-option,.drawer-section-title,.drawer-section-copy,.drawer-head h2,.death-stat-label,.death-stat-value,.death-sub,.death-eyebrow,#death-countdown{color:#ffffff!important}
        .equipment-name-line{display:flex;align-items:center;gap:10px;min-width:0}
        .equipment-identity-icon{width:34px;height:34px;flex:0 0 34px;filter:drop-shadow(0 0 7px var(--item-color));}
        .equipment-identity-icon svg{display:block;width:100%;height:100%;overflow:visible}
        @media(max-width:720px){#home-settings-drawer{width:min(360px,92vw)!important}}
      `;
      document.head.appendChild(releaseStyle);

      // ---------- Strict global drop math ----------
      // A wild item roll first selects a category: exactly 2% boss-tier when
      // boss-tier candidates exist, otherwise 100% standard. This is an absolute
      // probability, not a relative weight that changes with pool size.
      const finalEligibleWorldDropIds=function(){
        const owned=new Set(player.collectedEquipment||[]);
        const inWorld=new Set([...(magicItems||[]),...(cosmeticItems||[])].map(i=>i.type));
        return EQUIPMENT_TYPES.filter(item=>!item.hiddenEcho&&!owned.has(item.id)&&!inWorld.has(item.id)).map(item=>item.id);
      };
      eligibleWorldDropIds=finalEligibleWorldDropIds;
      weightedWorldDropPick=function strictTwoPercentWorldPick(ids){
        if(!ids||!ids.length)return null;
        const bossIds=ids.filter(id=>BOSS_REWARD_EQUIPMENT_IDS.has(id)||WORLD_BOSS_REWARD_EQUIPMENT_IDS.has(id)||!!getEquipmentDef(id).bossSource);
        const normalIds=ids.filter(id=>!bossIds.includes(id));
        if(bossIds.length&&Math.random()<0.02)return bossIds[Math.floor(Math.random()*bossIds.length)];
        const pool=normalIds.length?normalIds:bossIds;
        return pool[Math.floor(Math.random()*pool.length)];
      };
      spawnMagicItem=function strictWorldItemSpawn(x,y){
        const eligible=finalEligibleWorldDropIds();
        if(!eligible.length)return;
        const type=weightedWorldDropPick(eligible);
        if(!type)return;
        magicItems.push({x,y,type,width:28,height:28,bounceOffset:Math.random()*100});
        nextMagicPlatformIndex+=10+Math.floor(Math.random()*12);
      };

      // ---------- Independent boss loot tables ----------
      // Unique reward and ending echoes never share a mutually-exclusive branch.
      const awardBossRewardBeforeAudit=awardBossReward;
      awardBossReward=function awardBossRewardIndependent(kind){
        const before=new Set(player.collectedEquipment||[]);
        awardBossRewardBeforeAudit(kind);
        // Defensive guarantee: expansion reward maps may be layered by later code.
        const maps=[
          typeof ENDGAME_BOSS_REWARD_MAP_V27!=='undefined'?ENDGAME_BOSS_REWARD_MAP_V27:null,
          typeof TRUE_V30_BOSS_REWARD_MAP!=='undefined'?TRUE_V30_BOSS_REWARD_MAP:null,
          typeof V31_BOSS_REWARD_MAP!=='undefined'?V31_BOSS_REWARD_MAP:null,
          typeof V32_BOSS_REWARD_MAP!=='undefined'?V32_BOSS_REWARD_MAP:null
        ].filter(Boolean);
        for(const map of maps){
          const reward=map[kind];
          if(reward&&reward.equipment&&!(player.collectedEquipment||[]).includes(reward.equipment)){
            collectEquipmentItem(reward.equipment,'boss');
          }
        }
      };
      rollHiddenEchoDrop=function rollEndingItemsIndependently(){
        player.collectedEquipment=player.collectedEquipment||[];
        for(const id of HIDDEN_ECHO_IDS){
          if(!player.collectedEquipment.includes(id)&&Math.random()<0.05)collectEquipmentItem(id,'boss');
        }
      };

      // ---------- Equipment effect fidelity registry ----------
      // Existing specialised mechanics remain intact; this registry supplies the
      // exact numeric/feature branch for descriptions that previously had only a
      // vague or cosmetic approximation.
      const releaseEffectMap={
        rustedThimble:{guardShield:true,contactGrace:18},paperFeather:{fallDelta:-1.0,frictionMin:.95},bogLamp:{healSpawnMultiplier:1.35},sapphireNeedle:{attackW:38,bossSpark:true},copperLeaf:{speed:.8},carnivalBell:{enemyScoreMultiplier:1.25},mirrorThread:{attackW:24,echoTrail:true},ivoryButton:{lives:1},mothPin:{fallDelta:-.8},emberRosary:{killBurstChance:.22},opalLens:{attackH:24},scarletHook:{attackW:38},duskCapacitor:{accel:.16,frictionMin:.96},boneCompass:{hitInvulnBonus:45},staticVine:{thornAura:true},frostTicket:{attackW:28,downFallMultiplier:.62},gildedMoss:{pogoBoost:1.25,landingControl:true},velvetShard:{speed:1.05},blackglassPearl:{crystalGuard:true},sunSpindle:{healMultiplier:2},nurseryKey:{attackW:12,enemyScoreMultiplier:1.08},riftRibbon:{skyDash:true},canopyCharm:{speed:.55,fallDelta:-.55},circusCoin:{enemyScoreMultiplier:1.2},rainPendant:{frictionMin:.965,accel:.08},foundryGlove:{attackW:30,bossDamageBonus:1},catacombSeal:{lives:1},choirAsh:{ashFeather:true},archiveQuill:{attackW:26,enemyScoreMultiplier:1.1},harvestCrown:{speed:.45,enemyScoreMultiplier:1.2},
        nannyNeedle:{attackW:34,bossDamageBonus:1},moonFoldCape:{skyDash:true,fallDelta:-1},mawLantern:{killHealCharge:12},splitSapphire:{reflectChance:.22},gardenerShears:{thornAura:true,attackW:42,attackH:18},ringmasterHat:{enemyScoreMultiplier:1.5},widowMirror:{guardShield:true,reflectChance:.12},furnaceHeart:{lives:2},abbotWings:{fallDelta:-1.1,pogoBoost:1.35},cantorBell:{killHealCharge:10,ashFeather:true},opalCodex:{riftSlash:true,attackW:38},admiralAnchor:{hitInvulnBonus:50,knockbackMultiplier:.45},engineerGear:{speed:.65,attackH:22,dashMultiplier:1.18},astronomerHalo:{lives:1,enemyScoreMultiplier:1.15},staticScythe:{attackW:52,enemyScoreMultiplier:1.2},
        tyrantLens:{attackW:16,landingInvuln:20,negateMirrorGravity:true},sovereignAegis:{lives:1,blockCorrosion:true,preventPlatformShrink:true},godThreadMantle:{lives:2,voidPullMultiplier:.2,negateVoidBonus:true},
        spoolShield:{rechargeShield:true},thimbleCap:{hitCooldownReduction:30,respawnInvulnBonus:35},gildedNeedle:{bossThirdHitBonus:true},mercuryThread:{accel:.2,frictionMin:.97},serratedBlade:{bleed:true},glassPendant:{reflectOnLanding:true},echoCrest:{echoSlash:true},vampiricEye:{killHealCharge:8},heavyWeightAnchor:{downFallMultiplier:.55,pogoBoost:1.3,knockbackMultiplier:.4},prismaticWeaver:{prismaticCycle:true},
        shearGauntlets:{shearGauntlets:true},warpSpool:{warpSpool:true},leviathanCarapace:{crystalGuard:true,knockbackMultiplier:.45,voidPullMultiplier:.5},monarchCloak:{monarchCloak:true},infinityThread:{infinityThread:true},
        cometThread:{dashMultiplier:1.18},wizardHat:{enemyScoreMultiplier:1.12}
      };
      const recalcBeforeAudit=recalculateEquipmentEffects;
      recalculateEquipmentEffects=function recalculateEquipmentEffectsAudited(){
        recalcBeforeAudit();
        const eq=new Set(player.equippedEquipment||[]);
        player.releaseTraits={enemyScoreMultiplier:1,healMultiplier:1,healSpawnMultiplier:1,knockbackMultiplier:1,voidPullMultiplier:1,dashMultiplier:1,pogoBoost:1,downFallMultiplier:1,reflectChance:0,killHealCharge:0,bossDamageBonus:0,hitInvulnBonus:0,landingInvuln:0};
        for(const id of eq){
          const fx=releaseEffectMap[id]; if(!fx)continue;
          if(fx.speed)player.maxSpeed+=fx.speed;
          if(fx.accel)player.acceleration+=fx.accel;
          if(fx.frictionMin)player.friction=Math.max(player.friction,fx.frictionMin);
          if(fx.fallDelta)player.maxFallSpeed=Math.max(4.5,player.maxFallSpeed+fx.fallDelta);
          if(fx.attackW)player.attackBox.width+=fx.attackW;
          if(fx.attackH)player.attackBox.height+=fx.attackH;
          if(fx.lives)player.maxLives+=fx.lives;
          if(fx.skyDash)player.skyDash=true;
          if(fx.guardShield)player.guardShield=true;
          if(fx.crystalGuard)player.crystalGuard=true;
          if(fx.thornAura)player.thornAura=true;
          if(fx.riftSlash)player.riftSlash=true;
          if(fx.ashFeather)player.ashFeather=true;
          if(fx.shearGauntlets)player.shearGauntlets=true;
          if(fx.warpSpool)player.warpSpool=true;
          if(fx.monarchCloak)player.monarchCloak=true;
          if(fx.infinityThread)player.infinityThread=true;
          Object.assign(player.releaseTraits,{
            enemyScoreMultiplier:player.releaseTraits.enemyScoreMultiplier*(fx.enemyScoreMultiplier||1),
            healMultiplier:Math.max(player.releaseTraits.healMultiplier,fx.healMultiplier||1),
            healSpawnMultiplier:Math.max(player.releaseTraits.healSpawnMultiplier,fx.healSpawnMultiplier||1),
            knockbackMultiplier:Math.min(player.releaseTraits.knockbackMultiplier,fx.knockbackMultiplier||1),
            voidPullMultiplier:Math.min(player.releaseTraits.voidPullMultiplier,fx.voidPullMultiplier||1),
            dashMultiplier:player.releaseTraits.dashMultiplier*(fx.dashMultiplier||1),
            pogoBoost:Math.max(player.releaseTraits.pogoBoost,fx.pogoBoost||1),
            downFallMultiplier:Math.min(player.releaseTraits.downFallMultiplier,fx.downFallMultiplier||1),
            reflectChance:Math.max(player.releaseTraits.reflectChance,fx.reflectChance||0),
            killHealCharge:fx.killHealCharge||player.releaseTraits.killHealCharge,
            bossDamageBonus:Math.max(player.releaseTraits.bossDamageBonus,fx.bossDamageBonus||0),
            hitInvulnBonus:Math.max(player.releaseTraits.hitInvulnBonus,fx.hitInvulnBonus||0),
            landingInvuln:Math.max(player.releaseTraits.landingInvuln,fx.landingInvuln||0)
          });
          for(const [k,v] of Object.entries(fx))if(typeof v==='boolean')player[k]=v;
        }

        // Wizard Hat is intentionally calculated LAST. recalcBeforeAudit() rebuilds
        // attackBox from its clean base on every equipment change, then every
        // other flat/multiplicative slash modifier above is applied. Only after
        // that finished value exists do we add the hat's final 10%. This makes
        // equipment order irrelevant and prevents unequip/re-equip stacking.
        player.wizardHat = eq.has('wizardHat');
        if(player.wizardHat){
          player.attackBox.width *= 1.10;
          player.attackBox.height *= 1.10;
        }
        player.attackRange=Math.max(player.attackBox.width,player.attackBox.height)/2;
      };
      const healBeforeAudit=healPlayer;
      healPlayer=function auditedHeal(amount=1){return healBeforeAudit(amount*((player.releaseTraits&&player.releaseTraits.healMultiplier)||1));};

      // Platform creation is intentionally simple and persistent. Secret/hidden
      // platform injection has been removed completely.
      createPlatform=function createPlatformRelease(x,y,width,index){
        platforms.push({x,y,width,height:25,index});
      };

      // ---------- Dash overhaul ----------
      let dashBurstFrames=0;
      let dashBurstDir=0;
      window.ftPerformCurrentDash=function ftPerformCurrentDash(){
        if(onHomeScreen||gameOver||equipmentMenuOpen||window.ftGamePaused||!player||!player.skyDash||!player.dashReady)return false;
        const mult=(player.releaseTraits&&player.releaseTraits.dashMultiplier)||1;
        const heldDir=(keys['a']||keys['arrowleft'])?-1:((keys['d']||keys['arrowright'])?1:0);
        const velocityDir=Math.abs(player.vx)>.25?Math.sign(player.vx):0;
        const dir=heldDir||velocityDir||player.facing||1;
        player.facing=dir;
        const carried=Math.max(0,player.vx*dir);
        player.vx=dir*Math.max(15.5*mult,carried+11.5*mult);
        player.vy=Math.min(player.vy,-1.25);
        player.dashReady=false;dashBurstFrames=13;dashBurstDir=dir;window.dispatchEvent(new CustomEvent('ft-successful-dash'));
        if(player.warpSpool)player.warpPhaseTimer=40;
        if(player.monarchCloak){player.monarchAfterimages=player.monarchAfterimages||[];player.monarchAfterimages.push({wx:player.worldX,wy:player.worldY,facing:dir,life:45,maxLife:45});}
        addParticles(player.worldX-worldX,player.worldY,'#8be9ff');
        return true;
      };
      window.addEventListener('keydown',function releaseDashCapture(ev){
        if(window.ftEnhancedControlsActive||window.ftGamePaused)return;
        const key=ev.key.toLowerCase();
        if(key!=='shift'&&key!==' ')return;
        if(window.ftPerformCurrentDash&&window.ftPerformCurrentDash()){
          ev.preventDefault();ev.stopImmediatePropagation();
        }
      },true);
      const updateDashBase=update;
      update=function updateWithImpactDash(){
        if(dashBurstFrames>0){
          const dir=dashBurstDir||player.facing||1;
          const mult=(player.releaseTraits&&player.releaseTraits.dashMultiplier)||1;
          player.vx+=dir*1.15*mult;
          const cap=18.5*mult;
          player.vx=Math.max(-cap,Math.min(cap,player.vx));
          window.ftDashBurstActive=true;
          window.ftDashBurstCap=cap;
          dashBurstFrames--;
          try { updateDashBase(); } finally {
            window.ftDashBurstActive=false;
            window.ftDashBurstCap=0;
            if(dashBurstFrames<=0)dashBurstDir=0;
          }
          return;
        }
        window.ftDashBurstActive=false;
        window.ftDashBurstCap=0;
        updateDashBase();
      };

      // ---------- Cosmic Desolation organic star field ----------
      const drawBackgroundBeforeCosmicFix=drawRealmBackground;
      function cosmicHash(n){const x=Math.sin(n*127.1+311.7)*43758.5453123;return x-Math.floor(x);}
      function drawOrganicCosmicDesolation(W,H,t){
        const g=ctx.createRadialGradient(W*.45,H*.35,20,W*.5,H*.45,Math.max(W,H)*.85);
        g.addColorStop(0,'#171242');g.addColorStop(.45,'#080922');g.addColorStop(1,'#010106');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
        for(let layer=0;layer<3;layer++){
          const count=[75,48,26][layer],par=[.018,.035,.065][layer],size=[.8,1.25,2][layer];
          for(let i=0;i<count;i++){
            const seed=i+layer*1000;
            const span=W+220;
            const x=((cosmicHash(seed)*span-worldX*par)%span+span)%span-110;
            const y=cosmicHash(seed+71.3)*H;
            const tw=.35+.55*(.5+.5*Math.sin(t*.0015*(1+cosmicHash(seed+9)*2)+seed));
            ctx.fillStyle=`rgba(${190+layer*18},${200+layer*15},255,${tw})`;
            ctx.beginPath();ctx.arc(x,y,size*(.65+cosmicHash(seed+23)),0,Math.PI*2);ctx.fill();
          }
        }
        // Sparse nebulae, deliberately irregular rather than grid aligned.
        for(let i=0;i<7;i++){
          const x=cosmicHash(500+i)*W-worldX*.01,y=cosmicHash(600+i)*H,r=80+cosmicHash(700+i)*170;
          const ng=ctx.createRadialGradient(x,y,0,x,y,r);ng.addColorStop(0,`rgba(${70+i*12},45,170,.09)`);ng.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ng;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
        }
      }
      drawRealmBackground=function drawRealmBackgroundCosmicFixed(W,H,t){
        if(currentRealm==='space'&&!boss.active){drawOrganicCosmicDesolation(W,H,t);return;}
        drawBackgroundBeforeCosmicFix(W,H,t);
      };

      // ---------- Unique equipment silhouettes in the collection UI ----------
      function itemHash(id){let h=2166136261;for(const ch of id){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
      function uniqueItemSvg(id,color){
        const h=itemHash(id);
        const C=color;
        const fill=`${color}33`;
        const stroke=`stroke="${C}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
        const lower=String(id||'').toLowerCase();
        const v=(n,m=5)=>((h>>>n)%m);
        let body='';

        // Semantic families have genuinely different topology. Small hash-driven
        // details make repeated families (two bells, multiple crowns, etc.)
        // structurally distinct rather than simple recolours.
        if(/eye|lens/.test(lower)){
          const pupil=3+v(2,4), lashes=2+v(5,4);
          body=`<path d="M2 16 Q8 ${7+v(8,5)} 16 8 Q24 ${7+v(11,5)} 30 16 Q24 ${25-v(14,5)} 16 24 Q8 ${25-v(17,5)} 2 16Z" fill="${fill}" ${stroke}/><circle cx="16" cy="16" r="${pupil+3}" fill="none" ${stroke}/><circle cx="16" cy="16" r="${pupil}" fill="${C}"/>`;
          for(let i=0;i<lashes;i++){const x=6+i*(20/Math.max(1,lashes-1));body+=`<path d="M${x} 10 L${x+(i%2?2:-2)} ${5-v(i+1,3)}" ${stroke} fill="none"/>`;}
        } else if(/crown|tiara|helm/.test(lower)){
          const peaks=3+v(1,4); let pts='4,25 4,14 ';
          for(let i=0;i<peaks;i++){const x=6+i*(20/Math.max(1,peaks-1)); const y=(i===Math.floor(peaks/2)?3+v(8,4):7+v(i+10,6)); pts+=`${x},${y} ${x+2},16 `;}
          pts+='28,14 28,25';
          body=`<polygon points="${pts}" fill="${fill}" ${stroke}/><path d="M5 22 Q16 ${18+v(4,4)} 27 22" fill="none" ${stroke}/>`;
          if(/helm/.test(lower)) body+=`<path d="M9 24 L9 29 M23 24 L23 29 M12 13 Q16 9 20 13" fill="none" ${stroke}/>`;
        } else if(/bell/.test(lower)){
          const flare=6+v(4,4), clapper=2+v(9,3);
          body=`<path d="M16 4 C${7-v(2,3)} 5 ${8-v(5,2)} 12 ${8-v(7,2)} 20 L${4+v(10,3)} 24 L${28-v(12,3)} 24 L${24+v(14,2)} 20 C${24+v(16,2)} 12 ${25+v(18,2)} 5 16 4Z" fill="${fill}" ${stroke}/><path d="M${8-flare/3} 21 Q16 ${24+v(20,3)} ${24+flare/3} 21" fill="none" ${stroke}/><circle cx="16" cy="27" r="${clapper}" fill="${C}"/>`;
        } else if(/needle|shear|scythe|hook|quill/.test(lower)){
          if(/shear/.test(lower)) body=`<circle cx="9" cy="23" r="5" fill="${fill}" ${stroke}/><circle cx="19" cy="23" r="5" fill="${fill}" ${stroke}/><path d="M12 20 L27 4 L16 19 M16 19 L27 14" fill="none" ${stroke}/>`;
          else if(/scythe/.test(lower)) body=`<path d="M10 28 L17 5" ${stroke}/><path d="M17 5 Q28 5 30 13 Q23 10 17 14" fill="${fill}" ${stroke}/>`;
          else if(/hook/.test(lower)) body=`<path d="M17 3 L17 20 Q17 29 9 28 Q3 27 4 21 Q5 17 9 17" fill="none" ${stroke}/><path d="M14 4 L20 4" ${stroke}/>`;
          else if(/quill/.test(lower)) body=`<path d="M5 27 Q11 8 27 4 Q24 18 9 25Z" fill="${fill}" ${stroke}/><path d="M7 28 L23 8 M14 18 L9 14 M18 14 L23 13" fill="none" ${stroke}/>`;
          else body=`<path d="M5 27 L24 5" ${stroke}/><path d="M24 5 L28 3 L26 8Z" fill="${C}"/><circle cx="7" cy="26" r="3" fill="none" ${stroke}/>`;
        } else if(/wing|feather/.test(lower)){
          const split=3+v(3,4);
          body=`<path d="M16 26 Q3 23 4 9 Q11 10 16 18 Q21 10 28 9 Q29 23 16 26Z" fill="${fill}" ${stroke}/>`;
          for(let i=0;i<split;i++){const y=12+i*3;body+=`<path d="M15 ${20+i} L${6+i} ${y} M17 ${20+i} L${26-i} ${y}" fill="none" ${stroke}/>`;}
        } else if(/cape|cloak|mantle/.test(lower)){
          const notch=2+v(5,4);
          body=`<path d="M10 5 Q16 ${2+v(8,4)} 22 5 L${28-v(11,4)} 28 L16 ${24-v(14,3)} L${4+v(17,4)} 28Z" fill="${fill}" ${stroke}/><path d="M10 6 Q16 12 22 6" fill="none" ${stroke}/>`;
          for(let i=0;i<notch;i++) body+=`<path d="M${8+i*(16/Math.max(1,notch-1))} 27 L${10+i*(12/Math.max(1,notch-1))} ${23-v(i+2,3)}" fill="none" ${stroke}/>`;
        } else if(/spool/.test(lower)){
          const ribs=2+v(4,5);
          body=`<path d="M8 4 L24 4 L22 9 L22 23 L25 28 L7 28 L10 23 L10 9Z" fill="${fill}" ${stroke}/>`;
          for(let i=0;i<ribs;i++){const y=10+i*(12/Math.max(1,ribs-1));body+=`<path d="M10 ${y} Q16 ${y+(i%2?2:-2)} 22 ${y}" fill="none" ${stroke}/>`;}
        } else if(/thread|stitch|ribbon/.test(lower)){
          const bends=3+v(6,4); let d='M4 24 '; for(let i=0;i<bends;i++){const x=7+i*(21/Math.max(1,bends-1)); const y=(i%2?6+v(i+8,5):25-v(i+12,5)); d+=`Q${x-3} ${y} ${x} ${y} `;} d+='Q28 14 29 5';
          body=`<path d="${d}" fill="none" ${stroke}/><circle cx="4" cy="24" r="2.5" fill="${C}"/><circle cx="29" cy="5" r="2" fill="none" ${stroke}/>`;
        } else if(/button|coin|pearl|heart|star|shard/.test(lower)){
          if(/heart/.test(lower)) body=`<path d="M16 28 C4 20 3 9 9 6 C13 4 16 8 16 8 C16 8 19 4 23 6 C29 9 28 20 16 28Z" fill="${fill}" ${stroke}/><path d="M16 12 L16 23" ${stroke}/>`;
          else if(/star/.test(lower)) body=`<path d="M16 2 L20 11 L30 12 L22 18 L25 28 L16 22 L7 28 L10 18 L2 12 L12 11Z" fill="${fill}" ${stroke}/><circle cx="16" cy="16" r="${2+v(2,4)}" fill="${C}"/>`;
          else if(/shard/.test(lower)) body=`<polygon points="16,2 27,9 22,29 12,24 5,13" fill="${fill}" ${stroke}/><path d="M16 2 L14 23 M27 9 L10 18" fill="none" ${stroke}/>`;
          else if(/button/.test(lower)) body=`<circle cx="16" cy="16" r="13" fill="${fill}" ${stroke}/><circle cx="12" cy="12" r="2" fill="${C}"/><circle cx="20" cy="12" r="2" fill="${C}"/><circle cx="12" cy="20" r="2" fill="${C}"/><circle cx="20" cy="20" r="2" fill="${C}"/>`;
          else if(/coin/.test(lower)) body=`<circle cx="16" cy="16" r="13" fill="${fill}" ${stroke}/><path d="M16 7 L21 13 L18 23 L11 20 L10 12Z" fill="none" ${stroke}/>`;
          else body=`<ellipse cx="16" cy="17" rx="${9+v(1,4)}" ry="${11+v(4,3)}" fill="${fill}" ${stroke}/><path d="M10 10 Q16 ${4+v(8,4)} 22 10" fill="none" ${stroke}/>`;
        } else if(/anchor/.test(lower)){
          body=`<circle cx="16" cy="6" r="4" fill="none" ${stroke}/><path d="M16 10 L16 27 M7 14 L25 14 M5 20 Q6 28 16 28 Q26 28 27 20 M5 20 L9 18 M27 20 L23 18" fill="none" ${stroke}/>`;
        } else if(/gear|capacitor/.test(lower)){
          const teeth=6+v(1,5); let pts=[]; for(let i=0;i<teeth*2;i++){let a=i*Math.PI/teeth,r=i%2?9:14;pts.push(`${16+Math.cos(a)*r},${16+Math.sin(a)*r}`);} body=`<polygon points="${pts.join(' ')}" fill="${fill}" ${stroke}/><circle cx="16" cy="16" r="5" fill="#0a0b15" ${stroke}/>`;
          if(/capacitor/.test(lower)) body+=`<path d="M11 11 L21 21 M21 11 L11 21" ${stroke}/>`;
        } else if(/mirror|patch/.test(lower)){
          body=`<path d="M8 4 Q16 ${1+v(2,4)} 24 4 L27 16 L22 28 L10 28 L5 16Z" fill="${fill}" ${stroke}/><path d="M10 9 L22 6 M8 15 L24 11 M9 22 L22 18" fill="none" ${stroke}/>`;
        } else if(/leaf|vine|moss|thorn/.test(lower)){
          body=`<path d="M5 25 Q5 7 27 5 Q25 25 5 25Z" fill="${fill}" ${stroke}/><path d="M7 23 L24 8 M12 19 L9 12 M16 16 L22 16" fill="none" ${stroke}/>`;
          if(/thorn/.test(lower)) body+=`<path d="M8 20 L3 17 M14 15 L10 9 M20 11 L19 5" ${stroke}/>`;
        } else if(/boot/.test(lower)){
          body=`<path d="M8 4 L18 4 L18 18 Q22 23 29 23 L29 28 L8 28Z" fill="${fill}" ${stroke}/><path d="M9 12 L18 12 M9 17 L18 17" fill="none" ${stroke}/>`;
        } else if(/key/.test(lower)){
          body=`<circle cx="10" cy="11" r="6" fill="${fill}" ${stroke}/><path d="M14 15 L28 29 M21 22 L25 18 M24 25 L28 21" fill="none" ${stroke}/>`;
        } else if(/mask/.test(lower)){
          body=`<path d="M6 7 Q16 2 26 7 L24 23 Q16 29 8 23Z" fill="${fill}" ${stroke}/><path d="M9 13 Q12 10 14 14 Q11 16 9 13Z M18 14 Q20 10 23 13 Q21 16 18 14Z" fill="#0a0b15" ${stroke}/>`;
        } else if(/halo/.test(lower)){
          body=`<ellipse cx="16" cy="9" rx="12" ry="5" fill="none" ${stroke}/><path d="M9 14 Q6 23 16 29 Q26 23 23 14" fill="${fill}" ${stroke}/>`;
        } else if(/seal|charm|pin/.test(lower)){
          const sides=5+v(2,4); let pts=[]; for(let i=0;i<sides;i++){let a=-Math.PI/2+i*2*Math.PI/sides,r=(i%2?11:13);pts.push(`${16+Math.cos(a)*r},${16+Math.sin(a)*r}`);} body=`<polygon points="${pts.join(' ')}" fill="${fill}" ${stroke}/><path d="M11 16 Q16 ${8+v(8,5)} 21 16 Q16 ${24-v(11,4)} 11 16Z" fill="none" ${stroke}/>`;
        } else if(/shell/.test(lower)){
          body=`<path d="M4 23 Q5 7 16 5 Q27 7 28 23Z" fill="${fill}" ${stroke}/>`; for(let i=0;i<5;i++)body+=`<path d="M16 6 L${7+i*4} 23" fill="none" ${stroke}/>`;
        } else {
          // Guaranteed per-ID topology fallback: an asymmetric 5x5 sigil. The
          // occupancy is derived from the full hash, so two unknown/future items
          // cannot become mere colour swaps or translated copies.
          let cells='';
          const bits=(BigInt(h)<<32n)|BigInt(itemHash(id+'::shape'));
          for(let y=0;y<5;y++)for(let x=0;x<5;x++){
            const bit=Number((bits>>BigInt(y*5+x))&1n);
            if(bit || (x===2&&y===2)) cells+=`<rect x="${4+x*5}" y="${4+y*5}" width="5.2" height="5.2" rx="${v((x+y)%20,3)}" fill="${fill}" ${stroke}/>`;
          }
          body=cells+`<circle cx="${8+v(3,17)}" cy="${8+v(8,17)}" r="${1.5+v(13,3)}" fill="${C}"/>`;
        }
        return `<span class="equipment-identity-icon" style="--item-color:${color}"><svg viewBox="0 0 32 32" aria-hidden="true">${body}</svg></span>`;
      }
      const renderEquipmentBeforeAudit=renderEquipmentMenu;
      renderEquipmentMenu=function renderEquipmentMenuWithUniqueSilhouettes(){
        renderEquipmentBeforeAudit();
        const cards=document.querySelectorAll('#equipment-grid .equipment-card');
        cards.forEach(card=>{
          const name=card.querySelector('.equipment-name');if(!name||card.querySelector('.equipment-identity-icon'))return;
          const def=EQUIPMENT_TYPES.find(d=>d.name===name.textContent.trim());if(!def)return;
          const line=document.createElement('div');line.className='equipment-name-line';
          line.innerHTML=uniqueItemSvg(def.id,def.color);name.parentNode.insertBefore(line,name);line.appendChild(name);
        });
      };

      // Recalculate once after all expansion equipment has registered.
      setTimeout(()=>{try{recalculateEquipmentEffects();renderEquipmentMenu();}catch(e){console.error('Final audit init',e);}},0);
    })();


    // =====================================================================
    // FINAL LOOT + EQUIPPED-COSMETIC CORRECTION
    // - Wild boss equipment is an absolute 2% category roll.
    // - Y-menu cards keep their original/pre-audit appearance.
    // - Equipped player cosmetics are structurally unique per item.
    // =====================================================================
    (function installLootAndEquippedCosmeticCorrection(){
      'use strict';

      // ---------- Restore the requested Y-menu appearance ----------
      // The production audit added generated SVG identities beside item names.
      // Keep the underlying original equipment-card renderer and suppress only
      // that later-added identity layer so the Y menu returns to its prior look.
      const restoreMenuStyle=document.createElement('style');
      restoreMenuStyle.textContent=`
        #equipment-grid .equipment-identity-icon{display:none!important}
        #equipment-grid .equipment-name-line{display:contents!important}
      `;
      document.head.appendChild(restoreMenuStyle);

      const menuRendererWithAudit=renderEquipmentMenu;
      renderEquipmentMenu=function renderEquipmentMenuOriginalVisuals(){
        menuRendererWithAudit();
        document.querySelectorAll('#equipment-grid .equipment-identity-icon').forEach(n=>n.remove());
        document.querySelectorAll('#equipment-grid .equipment-name-line').forEach(line=>{
          const parent=line.parentNode;
          if(!parent)return;
          while(line.firstChild)parent.insertBefore(line.firstChild,line);
          line.remove();
        });
      };

      // ---------- True absolute 2% wild boss-item roll ----------
      function isBossTierWildItem(id){
        const def=getEquipmentDef(id)||{};
        return BOSS_REWARD_EQUIPMENT_IDS.has(id) ||
               WORLD_BOSS_REWARD_EQUIPMENT_IDS.has(id) ||
               !!def.bossSource || !!def.bossOnly;
      }
      function currentWildCandidates(){
        const owned=new Set(player.collectedEquipment||[]);
        const present=new Set([...(magicItems||[]),...(cosmeticItems||[])].map(i=>i.type));
        return EQUIPMENT_TYPES.filter(def=>
          !def.hiddenEcho &&
          !owned.has(def.id) &&
          !present.has(def.id)
        );
      }
      eligibleWorldDropIds=function eligibleWorldDropIdsStrict(){
        return currentWildCandidates().map(d=>d.id);
      };
      weightedWorldDropPick=function weightedWorldDropPickStrict(ids){
        const candidates=(ids||[]).map(id=>getEquipmentDef(id)).filter(Boolean);
        if(!candidates.length)return null;
        const bossPool=candidates.filter(d=>isBossTierWildItem(d.id));
        const normalPool=candidates.filter(d=>!isBossTierWildItem(d.id));

        // Exactly one category roll. A failed boss roll never falls back to a
        // boss item, even when every normal item has already been collected.
        const bossRoll=Math.random()<0.02;
        if(bossRoll){
          if(!bossPool.length)return null;
          return bossPool[Math.floor(Math.random()*bossPool.length)].id;
        }
        if(!normalPool.length)return null;
        return normalPool[Math.floor(Math.random()*normalPool.length)].id;
      };
      spawnMagicItem=function spawnMagicItemStrictTwoPercent(x,y){
        const eligible=eligibleWorldDropIds();
        if(!eligible.length)return;

        // Consume this scheduled opportunity whether or not the 2% boss-tier
        // category succeeds. Otherwise an empty normal pool would reroll every
        // platform and inflate the effective boss-item probability.
        nextMagicPlatformIndex+=10+Math.floor(Math.random()*12);
        const type=weightedWorldDropPick(eligible);
        if(!type)return;
        magicItems.push({x,y,type,width:28,height:28,bounceOffset:Math.random()*100});
      };

      // ---------- Equipped-player cosmetic renderer ----------
      // The old generic fallback used one primitive per slot (triangle for hats,
      // circle for chest, blob for orbit, etc.). This renderer uses the actual
      // item identity and a structural shape grammar. Colour is secondary: the
      // geometry itself is different for every equipped item.
      function cosmeticHash(str){
        let h=2166136261>>>0;
        for(const ch of String(str||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
        return h>>>0;
      }
      function familyFor(def){
        const s=(def.id+' '+def.name).toLowerCase();
        if(/wizard/.test(s))return 'wizard';
        if(/eye|lens/.test(s))return 'eye';
        if(/crown|tiara|helm|cap|hat/.test(s))return 'crown';
        if(/bell/.test(s))return 'bell';
        if(/needle|blade|shear|scythe|hook|quill/.test(s))return 'blade';
        if(/wing|feather/.test(s))return 'wing';
        if(/cape|cloak|mantle/.test(s))return 'cloak';
        if(/spool/.test(s))return 'spool';
        if(/thread|stitch|ribbon|vine/.test(s))return 'thread';
        if(/anchor/.test(s))return 'anchor';
        if(/gear|capacitor/.test(s))return 'gear';
        if(/mirror|glass|patch/.test(s))return 'mirror';
        if(/leaf|moss|thorn/.test(s))return 'leaf';
        if(/boot/.test(s))return 'boot';
        if(/key/.test(s))return 'key';
        if(/mask/.test(s))return 'mask';
        if(/halo/.test(s))return 'halo';
        if(/shell|carapace/.test(s))return 'shell';
        if(/heart/.test(s))return 'heart';
        if(/star|shard|pearl|coin|button|charm|seal|pin|pendant|rosary|aegis/.test(s))return 'relic';
        return 'sigil';
      }
      function familyOrdinal(def,family){
        let n=0;
        for(const item of EQUIPMENT_TYPES){
          if(familyFor(item)===family){
            if(item.id===def.id)return n;
            n++;
          }
        }
        return n;
      }
      function wearablePlacement(def,stack,t){
        const slot=def.slot||'orbit';
        if(slot==='hat')return {x:0,y:-48-stack*13,s:.68,r:0};
        if(slot==='face')return {x:8+stack*8,y:-24+stack*4,s:.48,r:0};
        if(slot==='chest')return {x:0,y:-4+stack*10,s:.56,r:0};
        if(slot==='hand')return {x:23+stack*10,y:-10+stack*5,s:.57,r:-.3};
        if(slot==='back')return {x:-8-stack*7,y:-8+stack*5,s:.78,r:-.08};
        if(slot==='trail')return {x:-28-stack*14-player.vx*1.4,y:10+Math.sin(t*.006+stack)*5,s:.50,r:.12};
        if(slot==='feet')return {x:(stack%2?10:-10),y:27+Math.floor(stack/2)*6,s:.48,r:0};
        if(slot==='aura')return {x:0,y:-10,s:1.05+stack*.12,r:t*.00025*(stack%2?-1:1)};
        const a=t*.0017+stack*1.9+(cosmeticHash(def.id)%100)*.01;
        return {x:Math.cos(a)*(34+stack*7),y:-14+Math.sin(a)*(19+stack*4),s:.48,r:a*.35};
      }
      function beginCosmetic(col,alpha=1){
        ctx.globalAlpha=alpha;
        ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.15;
        ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=9;
      }
      function drawUniqueWearable(def,t){
        const id=def.id, col=def.color||'#ffffff', family=familyFor(def);
        const ord=familyOrdinal(def,family), h=cosmeticHash(id);
        const k=ord+1, wob=Math.sin(t*.004+(h%31))*.08;
        beginCosmetic(col,.92);

        switch(family){
          case 'wizard': {
            // Tall crooked cone, broad brim and star stitch so the equipped item
            // reads unmistakably as a wizard hat on the player.
            ctx.beginPath();ctx.ellipse(0,8,15,4.5,wob,0,Math.PI*2);ctx.fill();ctx.stroke();
            ctx.beginPath();ctx.moveTo(-9,6);ctx.quadraticCurveTo(-4,-7,1,-20);ctx.quadraticCurveTo(8,-14,5,-4);ctx.quadraticCurveTo(3,1,10,6);ctx.closePath();ctx.fill();ctx.stroke();
            ctx.globalAlpha=.72;ctx.beginPath();ctx.arc(1,-8,2.1,0,Math.PI*2);ctx.fill();
            ctx.beginPath();ctx.moveTo(-6,-1);ctx.lineTo(-1,-4);ctx.lineTo(2,1);ctx.lineTo(6,-2);ctx.stroke();ctx.globalAlpha=.92;
            break;
          }
          case 'eye': {
            const lashes=2+(k%5), rx=9+(k%4), ry=5+(k%3);
            ctx.beginPath();ctx.moveTo(-rx,0);ctx.quadraticCurveTo(0,-ry-3-(k%3),rx,0);ctx.quadraticCurveTo(0,ry+3+(k%2),-rx,0);ctx.closePath();ctx.stroke();
            ctx.beginPath();ctx.arc(0,0,2.5+(k%3),0,Math.PI*2);ctx.fill();
            for(let i=0;i<lashes;i++){const x=-rx+3+i*((2*rx-6)/Math.max(1,lashes-1));ctx.beginPath();ctx.moveTo(x,-ry*.65);ctx.lineTo(x+(i%2?-2:2),-ry-5-(i%3));ctx.stroke();}
            if(k%2){ctx.beginPath();ctx.arc(0,0,rx+3,-.8,.8);ctx.stroke();}
            break;
          }
          case 'crown': {
            const peaks=3+(k%6), w=11+(k%3)*2;
            ctx.beginPath();ctx.moveTo(-w,7);ctx.lineTo(-w,-1);
            for(let i=0;i<peaks;i++){const x=-w+((i+.5)*2*w/peaks);const y=-7-(i%2?2:0)-(i===Math.floor(peaks/2)?5:0)-(k%3);ctx.lineTo(x,y);ctx.lineTo(-w+(i+1)*2*w/peaks,-1);}
            ctx.lineTo(w,7);ctx.closePath();ctx.fill();ctx.stroke();
            if(k%2===0){ctx.beginPath();ctx.arc(0,2,3+(k%3),Math.PI,Math.PI*2);ctx.stroke();}
            break;
          }
          case 'bell': {
            const skirt=9+(k%4), bodyH=10+(k%5);
            ctx.beginPath();ctx.moveTo(0,-bodyH);ctx.bezierCurveTo(-6-(k%3),-bodyH+2,-5-(k%2),2,-skirt,7);ctx.quadraticCurveTo(0,10+(k%3),skirt,7);ctx.bezierCurveTo(5+(k%2),2,6+(k%3),-bodyH+2,0,-bodyH);ctx.closePath();ctx.stroke();
            ctx.beginPath();ctx.arc(0,10,2+(k%3),0,Math.PI*2);ctx.fill();
            for(let i=0;i<k%4;i++){ctx.beginPath();ctx.moveTo(-5+i*4,-2);ctx.lineTo(-3+i*4,5);ctx.stroke();}
            break;
          }
          case 'blade': {
            const mode=k%5;
            if(mode===0){ctx.beginPath();ctx.moveTo(-10,10);ctx.lineTo(10,-11);ctx.lineTo(13,-12);ctx.lineTo(11,-8);ctx.stroke();ctx.beginPath();ctx.arc(-9,10,3,0,Math.PI*2);ctx.stroke();}
            else if(mode===1){ctx.beginPath();ctx.arc(-6,7,4,0,Math.PI*2);ctx.arc(4,7,4,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(12,-11);ctx.moveTo(2,4);ctx.lineTo(12,-2);ctx.stroke();}
            else if(mode===2){ctx.beginPath();ctx.moveTo(-7,12);ctx.lineTo(1,-10);ctx.stroke();ctx.beginPath();ctx.moveTo(1,-10);ctx.quadraticCurveTo(12,-12,14,-3);ctx.quadraticCurveTo(7,-6,1,-2);ctx.fill();}
            else if(mode===3){ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,5);ctx.quadraticCurveTo(0,13,-8,11);ctx.quadraticCurveTo(-13,9,-10,3);ctx.stroke();}
            else {ctx.beginPath();ctx.moveTo(-12,9);ctx.quadraticCurveTo(1,-13,13,-10);ctx.quadraticCurveTo(4,-3,-4,8);ctx.stroke();ctx.beginPath();ctx.moveTo(-7,7);ctx.lineTo(8,-7);ctx.stroke();}
            break;
          }
          case 'wing': {
            const feathers=3+(k%5);
            for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(0,7);ctx.quadraticCurveTo(side*(11+k%4),-11,side*(15+k%5),-2);ctx.quadraticCurveTo(side*(12+k%3),10,0,7);ctx.stroke();for(let i=0;i<feathers;i++){ctx.beginPath();ctx.moveTo(side*(2+i*2),4-i);ctx.lineTo(side*(8+i*2),8+i*2);ctx.stroke();}}
            if(k%2){ctx.beginPath();ctx.moveTo(0,5);ctx.lineTo(0,-10-k%4);ctx.stroke();}
            break;
          }
          case 'cloak': {
            const tails=2+(k%4), w=9+(k%4);
            ctx.beginPath();ctx.moveTo(-w,-10);ctx.quadraticCurveTo(0,-14-k%3,w,-10);ctx.lineTo(w+2,10);
            for(let i=tails;i>=0;i--){const x=w-(i*(2*w/tails));ctx.lineTo(x,7+(i%2?7:2)+(k%3));}
            ctx.lineTo(-w-2,10);ctx.closePath();ctx.fill();ctx.globalAlpha=.55;ctx.stroke();ctx.globalAlpha=.92;
            if(k%2){ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(0,9);ctx.stroke();}
            break;
          }
          case 'spool': {
            const ribs=2+(k%6);ctx.beginPath();ctx.moveTo(-8,-12);ctx.lineTo(8,-12);ctx.lineTo(6,-7);ctx.lineTo(6,8);ctx.lineTo(9,12);ctx.lineTo(-9,12);ctx.lineTo(-6,8);ctx.lineTo(-6,-7);ctx.closePath();ctx.stroke();
            for(let i=0;i<ribs;i++){const y=-6+i*(12/Math.max(1,ribs-1));ctx.beginPath();ctx.moveTo(-6,y);ctx.quadraticCurveTo(0,y+(i%2?3:-3),6,y);ctx.stroke();}
            break;
          }
          case 'thread': {
            const bends=3+(k%6);ctx.beginPath();ctx.moveTo(-12,8);for(let i=0;i<bends;i++){const x=-9+i*(21/Math.max(1,bends-1));const y=i%2?-9-(k%3):9+(k%2);ctx.quadraticCurveTo(x-2,y,x,y);}ctx.quadraticCurveTo(11,-5,12,-10);ctx.stroke();
            if(k%3===0){ctx.beginPath();ctx.arc(-12,8,3,0,Math.PI*2);ctx.stroke();}
            break;
          }
          case 'anchor': {
            ctx.beginPath();ctx.arc(0,-10,3+(k%3),0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,11);ctx.moveTo(-8,-1);ctx.lineTo(8,-1);ctx.moveTo(-11,5);ctx.quadraticCurveTo(-8,13,0,13);ctx.quadraticCurveTo(8,13,11,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-11,5);ctx.lineTo(-7,2);ctx.moveTo(11,5);ctx.lineTo(7,2);ctx.stroke();
            for(let i=0;i<k%3;i++){ctx.beginPath();ctx.arc(0,3+i*4,2,0,Math.PI*2);ctx.stroke();}
            break;
          }
          case 'gear': {
            const teeth=7+(k%6), outer=12, inner=8;ctx.save();ctx.rotate(wob+t*.0003*(k%2?1:-1));ctx.beginPath();for(let i=0;i<teeth*2;i++){const a=i*Math.PI/teeth,r=i%2?inner:outer;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,2+(k%4),0,Math.PI*2);ctx.stroke();if(k%2){ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(8,0);ctx.moveTo(0,-8);ctx.lineTo(0,8);ctx.stroke();}ctx.restore();break;
          }
          case 'mirror': {
            const sides=5+(k%4), r=11;ctx.beginPath();for(let i=0;i<sides;i++){const a=-Math.PI/2+i*Math.PI*2/sides;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.stroke();const cracks=2+(k%4);for(let i=0;i<cracks;i++){const a=(i/cracks)*Math.PI*2+.3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*(6+i),Math.sin(a)*(6+i));ctx.lineTo(Math.cos(a+.35)*10,Math.sin(a+.35)*10);ctx.stroke();}break;
          }
          case 'leaf': {
            const lobes=2+(k%5);ctx.beginPath();ctx.moveTo(-11,9);ctx.quadraticCurveTo(-10,-10-k%3,10,-11);ctx.quadraticCurveTo(11,9,-11,9);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-8,7);ctx.lineTo(8,-8);ctx.stroke();for(let i=0;i<lobes;i++){const q=-5+i*(10/Math.max(1,lobes-1));ctx.beginPath();ctx.moveTo(q,2-q*.4);ctx.lineTo(q-(3+k%2),-2-q*.4);ctx.stroke();}break;
          }
          case 'boot': {
            const tall=9+(k%5);ctx.beginPath();ctx.moveTo(-7,-tall);ctx.lineTo(3,-tall);ctx.lineTo(3,3);ctx.quadraticCurveTo(7,7,12,7);ctx.lineTo(12,11);ctx.lineTo(-7,11);ctx.closePath();ctx.stroke();for(let i=0;i<2+(k%3);i++){ctx.beginPath();ctx.moveTo(-6,-5+i*4);ctx.lineTo(2,-5+i*4);ctx.stroke();}break;
          }
          case 'key': {
            const teeth=2+(k%4);ctx.beginPath();ctx.arc(-6,-5,5+(k%2),0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-2,-1);ctx.lineTo(11,12);ctx.stroke();for(let i=0;i<teeth;i++){const q=3+i*4;ctx.beginPath();ctx.moveTo(q,q-1);ctx.lineTo(q+4,q-5);ctx.stroke();}break;
          }
          case 'mask': {
            ctx.beginPath();ctx.moveTo(-10,-10);ctx.quadraticCurveTo(0,-14-k%3,10,-10);ctx.lineTo(8,7);ctx.quadraticCurveTo(0,13+k%2,-8,7);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-7,-2);ctx.quadraticCurveTo(-4,-6,-1,-2);ctx.quadraticCurveTo(-4,1,-7,-2);ctx.moveTo(1,-2);ctx.quadraticCurveTo(4,-6,7,-2);ctx.quadraticCurveTo(4,1,1,-2);ctx.stroke();if(k%2){ctx.beginPath();ctx.moveTo(0,2);ctx.lineTo(0,9);ctx.stroke();}break;
          }
          case 'halo': {
            const rings=1+(k%3);for(let i=0;i<rings;i++){ctx.beginPath();ctx.ellipse(0,-5-i*4,11-i*2,4-i*.5,wob,0,Math.PI*2);ctx.stroke();}for(let i=0;i<2+(k%5);i++){const a=t*.001+i*Math.PI*2/(2+k%5);ctx.beginPath();ctx.arc(Math.cos(a)*11,-5+Math.sin(a)*4,1.5,0,Math.PI*2);ctx.fill();}break;
          }
          case 'shell': {
            const ribs=4+(k%5);ctx.beginPath();ctx.moveTo(-11,8);ctx.quadraticCurveTo(-10,-11,0,-12);ctx.quadraticCurveTo(10,-11,11,8);ctx.closePath();ctx.stroke();for(let i=0;i<ribs;i++){const x=-8+i*(16/Math.max(1,ribs-1));ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(x,8);ctx.stroke();}break;
          }
          case 'heart': {
            const split=k%3;ctx.beginPath();ctx.moveTo(0,11);ctx.bezierCurveTo(-13,3,-12,-9,-5,-10);ctx.bezierCurveTo(-1,-11,0,-6,0,-6);ctx.bezierCurveTo(0,-6,1,-11,5,-10);ctx.bezierCurveTo(12,-9,13,3,0,11);ctx.closePath();ctx.stroke();if(split){ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(-2,0);ctx.lineTo(2,3);ctx.lineTo(-1,9);ctx.stroke();}break;
          }
          case 'relic': {
            const sides=4+(k%7), r=10+(k%2);ctx.beginPath();for(let i=0;i<sides;i++){const a=-Math.PI/2+i*Math.PI*2/sides;const rr=i%2?r:r-(k%4);i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.stroke();const dots=1+(k%5);for(let i=0;i<dots;i++){const a=i*Math.PI*2/dots+t*.0005;ctx.beginPath();ctx.arc(Math.cos(a)*5,Math.sin(a)*5,1.5+(i%2),0,Math.PI*2);ctx.fill();}break;
          }
          default: {
            // Unknown/future items still get a topology encoded by the full ID.
            const vertices=5+(h%7), r1=7+((h>>>5)%5), r2=3+((h>>>9)%4);ctx.beginPath();for(let i=0;i<vertices*2;i++){const a=-Math.PI/2+i*Math.PI/vertices,r=i%2?r2:r1;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.stroke();const arms=1+((h>>>13)%5);for(let i=0;i<arms;i++){const a=(i/arms)*Math.PI*2+.4;ctx.beginPath();ctx.moveTo(Math.cos(a)*3,Math.sin(a)*3);ctx.lineTo(Math.cos(a)*(12+i),Math.sin(a)*(12+i));ctx.stroke();}break;
          }
        }
      }

      // This declaration replaces the earlier generic slot-shape fallback because
      // function declarations are resolved to the final definition in this scope.
      drawEquippedCosmetics=function drawEquippedCosmeticsPerItem(){
        const equipped=player.equippedEquipment||[];
        if(!equipped.length)return;
        const t=Date.now();
        const counts={};
        for(const id of equipped){
          const def=getEquipmentDef(id);if(!def)continue;
          const slot=def.slot||'orbit';const stack=counts[slot]||0;counts[slot]=stack+1;
          const p=wearablePlacement(def,stack,t);
          ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r||0);ctx.scale(p.s,p.s);
          drawUniqueWearable(def,t);
          ctx.restore();
        }
      };

      // Independent boss-kill tables: guarantee the boss-specific reward path is
      // evaluated separately from hidden ending-item rolls.
      const bossRewardFnBeforeFinal=awardBossReward;
      awardBossReward=function awardBossRewardFinalIndependent(kind){
        bossRewardFnBeforeFinal(kind);
        const maps=[
          typeof ENDGAME_BOSS_REWARD_MAP_V27!=='undefined'?ENDGAME_BOSS_REWARD_MAP_V27:null,
          typeof TRUE_V30_BOSS_REWARD_MAP!=='undefined'?TRUE_V30_BOSS_REWARD_MAP:null,
          typeof V31_BOSS_REWARD_MAP!=='undefined'?V31_BOSS_REWARD_MAP:null,
          typeof V32_BOSS_REWARD_MAP!=='undefined'?V32_BOSS_REWARD_MAP:null
        ].filter(Boolean);
        for(const map of maps){
          const reward=map[kind];
          if(reward&&reward.equipment&&!(player.collectedEquipment||[]).includes(reward.equipment)){
            collectEquipmentItem(reward.equipment,'boss');
          }
        }
      };
      rollHiddenEchoDrop=function rollHiddenEchoDropFinalIndependent(){
        player.collectedEquipment=player.collectedEquipment||[];
        for(const id of HIDDEN_ECHO_IDS){
          if(!player.collectedEquipment.includes(id)&&Math.random()<0.05){
            collectEquipmentItem(id,'boss');
          }
        }
      };
    })();



        // ── Boss arena containment ────────────────────────────────────────
        // While a boss is alive, both combatants are locked inside the arena
        // that was visible when the fight began. This prevents the player from
        // crossing a realm boundary mid-fight and prevents mobile/charging
        // bosses from escaping the fight area. The bounds live on `boss`, so
        // saving and loading during an active fight preserves the same arena.
        (function installBossArenaContainment(){
            const startBossBeforeArenaContainment = startBoss;
            const loadGameBeforeArenaContainment = loadGame;
            const resetGameBeforeArenaContainment = resetGame;
            const updateBeforeArenaContainment = update;

            function clampValue(v, lo, hi) {
                if (!Number.isFinite(v)) return lo;
                return Math.max(lo, Math.min(hi, v));
            }

            function createArenaBounds(force = false) {
                if (!boss.active) return;
                if (!force && boss.arenaLocked && Number.isFinite(boss.arenaLeft) && Number.isFinite(boss.arenaRight)) return;

                const W = Math.max(480, canvas.width || window.innerWidth || 960);
                const H = Math.max(360, canvas.height || window.innerHeight || 640);
                const viewLeft = Number.isFinite(worldX) ? worldX : (player.worldX - W / 2);
                const sidePad = 30;

                boss.arenaLocked = true;
                boss.arenaLeft = viewLeft + sidePad;
                boss.arenaRight = viewLeft + W - sidePad;
                boss.arenaTop = 18;
                boss.arenaBottom = H - 42;

                // Start every boss physically inside the sealed arena rather
                // than allowing its original right-edge spawn to sit outside it.
                const bossHalfW = Math.max(12, (boss.width || 40) / 2);
                boss.x = clampValue(boss.x, boss.arenaLeft + bossHalfW, boss.arenaRight - bossHalfW);
                boss.y = clampValue(boss.y, boss.arenaTop, Math.max(boss.arenaTop, boss.arenaBottom - (boss.height || 100)));

                const playerHalfW = Math.max(8, (player.width || 40) / 2);
                player.worldX = clampValue(player.worldX, boss.arenaLeft + playerHalfW, boss.arenaRight - playerHalfW);
                player.lastSafeX = clampValue(player.lastSafeX, boss.arenaLeft + playerHalfW, boss.arenaRight - playerHalfW);
            }

            function releaseArenaBounds() {
                boss.arenaLocked = false;
                delete boss.arenaLeft;
                delete boss.arenaRight;
                delete boss.arenaTop;
                delete boss.arenaBottom;
            }

            function containActiveBossFight() {
                if (!boss.active) {
                    if (boss.arenaLocked) releaseArenaBounds();
                    return;
                }

                createArenaBounds(false);

                const playerHalfW = Math.max(8, (player.width || 40) / 2);
                const minPlayerX = boss.arenaLeft + playerHalfW;
                const maxPlayerX = boss.arenaRight - playerHalfW;
                if (player.worldX < minPlayerX) {
                    player.worldX = minPlayerX;
                    if (player.vx < 0) player.vx = 0;
                } else if (player.worldX > maxPlayerX) {
                    player.worldX = maxPlayerX;
                    if (player.vx > 0) player.vx = 0;
                }
                // Never let a fall/respawn anchor place the player beyond a seal.
                player.lastSafeX = clampValue(player.lastSafeX, minPlayerX, maxPlayerX);

                const bossHalfW = Math.max(12, (boss.width || 40) / 2);
                const minBossX = boss.arenaLeft + bossHalfW;
                const maxBossX = boss.arenaRight - bossHalfW;
                const minBossY = boss.arenaTop;
                const maxBossY = Math.max(minBossY, boss.arenaBottom - (boss.height || 100));

                let hitLeft = false;
                let hitRight = false;
                if (boss.x < minBossX) {
                    boss.x = minBossX;
                    hitLeft = true;
                } else if (boss.x > maxBossX) {
                    boss.x = maxBossX;
                    hitRight = true;
                }
                boss.y = clampValue(boss.y, minBossY, maxBossY);

                // The original charge logic expected to travel beyond the
                // camera before changing state. With a sealed arena, hitting
                // the wall is the equivalent endpoint instead.
                if (hitLeft && boss.state === 'charge') {
                    boss.state = 'return';
                    boss.timer = 0;
                } else if (hitRight && boss.state === 'return') {
                    boss.state = 'hover';
                    boss.timer = 0;
                }
            }

            startBoss = function startBossWithSealedArena(kind) {
                startBossBeforeArenaContainment(kind);
                createArenaBounds(true);
                containActiveBossFight();
            };

            loadGame = function loadGameWithBossArenaContainment(slot) {
                loadGameBeforeArenaContainment(slot);
                if (boss.active) {
                    // New saves retain exact bounds. Older saves safely rebuild
                    // the arena around the loaded fight once.
                    createArenaBounds(!(boss.arenaLocked && Number.isFinite(boss.arenaLeft) && Number.isFinite(boss.arenaRight)));
                    containActiveBossFight();
                } else {
                    releaseArenaBounds();
                }
            };

            resetGame = function resetGameWithReleasedBossArena() {
                resetGameBeforeArenaContainment();
                releaseArenaBounds();
            };

            update = function updateWithBossArenaContainment() {
                updateBeforeArenaContainment();
                containActiveBossFight();
            };
        })();


        // ── Progressed-save stale equipment state + hard boss gate fix ─────
        // Older/progressed saves can contain boolean/timer fields from equipment
        // that is no longer equipped. Some expansion mechanics read those fields
        // directly, so merely removing the item from equippedEquipment was not
        // enough. Always clear transient equipment state BEFORE rebuilding the
        // active build from equippedEquipment.
        (function installProgressedSaveStateAndHardBossGateFix(){
            const recalcBeforeStaleStateFix = recalculateEquipmentEffects;
            recalculateEquipmentEffects = function recalculateEquipmentEffectsNoStaleState(){
                const eq = new Set(player.equippedEquipment || []);

                // Expansion item identity flags which older recalculators did not
                // reliably clear. The normal recalc chain will turn back on only
                // the ones that are genuinely equipped.
                const staleFlags = [
                    'spoolShield','thimbleCap','gildedNeedle','mercuryThread',
                    'serratedBlade','glassPendant','echoCrest','vampiricEye',
                    'heavyWeightAnchor','prismaticWeaver','shearGauntlets','warpSpool',
                    'leviathanCarapace','monarchCloak','infinityThread','wizardHat',
                    'v32_eclipseCrown','v32_doubleScore','v32_bossDamageReduction'
                ];
                for (const flag of staleFlags) player[flag] = false;

                // Clear transient mechanics when their source item is not active.
                if (!eq.has('warpSpool')) player.warpPhaseTimer = 0;
                if (!eq.has('monarchCloak')) player.monarchAfterimages = [];
                if (!eq.has('echoCrest')) player.echoSlashQueue = [];
                if (!eq.has('serratedBlade')) player.bleedTargets = {};
                if (!eq.has('glassPendant')) player.glassPendantReady = false;
                if (!eq.has('gildedNeedle')) player.gildedNeedleHits = 0;
                if (!eq.has('vampiricEye')) player.vampiricKillCharge = 0;
                if (!eq.has('prismaticWeaver')) { player.prismaticIndex = 0; player.prismaticTimer = 0; }
                if (!eq.has('infinityThread')) player.infinityKillCount = 0;
                if (!eq.has('thimbleCap')) {
                    player.thimbleCapCooldownReduction = 0;
                    player.thimbleCapRespawnBonus = 0;
                }

                const result = recalcBeforeStaleStateFix.apply(this, arguments);

                // Safety pass: an unequipped expansion identity may never remain
                // true after a rebuild, even if it was stored as true in a save.
                for (const flag of staleFlags) {
                    if (!eq.has(flag)) player[flag] = false;
                }
                return result;
            };

            // Immediately sanitize any save that is already loaded.
            try { recalculateEquipmentEffects(); } catch (e) { console.error('Equipment stale-state cleanup failed', e); }

            // Strengthen the existing boss arena lock. The previous lock used the
            // whole camera viewport, which still left roughly half a screen behind
            // the point where the fight began. That allowed the player (and some
            // mobile bosses) to backtrack out of the actual encounter space.
            const startBossBeforeHardGate = startBoss;
            const loadGameBeforeHardGate = loadGame;
            const updateBeforeHardGate = update;

            function establishHardBossGate(force){
                if (!boss.active) return;
                const W = Math.max(480, canvas.width || window.innerWidth || 960);
                const H = Math.max(360, canvas.height || window.innerHeight || 640);

                if (force || !Number.isFinite(boss.arenaEntryX)) {
                    // The exact point the player entered the boss encounter is the
                    // backtracking gate. A tiny allowance avoids trapping the
                    // player's centre on the seam while still preventing retreat.
                    boss.arenaEntryX = Number.isFinite(player.worldX) ? player.worldX : 0;
                }

                const playerHalf = Math.max(8, (player.width || 40) / 2);
                const left = boss.arenaEntryX - 12;
                const right = Math.max(left + 420, boss.arenaEntryX + W - 50);

                boss.arenaLocked = true;
                boss.arenaLeft = left;
                boss.arenaRight = right;
                boss.arenaTop = 18;
                boss.arenaBottom = H - 42;

                // Player worldX is its centre.
                const minPX = left + playerHalf;
                const maxPX = right - playerHalf;
                if (player.worldX < minPX) { player.worldX = minPX; if (player.vx < 0) player.vx = 0; }
                if (player.worldX > maxPX) { player.worldX = maxPX; if (player.vx > 0) player.vx = 0; }
                player.lastSafeX = Math.max(minPX, Math.min(maxPX, Number.isFinite(player.lastSafeX) ? player.lastSafeX : player.worldX));

                // boss.x is its LEFT edge, not its centre.
                const bw = Math.max(24, boss.width || 40);
                const minBX = left;
                const maxBX = Math.max(minBX, right - bw);
                let hitLeft = false, hitRight = false;
                if (boss.x < minBX) { boss.x = minBX; hitLeft = true; }
                if (boss.x > maxBX) { boss.x = maxBX; hitRight = true; }
                const maxBY = Math.max(boss.arenaTop, boss.arenaBottom - (boss.height || 100));
                boss.y = Math.max(boss.arenaTop, Math.min(maxBY, Number.isFinite(boss.y) ? boss.y : boss.arenaTop));

                if (hitLeft && boss.state === 'charge') { boss.state = 'return'; boss.timer = 0; }
                if (hitRight && boss.state === 'return') { boss.state = 'hover'; boss.timer = 0; }
            }

            startBoss = function startBossWithHardBacktrackGate(kind){
                startBossBeforeHardGate(kind);
                establishHardBossGate(true);
            };

            loadGame = function loadGameWithHardBacktrackGate(slot){
                loadGameBeforeHardGate(slot);
                if (boss.active) {
                    // Preserve a saved entry point when available. For an older
                    // active-boss save, the current position becomes the safe gate
                    // rather than reopening the old half-screen escape route.
                    establishHardBossGate(!Number.isFinite(boss.arenaEntryX));
                }
            };

            update = function updateWithHardBacktrackGate(){
                updateBeforeHardGate();
                if (boss.active) establishHardBossGate(false);
            };
        })();


        // =====================================================================
        // FINAL TRANSIENT ENTITY ACTIVE-ZONE CULLING
        // =====================================================================
        (function installAggressiveTransientCulling(){
            'use strict';
            const updateBeforeTransientCulling = update;

            function cullTransientEntitiesBeforeAI(){
                const W = Math.max(480, canvas.width || window.innerWidth || 960);
                const H = Math.max(360, canvas.height || window.innerHeight || 640);
                const camLeft = Number.isFinite(worldX) ? worldX : (player.worldX - W / 2);

                // IMPORTANT: never delete something merely because it is AHEAD
                // of the camera. Procedural generation intentionally creates enemies
                // and pickups before the player can see them. Only retire an entity
                // after the player has travelled well past it. Platforms are never
                // touched, preserving full backtracking.
                const retireBehindX = camLeft - 1250;

                // Historical enemies and pickups remain stored for backtracking.
                // Health drops follow the same one-way retirement rule. A heal that
                // spawned ahead of the player survives until reached or passed.
                // Historical enemies and pickups remain stored for backtracking.
                // Particles use screen-space coordinates. Remove offscreen entries
                // immediately and enforce a hard ceiling so effects can never
                // snowball into thousands of draw/update operations.
                for (let i = particles.length - 1; i >= 0; i--) {
                    const q = particles[i];
                    if (!q || q.alpha <= 0 || q.x < -180 || q.x > W + 180 || q.y < -180 || q.y > H + 180) particles.splice(i, 1);
                }
                if (particles.length > 160) particles.splice(0, particles.length - 160);

                // Boss attacks should never leak into normal traversal, and even
                // during intentionally projectile-heavy fights there is a finite
                // safety ceiling.
                if (!boss.active && bossAttacks.length) bossAttacks.length = 0;
                else if (bossAttacks.length > 140) bossAttacks.splice(0, bossAttacks.length - 140);

                // Tiny delayed combat structures should also never retain stale
                // references after their source enemies have gone away.
                if (Array.isArray(player.echoSlashQueue) && player.echoSlashQueue.length > 40) {
                    player.echoSlashQueue.splice(0, player.echoSlashQueue.length - 40);
                }
                if (player.bleedTargets && typeof player.bleedTargets.size === 'number' && player.bleedTargets.size > 80) {
                    const alive = new Set();
                    for (const e of enemies) if (e && e._bleedId !== undefined) alive.add(e._bleedId);
                    for (const id of player.bleedTargets.keys()) if (!alive.has(id)) player.bleedTargets.delete(id);
                }
            }

            update = function updateWithAggressiveTransientCulling(){
                cullTransientEntitiesBeforeAI();
                // Boss projectiles far outside the active camera can never affect play.
                // Removing only those stale/offscreen attacks prevents long fights from
                // accumulating invisible simulation work without reducing visible attacks.
                if (boss.active && bossAttacks.length) {
                    const W=Math.max(480,canvas.width||window.innerWidth||960),H=Math.max(360,canvas.height||window.innerHeight||640);
                    for(let i=bossAttacks.length-1;i>=0;i--){
                        const a=bossAttacks[i]; if(!a) { bossAttacks.splice(i,1); continue; }
                        const ax=Number.isFinite(a.x)?a.x:(Number.isFinite(a.wx)?a.wx-worldX:0), ay=Number.isFinite(a.y)?a.y:0;
                        if(ax < -900 || ax > W+900 || ay < -900 || ay > H+900) bossAttacks.splice(i,1);
                    }
                }
                updateBeforeTransientCulling();
            };
        })();
