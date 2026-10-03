/* Faded Thread module: 18-controls-tutorial-mobile-gamepad.js | build 03 Oct 2026 */
// =====================================================================
    // CONTROLS, FORGOTTEN MEADOW TUTORIAL, AND ECTOPLASMIC ENERGY
    // =====================================================================
    (function installTutorialControlsAndEctoplasmicEnergy(){
      'use strict';

      const FT_BIND_KEY='fadedThreadKeybindsV3';
      const LEGACY_BIND_KEY='fadedThreadKeybindsV2';
      const FT_GAMEPAD_BIND_KEY='fadedThreadGamepadBindsV1';
      const DEFAULT_BINDS={
        left:['a'],right:['d'],jump:['w'],down:['s'],
        attack:['x'],dash:['shift'],equipment:['y'],returnHome:['backspace']
      };
      const ACTION_LABELS={
        left:'Move Left',right:'Move Right',jump:'Jump / Aim Up',down:'Aim Down',
        attack:'Attack',dash:'Dash',equipment:'Equipment',returnHome:'Autosave + Home'
      };
      const DEFAULT_GAMEPAD_BINDS={
        left:'ls-left',right:'ls-right',jump:'btn-0',down:'ls-down',
        attack:'btn-2',dash:'btn-1',equipment:'btn-3',returnHome:'btn-8'
      };
      const GAMEPAD_INPUT_LABELS={
        'ls-left':'LEFT STICK LEFT','ls-right':'LEFT STICK RIGHT','ls-up':'LEFT STICK UP','ls-down':'LEFT STICK DOWN',
        'rs-left':'RIGHT STICK LEFT','rs-right':'RIGHT STICK RIGHT','rs-up':'RIGHT STICK UP','rs-down':'RIGHT STICK DOWN',
        'btn-0':'FACE BOTTOM','btn-1':'FACE RIGHT','btn-2':'FACE LEFT','btn-3':'FACE TOP',
        'btn-4':'LEFT SHOULDER','btn-5':'RIGHT SHOULDER','btn-6':'LEFT TRIGGER','btn-7':'RIGHT TRIGGER',
        'btn-8':'CENTRE LEFT','btn-9':'CENTRE RIGHT','btn-10':'LEFT STICK PRESS','btn-11':'RIGHT STICK PRESS',
        'btn-12':'D PAD UP','btn-13':'D PAD DOWN','btn-14':'D PAD LEFT','btn-15':'D PAD RIGHT'
      };
      function cloneDefaultBinds(){return Object.fromEntries(Object.entries(DEFAULT_BINDS).map(([a,ks])=>[a,[...ks]]));}
      function normaliseBindData(raw){
        const out=cloneDefaultBinds();
        if(!raw||typeof raw!=='object')return out;
        for(const action of Object.keys(DEFAULT_BINDS)){
          if(Array.isArray(raw[action])) out[action]=raw[action].filter(k=>typeof k==='string'&&k).slice(0,1);
          else if(typeof raw[action]==='string'&&raw[action]) out[action]=[raw[action]];
        }
        return out;
      }
      let binds=cloneDefaultBinds();
      let gamepadBinds={...DEFAULT_GAMEPAD_BINDS};
      try{
        const current=JSON.parse(localStorage.getItem(FT_BIND_KEY)||'null');
        const legacy=current||JSON.parse(localStorage.getItem(LEGACY_BIND_KEY)||'null');
        if(legacy)binds=normaliseBindData(legacy);
        const gpSaved=JSON.parse(localStorage.getItem(FT_GAMEPAD_BIND_KEY)||'null');
        if(gpSaved&&typeof gpSaved==='object')for(const action of Object.keys(DEFAULT_GAMEPAD_BINDS))if(typeof gpSaved[action]==='string')gamepadBinds[action]=gpSaved[action];
      }catch(_){ }
      let rebinding=null;
      let gamepadRebinding=null;
      let controlsView='keyboard';
      const heldBoundKeys=new Set();
      let ectoEnergy=100;
      let ectoVisualIntensity=0;
      let tutorialStep=0;
      let tutorialCompleteForSave=false;
      let tutorialMoveSeen=false;
      let tutorialJumpSeen=false;
      let tutorialEnemyKilled=false;
      let tutorialDirectionalSeen=false;
      let meadowCourseInstalled=false;
      let tutorialRenderedStep=-1;
      let tutorialTransitioning=false;
      let tutorialFadeTimer=null;
      let tutorialInputMode='keyboard';
      // Signals older input listeners to stand down so rebinding is authoritative.
      window.ftEnhancedControlsActive=true;

      function normalKey(e){
        let k=(e.key||'').toLowerCase();
        if(k===' ') return 'space';
        if(k==='arrowleft'||k==='arrowright'||k==='arrowup'||k==='arrowdown') return k;
        return k;
      }
      function displayKey(k){
        const names={arrowleft:'←',arrowright:'→',arrowup:'↑',arrowdown:'↓',shift:'SHIFT',space:'SPACE',control:'CTRL',alt:'ALT',meta:'CMD'};
        return names[k]||String(k||'').toUpperCase();
      }
      function saveBinds(){ localStorage.setItem(FT_BIND_KEY,JSON.stringify(binds)); }
      function saveGamepadBinds(){ localStorage.setItem(FT_GAMEPAD_BIND_KEY,JSON.stringify(gamepadBinds)); }

      const style=document.createElement('style');
      style.textContent=`
        #ft-controls-button{position:fixed;left:20px;right:auto;top:66px;z-index:11500;width:auto;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.55)!important;background:rgba(18,19,35,.82)!important;color:#fff!important;font:700 .72rem inherit;letter-spacing:.09em;cursor:pointer;box-shadow:0 9px 26px rgba(0,0,0,.28);display:none}
        #ft-controls-drawer{position:fixed;top:0;right:0;bottom:0;z-index:16000;width:min(390px,92vw);padding:28px 24px;box-sizing:border-box;overflow:auto;background:linear-gradient(180deg,rgba(18,19,35,.985),rgba(7,8,16,.99));border-left:1px solid rgba(210,225,255,.18);box-shadow:-24px 0 70px rgba(0,0,0,.5);transform:translateX(102%);transition:transform .34s cubic-bezier(.22,.8,.2,1);color:#fff}
        #ft-controls-drawer.show{transform:translateX(0)}
        .ft-controls-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}.ft-controls-head h2{margin:0;font-size:1.05rem;letter-spacing:.12em}.ft-controls-close{width:auto;margin:0;padding:8px 10px;color:#000!important;background:#fff!important;border-color:#fff!important}
        .ft-controls-copy{font-size:.75rem;opacity:.67;line-height:1.45;margin-bottom:14px}.ft-control-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}.ft-control-tab{margin:0!important;padding:10px 12px!important;background:rgba(255,255,255,.035)!important;color:#fff!important;border:1px solid rgba(255,255,255,.4)!important}.ft-control-tab.active{background:rgba(255,255,255,.14)!important;border-color:#fff!important;box-shadow:0 0 18px rgba(255,255,255,.1)!important}.ft-bind-panel{display:none}.ft-bind-panel.active{display:block}.ft-gamepad-note{font-size:.65rem;opacity:.64;line-height:1.45;margin:0 0 12px}.ft-gamepad-chip{font-size:.72rem;min-width:132px!important}
        .ft-controls-box{padding:16px;border:1px solid rgba(210,225,255,.17);border-radius:16px;background:rgba(255,255,255,.035)}
        .ft-bind-row{display:grid;grid-template-columns:1fr minmax(150px,1.35fr);align-items:center;gap:14px;padding:10px 0;border-top:1px solid rgba(255,255,255,.075)}.ft-bind-row:first-child{border-top:0}
        .ft-bind-controls{display:flex;gap:8px;justify-content:flex-end;align-items:center}.ft-bind-row button{width:auto;margin:0;padding:8px 12px;font-weight:800;background:rgba(255,255,255,.035)!important;color:#fff!important;border:1px solid #fff!important;border-radius:8px!important;box-shadow:none!important;min-width:92px}.ft-bind-row button.waiting{outline:2px solid #fff;animation:ftBindPulse .7s ease-in-out infinite alternate}.ft-controller-map{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.09);font-size:.66rem;line-height:1.65;opacity:.8}.ft-controller-map strong{color:#fff;opacity:1}
        @keyframes ftBindPulse{to{box-shadow:0 0 22px rgba(255,255,255,.38)!important}}
        .ft-controls-actions{display:grid;gap:9px;margin-top:16px}.ft-controls-actions button{margin:0;width:100%;background:rgba(255,255,255,.035)!important;color:#fff!important;border:1px solid #fff!important}
        #ft-ecto-wrap{position:fixed;left:50%;right:auto;top:18px;transform:translateX(-50%);z-index:9000;width:min(300px,32vw);pointer-events:none;display:none;transition:top .18s ease}
        #ft-ecto-label{display:flex;justify-content:space-between;font-size:.62rem;letter-spacing:.15em;color:#fff;text-shadow:0 2px 8px #000;margin-bottom:5px}
        #ft-ecto-bar{height:9px;border-radius:99px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.3)}
        #ft-ecto-fill{height:100%;width:100%;background:linear-gradient(90deg,#9effdf,#8ce9ff,#d9c3ff);transition:width .08s linear}
        #ft-ecto-wrap.low #ft-ecto-bar{box-shadow:0 0 18px rgba(180,140,255,.5),0 4px 14px rgba(0,0,0,.3)}
        #ft-ecto-wrap.empty #ft-ecto-bar{animation:ftEctoBarPanic .28s ease-in-out infinite alternate;box-shadow:0 0 25px rgba(255,55,130,.95),0 0 60px rgba(120,40,255,.5)}
        @keyframes ftEctoBarPanic{from{transform:scaleX(1)}to{transform:scaleX(1.035)}}
        #ft-ecto-danger{position:fixed;inset:0;z-index:9190;pointer-events:none;opacity:0;border-radius:0;box-shadow:inset 0 0 0 0 rgba(255,0,32,0);transition:opacity .12s linear,box-shadow .12s linear;background:transparent}
        #ft-ecto-danger.hit{animation:ftEctoHit .42s ease-out}
        @keyframes ftEctoHit{0%{filter:brightness(1)}18%{filter:brightness(1.8)}100%{filter:brightness(1)}}
        #ft-ecto-impact{position:fixed;inset:0;z-index:9195;pointer-events:none;overflow:hidden}
        .ft-ecto-ring{position:absolute;width:42px;height:42px;margin:-21px;border:5px solid rgba(255,38,86,.95);border-radius:50%;box-shadow:0 0 22px rgba(255,0,70,.95),0 0 70px rgba(175,40,255,.75),inset 0 0 18px rgba(255,255,255,.55);animation:ftEctoRing .85s cubic-bezier(.12,.72,.2,1) forwards}
        @keyframes ftEctoRing{0%{transform:scale(.25);opacity:1;filter:blur(0)}65%{opacity:.9}100%{transform:scale(9);opacity:0;filter:blur(7px)}}
        .ft-ecto-mote{position:absolute;width:7px;height:20px;margin:-4px;border-radius:50%;background:rgba(255,100,150,.95);box-shadow:0 0 12px rgba(255,0,70,1),0 0 25px rgba(150,60,255,.9);transform:rotate(var(--rot));animation:ftEctoMote .9s cubic-bezier(.08,.68,.18,1) forwards}
        @keyframes ftEctoMote{0%{transform:translate(0,0) rotate(var(--rot)) scale(1.25);opacity:1}70%{opacity:.95}100%{transform:translate(var(--dx),var(--dy)) rotate(calc(var(--rot) + 240deg)) scale(.15);opacity:0;filter:blur(4px)}}
        #gameCanvas.ft-ecto-shock{animation:ftEctoShock .62s ease-out}
        @keyframes ftEctoShock{0%,100%{transform:translate(0,0)}10%{transform:translate(-13px,7px)}20%{transform:translate(11px,-8px)}31%{transform:translate(-9px,-5px)}43%{transform:translate(8px,6px)}58%{transform:translate(-5px,3px)}74%{transform:translate(3px,-2px)}}
        #ft-tutorial{position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:9200;width:min(520px,calc(100vw - 32px));pointer-events:none;color:#fff;opacity:1;transition:opacity .28s ease,transform .28s ease}
        #ft-tutorial.ft-fade-out{opacity:0;transform:translateX(-50%) translateY(10px)}
        .ft-tutorial-card{padding:12px 15px;border-radius:14px;border:1px solid rgba(222,235,255,.26);background:linear-gradient(145deg,rgba(12,16,30,.82),rgba(24,20,45,.72));backdrop-filter:blur(14px);box-shadow:0 16px 45px rgba(0,0,0,.38)}
        .ft-tutorial-eyebrow{font-size:.54rem;letter-spacing:.19em;opacity:.58;margin-bottom:4px}.ft-tutorial-main{font-size:.88rem;font-weight:800;line-height:1.3}.ft-tutorial-sub{margin-top:3px;font-size:.68rem;opacity:.66;line-height:1.3}
        .ft-keycap{display:inline-block;min-width:24px;padding:2px 7px;margin:0 2px;border-radius:6px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);text-align:center;font-size:.72em;letter-spacing:.04em}
        .equipment-card.ft-controller-selected{outline:3px solid rgba(255,255,255,.95)!important;outline-offset:3px;box-shadow:0 0 0 1px rgba(130,220,255,.55),0 0 30px rgba(120,190,255,.4)!important;transform:translateY(-2px)}
        #ft-mobile-controls{position:fixed;inset:0;z-index:9100;pointer-events:none;display:none}.ft-mobile-group{position:absolute;bottom:max(18px,env(safe-area-inset-bottom));pointer-events:none}.ft-mobile-left{left:max(18px,env(safe-area-inset-left));width:150px;height:150px}.ft-mobile-right{right:max(18px,env(safe-area-inset-right));display:grid;grid-template-columns:repeat(2,66px);grid-template-rows:repeat(3,66px);gap:10px}.ft-mobile-btn{pointer-events:auto;touch-action:none;-webkit-user-select:none;user-select:none;border:1px solid rgba(255,255,255,.55)!important;background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.065))!important;color:#fff!important;border-radius:20px!important;backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 12px 30px rgba(0,0,0,.28)!important;font:800 20px/1 monospace!important;margin:0!important;padding:0!important;width:100%!important;height:100%!important}.ft-mobile-btn.active{background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(170,210,255,.16))!important;transform:scale(.94)}.ft-mobile-joystick{position:absolute;inset:0;border-radius:50%;pointer-events:auto;touch-action:none;border:1px solid rgba(255,255,255,.48);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.18),rgba(255,255,255,.06) 62%,rgba(8,12,26,.18));backdrop-filter:blur(20px) saturate(155%);-webkit-backdrop-filter:blur(20px) saturate(155%);box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 14px 34px rgba(0,0,0,.3)}.ft-mobile-stick{position:absolute;left:50%;top:50%;width:66px;height:66px;margin:-33px;border-radius:50%;border:1px solid rgba(255,255,255,.64);background:linear-gradient(145deg,rgba(255,255,255,.28),rgba(255,255,255,.09));box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 8px 22px rgba(0,0,0,.28);transform:translate(0,0);pointer-events:none}.ft-mobile-right [data-mobile-action=jump]{grid-column:2;grid-row:1}.ft-mobile-right [data-mobile-action=attack]{grid-column:1;grid-row:1}.ft-mobile-right [data-mobile-action=dash]{grid-column:2;grid-row:2}.ft-mobile-right [data-mobile-action=down]{grid-column:1;grid-row:2}.ft-mobile-right [data-mobile-action=equipment]{grid-column:1;grid-row:3}.ft-mobile-right [data-mobile-action=returnHome]{grid-column:2;grid-row:3;font-size:12px!important;letter-spacing:.04em}body.ft-touch-device:not(.ft-home-active) #ft-mobile-controls{display:block}.ft-controller-focus{outline:3px solid rgba(255,255,255,.98)!important;outline-offset:4px!important;box-shadow:0 0 0 2px rgba(90,205,255,.55),0 0 28px rgba(90,205,255,.5)!important;transform:translateY(-1px)}input[type=range].ft-controller-focus{outline:2px solid #fff!important;outline-offset:5px!important;filter:drop-shadow(0 0 8px rgba(100,210,255,.8))}
        @media(max-width:900px){#ft-ecto-wrap{left:50%;right:auto;top:70px;transform:translateX(-50%);width:min(320px,58vw)}}@media(max-width:780px){.ft-bind-row{grid-template-columns:1fr}.ft-bind-controls{justify-content:flex-start}#ft-controls-button{left:14px;top:62px}#ft-tutorial{bottom:188px;width:min(430px,calc(100vw - 38px))}.ft-mobile-left{width:132px;height:132px}.ft-mobile-right{grid-template-columns:repeat(2,58px);grid-template-rows:repeat(3,58px);gap:8px}.ft-mobile-stick{width:58px;height:58px;margin:-29px}}@media(max-width:430px){.ft-mobile-group{bottom:max(12px,env(safe-area-inset-bottom))}.ft-mobile-left{left:max(10px,env(safe-area-inset-left));width:112px;height:112px}.ft-mobile-right{right:max(10px,env(safe-area-inset-right));grid-template-columns:repeat(2,48px);grid-template-rows:repeat(3,48px);gap:6px}.ft-mobile-btn{border-radius:15px!important;font-size:15px!important}.ft-mobile-stick{width:50px;height:50px;margin:-25px}.ft-mobile-right [data-mobile-action=returnHome]{font-size:9px!important}#ft-tutorial{bottom:160px}#ft-ecto-wrap{top:66px;width:min(300px,64vw)}}
      `;
      document.head.appendChild(style);

      const controlsBtn=document.createElement('button');
      controlsBtn.id='ft-controls-button'; controlsBtn.textContent='CONTROLS';
      document.body.appendChild(controlsBtn);

      const drawer=document.createElement('aside');
      drawer.id='ft-controls-drawer';
      drawer.setAttribute('aria-label','Controls');
      drawer.innerHTML=`<div class="ft-controls-head"><h2>CONTROLS</h2><button class="ft-controls-close">CLOSE</button></div>
        <div class="ft-control-tabs"><button class="ft-control-tab active" data-control-view="keyboard">KEYBOARD</button><button class="ft-control-tab" data-control-view="gamepad">GAMEPAD</button></div>
        <div class="ft-bind-panel active" data-control-panel="keyboard"><div class="ft-controls-copy">One key per action. A key may be shared by multiple actions. Select a binding to replace it, or press Option to unbind it.</div><div class="ft-controls-box"><div id="ft-bind-list"></div></div></div>
        <div class="ft-bind-panel" data-control-panel="gamepad"><div class="ft-controls-copy">One gamepad input per action. Inputs may be shared by multiple actions.</div><div class="ft-controls-box"><div class="ft-gamepad-note">Neutral button names are used so the layout works across different controller styles.</div><div id="ft-gamepad-bind-list"></div></div></div>
        <div class="ft-controls-actions"><button class="ft-reset-binds">RESET CURRENT DEFAULTS</button></div>`;
      document.body.appendChild(drawer);
      const bindList=drawer.querySelector('#ft-bind-list');
      const gamepadBindList=drawer.querySelector('#ft-gamepad-bind-list');

      function renderBinds(){
        bindList.innerHTML=Object.keys(ACTION_LABELS).map(action=>{
          const k=(binds[action]||[])[0]||'';
          const waiting=rebinding&&rebinding.action===action;
          return `<div class="ft-bind-row"><span>${ACTION_LABELS[action]}</span><div class="ft-bind-controls"><button data-bind-action="${action}" class="ft-key-chip ${waiting?'waiting':''}">${waiting?'PRESS KEY':(k?displayKey(k):'UNBOUND')}</button></div></div>`;
        }).join('');
        gamepadBindList.innerHTML=Object.keys(ACTION_LABELS).map(action=>{
          const input=gamepadBinds[action]||'';
          const waiting=gamepadRebinding&&gamepadRebinding.action===action;
          return `<div class="ft-bind-row"><span>${ACTION_LABELS[action]}</span><div class="ft-bind-controls"><button data-gamepad-bind-action="${action}" class="ft-gamepad-chip ${waiting?'waiting':''}">${waiting?'PRESS INPUT':(GAMEPAD_INPUT_LABELS[input]||'UNBOUND')}</button></div></div>`;
        }).join('');
      }
      function setControlsView(view){controlsView=view;rebinding=null;gamepadRebinding=null;drawer.querySelectorAll('.ft-control-tab').forEach(b=>b.classList.toggle('active',b.dataset.controlView===view));drawer.querySelectorAll('.ft-bind-panel').forEach(p=>p.classList.toggle('active',p.dataset.controlPanel===view));renderBinds();}
      function openControls(){ rebinding=null;gamepadRebinding=null;renderBinds();drawer.classList.add('show');heldBoundKeys.clear();Object.keys(keys).forEach(k=>keys[k]=false); }
      function closeControls(){ rebinding=null;gamepadRebinding=null;drawer.classList.remove('show');renderBinds(); }
      controlsBtn.onclick=openControls;
      drawer.querySelector('.ft-controls-close').onclick=closeControls;
      drawer.querySelectorAll('.ft-control-tab').forEach(tab=>tab.onclick=()=>setControlsView(tab.dataset.controlView));
      drawer.querySelector('.ft-reset-binds').onclick=()=>{if(controlsView==='gamepad'){gamepadBinds={...DEFAULT_GAMEPAD_BINDS};saveGamepadBinds();gamepadRebinding=null;}else{binds=cloneDefaultBinds();saveBinds();rebinding=null;renderTutorial();}renderBinds();};
      bindList.onclick=e=>{
        const b=e.target.closest('[data-bind-action]');
        if(!b)return;
        gamepadRebinding=null;rebinding={action:b.dataset.bindAction,index:0};renderBinds();
      };
      gamepadBindList.onclick=e=>{
        const b=e.target.closest('[data-gamepad-bind-action]');
        if(!b)return;
        rebinding=null;gamepadRebinding={action:b.dataset.gamepadBindAction,armed:false,confirmReleased:false,startedAt:performance.now()};renderBinds();
      };

      const ectoWrap=document.createElement('div');
      ectoWrap.id='ft-ecto-wrap';
      ectoWrap.innerHTML='<div id="ft-ecto-label"><span>ECTOPLASMIC ENERGY</span><span id="ft-ecto-pct">100%</span></div><div id="ft-ecto-bar"><div id="ft-ecto-fill"></div></div>';
      document.body.appendChild(ectoWrap);
      const ectoFill=ectoWrap.querySelector('#ft-ecto-fill');
      const ectoPct=ectoWrap.querySelector('#ft-ecto-pct');
      const ectoDanger=document.createElement('div');ectoDanger.id='ft-ecto-danger';document.body.appendChild(ectoDanger);
      let ectoDamageAccumulator=0;

      const ectoImpact=document.createElement('div');ectoImpact.id='ft-ecto-impact';document.body.appendChild(ectoImpact);
      const tutorial=document.createElement('div');tutorial.id='ft-tutorial';document.body.appendChild(tutorial);
      function cap(k){return `<span class="ft-keycap">${displayKey(k)}</span>`;}
      function capAction(action){const k=(binds[action]||[])[0];return k?cap(k):'<span class="ft-keycap">UNBOUND</span>';}
      function gpCapAction(action){const input=gamepadBinds[action];return `<span class="ft-keycap">${GAMEPAD_INPUT_LABELS[input]||'UNBOUND'}</span>`;}
      function mobileCap(label){return `<span class="ft-keycap">${label}</span>`;}
      function tutorialCopy(step){
        const mode=tutorialInputMode;
        if(mode==='gamepad'){
          if(step===0)return [`Move: ${gpCapAction('left')}  ${gpCapAction('right')}`,'Use the bound stick or D Pad direction.'];
          if(step===1)return [`Flap: ${gpCapAction('jump')}`,''];
          if(step===2)return [`Kill the enemy: ${gpCapAction('attack')}`,''];
          if(step===3)return [`Aim + attack: ${gpCapAction('down')} / ${gpCapAction('jump')} + ${gpCapAction('attack')}`,''];
        }
        if(mode==='mobile'){
          if(step===0)return [`Move: ${mobileCap('JOYSTICK')}`,''];
          if(step===1)return [`Flap: ${mobileCap('JUMP')}`,'Dash refills energy.'];
          if(step===2)return [`Kill it: ${mobileCap('ATK')}`,''];
          if(step===3)return [`Directional attack: ${mobileCap('JOYSTICK')} + ${mobileCap('ATK')}`,''];
        }
        if(step===0)return [`Move: ${capAction('left')}  ${capAction('right')}`,''];
        if(step===1)return [`Flap: ${capAction('jump')}`,'Dash refills energy.'];
        if(step===2)return [`Kill it: ${capAction('attack')}`,''];
        if(step===3)return [`Directional attack: ${capAction('jump')} / ${capAction('down')} + ${capAction('attack')}`,''];
        return ['',''];
      }
      function setTutorialInputMode(mode){if(tutorialInputMode!==mode){tutorialInputMode=mode;tutorialRenderedStep=-1;renderTutorial(true);}}
      window.setTutorialInputMode=setTutorialInputMode;
      function renderTutorial(force=false){
        if(onHomeScreen||currentRealm!=='meadow'||gameOver||drawer.classList.contains('show')||tutorialStep>=4){
          if(!tutorialTransitioning) tutorial.style.display='none';
          return;
        }
        if(!force&&tutorialRenderedStep===tutorialStep)return;
        const [main,sub]=tutorialCopy(tutorialStep);
        tutorial.innerHTML=`<div class="ft-tutorial-card"><div class="ft-tutorial-eyebrow">TUTORIAL</div><div class="ft-tutorial-main">${main}</div>${sub?`<div class="ft-tutorial-sub">${sub}</div>`:''}</div>`;
        tutorialRenderedStep=tutorialStep;
        tutorial.style.display='block';
        requestAnimationFrame(()=>tutorial.classList.remove('ft-fade-out'));
      }

      const meadowDef=REALM_FLOW.find(r=>r.id==='meadow');
      if(meadowDef&&!/tutorial/i.test(meadowDef.name))meadowDef.name='Forgotten Meadow · Tutorial';

      function advanceTutorial(){
        if(currentRealm!=='meadow')return;
        let next=tutorialStep;
        if(next===0&&tutorialMoveSeen)next=1;
        if(next===1&&tutorialJumpSeen)next=2;
        if(next===2&&tutorialEnemyKilled)next=3;
        if(next===3&&tutorialDirectionalSeen)next=4;
        if(next===tutorialStep)return;
        if(tutorialFadeTimer)clearTimeout(tutorialFadeTimer);
        tutorialTransitioning=true;
        tutorial.classList.add('ft-fade-out');
        tutorialFadeTimer=setTimeout(()=>{
          tutorialStep=next;
          tutorialRenderedStep=-1;
          if(tutorialStep>=4){
            tutorialCompleteForSave=true;
            tutorial.style.display='none';
            tutorialTransitioning=false;
            try{ saveGame(); }catch(_){}
            return;
          }
          renderTutorial(true);
          tutorialTransitioning=false;
        },280);
      }

      function installFixedMeadowCourse(){
        if(currentRealm!=='meadow')return;
        platforms.length=0;enemies.length=0;heals.length=0;magicItems.length=0;cosmeticItems.length=0;
        const H=window.innerHeight;
        const course=[
          [0,H-250,600],[720,H-285,330],[1160,H-335,270],[1535,H-270,350],[2000,H-360,260],
          [2375,H-300,310],[2800,H-390,260],[3165,H-315,350],[3640,H-250,280],[4035,H-335,320],
          [4470,H-405,250],[4830,H-320,340],[5290,H-260,300],[5705,H-350,290],[6110,H-420,250],
          [6475,H-340,330],[6920,H-275,320],[7355,H-360,260],[7730,H-430,250],[8095,H-345,350],
          [8560,H-285,300],[8975,H-370,270],[9360,H-305,340],[9810,H-390,270],[10200,H-300,500]
        ];
        course.forEach((p,i)=>createPlatform(p[0],p[1],p[2],i));
        const placed=[
          [1350,course[2][1]-35,6,true],
          [2200,course[4][1]-35,6,false],
          [3010,course[6][1]-35,1,false],
          [3820,course[8][1]-35,6,false],
          [4680,course[10][1]-35,1,false],
          [5480,course[12][1]-35,6,false],
          [6280,course[14][1]-35,1,false],
          [7110,course[16][1]-35,6,false],
          [7900,course[18][1]-35,1,false],
          [8750,course[20][1]-35,6,false],
          [9530,course[22][1]-35,1,false]
        ];
        placed.forEach(([x,y,type,target])=>{createEnemy(x,y,type);const e=enemies[enemies.length-1];if(target)e._ftTutorialTarget=true;});
        spawnHeal(4940,course[11][1]-42);spawnHeal(8240,course[19][1]-42);
        maxReachedX=10700;
        meadowCourseInstalled=true;
      }

      const originalExtendWorld=extendWorld;
      extendWorld=function extendWorldWithFixedMeadow(targetX){
        if(currentRealm==='meadow'&&meadowCourseInstalled)return;
        return originalExtendWorld(targetX);
      };

      const originalEnemyKilled=onEnemyKilled;
      onEnemyKilled=function onEnemyKilledWithTutorial(ei){
        const e=enemies[ei];
        if(currentRealm==='meadow'&&e&&e._ftTutorialTarget){tutorialEnemyKilled=true;advanceTutorial();}
        return originalEnemyKilled(ei);
      };

      function isGrounded(){
        if(!player)return false;
        if(player.vy!==0)return false;
        return Math.abs((player.lastSafeY||0)-(player.worldY||0))<5;
      }
      function resetEcto(){ectoEnergy=100;}
      window.addEventListener('ft-successful-dash',()=>{resetEcto();ectoDamageAccumulator=0;});

      function logicalActionsForKey(k){return Object.keys(binds).filter(action=>(binds[action]||[]).includes(k));}
      function actionHeld(action){return (binds[action]||[]).some(k=>heldBoundKeys.has(k));}
      function setLogicalKeyState(action,isDown){
        if(action==='left'){keys['a']=isDown;keys['arrowleft']=false;}
        else if(action==='right'){keys['d']=isDown;keys['arrowright']=false;}
        else if(action==='jump'){keys['w']=isDown;keys['arrowup']=false;if(!isDown)jumpKeyReleased=true;}
        else if(action==='down'){keys['s']=isDown;keys['arrowdown']=false;}
        else if(action==='attack')keys['x']=isDown;
        else if(action==='dash'){keys['shift']=isDown;keys[' ']=false;}
      }

      function attemptBoundDash(){
        return !!(window.ftPerformCurrentDash&&window.ftPerformCurrentDash());
      }

      window.addEventListener('keydown',function(e){
        const k=normalKey(e);
        if(drawer.classList.contains('show')){
          e.preventDefault();e.stopImmediatePropagation();
          if(rebinding){
            if(k==='escape'){rebinding=null;renderBinds();return;}
            const target=rebinding.action;
            // On macOS Option reports as Alt. While replacing an existing binding,
            // Option removes that binding instead of becoming the new key.
            const optionPressed=(k==='alt'||e.key==='Alt'||e.code==='AltLeft'||e.code==='AltRight');
            if(optionPressed){
              binds[target]=[];
              saveBinds();
              renderTutorial();
              rebinding=null;renderBinds();return;
            }
            // One keyboard binding per action. Deliberately DO NOT remove this key
            // from other actions: the same physical key may trigger several actions.
            binds[target]=[k];
            saveBinds();rebinding=null;renderBinds();renderTutorial();
          }else if(k==='escape')closeControls();
          return;
        }
        if(onHomeScreen)return;
        // While paused, leave Tab/Enter/Space to normal browser button navigation.
        // Escape is handled by the release pause layer in capture phase.
        if(window.ftGamePaused)return;
        const actions=logicalActionsForKey(k);if(!actions.length)return;
        setTutorialInputMode('keyboard');
        heldBoundKeys.add(k);
        e.preventDefault();e.stopImmediatePropagation();ensureAudioContext();
        for(const action of actions){
          if(action==='returnHome'){if(!e.repeat){saveGame();showHomeScreen();}continue;}
          if(action==='left'){setLogicalKeyState('left',true);tutorialMoveSeen=true;advanceTutorial();}
          else if(action==='right'){setLogicalKeyState('right',true);tutorialMoveSeen=true;advanceTutorial();}
          else if(action==='down'){setLogicalKeyState('down',true);}
          else if(action==='jump'){
            if(!e.repeat&&jumpKeyReleased&&!gameOver){player.vy=player.flapForce;player.flapAnim=18;playFlapSound();jumpKeyReleased=false;tutorialJumpSeen=true;advanceTutorial();}
            setLogicalKeyState('jump',true);
          }
          else if(action==='attack'){
            setLogicalKeyState('attack',true);
            if(!e.repeat&&!player.isAttacking&&!gameOver){triggerAttack();if(keys['w']||keys['s']){tutorialDirectionalSeen=true;advanceTutorial();}}
          }
          else if(action==='dash'){
            setLogicalKeyState('dash',true);
            if(!e.repeat)attemptBoundDash();
          }
          else if(action==='equipment'){if(!e.repeat)toggleEquipmentMenu();}
        }
      },true);

      window.addEventListener('keyup',function(e){
        const k=normalKey(e);if(drawer.classList.contains('show')){e.preventDefault();e.stopImmediatePropagation();return;}
        if(onHomeScreen)return;
        if(window.ftGamePaused)return;
        const actions=logicalActionsForKey(k);if(!actions.length)return;e.preventDefault();e.stopImmediatePropagation();
        heldBoundKeys.delete(k);
        for(const action of actions){const gp=navigator.getGamepads?[...navigator.getGamepads()].find(Boolean):null;const padHeld=gp&&['left','right','down','jump','attack'].includes(action)?gpActionActive(gp,action):false;setLogicalKeyState(action,actionHeld(action)||padHeld||mobileHeld.has(action));}
      },true);

      function dramaticEctoDamage(){
        if(onHomeScreen||gameOver||ectoEnergy>0)return;
        player.lives=Math.max(0,(Number.isFinite(player.lives)?player.lives:1)-1);
        const livesEl=document.getElementById('lives');if(livesEl)livesEl.innerText=Math.floor(player.lives);
        ectoDanger.classList.remove('hit');void ectoDanger.offsetWidth;ectoDanger.classList.add('hit');
        const gameCanvas=document.getElementById('gameCanvas');
        if(gameCanvas){gameCanvas.classList.remove('ft-ecto-shock');void gameCanvas.offsetWidth;gameCanvas.classList.add('ft-ecto-shock');setTimeout(()=>gameCanvas.classList.remove('ft-ecto-shock'),650);}
        const sx=player.worldX-worldX, sy=player.worldY;
        for(let r=0;r<3;r++){
          const ring=document.createElement('div');ring.className='ft-ecto-ring';ring.style.left=sx+'px';ring.style.top=sy+'px';ring.style.animationDelay=(r*70)+'ms';ectoImpact.appendChild(ring);setTimeout(()=>ring.remove(),1100);
        }
        for(let i=0;i<34;i++){
          const a=Math.random()*Math.PI*2,dist=110+Math.random()*250;
          const mote=document.createElement('i');mote.className='ft-ecto-mote';mote.style.left=(sx+(Math.random()-.5)*28)+'px';mote.style.top=(sy+(Math.random()-.5)*40)+'px';mote.style.setProperty('--dx',(Math.cos(a)*dist)+'px');mote.style.setProperty('--dy',(Math.sin(a)*dist)+'px');mote.style.setProperty('--rot',(Math.random()*360)+'deg');mote.style.animationDelay=(Math.random()*90)+'ms';ectoImpact.appendChild(mote);setTimeout(()=>mote.remove(),1150);
        }
        for(let i=0;i<12;i++)setTimeout(()=>{if(!onHomeScreen&&player)addParticles(player.worldX-worldX+(Math.random()-.5)*130,player.worldY+(Math.random()-.5)*110,i%3===0?'#ffffff':(i%2?'#ff2c75':'#b43cff'));},i*35);
        try{playHitSound&&playHitSound();}catch(_){ }
        if(player.lives<=0)triggerDeathScreen('ectoplasmic energy depletion');
      }

      function updateEctoDepletionVisuals(){
        const canvas=document.getElementById('gameCanvas');
        if(onHomeScreen||gameOver){
          ectoVisualIntensity=0;
          ectoDanger.style.opacity='0';ectoDanger.style.boxShadow='inset 0 0 0 0 rgba(255,0,32,0)';if(canvas)canvas.style.filter='';return;
        }
        const target=Math.max(0,Math.min(1,(5-ectoEnergy)/5));
        if(target===0&&ectoVisualIntensity===0)return;
        // Deliberately slow visual response. Energy can hit zero first, then the
        // red haze and blur swell in over several seconds instead of snapping on.
        const rate=target>ectoVisualIntensity?0.012:0.045;
        ectoVisualIntensity += (target-ectoVisualIntensity)*rate;
        if(ectoVisualIntensity<0.006 && target===0){ectoVisualIntensity=0;ectoDanger.style.opacity='0';ectoDanger.style.boxShadow='inset 0 0 0 0 rgba(255,0,32,0)';if(canvas)canvas.style.filter='';return;}
        const eased=ectoVisualIntensity*ectoVisualIntensity;
        const edgeSize=Math.round(5 + eased*132),edgeBlur=Math.round(16 + eased*112),edgeAlpha=(0.04+eased*.66).toFixed(3);
        ectoDanger.style.opacity=String(Math.min(1,.03+eased*.97));
        ectoDanger.style.boxShadow=`inset 0 0 ${edgeBlur}px ${edgeSize}px rgba(255,0,28,${edgeAlpha})`;
        if(canvas)canvas.style.filter=`blur(${(eased*2.2).toFixed(2)}px)`;
      }

      const priorUpdate=update;
      update=function updateWithTutorialAndEctoplasmicEnergy(){
        priorUpdate();
        const inGame=!onHomeScreen&&!gameOver;
        const mainHud=document.getElementById('ui');
        if(mainHud){
          mainHud.classList.toggle('home-hidden',!inGame);
          mainHud.style.setProperty('display',inGame?'block':'none','important');
        }
        ectoWrap.style.display=inGame?'block':'none';
        if(inGame)ectoWrap.style.top=(boss&&boss.active)?'72px':'18px';
        if(!inGame)return;
        if(!isGrounded())ectoEnergy=Math.max(0,ectoEnergy-0.105);
        else {ectoEnergy=Math.min(100,ectoEnergy+2.6);ectoDamageAccumulator=0;}
        ectoFill.style.width=ectoEnergy+'%';ectoPct.textContent=Math.round(ectoEnergy)+'%';ectoWrap.classList.toggle('low',ectoEnergy<=25);ectoWrap.classList.toggle('empty',ectoEnergy<=0);
        updateEctoDepletionVisuals();
        if(ectoEnergy<=0&&!isGrounded()){
          ectoDamageAccumulator++;
          if(ectoDamageAccumulator>=60){ectoDamageAccumulator=0;dramaticEctoDamage();}
        }else if(ectoEnergy>0){ectoDamageAccumulator=0;}
        renderTutorial();
      };

      const priorReset=resetGame;
      resetGame=function resetGameWithFixedTutorial(){
        priorReset();
        tutorialStep=tutorialCompleteForSave?4:0;tutorialRenderedStep=-1;tutorialTransitioning=false;if(tutorialFadeTimer)clearTimeout(tutorialFadeTimer);tutorialFadeTimer=null;tutorial.classList.remove('ft-fade-out');tutorialMoveSeen=false;tutorialJumpSeen=false;tutorialEnemyKilled=false;tutorialDirectionalSeen=false;resetEcto();ectoDamageAccumulator=0;
        installFixedMeadowCourse();
        player.worldX=100;player.worldY=window.innerHeight-300;player.lastSafeX=100;player.lastSafeY=window.innerHeight-250;
        renderTutorial();
      };

      const priorMakeSaveDataForTutorial=makeSaveData;
      makeSaveData=function makeSaveDataWithTutorialFlag(){const data=priorMakeSaveDataForTutorial();data.tutorialComplete=!!tutorialCompleteForSave;return data;};
      const priorLoadGameForTutorial=loadGame;
      loadGame=function loadGameWithTutorialFlag(slot){
        let done=false;try{const raw=localStorage.getItem(saveKey(slot));if(raw)done=!!JSON.parse(raw).tutorialComplete;}catch(_){}
        tutorialCompleteForSave=done;tutorialStep=done?4:0;
        return priorLoadGameForTutorial(slot);
      };
      const priorStartInSlotForTutorial=startInSlot;
      startInSlot=function startInSlotWithFreshTutorial(slot){tutorialCompleteForSave=false;tutorialStep=0;return priorStartInSlotForTutorial(slot);};

      const priorShowHome=showHomeScreen;
      showHomeScreen=function showHomeWithControlLayer(){heldBoundKeys.clear();document.body.classList.add('ft-home-active');priorShowHome();const mainHud=document.getElementById('ui');if(mainHud){mainHud.classList.add('home-hidden');mainHud.style.setProperty('display','none','important');}ectoWrap.style.display='none';tutorial.style.display='none';ectoDanger.classList.remove('hit');ectoDanger.style.opacity='0';ectoDanger.style.boxShadow='inset 0 0 0 0 rgba(255,0,32,0)';const ftCanvas=document.getElementById('gameCanvas');if(ftCanvas)ftCanvas.style.filter='';closeControls();controlsBtn.style.display='block';};
      const priorHideHome=hideHomeScreen;
      hideHomeScreen=function hideHomeWithControlLayer(){document.body.classList.remove('ft-home-active');if(homeControllerTarget){homeControllerTarget.classList.remove('ft-controller-focus');homeControllerTarget=null;}closeControls();controlsBtn.style.display='none';priorHideHome();const mainHud=document.getElementById('ui');if(mainHud){mainHud.classList.remove('home-hidden');mainHud.style.setProperty('display','block','important');}ectoWrap.style.display='block';};


      // -----------------------------------------------------------------
      // GAMEPAD + TOUCH INPUT LAYER
      // Standard Gamepad API mapping is used so common controller layouts
      // can share the same neutral in-game naming system.
      // -----------------------------------------------------------------
      const mobileControls=document.createElement('div');
      mobileControls.id='ft-mobile-controls';
      mobileControls.innerHTML=`<div class="ft-mobile-group ft-mobile-left">
        <div class="ft-mobile-joystick" aria-label="Movement joystick"><div class="ft-mobile-stick"></div></div>
      </div><div class="ft-mobile-group ft-mobile-right">
        <button class="ft-mobile-btn" data-mobile-action="attack" aria-label="Attack">ATK</button>
        <button class="ft-mobile-btn" data-mobile-action="jump" aria-label="Jump">JUMP</button>
        <button class="ft-mobile-btn" data-mobile-action="down" aria-label="Aim down">↓</button>
        <button class="ft-mobile-btn" data-mobile-action="dash" aria-label="Dash">DASH</button>
        <button class="ft-mobile-btn" data-mobile-action="equipment" aria-label="Equipment">EQ</button>
        <button class="ft-mobile-btn" data-mobile-action="returnHome" aria-label="Autosave and home">HOME</button>
      </div>`;
      document.body.appendChild(mobileControls);
      const mobileHeld=new Set();
      function releaseMobileAction(action){
        mobileHeld.delete(action);
        if(['left','right','jump','down','attack','dash'].includes(action))setLogicalKeyState(action,false);
      }
      function pressMobileAction(action){
        if(onHomeScreen||gameOver||window.ftGamePaused)return;
        if(action==='returnHome'){saveGame();showHomeScreen();return;}
        if(action==='equipment'){toggleEquipmentMenu();return;}
        if(equipmentMenuOpen)return;
        mobileHeld.add(action);
        if(action==='left'){setLogicalKeyState('left',true);tutorialMoveSeen=true;advanceTutorial();}
        else if(action==='right'){setLogicalKeyState('right',true);tutorialMoveSeen=true;advanceTutorial();}
        else if(action==='down')setLogicalKeyState('down',true);
        else if(action==='jump'){
          if(jumpKeyReleased&&!gameOver){player.vy=player.flapForce;player.flapAnim=18;playFlapSound();jumpKeyReleased=false;tutorialJumpSeen=true;advanceTutorial();}
          setLogicalKeyState('jump',true);
        }else if(action==='attack'){
          setLogicalKeyState('attack',true);
          if(!player.isAttacking){triggerAttack();if(keys['w']||keys['s']){tutorialDirectionalSeen=true;advanceTutorial();}}
        }else if(action==='dash'){setLogicalKeyState('dash',true);attemptBoundDash();}
      }
      mobileControls.querySelectorAll('.ft-mobile-btn').forEach(btn=>{
        const action=btn.dataset.mobileAction;
        const down=e=>{e.preventDefault();e.stopPropagation();btn.classList.add('active');pressMobileAction(action);};
        const up=e=>{e.preventDefault();e.stopPropagation();btn.classList.remove('active');releaseMobileAction(action);};
        btn.addEventListener('pointerdown',down,{passive:false});
        btn.addEventListener('pointerup',up,{passive:false});
        btn.addEventListener('pointercancel',up,{passive:false});
        btn.addEventListener('pointerleave',e=>{if(e.buttons)up(e);},{passive:false});
      });
      const mobileJoystick=mobileControls.querySelector('.ft-mobile-joystick');
      const mobileStick=mobileControls.querySelector('.ft-mobile-stick');
      let mobileJoyPointer=null;
      function updateMobileJoystick(e){
        if(window.ftGamePaused)return;
        const r=mobileJoystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
        let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.31,dist=Math.hypot(dx,dy)||1,scale=Math.min(1,max/dist);dx*=scale;dy*=scale;
        mobileStick.style.transform=`translate(${dx}px,${dy}px)`;
        const nx=dx/max,ny=dy/max,dead=.22,left=nx<-dead,right=nx>dead,down=ny>dead;
        setLogicalKeyState('left',left);setLogicalKeyState('right',right);setLogicalKeyState('down',down);
        if(left||right){tutorialMoveSeen=true;advanceTutorial();}
      }
      function releaseMobileJoystick(){mobileJoyPointer=null;mobileStick.style.transform='translate(0,0)';setLogicalKeyState('left',false);setLogicalKeyState('right',false);setLogicalKeyState('down',false);}
      mobileJoystick.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();mobileJoyPointer=e.pointerId;try{mobileJoystick.setPointerCapture(e.pointerId);}catch(_){}updateMobileJoystick(e);},{passive:false});
      mobileJoystick.addEventListener('pointermove',e=>{if(e.pointerId!==mobileJoyPointer)return;e.preventDefault();updateMobileJoystick(e);},{passive:false});
      mobileJoystick.addEventListener('pointerup',e=>{if(e.pointerId===mobileJoyPointer){e.preventDefault();releaseMobileJoystick();}},{passive:false});
      mobileJoystick.addEventListener('pointercancel',releaseMobileJoystick,{passive:false});
      function activateTouchControls(e){
        if((e&&e.pointerType&&e.pointerType!=='touch')||document.body.classList.contains('ft-touch-device'))return;
        document.body.classList.add('ft-touch-device');
        setTutorialInputMode('mobile');
      }
      window.addEventListener('pointerdown',activateTouchControls,{capture:true,passive:true});
      window.addEventListener('touchstart',()=>{document.body.classList.add('ft-touch-device');setTutorialInputMode('mobile');},{capture:true,passive:true});

      const GP={A:0,B:1,X:2,Y:3,LB:4,RB:5,VIEW:8,MENU:9,LS:10,RS:11,UP:12,DOWN:13,LEFT:14,RIGHT:15};
      const gpPrev={};
      const gpBindPrev={};
      function gpInputActive(gp,input){
        if(!gp||!input)return false;
        if(input.startsWith('btn-')){const i=Number(input.slice(4));return !!(gp.buttons[i]&&gp.buttons[i].pressed);}
        const ax0=gp.axes[0]||0,ay0=gp.axes[1]||0,ax1=gp.axes[2]||0,ay1=gp.axes[3]||0;
        if(input==='ls-left')return ax0<-.5;if(input==='ls-right')return ax0>.5;if(input==='ls-up')return ay0<-.5;if(input==='ls-down')return ay0>.5;
        if(input==='rs-left')return ax1<-.5;if(input==='rs-right')return ax1>.5;if(input==='rs-up')return ay1<-.5;if(input==='rs-down')return ay1>.5;
        return false;
      }
      function gpActionActive(gp,action){return gpInputActive(gp,gamepadBinds[action]);}
      function gpActionEdge(gp,action){const key=gp.index+':action:'+action,now=gpActionActive(gp,action),was=!!gpBindPrev[key];gpBindPrev[key]=now;return now&&!was;}
      function detectGamepadInput(gp){
        for(let i=0;i<Math.min(16,gp.buttons.length);i++)if(gp.buttons[i]&&gp.buttons[i].pressed)return 'btn-'+i;
        const a=gp.axes||[];if((a[0]||0)<-.65)return 'ls-left';if((a[0]||0)>.65)return 'ls-right';if((a[1]||0)<-.65)return 'ls-up';if((a[1]||0)>.65)return 'ls-down';
        if((a[2]||0)<-.65)return 'rs-left';if((a[2]||0)>.65)return 'rs-right';if((a[3]||0)<-.65)return 'rs-up';if((a[3]||0)>.65)return 'rs-down';return null;
      }
      let equipmentControllerIndex=0;
      let gpVerticalLatch=0,gpHorizontalLatch=0;
      const gpHeldActions={left:false,right:false,down:false,jump:false,attack:false};
      window.ftClearGameplayInput=function(){
        heldBoundKeys.clear(); mobileHeld.clear();
        Object.keys(gpHeldActions).forEach(k=>gpHeldActions[k]=false);
        Object.keys(keys).forEach(k=>keys[k]=false);
        jumpKeyReleased=true;
        try{releaseMobileJoystick();}catch(_){}
      };
      function gpPressed(gp,index){return !!(gp.buttons[index]&&gp.buttons[index].pressed);}
      function gpEdge(gp,index){const key=gp.index+':'+index,now=gpPressed(gp,index),was=!!gpPrev[key];gpPrev[key]=now;return now&&!was;}
      function markEquipmentCards(scrollSelected=true){
        const cards=[...document.querySelectorAll('#equipment-grid .equipment-card')];
        const owned=player.collectedEquipment||[];
        cards.forEach((card,i)=>{if(owned[i])card.dataset.equipId=owned[i];card.classList.toggle('ft-controller-selected',equipmentMenuOpen&&i===equipmentControllerIndex);});
        if(cards.length){equipmentControllerIndex=Math.max(0,Math.min(equipmentControllerIndex,cards.length-1));cards.forEach((c,i)=>c.classList.toggle('ft-controller-selected',equipmentMenuOpen&&i===equipmentControllerIndex));const sel=cards[equipmentControllerIndex];if(scrollSelected&&sel&&equipmentMenuOpen)sel.scrollIntoView({block:'nearest',inline:'nearest'});}
      }
      const renderEquipmentMenuBeforeController=renderEquipmentMenu;
      renderEquipmentMenu=function renderEquipmentMenuControllerAware(){renderEquipmentMenuBeforeController();markEquipmentCards(false);};
      const toggleEquipmentMenuBeforeController=toggleEquipmentMenu;
      toggleEquipmentMenu=function toggleEquipmentMenuControllerAware(){toggleEquipmentMenuBeforeController();if(equipmentMenuOpen){equipmentControllerIndex=0;setTimeout(markEquipmentCards,0);}else markEquipmentCards();};
      function moveEquipmentSelection(dx,dy){
        const cards=[...document.querySelectorAll('#equipment-grid .equipment-card')];if(!cards.length)return;
        const grid=document.getElementById('equipment-grid');
        let cols=1;try{const g=getComputedStyle(grid);const widths=g.gridTemplateColumns.split(' ').filter(Boolean);cols=Math.max(1,widths.length);}catch(_){}
        equipmentControllerIndex=Math.max(0,Math.min(cards.length-1,equipmentControllerIndex+dx+dy*cols));markEquipmentCards();
      }
      function activateSelectedEquipment(){const cards=[...document.querySelectorAll('#equipment-grid .equipment-card')];const card=cards[equipmentControllerIndex];const id=card&&card.dataset.equipId;if(id)toggleEquipment(id);}

      // Controller navigation for every home-screen surface. The currently
      // targeted control gets the same strong hover treatment as equipment.
      let homeControllerTarget=null,homeNavX=0,homeNavY=0,homeRangeRepeatAt=0;
      function isVisibleControllerElement(el){
        if(!el||el.disabled)return false;
        const cs=getComputedStyle(el),r=el.getBoundingClientRect();
        return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.05&&r.width>2&&r.height>2;
      }
      function homeControllerCandidates(){
        let selectors=[];
        if(document.getElementById('ft-pause-overlay')?.classList.contains('show')){
          selectors=['#ft-pause-overlay button:not(:disabled)'];
        }else if(drawer.classList.contains('show')){
          selectors=['#ft-controls-drawer .ft-controls-close','#ft-controls-drawer .ft-control-tab','#ft-controls-drawer [data-bind-action]','#ft-controls-drawer [data-gamepad-bind-action]','#ft-controls-drawer .ft-reset-binds'];
        }else if(document.getElementById('transfer-menu')?.classList.contains('show')){
          selectors=['#transfer-menu button:not(:disabled)'];
        }else if(document.getElementById('home-settings-drawer')?.classList.contains('show')){
          selectors=['#home-settings-drawer .drawer-close','#home-settings-drawer .death-option'];
        }else if(document.getElementById('audio-panel')?.classList.contains('show')){
          selectors=['#audio-panel input[type=range]','#audio-toggle'];
        }else{
          selectors=['#home-settings-button','#ft-controls-button','#audio-toggle','#home-buttons button:not(:disabled)','#transfer-open-btn'];
        }
        return selectors.flatMap(q=>[...document.querySelectorAll(q)]).filter(isVisibleControllerElement);
      }
      function setHomeControllerTarget(el){
        if(homeControllerTarget&&homeControllerTarget!==el)homeControllerTarget.classList.remove('ft-controller-focus');
        homeControllerTarget=el||null;
        if(homeControllerTarget){homeControllerTarget.classList.add('ft-controller-focus');try{homeControllerTarget.scrollIntoView({block:'nearest',inline:'nearest'});}catch(_){}}
      }
      function ensureHomeControllerTarget(){
        const list=homeControllerCandidates();
        if(!list.length){setHomeControllerTarget(null);return null;}
        if(!homeControllerTarget||!list.includes(homeControllerTarget))setHomeControllerTarget(list[0]);
        return homeControllerTarget;
      }
      function moveHomeControllerTarget(dx,dy){
        const list=homeControllerCandidates();if(!list.length)return;
        const cur=ensureHomeControllerTarget();if(!cur){setHomeControllerTarget(list[0]);return;}
        const cr=cur.getBoundingClientRect(),cx=cr.left+cr.width/2,cy=cr.top+cr.height/2;
        let best=null,bestScore=Infinity;
        for(const el of list){if(el===cur)continue;const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,vx=x-cx,vy=y-cy;
          if(dx<0&&vx>=-4)continue;if(dx>0&&vx<=4)continue;if(dy<0&&vy>=-4)continue;if(dy>0&&vy<=4)continue;
          const primary=Math.abs(dx?vx:vy),cross=Math.abs(dx?vy:vx),score=primary+cross*2.1;if(score<bestScore){bestScore=score;best=el;}
        }
        if(!best){const i=list.indexOf(cur);best=list[(i+(dx+dy>0?1:-1)+list.length)%list.length];}
        setHomeControllerTarget(best);
      }
      function activateHomeControllerTarget(){
        const el=ensureHomeControllerTarget();if(!el)return;
        if(el.matches('input[type=range]'))return;
        el.click();
        setTimeout(()=>ensureHomeControllerTarget(),0);
      }
      function adjustHomeRange(dir,amount=3){
        const el=ensureHomeControllerTarget();if(!el||!el.matches('input[type=range]'))return false;
        const min=Number(el.min||0),max=Number(el.max||100),step=Number(el.step||1)||1;
        const delta=Math.max(step,amount);el.value=String(Math.max(min,Math.min(max,Number(el.value||0)+dir*delta)));
        el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;
      }
      function closeTopHomeSurface(){
        if(document.getElementById('ft-pause-overlay')?.classList.contains('show')){if(window.ftSetPaused)window.ftSetPaused(false);return true;}
        if(drawer.classList.contains('show')){closeControls();return true;}
        if(document.getElementById('transfer-menu')?.classList.contains('show')){closeTransferMenu();return true;}
        if(document.getElementById('home-settings-drawer')?.classList.contains('show')){closeHomeSettings();return true;}
        if(document.getElementById('audio-panel')?.classList.contains('show')){document.getElementById('audio-panel').classList.remove('show');return true;}
        return false;
      }
      function handleHomeGamepad(gp){
        ensureHomeControllerTarget();
        const ax=gp.axes[0]||0,ay=gp.axes[1]||0;
        const left=gpPressed(gp,GP.LEFT)||ax<-.55,right=gpPressed(gp,GP.RIGHT)||ax>.55,up=gpPressed(gp,GP.UP)||ay<-.55,down=gpPressed(gp,GP.DOWN)||ay>.55;
        const selected=ensureHomeControllerTarget(),range=selected&&selected.matches('input[type=range]');
        const now=performance.now();
        if(range&&(left||right)){
          if(now>=homeRangeRepeatAt){adjustHomeRange(left?-1:1,3);homeRangeRepeatAt=now+90;}
          homeNavX=left?-1:1;
        }else{
          if(left&&homeNavX!==-1){moveHomeControllerTarget(-1,0);homeNavX=-1;}else if(right&&homeNavX!==1){moveHomeControllerTarget(1,0);homeNavX=1;}else if(!left&&!right)homeNavX=0;
        }
        if(up&&homeNavY!==-1){moveHomeControllerTarget(0,-1);homeNavY=-1;}else if(down&&homeNavY!==1){moveHomeControllerTarget(0,1);homeNavY=1;}else if(!up&&!down)homeNavY=0;
        if(gpEdge(gp,GP.A))activateHomeControllerTarget();
        if(gpEdge(gp,GP.B)){closeTopHomeSurface();setTimeout(()=>ensureHomeControllerTarget(),0);}
      }

      // Controller navigation for the death screen mirrors the home/Y-menu focus model.
      let deathControllerTarget=null,deathNavLatch=0;
      function deathControllerButtons(){
        return [...document.querySelectorAll('#death-screen.show .death-actions button')].filter(isVisibleControllerElement);
      }
      function setDeathControllerTarget(el){
        if(deathControllerTarget&&deathControllerTarget!==el)deathControllerTarget.classList.remove('ft-controller-focus');
        deathControllerTarget=el||null;
        if(deathControllerTarget)deathControllerTarget.classList.add('ft-controller-focus');
      }
      function ensureDeathControllerTarget(){
        const list=deathControllerButtons();
        if(!list.length){setDeathControllerTarget(null);return null;}
        if(!deathControllerTarget||!list.includes(deathControllerTarget))setDeathControllerTarget(list[0]);
        return deathControllerTarget;
      }
      function moveDeathControllerTarget(dir){
        const list=deathControllerButtons();if(!list.length)return;
        const cur=ensureDeathControllerTarget();
        const idx=Math.max(0,list.indexOf(cur));
        setDeathControllerTarget(list[(idx+dir+list.length)%list.length]);
      }
      function handleDeathGamepad(gp){
        const ay=gp.axes[1]||0;
        const left=gpPressed(gp,GP.LEFT)||(gp.axes[0]||0)<-.55;
        const right=gpPressed(gp,GP.RIGHT)||(gp.axes[0]||0)>.55;
        const up=gpPressed(gp,GP.UP)||ay<-.55;
        const down=gpPressed(gp,GP.DOWN)||ay>.55;
        const prev=left||up, next=right||down;
        ensureDeathControllerTarget();
        if(prev&&deathNavLatch!==-1){moveDeathControllerTarget(-1);deathNavLatch=-1;}
        else if(next&&deathNavLatch!==1){moveDeathControllerTarget(1);deathNavLatch=1;}
        else if(!prev&&!next)deathNavLatch=0;
        if(gpEdge(gp,GP.A)){const el=ensureDeathControllerTarget();if(el)el.click();}
      }

      function gamepadLoop(){
        const pads=navigator.getGamepads?navigator.getGamepads():[];
        const gp=[...pads].find(Boolean);
        if(gp&&gpEdge(gp,GP.MENU)&&!drawer.classList.contains('show')&&!ftDeathPending&&!onHomeScreen&&window.ftTogglePause){
          window.ftTogglePause();
        }
        if(gp&&drawer.classList.contains('show')&&gamepadRebinding){
          const input=detectGamepadInput(gp);
          // The confirm press used to choose a binding row must be released once
          // before capture starts. This prevents Face Bottom from instantly
          // rebinding every action to itself.
          if(!gamepadRebinding.armed){
            // The Face Bottom press used to enter remapping is a UI confirm, not the requested bind.
            // Ignore it once, wait for it to be physically released, then listen for the next deliberate input.
            const confirmDown=gpPressed(gp,GP.A);
            if(!confirmDown) gamepadRebinding.confirmReleased=true;
            if(gamepadRebinding.confirmReleased && performance.now()-(gamepadRebinding.startedAt||0)>140) gamepadRebinding.armed=true;
          }else if(input){
            gamepadBinds[gamepadRebinding.action]=input;
            saveGamepadBinds();
            gamepadRebinding=null;
            renderBinds();
          }
        }else if(gp&&ftDeathPending){
          handleDeathGamepad(gp);
        }else if(gp&&window.ftGamePaused){
          handleHomeGamepad(gp);
        }else if(gp&&onHomeScreen){
          handleHomeGamepad(gp);
        }else if(gp&&!onHomeScreen&&!gameOver&&!window.ftGamePaused){
          if(equipmentMenuOpen){
            const ax=gp.axes[0]||0,ay=gp.axes[1]||0;
            const left=gpPressed(gp,GP.LEFT)||ax<-.55,right=gpPressed(gp,GP.RIGHT)||ax>.55,up=gpPressed(gp,GP.UP)||ay<-.55,down=gpPressed(gp,GP.DOWN)||ay>.55;
            if(left&&gpHorizontalLatch!==-1){moveEquipmentSelection(-1,0);gpHorizontalLatch=-1;}else if(right&&gpHorizontalLatch!==1){moveEquipmentSelection(1,0);gpHorizontalLatch=1;}else if(!left&&!right)gpHorizontalLatch=0;
            if(up&&gpVerticalLatch!==-1){moveEquipmentSelection(0,-1);gpVerticalLatch=-1;}else if(down&&gpVerticalLatch!==1){moveEquipmentSelection(0,1);gpVerticalLatch=1;}else if(!up&&!down)gpVerticalLatch=0;
            if(gpEdge(gp,GP.A))activateSelectedEquipment();
            if(gpEdge(gp,GP.B)||gpActionEdge(gp,'equipment'))toggleEquipmentMenu();
          }else{
            const left=gpActionActive(gp,'left'),right=gpActionActive(gp,'right'),down=gpActionActive(gp,'down');
            if(left||right||down||gpActionActive(gp,'jump')||gpActionActive(gp,'attack')||gpActionActive(gp,'dash'))setTutorialInputMode('gamepad');
            if(left!==gpHeldActions.left){gpHeldActions.left=left;setLogicalKeyState('left',left||actionHeld('left')||mobileHeld.has('left'));}
            if(right!==gpHeldActions.right){gpHeldActions.right=right;setLogicalKeyState('right',right||actionHeld('right')||mobileHeld.has('right'));}
            if(down!==gpHeldActions.down){gpHeldActions.down=down;setLogicalKeyState('down',down||actionHeld('down')||mobileHeld.has('down'));}
            if(left||right){tutorialMoveSeen=true;advanceTutorial();}
            if(gpActionEdge(gp,'jump')){
              if(jumpKeyReleased){player.vy=player.flapForce;player.flapAnim=18;playFlapSound();jumpKeyReleased=false;tutorialJumpSeen=true;advanceTutorial();}
              setLogicalKeyState('jump',true);
            }
            if(!gpActionActive(gp,'jump')&&!actionHeld('jump')){setLogicalKeyState('jump',false);jumpKeyReleased=true;}
            if(player.isAttacking&&down)player.attackDir='down';
            if(gpActionEdge(gp,'attack')){setLogicalKeyState('attack',true);if(!player.isAttacking){triggerAttack();if(down)player.attackDir='down';else if(gpActionActive(gp,'jump'))player.attackDir='up';if(gpActionActive(gp,'jump')||down){tutorialDirectionalSeen=true;advanceTutorial();}}}
            if(!gpActionActive(gp,'attack')&&!actionHeld('attack'))setLogicalKeyState('attack',false);
            if(gpActionEdge(gp,'dash'))attemptBoundDash();
            if(gpActionEdge(gp,'equipment'))toggleEquipmentMenu();
            if(gpActionEdge(gp,'returnHome')){saveGame();showHomeScreen();}
          }
        }
        requestAnimationFrame(gamepadLoop);
      }
      requestAnimationFrame(gamepadLoop);
      document.body.classList.toggle('ft-home-active',!!onHomeScreen);
      controlsBtn.style.display=onHomeScreen?'block':'none';
      renderBinds();renderTutorial();
    })();
