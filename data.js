/* ============================================================
   BALLKNOWLEDGE ACADEMY — data.js
   ------------------------------------------------------------
   ÚNICO archivo que necesitas tocar para actualizar la web.
   No hace falta saber programar: solo copia/pega bloques
   siguiendo el mismo formato y respeta las comas.
   ============================================================ */


/* ------------------------------------------------------------
   0) SISTEMA DE PUNTUACIÓN (las categorías de las reseñas)
   ------------------------------------------------------------
   Esta lista define QUÉ categorías se puntúan en cada reseña
   y en qué orden se muestran. Si quieres añadir, quitar o
   renombrar una categoría, hazlo aquí y se actualizará en
   automático en todas las tarjetas de "Reseñas".

   "key"   -> identificador interno (no lo toques, se usa para
              enlazar con el número dentro de cada anime)
   "emoji" -> el icono que aparece delante
   "label" -> el texto que se muestra
------------------------------------------------------------ */
const ESTADISTICAS = [
  { key: "opEd",        emoji: "🎵", label: "OP/ED" },
  { key: "queso",       emoji: "🧀", label: "Queso" },
  { key: "cocina",      emoji: "🍳", label: "Cocina" },
  { key: "prota",       emoji: "⭐", label: "Prota" },
  { key: "animacion",   emoji: "🎨", label: "Animación" },
  { key: "trama",       emoji: "📖", label: "Trama" },
  { key: "fanService",  emoji: "🔥", label: "Fan Service" },
  { key: "fantasia",    emoji: "🧙", label: "Fantasía" },
  { key: "perSec",      emoji: "👥", label: "Per. Sec" },
  { key: "aprendizaje", emoji: "🧠", label: "Aprendizaje" },
  { key: "final",       emoji: "🏁", label: "Final" }
];

/* Si añades una categoría nueva arriba, recuerda añadir su
   número correspondiente dentro de "subnotas" en cada anime
   de ANIME_COMPLETADOS (si no la pones, se mostrará como "-"). */


/* ------------------------------------------------------------
   1) RESEÑAS (animes ya vistos) — formato Notion
   ------------------------------------------------------------
   Cada anime tiene una nota final ("nota") y un desglose
   ("subnotas") con una entrada por cada categoría definida
   arriba en ESTADISTICAS. Usa "null" (sin comillas) para
   cualquier valor que todavía no hayas puntuado — se mostrará
   como "?" en vez de romper la tarjeta.

   Para AÑADIR un anime nuevo: copia un bloque { ... } entero,
   pégalo dentro de los corchetes y rellena tus datos.
------------------------------------------------------------ */
const ANIME_COMPLETADOS = [
  {
    nombre: "The Quintessential Quintuplets",
    imagen: "images/the-quintessential-quintuplets.jpg",
    nota: 9,
    subnotas: {
      opEd: 8, queso: 10, cocina: 10, prota: 5,
      animacion: 8, trama: 7, fanService: 10,
      fantasia: 10, perSec: 5, aprendizaje: 7, final: 10
    }
  },
  {
    nombre: "My Dress Up Darling",
    imagen: "images/my-dress-up-darling.webp",
    nota: 9,
    subnotas: {
      opEd: 9.5, queso: 8.5, cocina: 9, prota: 9,
      animacion: 9.5, trama: 9, fanService: 9,
      fantasia: 7, perSec: 9, aprendizaje: 5, final: null
    }
  },
  {
    nombre: "The Fragant Flower Blooms With Dignity",
    imagen: "images/the-fragant-flower-blooms-with-dignity.webp",
    nota: 9,
    subnotas: {
      opEd: 8.5, queso: 9.5, cocina: 7.5, prota: 9.5,
      animacion: 9.5, trama: 8, fanService: 0,
      fantasia: 5, perSec: 8.5, aprendizaje: 6.5, final: 10
    }
  },
  {
    nombre: "Call Of The Night",
    imagen: "images/call-of-the-night.jpg",
    nota: 8,
    subnotas: {
      opEd: 9, queso: 10, cocina: 8, prota: 7,
      animacion: 8, trama: 8, fanService: 7,
      fantasia: 10, perSec: 9, aprendizaje: 5, final: 9
    }
  },
  {
    nombre: "Darling In The FranXX",
    imagen: "images/darling-in-the-franxx.jpg",
    nota: 7,
    subnotas: {
      opEd: 9, queso: 8, cocina: 7, prota: 9,
      animacion: 9, trama: 9, fanService: 8,
      fantasia: 10, perSec: 7, aprendizaje: 5, final: 8
    }
  },
  {
    nombre: "Your Lie In April",
    imagen: "images/your-lie-in-april.png",
    nota: 10,
    subnotas: {
      opEd: 10, queso: 10, cocina: 10, prota: 10,
      animacion: 9, trama: 9, fanService: 0,
      fantasia: 5, perSec: 9, aprendizaje: 9, final: 10
    }
  },
  {
    nombre: "Gals Can´t Be Kind To Otakus",
    imagen: "images/gals-can-t-be-kind-to-otakus.jpg",
    nota: 7,
    subnotas: {
      opEd: 10, queso: 8, cocina: 7, prota: 7,
      animacion: 10, trama: 6, fanService: 7,
      fantasia: 10, perSec: 5, aprendizaje: 5, final: 6
    }
  },
  {
    nombre: "Rascal Does Not Dream Of Bunny Girl Senpai",
    imagen: "images/rascal-does-not-dream-of-bunny-girl-senpai.jpg",
    nota: 8,
    subnotas: {
      opEd: 10, queso: 8.5, cocina: 7, prota: 10,
      animacion: 8, trama: 9, fanService: 3,
      fantasia: 10, perSec: 10, aprendizaje: 8.5, final: null
    }
  },
  {
    nombre: "Cyberpunk: Edgerunners",
    imagen: "images/cyberpunk-edgerunners.jpeg",
    nota: 9,
    subnotas: {
      opEd: null, queso: 9, cocina: 8, prota: 10,
      animacion: 10, trama: 9, fanService: 8,
      fantasia: 10, perSec: 8, aprendizaje: 6, final: 10
    }
  },
  {
    nombre: "A Silent Voice",
    imagen: "images/a-silent-voice.webp",
    nota: 9,
    subnotas: {
      opEd: 5, queso: 8, cocina: 7, prota: 9,
      animacion: 8.5, trama: 10, fanService: 0,
      fantasia: 6.5, perSec: 6.5, aprendizaje: 8, final: 9
    }
  },
  {
    nombre: "Violet Evergarden",
    imagen: "images/violet-evergarden.webp",
    nota: 10,
    subnotas: {
      opEd: 8, queso: 10, cocina: 10, prota: 10,
      animacion: 10, trama: 10, fanService: 0,
      fantasia: 8, perSec: 10, aprendizaje: 8, final: 10
    }
  },
  {
    nombre: "The Dangers In My Heart",
    imagen: "images/the-dangers-in-my-heart.webp",
    nota: 6,
    subnotas: {
      opEd: 5, queso: 7, cocina: 6.5, prota: 3,
      animacion: 7, trama: 6, fanService: 10,
      fantasia: 10, perSec: 7, aprendizaje: 2.5, final: 6
    }
  },
  {
    nombre: "Kaguya-sama",
    imagen: "images/kaguya-sama.jpg",
    nota: 10,
    subnotas: {
      opEd: 10, queso: 8.5, cocina: 10, prota: 10,
      animacion: 9, trama: 10, fanService: 8,
      fantasia: 5, perSec: 10, aprendizaje: 9.5, final: 9
    }
  },
 	{
	nombre: "Overflow",
	imagen: "images/overflow.jpg",
	nota: 3,
    subnotas: {
      opEd: 0, queso: 9, cocina: 0, prota: 4,
      animacion: 7, trama: 0, fanService: 10,
      fantasia: 10, perSec: 0, aprendizaje: 4, final: null
	}
   }
];


/* ------------------------------------------------------------
   2) PLANEADOS (animes que tocan a continuación)
   ------------------------------------------------------------
   "prioridad": true  -> se marca con ⭐ como "quiero verlo ya"
   "etiqueta": texto corto opcional para tu propia clasificación
               (déjalo como "" si no quieres ninguna etiqueta)
   "comentario": opcional, por qué te interesa este anime
------------------------------------------------------------ */
const ANIME_PLANEADOS = [
  { nombre: "Horimiya", imagen: "images/horimiya.webp", prioridad: true, etiqueta: "" },
  { nombre: "You And I Are Polar Opposites", imagen: "images/you-and-i-are-polar-opposites.jpg", prioridad: true, etiqueta: "" },
  { nombre: "The Angel Next Door Spoils Me Rotten", imagen: "images/the-angel-next-door-spoils-me-rotten.webp", prioridad: true, etiqueta: "" },
  { nombre: "I Want to Eat Your Pancreas", imagen: "images/i-want-to-eat-your-pancreas.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Monogatari", imagen: "images/monogatari.webp", prioridad: false, etiqueta: "" },
  { nombre: "High School DxD", imagen: "images/high-school-dxd.png", prioridad: false, etiqueta: "H" },
  { nombre: "Josee, the Tiger and the Fish", imagen: "images/josee-the-tiger-and-the-fish.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Orange", imagen: "images/orange.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Golden Time", imagen: "images/golden-time.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Toradora!", imagen: "images/toradora.avif", prioridad: false, etiqueta: "" },
  { nombre: "The Ramparts Of Ice", imagen: "images/the-ramparts-of-ice.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Alya Sometimes Hides Her Feelings In Russian", imagen: "images/alya-sometimes-hides-her-feelings-in-russian.jpg", prioridad: true, etiqueta: "" },
  { nombre: "Blue Box", imagen: "images/blue-box.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Plastic Memories", imagen: "images/plastic-memories.jpg", prioridad: true, etiqueta: "" },
  { nombre: "Nisekoi", imagen: "images/nisekoi.jpg", prioridad: false, etiqueta: "" },
  { nombre: "More Than a Married Couple, But Not Lovers", imagen: "images/more-than-a-married-couple-but-not-lovers.jpg", prioridad: true, etiqueta: "" },
  { nombre: "The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You", imagen: "images/the-100-girlfriends-who-really-really-really-really-really-love-you.webp", prioridad: false, etiqueta: "" },
  { nombre: "My Love Story with Yamada-kun at Lv999", imagen: "images/my-love-story-with-yamada-kun-at-lv999.avif", prioridad: false, etiqueta: "" },
  { nombre: "Weathering With You", imagen: "images/weathering-with-you.avif", prioridad: false, etiqueta: "" },
  { nombre: "Oregairu", imagen: "images/oregairu.webp", prioridad: false, etiqueta: "" },
  { nombre: "Fruits Basket", imagen: "images/fruits-basket.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Just Because!", imagen: "images/just-because.png", prioridad: false, etiqueta: "" },
  { nombre: "Komi Can't Communicate", imagen: "images/komi-can-t-communicate.avif", prioridad: false, etiqueta: "" },
  { nombre: "Our Dating Story: The Experienced You and the Inexperienced Me", imagen: "images/our-dating-story-the-experienced-you-and-the-inexperienced-me.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Yamada-kun and the Seven Witches", imagen: "images/yamada-kun-and-the-seven-witches.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Masamune-kun's Revenge", imagen: "images/masamune-kun-s-revenge.webp", prioridad: false, etiqueta: "" },
  { nombre: "A Galaxy Next Door", imagen: "images/a-galaxy-next-door.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Kubo Won't Let Me Be Invisible", imagen: "images/kubo-won-t-let-me-be-invisible.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Boarding School Juliet", imagen: "images/boarding-school-juliet.jpg", prioridad: false, etiqueta: "" },
  { nombre: "We Never Learn", imagen: "images/we-never-learn.png", prioridad: false, etiqueta: "" },
  { nombre: "Haganai", imagen: "images/haganai.webp", prioridad: false, etiqueta: "" },
  { nombre: "Saekano: How to Raise a Boring Girlfriend", imagen: "images/saekano-how-to-raise-a-boring-girlfriend.webp", prioridad: false, etiqueta: "" },
  { nombre: "Wotakoi: Love Is Hard for Otaku", imagen: "images/wotakoi-love-is-hard-for-otaku.jpg", prioridad: false, etiqueta: "" },
  { nombre: "The Café Terrace and Its Goddesses", imagen: "images/the-caf-terrace-and-its-goddesses.webp", prioridad: false, etiqueta: "" },
  { nombre: "Science Fell in Love, So I Tried to Prove It", imagen: "images/science-fell-in-love-so-i-tried-to-prove-it.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Okitsura", imagen: "images/okitsura.jpe", prioridad: false, etiqueta: "" },
  { nombre: "Hokkaido Gals Are Super Adorable!", imagen: "images/hokkaido-gals-are-super-adorable.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Dealing With The Mikadono Sisters Is A Breeze", imagen: "images/dealing-with-the-mikadono-sisters-is-a-breeze.jpg", prioridad: false, etiqueta: "" },
  { nombre: "Don't Toy With Me Miss Nagatoro", imagen: "images/don-t-toy-with-me-miss-nagatoro.jpg", prioridad: false, etiqueta: "" }
];


/* ------------------------------------------------------------
   3) CALENDARIO (qué toca ver cada día)
   ------------------------------------------------------------
   La clave es la fecha en formato "AAAA-MM-DD" (año-mes-día,
   siempre con dos dígitos en mes y día).
   Puedes programar tantos días futuros como quieras: la web
   solo mostrará el día de HOY como principal, pero guardará
   el resto para cuando llegue su turno.
   Si un día no tiene episodios, simplemente no lo incluyas.

   OJO: ya NO hace falta poner "imagen" aquí. La web busca
   automáticamente la imagen de ese anime en ANIME_COMPLETADOS
   o ANIME_PLANEADOS por el nombre, así que si pones la imagen
   una sola vez (en su reseña o en planeados) se actualiza sola
   en el calendario, en la portada y en cualquier otro sitio
   donde aparezca ese mismo anime. Solo asegúrate de escribir
   el nombre EXACTAMENTE igual que en esas listas.
------------------------------------------------------------ */
const CALENDARIO = {
  "2026-08-17": [
    { anime: "Plastic Memories", episodio: 8 },
    { anime: "Plastic Memories", episodio: 9 }
  ],
  "2026-08-18": [
    { anime: "Plastic Memories", episodio: 10 },
    { anime: "Plastic Memories", episodio: 11 }
  ],
  "2026-08-19": [
    { anime: "Plastic Memories", episodio: 12 },
    { anime: "Plastic Memories", episodio: 13 }
  ],
  "2026-08-20": [
    { anime: "Horimiya", episodio: 1 },
    { anime: "Horimiya", episodio: 2 }
  ],
  "2026-08-21": [
    { anime: "Horimiya", episodio: 3 },
	{ anime: "Horimiya", episodio: 4 }
  ]
};


/* ------------------------------------------------------------
   4) PORTADA — imagen parallax y gifs decorativos
   ------------------------------------------------------------
   IMAGEN_PARALLAX: ruta a la imagen que quieres que se mueva
   con efecto parallax en la portada. Mientras no la pongas,
   se muestra un marcador de posición rosa.

   GIFS_DECORATIVOS: lista de rutas a tus gifs. Aparecen
   repartidos por la sección "de fondo" de la home, cada uno
   con un tamaño y una rotación distinta para que parezca
   desordenado. Añade o quita líneas libremente (funciona con
   cualquier cantidad, de 0 en adelante).
------------------------------------------------------------ */
const IMAGEN_PARALLAX = "images/parallax-hero.png";

const GIFS_DECORATIVOS = [
  "images/gif1.gif",
  "images/gif2.gif",
  "images/gif3.gif",
  "images/gif4.gif",
  "images/gif5.gif",
  "images/gif6.gif",
  "images/gif7.gif",
  "images/gif8.gif"
];


/* ------------------------------------------------------------
   5) LISTAS — la playlist de Spotify
   ------------------------------------------------------------
   LINK_SPOTIFY: pega aquí el link de vuestra lista cuando lo
   tengas. Mientras esté vacío ("") se mostrará un aviso en su
   lugar en vez de un botón roto.

   IMAGEN_PLAYLIST: ruta a la portada/captura de la playlist.
   Mientras no la pongas, sale un marcador de posición.
------------------------------------------------------------ */
const LINK_SPOTIFY = "https://open.spotify.com/playlist/7BKyZr5MCvESZhlIkn7FNK?si=bvEhiB9kRgOY4I4MdwX0qA";
const IMAGEN_PLAYLIST = "images/playlist-cover.jpg";

/* ------------------------------------------------------------
   6) COMUNIDAD — vídeo vertical y fotos
   ------------------------------------------------------------
   VIDEO_COMUNIDAD: ruta a un vídeo (formato vertical, tipo
   móvil) que quieras mostrar. Mientras esté vacío ("") se
   muestra un marcador de posición en su lugar.

   IMAGENES_COMUNIDAD: hasta 4 rutas de fotos. Aparecen un
   poco inclinadas, como una polaroid. Si pones menos de 4,
   simplemente se quedan huecos vacíos donde faltan.
------------------------------------------------------------ */
const VIDEO_COMUNIDAD = "images/video.html";

const IMAGENES_COMUNIDAD = [
  "images/comunidad1.png",
  "images/comunidad2.jpg",
  "images/comunidad3.jpg",
  "images/comunidad4.png",
  "images/comunidad5.png",
  "images/comunidad6.png"
];
