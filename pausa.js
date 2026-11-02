/* Botão de pausa das duas telas.
   Expõe window.PAUSADO (o laço de animação de cada tela consulta isso) e
   congela também as animações de CSS/WAAPI (volante, tampas).
   Atalho: barra de espaço ou P. */
(function(){
  var pausado=false, btn=null;

  var CSS = '#btn-pausa{position:fixed;top:clamp(12px,1.8vh,22px);left:clamp(14px,1.8vw,26px);'
    + 'z-index:9;display:inline-flex;align-items:center;gap:8px;'
    + 'padding:9px 16px 9px 12px;border-radius:999px;cursor:pointer;'
    + 'background:#FEFEFE;border:1px solid #D7DBE1;color:#17150F;'
    + "font-family:-apple-system,'SF Pro Text',BlinkMacSystemFont,system-ui,sans-serif;"
    + 'font-size:clamp(13px,1.6vh,15px);font-weight:600;letter-spacing:-.011em;'
    + 'box-shadow:0 1px 2px rgba(23,28,38,.04),0 10px 24px -16px rgba(23,28,38,.28);'
    + 'transition:border-color .18s,box-shadow .18s,transform .12s}'
    + '#btn-pausa:hover{border-color:#FA6503}'
    + '#btn-pausa:active{transform:scale(.97)}'
    + '#btn-pausa svg{display:block;flex:0 0 auto}'
    + '#btn-pausa .tx{min-width:7.2ch;text-align:left}'
    + '#btn-pausa.on{border-color:#FA6503}';

  var ICONE_PAUSA = '<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">'
    + '<rect x="1" y="1" width="4.4" height="14" rx="1.6" fill="#FA6503"/>'
    + '<rect x="8.6" y="1" width="4.4" height="14" rx="1.6" fill="#FA6503"/></svg>';
  var ICONE_PLAY = '<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">'
    + '<path d="M2.4 1.6 12.6 7.3a.8.8 0 0 1 0 1.4L2.4 14.4A.8.8 0 0 1 1.2 13.7V2.3'
    + 'a.8.8 0 0 1 1.2-.7Z" fill="#FA6503"/></svg>';

  function pinta(){
    btn.innerHTML = (pausado?ICONE_PLAY:ICONE_PAUSA)
      + '<span class="tx">' + (pausado?'Continuar':'Pausar') + '</span>';
    btn.classList.toggle('on', pausado);
    btn.setAttribute('aria-pressed', pausado ? 'true' : 'false');
  }

  function alterna(){
    pausado = !pausado;
    window.PAUSADO = pausado;
    if(document.getAnimations) document.getAnimations().forEach(function(a){
      try{ pausado ? a.pause() : a.play(); }catch(e){}
    });
    pinta();
  }

  window.PAUSADO = false;
  window.pausaAlterna = alterna;

  function montar(){
    var st=document.createElement('style'); st.textContent=CSS;
    document.head.appendChild(st);
    btn=document.createElement('button');
    btn.id='btn-pausa'; btn.type='button'; btn.title='Pausar (espaço)';
    pinta();
    btn.addEventListener('click', function(ev){ ev.stopPropagation(); alterna(); });
    document.body.appendChild(btn);
    addEventListener('keydown', function(ev){
      if(ev.code==='Space' || ev.key==='p' || ev.key==='P'){ ev.preventDefault(); alterna(); }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',montar);
  else montar();
})();
