/* Faded Thread module: 19-release-hardening.js | release master 03 Oct 2026 */
(function installFadedThreadReleaseHardening(){
  'use strict';

  const RELEASE_BUILD = '2026.10.03-html-master';
  window.FADED_THREAD_BUILD = RELEASE_BUILD;
  window.ftGamePaused = false;
  document.title = 'Faded Thread';
  document.documentElement.setAttribute('data-faded-thread-build', RELEASE_BUILD);

  const style = document.createElement('style');
  style.textContent = `
    #ft-pause-button{position:fixed;right:58px;top:14px;z-index:11510;width:36px;height:36px;border-radius:11px;border:1px solid rgba(190,210,255,.3);background:rgba(8,10,23,.72);backdrop-filter:blur(10px);color:#eef4ff;cursor:pointer;font:800 13px/1 inherit;box-shadow:0 8px 22px rgba(0,0,0,.24),0 0 13px rgba(120,160,255,.14);display:none}
    #ft-pause-button:hover{background:rgba(15,19,40,.9);transform:translateY(-1px)}
    #ft-pause-overlay{position:fixed;inset:0;z-index:17000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(3,4,12,.78);backdrop-filter:blur(12px);color:#eef4ff;font-family:'Courier New',Courier,monospace}
    #ft-pause-overlay.show{display:flex}
    .ft-pause-card{width:min(470px,94vw);padding:30px;border:1px solid rgba(210,225,255,.38);border-radius:22px;background:linear-gradient(180deg,rgba(15,18,40,.98),rgba(4,6,16,.97));box-shadow:0 22px 70px rgba(0,0,0,.55),0 0 40px rgba(120,160,255,.15);text-align:center}
    .ft-pause-eyebrow{font-size:.68rem;letter-spacing:.3em;opacity:.58;margin-bottom:8px}
    .ft-pause-card h2{margin:0 0 7px;font-size:2.1rem;letter-spacing:.16em}
    .ft-pause-copy{font-size:.78rem;line-height:1.5;opacity:.7;margin-bottom:19px}
    .ft-pause-actions{display:grid;gap:9px}
    .ft-pause-actions button,.ft-home-fullscreen{cursor:pointer;border:1px solid rgba(210,225,255,.36);border-radius:12px;padding:12px 14px;background:rgba(255,255,255,.07);color:#eef4ff;font:800 .78rem 'Courier New',Courier,monospace;letter-spacing:.08em}
    .ft-pause-actions button:hover,.ft-home-fullscreen:hover{background:rgba(180,205,255,.16)}
    #ft-release-toast{position:fixed;left:50%;bottom:28px;z-index:18000;max-width:min(620px,calc(100vw - 36px));transform:translate(-50%,18px);padding:11px 15px;border-radius:11px;border:1px solid rgba(255,180,180,.55);background:rgba(38,9,15,.95);color:#ffe7e7;font:700 .74rem/1.45 'Courier New',Courier,monospace;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;text-align:center}
    #ft-release-toast.show{opacity:1;transform:translate(-50%,0)}
    .ft-home-release-row{margin-top:10px}
    .ft-home-release-row .ft-home-fullscreen{width:100%}
    body.ft-paused #ft-mobile-controls{pointer-events:none!important;opacity:.28!important}
  `;
  document.head.appendChild(style);

  const pauseButton = document.createElement('button');
  pauseButton.id = 'ft-pause-button';
  pauseButton.type = 'button';
  pauseButton.setAttribute('aria-label','Pause game');
  pauseButton.textContent = 'Ⅱ';
  document.body.appendChild(pauseButton);

  const pauseOverlay = document.createElement('div');
  pauseOverlay.id = 'ft-pause-overlay';
  pauseOverlay.setAttribute('role','dialog');
  pauseOverlay.setAttribute('aria-modal','true');
  pauseOverlay.setAttribute('aria-label','Pause menu');
  pauseOverlay.innerHTML = `
    <div class="ft-pause-card">
      <div class="ft-pause-eyebrow">THREAD SUSPENDED</div>
      <h2>PAUSED</h2>
      <div class="ft-pause-copy">Press Esc or the controller Menu button to resume.</div>
      <div class="ft-pause-actions">
        <button type="button" id="ft-pause-resume">RESUME</button>
        <button type="button" id="ft-pause-fullscreen">ENTER FULLSCREEN</button>
        <button type="button" id="ft-pause-home">SAVE + RETURN HOME</button>
      </div>
    </div>`;
  document.body.appendChild(pauseOverlay);

  const toast = document.createElement('div');
  toast.id = 'ft-release-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);
  let toastTimer = 0;
  function releaseToast(message){
    toast.textContent = String(message || '');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.classList.remove('show'),5000);
  }
  window.ftReleaseToast = releaseToast;

  function clearGameplayInput(){
    try{
      if(typeof window.ftClearGameplayInput === 'function') window.ftClearGameplayInput();
      else {
        Object.keys(keys || {}).forEach(k=>keys[k]=false);
        jumpKeyReleased = true;
      }
    }catch(_){}
  }

  function gameCanPause(){
    if(typeof onHomeScreen !== 'undefined' && onHomeScreen) return false;
    if(typeof gameOver !== 'undefined' && gameOver) return false;
    if(document.getElementById('death-screen')?.classList.contains('show')) return false;
    const ending = document.getElementById('v32EndingOverlay');
    if(ending && getComputedStyle(ending).display !== 'none') return false;
    return true;
  }

  function setPaused(next){
    next = !!next && gameCanPause();
    if(window.ftGamePaused === next) return;
    window.ftGamePaused = next;
    document.body.classList.toggle('ft-paused', next);
    pauseOverlay.classList.toggle('show', next);
    pauseButton.setAttribute('aria-label', next ? 'Resume game' : 'Pause game');
    if(next){
      clearGameplayInput();
      setTimeout(()=>document.getElementById('ft-pause-resume')?.focus(),0);
    }
  }
  window.ftSetPaused = setPaused;
  window.ftTogglePause = ()=>setPaused(!window.ftGamePaused);

  // Freeze gameplay simulation while still allowing the already-rendered world
  // and menus to remain visible. This wraps the final optimised update function.
  const updateBeforeReleasePause = update;
  update = function updateWithReleasePause(){
    if(window.ftGamePaused) return;
    return updateBeforeReleasePause();
  };

  async function toggleFullscreen(){
    try{
      if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    }catch(err){
      console.warn('[Faded Thread] Fullscreen request failed', err);
      releaseToast('Fullscreen could not be changed on this device.');
    }
  }
  window.ftToggleFullscreen = toggleFullscreen;

  function refreshFullscreenLabels(){
    const label = document.fullscreenElement ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN';
    const pauseFs = document.getElementById('ft-pause-fullscreen');
    const homeFs = document.getElementById('ft-home-fullscreen');
    if(pauseFs) pauseFs.textContent = label;
    if(homeFs) homeFs.textContent = label;
    setTimeout(()=>window.dispatchEvent(new Event('resize')),30);
  }
  document.addEventListener('fullscreenchange', refreshFullscreenLabels);

  document.getElementById('ft-pause-resume').addEventListener('click',()=>setPaused(false));
  document.getElementById('ft-pause-fullscreen').addEventListener('click',toggleFullscreen);
  document.getElementById('ft-pause-home').addEventListener('click',()=>{
    try{ saveGame(); }catch(err){ console.error('[Faded Thread] Save before home failed',err); }
    setPaused(false);
    showHomeScreen();
  });
  pauseButton.addEventListener('click',()=>window.ftTogglePause());

  // Fullscreen is also available before starting a run.
  const transferRow = document.querySelector('.home-transfer-row');
  if(transferRow){
    const row = document.createElement('div');
    row.className = 'ft-home-release-row';
    row.innerHTML = '<button type="button" class="ft-home-fullscreen" id="ft-home-fullscreen">ENTER FULLSCREEN</button>';
    transferRow.insertAdjacentElement('afterend', row);
    row.querySelector('button').addEventListener('click',toggleFullscreen);
  }

  // Escape is reserved for pause/close behaviour and is intentionally not a
  // rebindable gameplay action. The controller Menu/Start button mirrors it.
  window.addEventListener('keydown',e=>{
    if(e.key !== 'Escape') return;
    const controlsDrawer = document.getElementById('ft-controls-drawer');
    if(controlsDrawer?.classList.contains('show')) return; // its own handler closes it
    const audioPanel = document.getElementById('audio-panel');
    if(audioPanel?.classList.contains('show')){
      e.preventDefault(); e.stopImmediatePropagation(); audioPanel.classList.remove('show'); return;
    }
    if(typeof onHomeScreen !== 'undefined' && onHomeScreen){
      if(document.getElementById('transfer-menu')?.classList.contains('show')){e.preventDefault();e.stopImmediatePropagation();closeTransferMenu();return;}
      if(document.getElementById('home-settings-drawer')?.classList.contains('show')){e.preventDefault();e.stopImmediatePropagation();closeHomeSettings();return;}
      return;
    }
    if(typeof equipmentMenuOpen !== 'undefined' && equipmentMenuOpen){
      e.preventDefault(); e.stopImmediatePropagation(); toggleEquipmentMenu(); return;
    }
    if(gameCanPause()){
      e.preventDefault(); e.stopImmediatePropagation(); window.ftTogglePause();
    }
  },true);

  // Alt-tabbing or losing the window must never leave a movement key stuck or
  // allow the player to die while the game is not focused.
  window.addEventListener('blur',()=>{ if(gameCanPause()) setPaused(true); else clearGameplayInput(); });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden && gameCanPause()) setPaused(true);
    if(document.hidden) clearGameplayInput();
  });

  // Save failures (quota/private-storage problems) are surfaced instead of being
  // silently lost. localStorage writes are atomic, so the previous save remains
  // intact if a new write fails.
  const saveBeforeReleaseSafety = saveGame;
  saveGame = function saveGameReleaseSafe(){
    try{
      const result = saveBeforeReleaseSafety();
      return result === false ? false : true;
    }catch(err){
      console.error('[Faded Thread] Save failed', err);
      releaseToast('SAVE FAILED — export your save from the home screen before closing the game.');
      return false;
    }
  };

  function saveOnExit(){
    try{
      if(typeof onHomeScreen !== 'undefined' && !onHomeScreen && typeof activeSaveSlot !== 'undefined' && activeSaveSlot) saveGame();
    }catch(err){ console.error('[Faded Thread] Exit autosave failed',err); }
  }
  window.addEventListener('pagehide', saveOnExit);
  window.addEventListener('beforeunload', saveOnExit);

  // Ensure pause state cannot leak through a load/new-game/home transition.
  const showHomeBeforeRelease = showHomeScreen;
  showHomeScreen = function showHomeReleaseSafe(){
    setPaused(false);
    pauseButton.style.display = 'none';
    const result = showHomeBeforeRelease();
    try{
      if(typeof ftThemeAudio !== 'undefined'){ ftThemeAudio.pause(); ftThemeAudio.currentTime = 0; }
      if(typeof window.ftStopIncomingRealmTrack === 'function') window.ftStopIncomingRealmTrack();
    }catch(_){}
    return result;
  };
  const hideHomeBeforeRelease = hideHomeScreen;
  hideHomeScreen = function hideHomeReleaseSafe(){
    setPaused(false);
    const result = hideHomeBeforeRelease();
    pauseButton.style.display = 'block';
    return result;
  };

  // Log unreadable audio once for diagnostics without repeatedly interrupting play.
  const reportedAudioErrors = new Set();
  function reportAudioError(path){
    const key=String(path||'unknown'); if(reportedAudioErrors.has(key))return;
    reportedAudioErrors.add(key); console.error('[Faded Thread] Missing or unreadable audio asset:',key);
  }
  try{
    if(typeof ftThemeAudio !== 'undefined') ftThemeAudio.addEventListener('error',()=>reportAudioError(ftThemeAudio.currentSrc||ftThemeAudio.src));
    if(typeof ftSfx !== 'undefined') Object.values(ftSfx).forEach(a=>a.addEventListener('error',()=>reportAudioError(a.currentSrc||a.src)));
  }catch(_){}

  pauseButton.style.display = (typeof onHomeScreen !== 'undefined' && onHomeScreen) ? 'none' : 'block';
  refreshFullscreenLabels();
})();
