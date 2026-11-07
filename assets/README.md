# Ballknowledge Academy — recursos visuales para el rediseño

Añade tus imágenes a estas rutas (los espacios ya están preparados en `style.css` y `academy.js`):

## Fondo común de aula
- `assets/classroom-bg.jpg`
- Tamaño recomendado: **1920 × 1080 px** (16:9), JPG, aula literaria cálida y desenfocada. Se muestra como fondo con una capa translúcida encima para que el texto siga siendo legible.

## Personajes-guía
Los sprites deben ser PNG con transparencia y personaje completo centrado, sin texto ni borde:

| Personaje | Sprite mini | Sprite diálogo |
|---|---|---|
| Sayori | `assets/characters/sayori-mini.png` | `assets/characters/sayori.png` |
| Yuri | `assets/characters/yuri-mini.png` | `assets/characters/yuri.png` |
| Natsuki | `assets/characters/natsuki-mini.png` | `assets/characters/natsuki.png` |
| Monika | `assets/characters/monika-mini.png` | `assets/characters/monika.png` |

- Sprite mini: lienzo recomendado **600 × 800 px** (3:4); se muestra en un hueco de 74 × 106 px, abajo a la derecha.
- Sprite grande: lienzo recomendado **900 × 1200 px** (3:4); se muestra en el diálogo inferior, hueco de 82 × 112 px.
- Mantén el personaje dentro del lienzo y deja transparencia alrededor para evitar recortes.

## Música
- Coloca la banda sonora que tengas derecho a usar en `audio/academy-theme.mp3`.
- La app la inicia tras interacción del usuario; el slider y mute de Inicio guardan preferencia en localStorage.

Estos archivos no se han incluido deliberadamente; son los huecos y rutas para que tú agregues tus propios recursos.