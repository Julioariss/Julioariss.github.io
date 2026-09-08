#!/usr/bin/env python3
"""Arma index.html desde las piezas de .build/ (CSS, markup y scripts)."""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
R = lambda p: open('.build/' + p).read()

head = R('head.html').replace('</style>', R('extra.css') + '</style>')
body = R('body.html').replace('{{BADGE}}', R('uri1.txt'))

lang = '''<script>
(function(){var root=document.documentElement,btn=null;
 /* Ingles por defecto; el boton ES/EN cambia y recuerda la eleccion */
 function set(l){root.setAttribute('lang',l);if(btn)btn.textContent=l==='es'?'EN':'ES';try{localStorage.setItem('orbmail.lang',l)}catch(e){}}
 var saved=null;try{saved=localStorage.getItem('orbmail.lang')}catch(e){}
 var start=(saved==='es'||saved==='en')?saved:'en';
 root.setAttribute('lang',start);
 addEventListener('DOMContentLoaded',function(){btn=document.getElementById('langBtn');if(!btn)return;
  btn.textContent=start==='es'?'EN':'ES';
  btn.addEventListener('click',function(){set(root.getAttribute('lang')==='es'?'en':'es')})});})();
</script>'''

out = (head + '\n' + lang + '\n' + R('theme.js') + '\n' + body +
       '\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n' +
       R('stage.js') + '\n' + R('script_hash.html') + '\n')
assert '{{' not in out, 'quedaron marcadores sin reemplazar'
open('index.html', 'w').write(out)
print('index.html', len(out), 'bytes')
