<script>
(function(){
  var root=document.documentElement, KEY='orbmail.theme';
  var mq=matchMedia('(prefers-color-scheme: light)');
  function paint(light){
    if(light){root.setAttribute('data-theme','light')} else {root.removeAttribute('data-theme')}
    if(window.__orbSkin)try{window.__orbSkin(light)}catch(e){}
  }
  function saved(){ try{return localStorage.getItem(KEY)}catch(e){return null} }
  function isLight(){ var s=saved(); return s ? s==='light' : mq.matches; }
  paint(isLight());
  /* si el usuario no eligio a mano, el sitio sigue en vivo el modo del sistema (macOS, Windows, iOS...) */
  var onOS=function(){ if(!saved()) paint(mq.matches); };
  if(mq.addEventListener){mq.addEventListener('change',onOS)}else if(mq.addListener){mq.addListener(onOS)}
  addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('themeBtn'); if(!b)return;
    b.addEventListener('click',function(){
      var next = root.getAttribute('data-theme')==='light' ? 'dark' : 'light';
      /* si vuelve a coincidir con el sistema, se olvida la preferencia y sigue al sistema otra vez */
      if((next==='light')===mq.matches){ try{localStorage.removeItem(KEY)}catch(e){} }
      else { try{localStorage.setItem(KEY,next)}catch(e){} }
      paint(next==='light');
    });
  });
  /* el escenario 3D se pinta cuando termina de crearse */
  addEventListener('load',function(){ if(window.__orbSkin)try{window.__orbSkin(isLight())}catch(e){} });
})();
</script>
