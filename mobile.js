/* Faded Thread mobile layer | 03 Oct 2026 */
(function(){
  'use strict';
  const doc=document, root=doc.documentElement;

  // Detect touch devices up front so controls and layout appear immediately.
  try{
    if(window.matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)){
      doc.body.classList.add('ft-touch-device');
    }
  }catch(_){}

  // Block pinch zoom, double-tap zoom, long-press menus and rubber-banding.
  ['gesturestart','gesturechange','gestureend'].forEach(t=>doc.addEventListener(t,e=>e.preventDefault(),{passive:false}));
  doc.addEventListener('contextmenu',e=>{if(doc.body.classList.contains('ft-touch-device'))e.preventDefault();});
  let lastEnd=0;
  doc.addEventListener('touchend',e=>{
    const n=Date.now();
    if(n-lastEnd<350&&!(e.target.closest&&e.target.closest('input,select,textarea')))e.preventDefault();
    lastEnd=n;
  },{passive:false});
  doc.addEventListener('touchmove',e=>{
    const t=e.target;
    if(t.closest&&t.closest('#home-screen .home-panel,.transfer-panel,.equipment-panel,#home-settings-drawer,.death-card,#ft-controls-panel,input[type=range]'))return;
    if(e.touches.length>1||doc.body.classList.contains('ft-touch-device'))e.preventDefault();
  },{passive:false});

  // Rotate hint for portrait phones.
  const hint=doc.createElement('div');
  hint.id='ft-rotate-hint';
  hint.innerHTML='<span class="ft-rot-icon">&#128241;</span>Turn your phone sideways for the best view.<br><button type="button">PLAY ANYWAY</button>';
  hint.querySelector('button').addEventListener('click',()=>doc.body.classList.add('ft-rotate-dismissed'));
  doc.body.appendChild(hint);

  // Keep the canvas matched to the real visible viewport (URL bars, rotation, keyboards).
  function syncSize(){
    const vv=window.visualViewport;
    root.style.setProperty('--ft-vh',(vv?vv.height:window.innerHeight)+'px');
    window.dispatchEvent(new Event('resize'));
  }
  let t=null;
  function queue(){clearTimeout(t);t=setTimeout(syncSize,60);}
  window.addEventListener('orientationchange',()=>{setTimeout(syncSize,150);setTimeout(syncSize,500);});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',queue);

  // First touch unlocks audio on iOS/Android.
  function unlock(){
    try{
      const C=window.AudioContext||window.webkitAudioContext;
      [window.audioCtx,window.audioContext,window.actx].forEach(c=>{if(c&&c.state==='suspended')c.resume();});
      doc.querySelectorAll('audio').forEach(a=>{if(a.paused&&a.dataset.ftUnlocked!=='1'){a.dataset.ftUnlocked='1';}});
    }catch(_){}
  }
  ['touchstart','pointerdown'].forEach(ev=>window.addEventListener(ev,unlock,{passive:true,once:false}));
  syncSize();
})();
