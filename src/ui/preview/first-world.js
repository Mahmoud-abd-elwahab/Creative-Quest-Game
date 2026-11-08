/**
 * DESIGN PREVIEW ONLY.
 * No gameplay state, save mutation, scoring, event bridge, or Engine pause/resume.
 * All visible values are illustrative fixtures and navigation changes only this preview.
 */
(() => {
  'use strict';
  const screens = new Set(['hud','challenge','weak','success','boss','loading','offline','locked']);
  const dialog = document.getElementById('uxDialog');
  const title = document.getElementById('dialogTitle');
  const eyebrow = document.getElementById('dialogEyebrow');
  const content = document.getElementById('dialogContent');
  const footer = document.getElementById('dialogFooter');
  const closeButton = document.getElementById('closeDialog');
  const trigger = document.getElementById('actionTrigger');
  let focusOrigin = trigger; // ephemeral focus state only

  const fixture = {
    challenge: { heading:'قبل ما تفسّر، لاحظ', tag:'OBSERVATION · LEVEL 01',
      template:'challengeBody', footer:[
        {text:'ورّيني تلميح',kind:'secondary',hint:true},
        {text:'راجع إجابتي',kind:'primary',screen:'weak'}
      ] },
    weak: { heading:'راجع طريقة تفكيرك', tag:'OBSERVATION · FEEDBACK',
      template:'weakBody', footer:[
        {text:'ارجع للخريطة',kind:'secondary',screen:'hud'},
        {text:'جرّب مرة تانية',kind:'primary',screen:'challenge'}
      ] },
    success: { heading:'المهمة اتعلمتها', tag:'OBSERVATION · FEEDBACK',
      template:'successBody', footer:[{text:'كمل الاستكشاف',kind:'primary',screen:'hud'}] },
    boss: { heading:'مواجهة الـBoss', tag:'WORLD 01 · BOSS · PHASE 02',
      template:'bossBody', footer:[
        {text:'ارجع للخريطة',kind:'secondary',screen:'hud'},
        {text:'راجع المرحلة',kind:'primary',screen:'weak'}
      ] },
    loading: { heading:'تحميل العالم',tag:'CREATIVE QUEST · LOADING',
      template:'loadingBody',footer:[{text:'رجوع',kind:'secondary',screen:'hud'}] },
    offline: { heading:'حالة الاتصال',tag:'CREATIVE QUEST · OFFLINE',
      template:'offlineBody', footer:[
        {text:'ارجع للخريطة',kind:'secondary',screen:'hud'},
        {text:'حاول تاني',kind:'primary',screen:'loading'}
      ] },
    locked: { heading:'حالة الميزة',tag:'CREATIVE QUEST · LOCKED',
      template:'lockedBody', footer:[{text:'تمام، ارجع',kind:'primary',screen:'hud'}] }
  };

  function setQuery(screen) {
    const url = new URL(location.href);
    if (screen === 'hud') url.searchParams.delete('screen');
    else url.searchParams.set('screen',screen);
    history.replaceState(null,'',url);
  }

  function render(screen, opener) {
    if (!screens.has(screen)) screen = 'hud';
    if (screen === 'hud') {
      if (dialog.open) dialog.close('close');
      setQuery('hud');
      return;
    }
    if (opener && !dialog.contains(opener)) focusOrigin=opener;
    const view=fixture[screen];
    eyebrow.textContent=view.tag;
    title.textContent=view.heading;
    content.replaceChildren(document.getElementById(view.template).content.cloneNode(true));
    footer.replaceChildren();
    for(const action of view.footer) {
      const button=document.createElement('button');
      button.type='button';
      button.className='btn '+action.kind;
      button.textContent=action.text;
      if (action.screen) button.dataset.previewTo=action.screen;
      if (action.hint) button.dataset.previewHint='true';
      footer.append(button);
    }
    if (!dialog.open) dialog.showModal();
    content.scrollTop=0;
    title.tabIndex=-1;
    title.focus({preventScroll:true});
    setQuery(screen);
  }

  document.addEventListener('click',(e)=>{
    if (!(e.target instanceof Element)) return;
    const target=e.target.closest('[data-preview-to]');
    if (target instanceof HTMLElement) {
      e.preventDefault();
      render(target.dataset.previewTo,target);
      return;
    }
    if (e.target.closest('[data-preview-hint]')) {
      const hint=document.getElementById('hintText');
      if(hint) { hint.hidden=false; hint.tabIndex=-1; hint.focus(); }
    }
  });
  closeButton.addEventListener('click',()=>dialog.close('close'));
  dialog.addEventListener('close',()=>{
    // HTMLDialogElement provides focus containment. Restore our exact opener.
    if (focusOrigin?.isConnected) focusOrigin.focus({preventScroll:true});
    setQuery('hud');
  });
  const requested = new URLSearchParams(location.search).get('screen') || 'hud';
  if(requested!=='hud') render(requested);
})();
