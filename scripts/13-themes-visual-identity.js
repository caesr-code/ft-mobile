/* Faded Thread module: 13-themes-visual-identity.js | build 03 Oct 2026 */
// Bundled soundtrack and sound-effects system.
    const FT_THEME_LIBRARY = {"ashlibrary": "themes/Ash Library.mp3", "aurorabridge": "themes/Aurora Bridge.mp3", "blackglasssea": "themes/Blackglass Sea.mp3", "bloodmooncathedral": "themes/Blood Moon Cathedral.mp3", "boneobservatory": "themes/Bone Observatory.mp3", "buriedcarnival": "themes/Buried Carnival.mp3", "celestialloom": "themes/Celestial Loom.mp3", "cinderveil": "themes/Cinder Veil.mp3", "clockworkabyss": "themes/Clockwork Abyss.mp3", "coppercanopy": "themes/Copper Canopy.mp3", "corrodedsunvault": "themes/Corroded Sun Vault.mp3", "cosmicdesolation": "themes/Cosmic Desolation.mp3", "crimsonmourning": "themes/Crimson Mourning.mp3", "drownedstar": "themes/Drowned Star.mp3", "duskaqueduct": "themes/Dusk Aqueduct.mp3", "echoforge": "themes/Echo Forge.mp3", "echoinghollow": "themes/Echoing Hollow.mp3", "eclipsethrone": "themes/Eclipse Throne.mp3", "emberchoir": "themes/Ember Choir.mp3", "endlessocean": "themes/Endless Ocean.mp3", "fadedsadness": "themes/Faded Sadness.mp3", "forgottenmeadow": "themes/Forgotten Meadow.mp3", "fracturedeternity": "themes/Fractured Eternity.mp3", "frayeddepths": "themes/Frayed Depths.mp3", "frostedtheatre": "themes/Frosted Theatre.mp3", "gildedswamp": "themes/Gilded Swamp.mp3", "glasscitadel": "themes/Glass Citadel.mp3", "glasssanctum": "themes/Glass Sanctum.mp3", "hollowloom": "themes/Hollow Loom.mp3", "infinityloom": "themes/Infinity Loom.mp3", "ivoryfoundry": "themes/Ivory Foundry.mp3", "lanternbog": "themes/Lantern Bog.mp3", "leviathantrench": "themes/Leviathan Trench.mp3", "loomcitadel": "themes/Loom Citadel.mp3", "machineloom": "themes/Machine Loom.mp3", "marrowlabyrinth": "themes/Marrow Labyrinth.mp3", "mirrorrain": "themes/Mirror Rain.mp3", "monarchspire": "themes/Monarch Spire.mp3", "mothcatacombs": "themes/Moth Catacombs.mp3", "needleseye": "themes/Needle's Eye.mp3", "neonorchard": "themes/Neon Orchard.mp3", "nightmaregarden": "themes/Nightmare Garden.mp3", "opalarchive": "themes/Opal Archive.mp3", "overseerarchive": "themes/Overseer Archive.mp3", "papermoonrealm": "themes/Paper Moon (realm).mp3", "prismcourt": "themes/Prism Court.mp3", "prismregent": "themes/Prism Regent.mp3", "rustednursery": "themes/Rusted Nursery.mp3", "sapphirerift": "themes/Sapphire Rift.mp3", "scarletharbor": "themes/Scarlet Harbor.mp3", "shadowbazaar": "themes/Shadow Bazaar.mp3", "shatteredmirrorwastes": "themes/Shattered Mirror Wastes.mp3", "silkgraveyard": "themes/Silk Graveyard.mp3", "silverthreadfields": "themes/Silver Thread Fields.mp3", "starlitreliquary": "themes/Starlit Reliquary.mp3", "staticvineyard": "themes/Static Vineyard.mp3", "theashseraph": "themes/The Ash Seraph.mp3", "theauroraknight": "themes/The Aurora Knight.mp3", "theboneastronomer": "themes/The Bone Astronomer.mp3", "theburiedringmaster": "themes/The Buried Ringmaster.mp3", "theclockabyss": "themes/The Clock Abyss.mp3", "thecoppergardener": "themes/The Copper Gardener.mp3", "thecorrodedsoveraign": "themes/The Corroded Sovereign.mp3", "thecrimsonarchbishop": "themes/The Crimson Archbishop.mp3", "theduskengineer": "themes/The Dusk Engineer.mp3", "theeclipsesoveraign": "themes/The Eclipse Soveraign.mp3", "theembercantor": "themes/The Ember Cantor.mp3", "thefinalthread": "themes/The Final Thread.mp3", "thefinalweaver": "themes/The Final Weaver.mp3", "thefirststitch": "themes/The First Stitch.mp3", "thefrayedleviathan": "themes/The Frayed Leviathan.mp3", "thegearsaint": "themes/The Gear Saint.mp3", "thehollowcrown": "themes/The Hollow Crown.mp3", "theivoryfurnace": "themes/The Ivory Furnace.mp3", "thelanternmaw": "themes/The Lantern Maw.mp3", "theloomoverseer": "themes/The Loom Overseer.mp3", "themarrowqueen": "themes/The Marrow Queen.mp3", "themirrortyrant": "themes/The Mirror Tyrant.mp3", "themirrorwidow": "themes/The Mirror Widow.mp3", "themothabbot": "themes/The Moth Abbot.mp3", "theneonwarden": "themes/The Neon Warden.mp3", "theopallibrarian": "themes/The Opal Librarian.mp3", "thepapermoonboss": "themes/The Paper Moon (boss).mp3", "therustednanny": "themes/The Rusted Nanny.mp3", "thesapphiresplit": "themes/The Sapphire Split.mp3", "thescarletadmiral": "themes/The Scarlet Admiral.mp3", "theshadowmerchant": "themes/The Shadow Merchant.mp3", "theshatteredchoir": "themes/The Shattered Choir.mp3", "thesilkjudge": "themes/The Silk Judge.mp3", "thestarlitrelic": "themes/The Starlit Relic.mp3", "thestaticharvest": "themes/The Static Harvest.mp3", "thevelvetsoveraign": "themes/The Velvet Sovereign.mp3", "thevoidthreadgod": "themes/The Void Thread God.mp3", "threadfactory": "themes/Thread Factory.mp3", "threadedsun": "themes/Threaded Sun.mp3", "threadstormspire": "themes/Threadstorm Spire.mp3", "velvetcourt": "themes/Velvet Court.mp3", "velvetmeteor": "themes/Velvet Meteor.mp3", "voidthreadabyss": "themes/Void Thread Abyss.mp3", "weaverking": "themes/Weaver King.mp3"};
    const ftSfx = {
        pickup: new Audio('sfx/heal.mp3'),
        flap: new Audio('sfx/flap.mp3'),
        hurt: new Audio('sfx/hurt.mp3'),
        attack: new Audio('sfx/Needle_Swing.mp3')
    };
    Object.values(ftSfx).forEach(a => { a.preload = 'auto'; a.volume = 0.72; });
    function ftPlaySfx(key, volume=0.72) {
        const base = ftSfx[key]; if (!base) return;
        const a = base.cloneNode(); a.volume = volume; a.play().catch(()=>{});
    }
    playSlashSound = () => ftPlaySfx('attack', 0.72);
    playPlayerHurtSound = () => ftPlaySfx('hurt', 0.82);
    playPickupChime = () => ftPlaySfx('pickup', 0.70);
    function playFlapSound() { ftPlaySfx('flap', 0.62); }

    const ftThemeAudio = new Audio();
    ftThemeAudio.loop = true;
    ftThemeAudio.preload = 'auto';
    ftThemeAudio.volume = 0.38;
    let ftThemeKey = '';
    function ftNormThemeName(s) {
        return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
          .replace(/sovereign/g,'soveraign').replace(/[^a-z0-9]+/g,'');
    }
    const FT_THEME_ALIASES = {
        forgottenmeadow:'forgottenmeadow', hollowloom:'hollowloom', theneedleseye:'needleseye',
        thornmother:'nightmaregarden', shatteredchoir:'theshatteredchoir',
        eclipsesoveraign:'theeclipsesoveraign', rustednanny:'therustednanny',
        firststitch:'thefirststitch', gearsaint:'thegearsaint', weaverking:'weaverking',
        drownedstar:'drownedstar', prismregent:'prismregent', clockabyss:'theclockabyss',
        crimsonarchbishop:'thecrimsonarchbishop', shadowmerchant:'theshadowmerchant',
        auroraknight:'theauroraknight', marrowqueen:'themarrowqueen', starlitrelic:'thestarlitrelic'
    };
    // Explicit overrides are evaluated before fuzzy matching. This prevents
    // similarly named realm/boss tracks (notably Paper Moon) from selecting
    // the wrong file, and gives soundtrack-less legacy realms a deliberate
    // fallback instead of silence.
    const FT_BOSS_THEME_OVERRIDES = {
        paperMoonBoss:'thepapermoonboss',
        silverShears:'silverthreadfields',
        thornMother:'nightmaregarden'
    };
    const FT_REALM_THEME_OVERRIDES = {
        corruptedHeaven:'celestialloom',
        crystalWastes:'sapphirerift'
    };
    function ftResolveTheme() {
        if (boss && boss.active) {
            const bossKey = FT_BOSS_THEME_OVERRIDES[boss.kind];
            if (bossKey && FT_THEME_LIBRARY[bossKey]) return FT_THEME_LIBRARY[bossKey];
        } else {
            const realmKey = FT_REALM_THEME_OVERRIDES[currentRealm];
            if (realmKey && FT_THEME_LIBRARY[realmKey]) return FT_THEME_LIBRARY[realmKey];
        }
        const displayName = boss && boss.active ? (boss.name || realmData().name) : realmData().name;
        const normalised = ftNormThemeName(displayName);
        const key = normalised.replace(/^the/,'');
        const candidates = [normalised, key, FT_THEME_ALIASES[key], FT_THEME_ALIASES[normalised]];
        for (const c of candidates) if (c && FT_THEME_LIBRARY[c]) return FT_THEME_LIBRARY[c];
        const all = Object.keys(FT_THEME_LIBRARY);
        let best = all.find(k => k.includes(key) || key.includes(k));
        if (!best && currentRealm) best = all.find(k => k.includes(ftNormThemeName(currentRealm)));
        return best ? FT_THEME_LIBRARY[best] : null;
    }
    function ftSyncTheme(force=false) {
        if (typeof onHomeScreen !== 'undefined' && onHomeScreen) {
            ftThemeAudio.pause();
            return;
        }
        const src = ftResolveTheme();
        if (!src || (!force && src === ftThemeKey)) return;
        ftThemeKey = src;
        ftThemeAudio.pause(); ftThemeAudio.src = src; ftThemeAudio.currentTime = 0;
        ftThemeAudio.play().catch(()=>{});
    }
    // Disable the former sequenced background score while retaining other gameplay audio helpers.
    startBgTheme = () => {}; stopBgTheme = () => {}; setBgThemeIntensified = () => {};
    ['pointerdown','keydown','touchstart'].forEach(ev => addEventListener(ev, () => ftSyncTheme(true), {once:true, passive:true}));
    setInterval(() => ftSyncTheme(), 300);


    // Selective visual pass: preserve authored early-game art and only enhance later repeated assets.
    const ftAuthoredBackground = drawRealmBackground;
    const FT_REALMS_TO_REBUILD = new Set([
      'rustedNursery','paperMoon','lanternBog','sapphireRift','copperCanopy','buriedCarnival',
      'mirrorRain','ivoryFoundry','mothCatacombs','emberChoir','opalArchive','scarletHarbor',
      'duskAqueduct','boneObservatory','staticVineyard','frostedTheatre','gildedSwamp','velvetMeteor',
      'blackglassSea','threadedSun','mirrorWastes','corrodedSunVault','voidThreadAbyss','eclipseThrone'
    ]);
    function ftHash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
    drawRealmBackground = function(W,H,t){
      ftAuthoredBackground(W,H,t);
      if(!FT_REALMS_TO_REBUILD.has(currentRealm) || currentRealm==='space') return;
      const name=(realmData().name||currentRealm), h=ftHash(name), phase=t*.001;
      ctx.save(); ctx.globalCompositeOperation='screen';
      // Named, recognisable animated silhouettes rather than a universal star/string overlay.
      const motifs={
        rustedNursery:'cradles',paperMoon:'paper',lanternBog:'lanterns',sapphireRift:'crystals',
        copperCanopy:'leaves',buriedCarnival:'tents',mirrorRain:'mirrors',ivoryFoundry:'furnaces',
        mothCatacombs:'moths',emberChoir:'flames',opalArchive:'books',scarletHarbor:'ships',
        duskAqueduct:'arches',boneObservatory:'bones',staticVineyard:'vines',frostedTheatre:'curtains',
        gildedSwamp:'reeds',velvetMeteor:'meteors',blackglassSea:'waves',threadedSun:'sunthreads',
        mirrorWastes:'mirrors',corrodedSunVault:'gears',voidThreadAbyss:'voidribbons',eclipseThrone:'eclipse'
      };
      const m=motifs[currentRealm]||'shapes';
      for(let i=0;i<14;i++){
        const baseX=ftScatter01(h,i,0)*(W+220)-110;
        const baseY=ftScatter01(h,i,1)*H;
        const x=((baseX-worldX*.04+110)%(W+220)+W+220)%(W+220)-110;
        const y=(baseY+Math.sin(phase*(0.85+ftScatter01(h,i,2)*.75)+ftScatter01(h,i,3)*Math.PI*2)*38+H)%H;
        ctx.strokeStyle=`hsla(${h%360},85%,70%,${.11+(i%3)*.025})`;ctx.fillStyle=`hsla(${(h+65)%360},80%,55%,.055)`;ctx.lineWidth=2;
        ctx.beginPath();
        if(m==='cradles'){ctx.moveTo(x-25,y-18);ctx.quadraticCurveTo(x,y+28,x+25,y-18);ctx.moveTo(x-30,y+18);ctx.quadraticCurveTo(x,y+34,x+30,y+18)}
        else if(m==='paper'){ctx.moveTo(x-28,y-22);ctx.lineTo(x+28,y-8);ctx.lineTo(x+5,y+28);ctx.closePath()}
        else if(m==='lanterns'){ctx.ellipse(x,y,16,25,0,0,Math.PI*2);ctx.moveTo(x-10,y);ctx.lineTo(x+10,y)}
        else if(m==='crystals'||m==='mirrors'){ctx.moveTo(x,y-35);ctx.lineTo(x+20,y);ctx.lineTo(x,y+35);ctx.lineTo(x-20,y);ctx.closePath()}
        else if(m==='leaves'){ctx.ellipse(x,y,30,12,phase*.2+i,0,Math.PI*2)}
        else if(m==='tents'){ctx.moveTo(x-35,y+25);ctx.lineTo(x,y-35);ctx.lineTo(x+35,y+25);ctx.closePath()}
        else if(m==='furnaces'||m==='gears'){ctx.arc(x,y,18,0,Math.PI*2);for(let k=0;k<8;k++){let a=k*Math.PI/4+phase*.15;ctx.moveTo(x+Math.cos(a)*18,y+Math.sin(a)*18);ctx.lineTo(x+Math.cos(a)*27,y+Math.sin(a)*27)}}
        else if(m==='moths'){ctx.moveTo(x,y);ctx.quadraticCurveTo(x-32,y-27,x-38,y+10);ctx.quadraticCurveTo(x-15,y+5,x,y);ctx.quadraticCurveTo(x+32,y-27,x+38,y+10);ctx.quadraticCurveTo(x+15,y+5,x,y)}
        else if(m==='flames'||m==='meteors'){ctx.moveTo(x,y-30);ctx.bezierCurveTo(x+25,y-5,x+15,y+25,x,y+30);ctx.bezierCurveTo(x-20,y+12,x-15,y-8,x,y-30)}
        else if(m==='books'){ctx.rect(x-25,y-18,50,36);ctx.moveTo(x,y-18);ctx.lineTo(x,y+18)}
        else if(m==='ships'){ctx.moveTo(x-38,y+15);ctx.lineTo(x+34,y+15);ctx.lineTo(x+20,y+28);ctx.lineTo(x-24,y+28);ctx.closePath();ctx.moveTo(x,y+15);ctx.lineTo(x,y-30);ctx.lineTo(x+26,y-5);ctx.closePath()}
        else if(m==='arches'){ctx.arc(x,y+20,28,Math.PI,0);ctx.lineTo(x+28,y+35);ctx.moveTo(x-28,y+20);ctx.lineTo(x-28,y+35)}
        else if(m==='bones'){ctx.moveTo(x-28,y-22);ctx.lineTo(x+28,y+22);ctx.moveTo(x+28,y-22);ctx.lineTo(x-28,y+22);for(const q of [[-28,-22],[28,22],[28,-22],[-28,22]])ctx.arc(x+q[0],y+q[1],5,0,Math.PI*2)}
        else if(m==='vines'||m==='reeds'||m==='voidribbons'||m==='sunthreads'){ctx.moveTo(x,y+45);ctx.bezierCurveTo(x-35,y+10,x+35,y-10,x,y-45)}
        else if(m==='curtains'){ctx.moveTo(x-35,y-40);ctx.bezierCurveTo(x-15,y-10,x-15,y+10,x-35,y+40);ctx.moveTo(x+35,y-40);ctx.bezierCurveTo(x+15,y-10,x+15,y+10,x+35,y+40)}
        else if(m==='waves'){ctx.moveTo(x-45,y);ctx.bezierCurveTo(x-25,y-25,x-5,y+25,x+15,y);ctx.bezierCurveTo(x+30,y-18,x+42,y-10,x+48,y)}
        else {ctx.arc(x,y,20,0,Math.PI*2)}
        i%4===0?ctx.fill():ctx.stroke();
      }
      ctx.restore();
    };

    // Keep the authored early enemy drawings, adding motion only where they were static.
    const ftAuthoredEnemy = drawEnemy;
    drawEnemy = function(e,screenX){
      const type=Number(e.type)||0, now=Date.now()*.001, cx=screenX+e.width/2, cy=e.y+e.height/2;
      if(type<59){
        const bob=Math.sin(now*3+(e.floatOffset||type))*2.5;
        const breathe=1+Math.sin(now*4+type)*.025;
        ctx.save();ctx.translate(cx,cy+bob);ctx.scale(breathe,1/breathe);ctx.translate(-cx,-cy);
        ftAuthoredEnemy(e,screenX);ctx.restore();return;
      }
      const defs=Object.assign({},typeof TRUE_V30_ENEMIES!=='undefined'?TRUE_V30_ENEMIES:{},typeof V31_ENEMIES!=='undefined'?V31_ENEMIES:{},typeof V32_ENEMIES!=='undefined'?V32_ENEMIES:{});
      const d=defs[type]||{}, flags=d.behaviorFlags||[], h=ftHash((d.name||'enemy')+type), hue=h%360;
      const bob=Math.sin(now*(2.2+(h%5)*.25)+(e.floatOffset||0))*5;
      ctx.save();ctx.translate(cx,cy+bob);ctx.rotate(Math.sin(now*2+h)*.035);ctx.shadowColor=`hsl(${hue},90%,65%)`;ctx.shadowBlur=18;ctx.lineWidth=2.3;ctx.strokeStyle=`hsl(${hue},85%,72%)`;ctx.fillStyle=`hsla(${hue},45%,14%,.96)`;
      const w=e.width,hg=e.height, flying=flags.some(f=>['flying','floating','sine_wave','phase_drift','homing'].includes(f)), heavy=flags.includes('heavy');
      ctx.beginPath();
      switch(type%10){
        case 0:ctx.ellipse(0,0,w*.38,hg*.46,0,0,Math.PI*2);break;
        case 1:ctx.moveTo(0,-hg*.5);ctx.lineTo(w*.46,hg*.28);ctx.lineTo(0,hg*.5);ctx.lineTo(-w*.46,hg*.28);ctx.closePath();break;
        case 2:for(let k=0;k<12;k++){let a=k*Math.PI/6,r=k%2?w*.27:w*.48;k?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();break;
        case 3:ctx.moveTo(-w*.44,hg*.45);ctx.lineTo(-w*.32,-hg*.25);ctx.quadraticCurveTo(0,-hg*.58,w*.32,-hg*.25);ctx.lineTo(w*.44,hg*.45);ctx.closePath();break;
        case 4:ctx.ellipse(0,0,w*.48,hg*.28,Math.sin(now)*.18,0,Math.PI*2);break;
        case 5:ctx.moveTo(-w*.48,0);ctx.bezierCurveTo(-w*.3,-hg*.6,w*.3,-hg*.6,w*.48,0);ctx.bezierCurveTo(w*.2,hg*.55,-w*.2,hg*.55,-w*.48,0);break;
        case 6:ctx.rect(-w*.4,-hg*.45,w*.8,hg*.9);break;
        case 7:ctx.moveTo(0,-hg*.5);ctx.lineTo(w*.48,-hg*.05);ctx.lineTo(w*.25,hg*.5);ctx.lineTo(-w*.25,hg*.5);ctx.lineTo(-w*.48,-hg*.05);ctx.closePath();break;
        case 8:ctx.arc(0,0,Math.min(w,hg)*.45,0,Math.PI*2);break;
        default:ctx.moveTo(-w*.48,hg*.3);ctx.quadraticCurveTo(0,-hg*.58,w*.48,hg*.3);ctx.lineTo(0,hg*.5);ctx.closePath();
      }
      ctx.fill();ctx.stroke();
      // Type-specific animated anatomy.
      const limbs=2+(type%4);for(let i=0;i<limbs;i++){let side=i%2?-1:1,yy=-hg*.25+i*(hg*.5/Math.max(1,limbs-1));ctx.beginPath();ctx.moveTo(side*w*.28,yy);ctx.quadraticCurveTo(side*w*(.48+.1*Math.sin(now*4+i)),yy+Math.sin(now*5+i)*10,side*w*.65,yy+(i%2?14:-14));ctx.stroke()}
      if(flying){for(let side of [-1,1]){ctx.beginPath();ctx.moveTo(side*w*.15,-hg*.1);ctx.quadraticCurveTo(side*w*(.55+.08*Math.sin(now*6)), -hg*.45,side*w*.6,hg*.05);ctx.quadraticCurveTo(side*w*.35,hg*.15,side*w*.15,-hg*.1);ctx.stroke()}}
      if(heavy){ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-w*.34,hg*.18);ctx.lineTo(w*.34,hg*.18);ctx.stroke();ctx.lineWidth=2.3}
      for(let i=0;i<1+(type%3);i++){let ox=(i-(type%3)/2)*13;ctx.beginPath();ctx.moveTo(ox-6,-hg*.36);ctx.lineTo(ox,-hg*(.55+(i%2)*.08));ctx.lineTo(ox+6,-hg*.36);ctx.stroke()}
      ctx.fillStyle='rgba(255,255,255,.95)';ctx.shadowBlur=8;const eyes=1+(type%3);for(let i=0;i<eyes;i++){let ex=(i-(eyes-1)/2)*11;ctx.beginPath();ctx.ellipse(ex,-hg*.1,3.2,5.5,Math.sin(now*2+i)*.1,0,Math.PI*2);ctx.fill()}
      ctx.restore();
    };


    // Boss arena overhaul: each boss realm gets a unique animated backdrop that
    // reflects the boss's identity, silhouette language and title.
    (function installBossRealmIdentityPass(){
      const BOSS_REALM_SCENES = {
        needle:{top:'#1b0507',mid:'#37080a',bot:'#080103',fog:'rgba(255,90,70,0.10)',motif:'needle',accent:'#ff7358'},
        weaver:{top:'#160e05',mid:'#2f1d08',bot:'#090503',fog:'rgba(255,190,96,0.10)',motif:'weaver',accent:'#ffbe60'},
        gearSaint:{top:'#0b1020',mid:'#172544',bot:'#05070e',fog:'rgba(173,196,255,0.10)',motif:'gearSaint',accent:'#b8c8ff'},
        thornMother:{top:'#051108',mid:'#0c2410',bot:'#030805',fog:'rgba(126,255,136,0.10)',motif:'thornMother',accent:'#8dff81'},
        drownedStar:{top:'#031321',mid:'#06314a',bot:'#01070d',fog:'rgba(116,229,255,0.10)',motif:'drownedStar',accent:'#7de6ff'},
        prismRegent:{top:'#17061c',mid:'#2d0d38',bot:'#09020a',fog:'rgba(255,132,255,0.10)',motif:'prismRegent',accent:'#ff9bff'},
        ashSeraph:{top:'#221108',mid:'#47220d',bot:'#090402',fog:'rgba(255,143,82,0.10)',motif:'ashSeraph',accent:'#ff9d65'},
        silkJudge:{top:'#0b0d1d',mid:'#181f39',bot:'#05060f',fog:'rgba(225,230,255,0.09)',motif:'silkJudge',accent:'#d9ddff'},
        hollowCrown:{top:'#130520',mid:'#25093b',bot:'#05020a',fog:'rgba(188,104,255,0.10)',motif:'hollowCrown',accent:'#bd79ff'},
        neonWarden:{top:'#031814',mid:'#063329',bot:'#010706',fog:'rgba(102,255,217,0.10)',motif:'neonWarden',accent:'#74ffd8'},
        clockAbyss:{top:'#181204',mid:'#322308',bot:'#070401',fog:'rgba(255,205,107,0.10)',motif:'clockAbyss',accent:'#ffcc6f'},
        shatteredChoir:{top:'#081720',mid:'#123140',bot:'#04080d',fog:'rgba(213,251,255,0.09)',motif:'shatteredChoir',accent:'#d8fbff'},
        crimsonArchbishop:{top:'#200306',mid:'#410811',bot:'#090102',fog:'rgba(255,92,114,0.11)',motif:'crimsonArchbishop',accent:'#ff5d74'},
        shadowMerchant:{top:'#0d0718',mid:'#190d2c',bot:'#04020a',fog:'rgba(140,96,255,0.10)',motif:'shadowMerchant',accent:'#9e7aff'},
        auroraKnight:{top:'#021412',mid:'#07302a',bot:'#020707',fog:'rgba(126,255,220,0.10)',motif:'auroraKnight',accent:'#7bffd8'},
        marrowQueen:{top:'#1b1208',mid:'#342112',bot:'#080502',fog:'rgba(255,231,214,0.09)',motif:'marrowQueen',accent:'#ffe3cf'},
        starlitRelic:{top:'#151103',mid:'#292209',bot:'#060501',fog:'rgba(255,245,167,0.10)',motif:'starlitRelic',accent:'#fff5a8'},
        firstStitch:{top:'#090a15',mid:'#161831',bot:'#040408',fog:'rgba(255,255,255,0.10)',motif:'firstStitch',accent:'#f3f4ff'},
        boneAstronomer:{top:'#0d1420',mid:'#16263e',bot:'#04070c',fog:'rgba(216,238,255,0.10)',motif:'boneAstronomer',accent:'#d8eeff'},
        buriedRingmaster:{top:'#261108',mid:'#431d10',bot:'#0a0402',fog:'rgba(255,168,97,0.10)',motif:'buriedRingmaster',accent:'#ffb16b'},
        copperGardener:{top:'#191107',mid:'#352012',bot:'#080402',fog:'rgba(240,180,117,0.10)',motif:'copperGardener',accent:'#eeb27a'},
        corrodedSovereign:{top:'#1a160b',mid:'#3a3216',bot:'#090703',fog:'rgba(175,201,107,0.10)',motif:'corrodedSovereign',accent:'#b4cc73'},
        duskEngineer:{top:'#130b17',mid:'#24112a',bot:'#050208',fog:'rgba(157,124,255,0.10)',motif:'duskEngineer',accent:'#a182ff'},
        eclipseSovereign:{top:'#0c0116',mid:'#17042b',bot:'#040008',fog:'rgba(206,96,255,0.10)',motif:'eclipseSovereign',accent:'#cc68ff'},
        emberCantor:{top:'#220a05',mid:'#3f1208',bot:'#090202',fog:'rgba(255,118,70,0.10)',motif:'emberCantor',accent:'#ff7e59'},
        ivoryFurnace:{top:'#20140b',mid:'#392213',bot:'#090402',fog:'rgba(255,229,205,0.10)',motif:'ivoryFurnace',accent:'#ffe4cc'},
        lanternMaw:{top:'#140f05',mid:'#2a2108',bot:'#070401',fog:'rgba(255,211,102,0.10)',motif:'lanternMaw',accent:'#ffd66c'},
        mirrorTyrant:{top:'#08121a',mid:'#12293a',bot:'#04070c',fog:'rgba(171,228,255,0.10)',motif:'mirrorTyrant',accent:'#abdfff'},
        mirrorWidow:{top:'#14071a',mid:'#250b30',bot:'#050208',fog:'rgba(255,127,227,0.10)',motif:'mirrorWidow',accent:'#ff8ddf'},
        mothAbbot:{top:'#161207',mid:'#2d2510',bot:'#060502',fog:'rgba(255,236,173,0.09)',motif:'mothAbbot',accent:'#ffecad'},
        opalLibrarian:{top:'#08171a',mid:'#113033',bot:'#030709',fog:'rgba(148,255,239,0.09)',motif:'opalLibrarian',accent:'#9efff2'},
        paperMoonBoss:{top:'#0f101c',mid:'#191b33',bot:'#04050a',fog:'rgba(233,236,255,0.10)',motif:'paperMoonBoss',accent:'#e9efff'},
        rustedNanny:{top:'#1a0d07',mid:'#32150d',bot:'#070302',fog:'rgba(255,145,108,0.10)',motif:'rustedNanny',accent:'#ff9b72'},
        sapphireSplit:{top:'#041122',mid:'#072445',bot:'#01050a',fog:'rgba(103,180,255,0.10)',motif:'sapphireSplit',accent:'#74b7ff'},
        scarletAdmiral:{top:'#18060a',mid:'#340b13',bot:'#060104',fog:'rgba(255,90,120,0.10)',motif:'scarletAdmiral',accent:'#ff6988'},
        staticHarvest:{top:'#111111',mid:'#191922',bot:'#07070a',fog:'rgba(208,208,255,0.08)',motif:'staticHarvest',accent:'#c8d0ff'},
        voidThreadGod:{top:'#03050f',mid:'#090f24',bot:'#010206',fog:'rgba(154,112,255,0.12)',motif:'voidThreadGod',accent:'#ad8cff'}
      };

      function ftBossScene(kind){
        return BOSS_REALM_SCENES[kind] || {top:'#100915',mid:'#22102f',bot:'#050208',fog:'rgba(255,255,255,0.08)',motif:'generic',accent:(BOSS_DEFS[kind]&&BOSS_DEFS[kind].color)||'#ffffff'};
      }
      function ftColorAlpha(hex,a){
        const rgb = hexToRgb(hex || '#ffffff');
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
      }
      function ftSpikeLine(x,y,w,h,count,dir){
        ctx.beginPath();
        for(let i=0;i<=count;i++){
          const px=x+i*(w/count);
          const py=y+(i%2===0?0:h*dir);
          if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.stroke();
      }
      function ftWindowArch(x,y,w,h,fill,stroke){
        ctx.fillStyle=fill; ctx.strokeStyle=stroke; ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(x,y+h); ctx.lineTo(x,y+h*0.45);
        ctx.quadraticCurveTo(x+w*0.5,y-h*0.35,x+w,y+h*0.45);
        ctx.lineTo(x+w,y+h); ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
      drawBossArenaBackground = function drawBossArenaIdentityBackground(W,H,t,realmId){
        const kind = (boss && boss.kind) || '';
        const s = ftBossScene(kind);
        const accent = s.accent || '#ffffff';
        const horizon = H*0.62;
        const time = t*0.001;

        ctx.save();
        const bg=ctx.createLinearGradient(0,0,0,H);
        bg.addColorStop(0,s.top); bg.addColorStop(0.58,s.mid); bg.addColorStop(1,s.bot);
        ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

        // Atmospheric haze.
        for(let i=0;i<4;i++){
          const gx=(W*0.18)+(i*W*0.22)+(Math.sin(time*0.35+i)*30)-((worldX*0.03*i)%80);
          const gy=H*(0.18+0.12*(i%2));
          const grad=ctx.createRadialGradient(gx,gy,5,gx,gy,150+i*35);
          grad.addColorStop(0,ftColorAlpha(accent,0.14-i*0.015));
          grad.addColorStop(1,'rgba(0,0,0,0)');
          ctx.fillStyle=grad;
          ctx.beginPath(); ctx.arc(gx,gy,180+i*20,0,Math.PI*2); ctx.fill();
        }

        // Far skyline silhouette varies by boss motif.
        ctx.save();
        ctx.fillStyle='rgba(0,0,0,0.28)';
        ctx.strokeStyle=ftColorAlpha(accent,0.16); ctx.lineWidth=1.5;
        switch(s.motif){
          case 'needle':
            for(let i=0;i<7;i++){ const x=((i*150)-(worldX*0.08)%150)-40; const h=100+(i%3)*35; ctx.beginPath(); ctx.moveTo(x,horizon+70); ctx.lineTo(x+22,horizon-h); ctx.lineTo(x+44,horizon+70); ctx.closePath(); ctx.fill(); }
            for(let i=0;i<5;i++){ const x=((i*220)-(worldX*0.05)%220)+30; ctx.beginPath(); ctx.arc(x,horizon-35,18,0,Math.PI*2); ctx.stroke(); }
            break;
          case 'weaver':
          case 'firstStitch':
          case 'voidThreadGod':
            ctx.strokeStyle=ftColorAlpha(accent,0.15); ctx.lineWidth=2;
            for(let i=0;i<12;i++){ const x=i*(W/11); ctx.beginPath(); ctx.moveTo(x,0); ctx.bezierCurveTo(x+Math.sin(time+i)*40,H*0.22,x-Math.cos(time*0.7+i)*55,horizon,x+Math.sin(time*1.3+i)*25,H); ctx.stroke(); }
            break;
          case 'gearSaint':
          case 'clockAbyss':
          case 'duskEngineer':
            for(let i=0;i<6;i++){ const x=60+i*140-((worldX*0.06)%140); const r=26+(i%3)*14; ctx.beginPath(); ctx.arc(x,horizon-90-(i%2)*40,r,0,Math.PI*2); ctx.stroke(); for(let k=0;k<8;k++){ const a=time*0.5+i+k*Math.PI/4; ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*r*0.7,horizon-90-(i%2)*40+Math.sin(a)*r*0.7); ctx.lineTo(x+Math.cos(a)*r*1.2,horizon-90-(i%2)*40+Math.sin(a)*r*1.2); ctx.stroke(); } }
            break;
          case 'thornMother':
          case 'copperGardener':
          case 'corrodedSovereign':
            ctx.strokeStyle=ftColorAlpha(accent,0.18); ctx.lineWidth=3;
            for(let i=0;i<10;i++){ const x=i*(W/9)-20; ctx.beginPath(); ctx.moveTo(x,H); ctx.quadraticCurveTo(x+Math.sin(time+i)*30,horizon+20,x+((i%2)*22-11),horizon-110-(i%3)*18); ctx.stroke(); }
            ftSpikeLine(0,horizon+10,W,14,40,-1);
            break;
          case 'drownedStar':
          case 'scarletAdmiral':
            ctx.fillStyle=ftColorAlpha(accent,0.08); ctx.fillRect(0,horizon+30,W,H-(horizon+30));
            ctx.strokeStyle=ftColorAlpha(accent,0.18); ctx.lineWidth=2;
            for(let i=0;i<9;i++){ const x=i*(W/8)-40; ctx.beginPath(); ctx.moveTo(x,horizon+25); for(let n=0;n<8;n++){ const px=x+n*24; ctx.lineTo(px,horizon+25+Math.sin(time*2+n+i)*8); } ctx.stroke(); }
            break;
          case 'prismRegent':
          case 'sapphireSplit':
          case 'opalLibrarian':
          case 'mirrorTyrant':
          case 'mirrorWidow':
          case 'shatteredChoir':
            for(let i=0;i<10;i++){ const x=i*(W/9)-20; const h=70+(i%4)*24; ctx.beginPath(); ctx.moveTo(x,horizon+70); ctx.lineTo(x+18,horizon-h); ctx.lineTo(x+44,horizon+70); ctx.closePath(); ctx.fill(); ctx.stroke(); }
            break;
          case 'ashSeraph':
          case 'emberCantor':
          case 'ivoryFurnace':
            for(let i=0;i<9;i++){ const x=i*(W/8)-20; const h=90+(i%3)*24; ctx.beginPath(); ctx.moveTo(x,horizon+70); ctx.lineTo(x+22,horizon-h); ctx.lineTo(x+44,horizon+70); ctx.closePath(); ctx.fill(); }
            break;
          case 'silkJudge':
          case 'crimsonArchbishop':
          case 'boneAstronomer':
          case 'mothAbbot':
          case 'lanternMaw':
            for(let i=0;i<6;i++){ const x=30+i*150-((worldX*0.04)%150); ftWindowArch(x,horizon-40-(i%2)*20,90,120,'rgba(0,0,0,0.22)',ftColorAlpha(accent,0.16)); }
            break;
          case 'hollowCrown':
          case 'starlitRelic':
          case 'paperMoonBoss':
          case 'eclipseSovereign':
            ctx.strokeStyle=ftColorAlpha(accent,0.15); ctx.lineWidth=2;
            for(let i=0;i<5;i++){ const x=100+i*160-((worldX*0.03)%160); ctx.beginPath(); ctx.arc(x,horizon-50-(i%2)*18,35+(i%3)*8,0,Math.PI*2); ctx.stroke(); }
            break;
          case 'neonWarden':
          case 'staticHarvest':
            ctx.strokeStyle=ftColorAlpha(accent,0.16); ctx.lineWidth=1;
            for(let y=0;y<horizon+60;y+=32){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
            for(let x=0;x<W+40;x+=44){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,horizon+70); ctx.stroke(); }
            break;
          case 'shadowMerchant':
          case 'buriedRingmaster':
          case 'rustedNanny':
            for(let i=0;i<8;i++){ const x=i*(W/7)-40; const aw=80; ctx.beginPath(); ctx.moveTo(x,horizon+60); ctx.quadraticCurveTo(x+aw*0.5,horizon-20-(i%2)*16,x+aw,horizon+60); ctx.closePath(); ctx.fill(); ctx.stroke(); }
            break;
          case 'auroraKnight':
            ctx.strokeStyle=ftColorAlpha(accent,0.12); ctx.lineWidth=3;
            for(let i=0;i<7;i++){ const x=i*(W/6)-40; ctx.beginPath(); ctx.moveTo(x,horizon+50); ctx.lineTo(x+30,horizon-85-(i%2)*28); ctx.lineTo(x+60,horizon+50); ctx.stroke(); }
            break;
          case 'marrowQueen':
            ctx.strokeStyle=ftColorAlpha(accent,0.18); ctx.lineWidth=4;
            for(let i=0;i<8;i++){ const x=i*(W/7)-10; ctx.beginPath(); ctx.moveTo(x,horizon+60); ctx.lineTo(x+10,horizon-60-(i%3)*20); ctx.lineTo(x+20,horizon+60); ctx.stroke(); }
            break;
          default:
            for(let i=0;i<9;i++){ const x=i*(W/8)-30; const h=65+(i%3)*25; ctx.beginPath(); ctx.moveTo(x,horizon+60); ctx.lineTo(x+20,horizon-h); ctx.lineTo(x+40,horizon+60); ctx.closePath(); ctx.fill(); }
        }
        ctx.restore();

        // Main emblem / focal backdrop linked to boss identity.
        const cx=W*0.5, cy=H*0.29;
        ctx.save();
        ctx.shadowColor=accent; ctx.shadowBlur=24; ctx.strokeStyle=ftColorAlpha(accent,0.58); ctx.fillStyle=ftColorAlpha(accent,0.12); ctx.lineWidth=3;
        const pulse=1+Math.sin(time*1.4)*0.04;
        switch(s.motif){
          case 'needle': {
            ctx.beginPath(); ctx.arc(cx,cy,72,0,Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx-10,cy-120); ctx.lineTo(cx+16,cy+102); ctx.lineTo(cx-18,cy+70); ctx.closePath(); ctx.fill(); ctx.stroke();
            break; }
          case 'weaver': {
            for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(cx+i*28,cy-120); ctx.quadraticCurveTo(cx+i*16+Math.sin(time+i)*18,cy,cx+i*28,cy+120); ctx.stroke(); }
            ctx.beginPath(); ctx.ellipse(cx,cy,86,62,0,0,Math.PI*2); ctx.stroke();
            break; }
          case 'gearSaint': {
            const r=76; ctx.beginPath(); for(let i=0;i<16;i++){ const a=i*Math.PI/8; const rr=i%2?r*1.26:r; const px=cx+Math.cos(a+time*0.3)*rr, py=cy+Math.sin(a+time*0.3)*rr; i?ctx.lineTo(px,py):ctx.moveTo(px,py);} ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,r*0.42,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy-r*1.15,28,0,Math.PI*2); ctx.stroke(); break; }
          case 'thornMother': {
            ctx.beginPath(); ctx.moveTo(cx,cy-98); ctx.bezierCurveTo(cx+110,cy-40,cx+86,cy+112,cx,cy+138); ctx.bezierCurveTo(cx-86,cy+112,cx-110,cy-40,cx,cy-98); ctx.closePath(); ctx.fill(); ctx.stroke(); for(let i=0;i<8;i++){ const a=i*Math.PI/4+time*0.2; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*48,cy+Math.sin(a)*38); ctx.lineTo(cx+Math.cos(a)*112,cy+Math.sin(a)*96); ctx.stroke(); } break; }
          case 'drownedStar': {
            for(let i=0;i<5;i++){ const a=-Math.PI/2+i*(Math.PI*2/5); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*98,cy+Math.sin(a)*98); ctx.lineTo(cx+Math.cos(a+0.34)*38,cy+Math.sin(a+0.34)*38); ctx.closePath(); ctx.fill(); ctx.stroke(); } ctx.beginPath(); ctx.arc(cx,cy,28,0,Math.PI*2); ctx.stroke(); break; }
          case 'prismRegent': {
            ctx.beginPath(); ctx.moveTo(cx,cy-108); ctx.lineTo(cx+92,cy-18); ctx.lineTo(cx+56,cy+112); ctx.lineTo(cx-56,cy+112); ctx.lineTo(cx-92,cy-18); ctx.closePath(); ctx.fill(); ctx.stroke(); for(let i=0;i<6;i++){ ctx.strokeStyle=`hsla(${(i*60+t*0.04)%360},90%,72%,0.52)`; ctx.beginPath(); ctx.moveTo(cx,cy-108); ctx.lineTo(cx-140+i*56,cy+150); ctx.stroke(); } break; }
          case 'ashSeraph': {
            for(let side of [-1,1]){ ctx.beginPath(); ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx+side*70,cy-74,cx+side*154,cy-20,cx+side*120,cy+76); ctx.bezierCurveTo(cx+side*70,cy+42,cx+side*38,cy+18,cx,cy); ctx.fill(); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(cx,cy-85); ctx.lineTo(cx+24,cy+78); ctx.lineTo(cx-24,cy+78); ctx.closePath(); ctx.fill(); ctx.stroke(); break; }
          case 'silkJudge': {
            for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(cx+i*34,cy-112); ctx.quadraticCurveTo(cx+i*20,cy-20,cx+i*34,cy+98); ctx.stroke(); }
            ctx.beginPath(); ctx.moveTo(cx-74,cy-74); ctx.lineTo(cx+74,cy-74); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx-54,cy-74); ctx.lineTo(cx-80,cy+12); ctx.lineTo(cx-32,cy+12); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx+54,cy-74); ctx.lineTo(cx+80,cy+12); ctx.lineTo(cx+32,cy+12); ctx.closePath(); ctx.fill(); ctx.stroke();
            break; }
          case 'hollowCrown': {
            ctx.beginPath(); ctx.moveTo(cx-112,cy+72); ctx.lineTo(cx-74,cy-28); ctx.lineTo(cx-24,cy+18); ctx.lineTo(cx,cy-98); ctx.lineTo(cx+24,cy+18); ctx.lineTo(cx+74,cy-28); ctx.lineTo(cx+112,cy+72); ctx.closePath(); ctx.fill(); ctx.stroke(); break; }
          case 'neonWarden': {
            ctx.strokeStyle=ftColorAlpha(accent,0.62); for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx-96+i*8,cy-90+i*8,192-i*16,180-i*16,18) : ctx.rect(cx-96+i*8,cy-90+i*8,192-i*16,180-i*16); ctx.stroke(); } break; }
          case 'clockAbyss': {
            ctx.beginPath(); ctx.arc(cx,cy,96,0,Math.PI*2); ctx.stroke(); for(let i=0;i<12;i++){ const a=i*Math.PI/6 + time*0.22; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*74,cy+Math.sin(a)*74); ctx.lineTo(cx+Math.cos(a)*96,cy+Math.sin(a)*96); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(time*0.8)*54,cy+Math.sin(time*0.8)*54); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(-time*0.4)*80,cy+Math.sin(-time*0.4)*80); ctx.stroke(); break; }
          case 'shatteredChoir':
          case 'mirrorTyrant':
          case 'mirrorWidow':
          case 'sapphireSplit': {
            for(let i=0;i<8;i++){ const a=i*Math.PI/4 + Math.sin(time+i)*0.18; const r1=28, r2=110+(i%2)*12; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); ctx.lineTo(cx+Math.cos(a+0.18)*r2,cy+Math.sin(a+0.18)*r2); ctx.lineTo(cx+Math.cos(a-0.18)*(r2-26),cy+Math.sin(a-0.18)*(r2-26)); ctx.closePath(); ctx.fill(); ctx.stroke(); } break; }
          case 'crimsonArchbishop': {
            ftWindowArch(cx-66,cy-96,132,190,ftColorAlpha(accent,0.08),ftColorAlpha(accent,0.58));
            ctx.beginPath(); ctx.moveTo(cx,cy-128); ctx.lineTo(cx+12,cy-96); ctx.lineTo(cx-12,cy-96); ctx.closePath(); ctx.fill(); ctx.stroke();
            break; }
          case 'shadowMerchant': {
            ctx.beginPath(); ctx.moveTo(cx-96,cy+48); ctx.quadraticCurveTo(cx,cy-128,cx+96,cy+48); ctx.stroke();
            for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.arc(cx+i*38,cy-36+Math.sin(time*1.5+i)*8,16,0,Math.PI*2); ctx.stroke(); }
            break; }
          case 'auroraKnight': {
            for(let i=0;i<4;i++){ ctx.strokeStyle=`hsla(${(150+i*30+t*0.03)%360},90%,75%,0.46)`; ctx.lineWidth=5-i; ctx.beginPath(); ctx.moveTo(cx-130,cy-50+i*18); ctx.bezierCurveTo(cx-20,cy-120+i*8,cx+40,cy+10+i*5,cx+130,cy-86+i*10); ctx.stroke(); }
            ctx.strokeStyle=ftColorAlpha(accent,0.55); ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx,cy-110); ctx.lineTo(cx+48,cy+80); ctx.lineTo(cx-48,cy+80); ctx.closePath(); ctx.stroke();
            break; }
          case 'marrowQueen': {
            for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(cx+i*28,cy+95); ctx.lineTo(cx+i*16,cy-90-(Math.abs(i)%2)*18); ctx.stroke(); }
            ctx.beginPath(); ctx.arc(cx,cy+10,44,0,Math.PI,true); ctx.stroke(); break; }
          case 'starlitRelic': {
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx-82,cy-98,164,196,22) : ctx.rect(cx-82,cy-98,164,196); ctx.stroke(); for(let i=0;i<12;i++){ const a=i*Math.PI/6; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*62,cy+Math.sin(a)*62,4,0,Math.PI*2); ctx.fill(); } break; }
          case 'firstStitch': {
            const ringColors=['#ff7358','#ffbe60','#b8c8ff','#8dff81','#7de6ff','#ff9bff','#ff9d65','#d9ddff','#bd79ff'];
            for(let i=0;i<ringColors.length;i++){ ctx.strokeStyle=ftColorAlpha(ringColors[i],0.45); ctx.beginPath(); ctx.arc(cx,cy,34+i*10+Math.sin(time*2+i)*4,0,Math.PI*2); ctx.stroke(); }
            for(let i=0;i<9;i++){ const a=time*0.4+i*Math.PI*2/9; ctx.strokeStyle=ftColorAlpha(ringColors[i],0.52); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*122,cy+Math.sin(a)*122); ctx.stroke(); }
            break; }
          case 'boneAstronomer': {
            ctx.beginPath(); ctx.arc(cx,cy,92,0,Math.PI*2); ctx.stroke(); for(let i=0;i<7;i++){ const a=i*Math.PI*2/7+time*0.2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*74,cy+Math.sin(a)*74,10,0,Math.PI*2); ctx.stroke(); } break; }
          case 'buriedRingmaster': {
            ctx.beginPath(); ctx.arc(cx,cy,90,0,Math.PI*2); ctx.stroke(); for(let i=0;i<8;i++){ const a=i*Math.PI/4; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*90,cy+Math.sin(a)*90); ctx.lineTo(cx+Math.cos(a)*125,cy+Math.sin(a)*125); ctx.stroke(); } break; }
          case 'copperGardener':
          case 'corrodedSovereign': {
            ctx.beginPath(); ctx.arc(cx,cy,46,0,Math.PI*2); ctx.stroke(); for(let i=0;i<10;i++){ const a=i*Math.PI/5+time*0.1; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*118,cy+Math.sin(a)*118); ctx.stroke(); } break; }
          case 'duskEngineer': {
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx-90,cy-70,180,140,18) : ctx.rect(cx-90,cy-70,180,140); ctx.stroke(); for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(cx-90,cy+i*24); ctx.lineTo(cx+90,cy+i*24); ctx.stroke(); } break; }
          case 'eclipseSovereign': {
            ctx.beginPath(); ctx.arc(cx,cy,100,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='rgba(10,0,20,0.85)'; ctx.beginPath(); ctx.arc(cx+22*Math.cos(time*0.5),cy,84,0,Math.PI*2); ctx.fill(); break; }
          case 'emberCantor': {
            for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(cx+i*28,cy+84); ctx.lineTo(cx+i*16,cy-72); ctx.stroke(); } ctx.beginPath(); ctx.arc(cx,cy-10,40,0,Math.PI*2); ctx.stroke(); break; }
          case 'ivoryFurnace': {
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx-72,cy-92,144,184,18) : ctx.rect(cx-72,cy-92,144,184); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy+10,36,0,Math.PI*2); ctx.stroke(); break; }
          case 'lanternMaw': {
            ctx.beginPath(); ctx.arc(cx,cy,86,0,Math.PI*2); ctx.stroke(); for(let i=0;i<12;i++){ const a=i*Math.PI/6; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*32,cy+Math.sin(a)*32); ctx.lineTo(cx+Math.cos(a)*112,cy+Math.sin(a)*112); ctx.stroke(); } break; }
          case 'mothAbbot': {
            for(let side of [-1,1]){ ctx.beginPath(); ctx.moveTo(cx,cy); ctx.quadraticCurveTo(cx+side*80,cy-80,cx+side*134,cy-10); ctx.quadraticCurveTo(cx+side*100,cy+70,cx,cy+26); ctx.fill(); ctx.stroke(); } break; }
          case 'opalLibrarian': {
            for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(cx-100+i*34,cy+92); ctx.lineTo(cx-100+i*34,cy-92); ctx.stroke(); } ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx-110,cy-104,220,208,14) : ctx.rect(cx-110,cy-104,220,208); ctx.stroke(); break; }
          case 'paperMoonBoss': {
            ctx.beginPath(); ctx.arc(cx,cy,96,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx-24,cy-90); ctx.lineTo(cx+86,cy); ctx.lineTo(cx-24,cy+90); ctx.closePath(); ctx.fill(); ctx.stroke(); break; }
          case 'rustedNanny': {
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx-72,cy-90,144,180,28) : ctx.rect(cx-72,cy-90,144,180); ctx.stroke(); for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.arc(cx+i*26,cy-24+(i%2)*10,10,0,Math.PI*2); ctx.stroke(); } break; }
          case 'scarletAdmiral': {
            ctx.beginPath(); ctx.moveTo(cx-110,cy+62); ctx.lineTo(cx,cy-84); ctx.lineTo(cx+110,cy+62); ctx.closePath(); ctx.stroke(); for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(cx+i*28,cy+62); ctx.lineTo(cx+i*18,cy-18); ctx.stroke(); } break; }
          case 'staticHarvest': {
            ctx.strokeStyle=ftColorAlpha(accent,0.52); for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(cx-110,cy+i*24+Math.sin(time*18+i)*5); ctx.lineTo(cx+110,cy+i*24+Math.cos(time*15+i)*5); ctx.stroke(); } break; }
          case 'voidThreadGod': {
            for(let i=0;i<8;i++){ const a=i*Math.PI/4+time*0.08; ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*46,cy+Math.sin(a)*20,26+i*5,80+i*9,a,0,Math.PI*2); ctx.stroke(); } ctx.beginPath(); ctx.arc(cx,cy,26,0,Math.PI*2); ctx.fill(); ctx.stroke(); break; }
          default: {
            ctx.beginPath(); ctx.arc(cx,cy,90*pulse,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,42,0,Math.PI*2); ctx.stroke(); }
        }
        ctx.restore();

        // Foreground ambient particles and motif-specific motion.
        ctx.save();
        const arenaParticleSeed = ftScatterSeed('arena-particles:' + kind);
        for(let i=0;i<28;i++){
          let px=(ftScatter01(arenaParticleSeed,i,0)*(W+80) + worldX*(0.015+ftScatter01(arenaParticleSeed,i,2)*0.035) + t*(0.008+ftScatter01(arenaParticleSeed,i,3)*0.024))%(W+80)-40;
          let py=(ftScatter01(arenaParticleSeed,i,1)*(H+120) + t*(0.007+ftScatter01(arenaParticleSeed,i,4)*0.018))%(H+120)-60;
          let size=1.2+ftScatter01(arenaParticleSeed,i,5)*2.8;
          ctx.fillStyle=ftColorAlpha(accent,0.16+0.04*Math.sin(time*2+i));
          if(['drownedStar','scarletAdmiral'].includes(s.motif)) py = H - ((ftScatter01(arenaParticleSeed,i,6)*(H*0.6)+t*(0.016+ftScatter01(arenaParticleSeed,i,7)*0.024))%(H*0.6));
          if(['staticHarvest'].includes(s.motif)) px=(ftScatter01(arenaParticleSeed,i,8)*(W+60)+t*(0.18+ftScatter01(arenaParticleSeed,i,9)*0.22))%(W+60)-30, py=(ftScatter01(arenaParticleSeed,i,10)*(H+60)+t*(0.06+ftScatter01(arenaParticleSeed,i,11)*0.12))%(H+60)-30;
          ctx.beginPath();
          if(['weaver','silkJudge','firstStitch','voidThreadGod'].includes(s.motif)){
            ctx.ellipse(px,py,size*0.7,size*3,Math.sin(time+i),0,Math.PI*2);
          } else if(['prismRegent','mirrorTyrant','mirrorWidow','sapphireSplit','shatteredChoir'].includes(s.motif)){
            ctx.moveTo(px,py-size*2); ctx.lineTo(px+size*1.5,py); ctx.lineTo(px,py+size*2); ctx.lineTo(px-size*1.5,py); ctx.closePath();
          } else if(['thornMother','marrowQueen','copperGardener','corrodedSovereign'].includes(s.motif)){
            ctx.moveTo(px,py+size*2); ctx.lineTo(px+size,py-size*2); ctx.lineTo(px-size,py-size*2); ctx.closePath();
          } else {
            ctx.arc(px,py,size,0,Math.PI*2);
          }
          ctx.fill();
        }

        // Ground mist.
        const mist=ctx.createLinearGradient(0,horizon-30,0,H);
        mist.addColorStop(0,'rgba(0,0,0,0)'); mist.addColorStop(1,s.fog);
        ctx.fillStyle=mist; ctx.fillRect(0,horizon-30,W,H-horizon+30);
        ctx.restore();
        ctx.restore();
      };
    })();
