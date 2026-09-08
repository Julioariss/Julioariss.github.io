# Piezas de la portada

`index.html` se ARMA con `python3 build.py` a partir de estos archivos. No edites
`index.html` a mano: se sobrescribe.

- `head.html`   — <head> + hoja de estilos base (paletas oscura y Pinterest clara)
- `extra.css`   — estilos del toggle de tema, el retrato y ajustes del modo claro
- `body.html`   — todo el markup; `{{BADGE}}` se reemplaza por el SVG del App Store
- `theme.js`    — tema: sigue al sistema, botón sol/luna, avisa al escenario 3D
- `stage.js`    — escenario 3D (three.js): 5 teléfonos, texturas y luces por tema
- `script_hash.html` — salto a #how
- `uri1.txt`    — data URI del badge del App Store

Las capturas y fotos van sueltas en `img/` (no en base64) para que la página pese poco.
