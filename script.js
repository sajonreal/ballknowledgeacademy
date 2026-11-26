/* ============================================================
   BALLKNOWLEDGE ACADEMY — script.js
   Lógica compartida por todas las páginas.
   La autenticación se gestiona en auth-core.js y auth-gate.js.
   ============================================================ */

function getUsuarioActual() {
  return localStorage.getItem("bka_usuario");
}

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/* Devuelve la clave "AAAA-MM-DD" del día de hoy (hora local) */
function getTodayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* Devuelve algo tipo "Domingo 16" */
function getTodayLabel(d = new Date()) {
  return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()}`;
}

function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/* --------------------------------------------------------
   Notas por usuario: si un anime tiene "notasUsuarios"
   rellenado (una o las dos personas ya lo han valorado),
   la nota y el desglose que se muestran en TODA la web se
   calculan como la media (truncada a 1 decimal) de esas
   valoraciones. Si el anime no tiene "notasUsuarios"
   todavía, se usan los valores manuales de siempre
   ("nota" y "subnotas") tal cual — así los animes antiguos
   no se ven afectados por este cambio.
-------------------------------------------------------- */
function truncar1(n) {
  return Math.trunc(n * 10) / 10;
}

function calcularNotasFinales(anime) {
  const usuarios = anime.notasUsuarios ? Object.values(anime.notasUsuarios) : [];

  if (usuarios.length === 0) {
    return { nota: anime.nota ?? null, subnotas: anime.subnotas || {} };
  }

  const subnotas = {};
  (typeof ESTADISTICAS !== "undefined" ? ESTADISTICAS : []).forEach(stat => {
    const valores = usuarios.map(u => u[stat.key]).filter(v => v !== null && v !== undefined && v !== "");
    if (!valores.length) { subnotas[stat.key] = null; return; }
    if (stat.key === "fanService" && valores.every(v => String(v).toUpperCase() === "H")) {
      subnotas[stat.key] = "H"; return;
    }
    if (stat.key === "final" && valores.every(v => String(v) === "?")) {
      subnotas[stat.key] = "?"; return;
    }
    const numericos = valores.filter(v => typeof v === "number" || (String(v).trim() !== "" && !Number.isNaN(Number(v))));
    if (!numericos.length) { subnotas[stat.key] = null; return; }
    const suma = numericos.reduce((acc, value) => acc + Number(value), 0)
      + (stat.key === "fanService" ? valores.filter(v => String(v).toUpperCase() === "H").length * 10 : 0);
    const divisor = stat.key === "final" ? numericos.length : valores.length;
    subnotas[stat.key] = truncar1(suma / divisor);
  });
  
  const finales = usuarios
    .map(u => u.notaFinal ?? u.final)
    .filter(v => v !== null && v !== undefined && v !== "" && v !== "?");
  const nota = finales.length
    ? truncar1(finales.reduce((a, b) => a + Number(b), 0) / finales.length)
    : null;

  return { nota, subnotas };
}

/* --------------------------------------------------------
   Firebase: valoraciones compartidas de verdad entre los
   dos dispositivos. Si "FIREBASE_CONFIG" no existe todavía
   en data.js, estas funciones simplemente no hacen nada y
   la web sigue funcionando con los valores fijos de siempre.
-------------------------------------------------------- */
function slugAnime(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let _dbFirestore = null;

function initFirebase() {
  if (_dbFirestore) return _dbFirestore;
  if (typeof FIREBASE_CONFIG === "undefined" || typeof firebase === "undefined") return null;
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  _dbFirestore = firebase.firestore();
  return _dbFirestore;
}

/* Trae las valoraciones de Firebase y las mete directamente
   dentro de ANIME_COMPLETADOS (en "notasUsuarios"), para que
   calcularNotasFinales() las use exactamente igual que si
   estuvieran escritas a mano en data.js. */
async function cargarNotasUsuariosYAplicar() {
  const db = initFirebase();
  if (!db || typeof ANIME_COMPLETADOS === "undefined") return;

  try {
    const snapshot = await db.collection("valoraciones").get();
    const mapa = {};
    snapshot.forEach(doc => { mapa[doc.id] = doc.data(); });

    ANIME_COMPLETADOS.forEach(anime => {
      const datos = mapa[slugAnime(anime.nombre)];
      if (datos) {
        anime.notasUsuarios = Object.fromEntries(
          Object.entries(datos).filter(([key, value]) =>
            key !== "comentarios" && value && typeof value === "object" && !Array.isArray(value)
          )
        );
        anime.comentarios = Array.isArray(datos.comentarios) ? datos.comentarios : [];
      }
    });
  } catch (err) {
    console.error("No se pudieron cargar las valoraciones de Firebase:", err);
  }
}

/* Guarda (o actualiza) la valoración de un usuario para un
   anime, sin borrar la del otro usuario (merge: true). */
async function guardarNotaUsuarioFirebase(animeNombre, usuario, valores) {
  const db = initFirebase();
  if (!db) throw new Error("Firebase no está configurado todavía en data.js.");
  const id = slugAnime(animeNombre);
  await db.collection("valoraciones").doc(id).set({ [usuario]: valores }, { merge: true });
}

/* Comentarios de reseñas: se guardan en el mismo documento que las valoraciones. */
async function guardarComentarioFirebase(animeNombre, usuario, texto) {
  const db = initFirebase();
  if (!db) throw new Error("Firebase no está configurado todavía.");
  const ref = db.collection("valoraciones").doc(slugAnime(animeNombre));
  const comentario = { usuario, texto: String(texto).trim().slice(0, 500), creado: Date.now() };
  await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    const datos = snapshot.exists ? snapshot.data() : {};
    const comentarios = Array.isArray(datos.comentarios) ? datos.comentarios.slice() : [];
    comentarios.push(comentario);
    transaction.set(ref, { comentarios }, { merge: true });
  });
  return comentario;
}

/* --------------------------------------------------------
   PERFILES: nombre para mostrar, foto y color de cada
   usuario. Se guardan en Firebase para que se vean igual
   desde cualquier dispositivo, y se cargan una vez al
   principio en la variable global PERFILES.
-------------------------------------------------------- */
let PERFILES = {};

const COLOR_USUARIO_POR_DEFECTO = "#ff5fb2";

async function cargarPerfilesYAplicar() {
  const db = initFirebase();
  if (!db) return;
  try {
    const snapshot = await db.collection("perfiles").get();
    const mapa = {};
    snapshot.forEach(doc => { mapa[doc.id] = doc.data(); });
    PERFILES = mapa;
  } catch (err) {
    console.error("No se pudieron cargar los perfiles de Firebase:", err);
  }
}

async function guardarPerfilFirebase(usuario, datos) {
  const db = initFirebase();
  if (!db) throw new Error("Firebase no está configurado todavía en data.js.");
  await db.collection("perfiles").doc(usuario).set(datos, { merge: true });
  PERFILES[usuario] = { ...(PERFILES[usuario] || {}), ...datos };
}

function getNombreMostrar(usuario) {
  return (PERFILES[usuario] && PERFILES[usuario].nombreMostrar) || usuario;
}

function getColorUsuario(usuario) {
  return (PERFILES[usuario] && PERFILES[usuario].color) || COLOR_USUARIO_POR_DEFECTO;
}

function getFotoUsuario(usuario) {
  return (PERFILES[usuario] && PERFILES[usuario].foto) || null;
}

/* Devuelve el HTML de "avatar + nombre en su color" para
   mostrar un usuario en cualquier parte de la web. */
function htmlUsuario(usuario) {
  const color = getColorUsuario(usuario);
  const foto = getFotoUsuario(usuario);
  const inicial = usuario.trim().charAt(0).toUpperCase();
  const avatar = foto
    ? `<img class="usuario-avatar" src="${foto}" alt="">`
    : `<span class="usuario-avatar usuario-avatar-letra" style="background:${color};">${inicial}</span>`;
  return `<span class="usuario-inline">${avatar}<span class="usuario-nombre" style="color:${color};">${getNombreMostrar(usuario)}</span></span>`;
}

/* Redimensiona y comprime una imagen elegida por el usuario
   para poder guardarla como texto (base64) en Firestore sin
   pasarse de tamaño. Devuelve una Promise con el resultado. */
function comprimirImagenComoBase64(archivo, tamañoMax = 160, calidad = 0.75) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer la imagen."));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo procesar la imagen."));
      img.onload = () => {
        const escala = Math.min(1, tamañoMax / Math.max(img.width, img.height));
        const w = Math.round(img.width * escala);
        const h = Math.round(img.height * escala);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", calidad));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

/* --------------------------------------------------------
   SEGUIMIENTO: quién está "siguiendo activamente" el anime
   que toca hoy. Se guarda por anime (no por día), así que si
   el mismo anime sigue varios días seguidos en el calendario
   la gente no tiene que volver a darle a "Seguir" — solo hace
   falta pulsarlo de nuevo cuando cambia a un anime distinto.
-------------------------------------------------------- */
async function getSeguidoresAnime(animeNombre) {
  const db = initFirebase();
  if (!db) return {};
  const id = slugAnime(animeNombre);
  const doc = await db.collection("seguimiento").doc(id).get();
  return doc.exists ? doc.data() : {};
}

async function alternarSeguimiento(animeNombre, usuario, seguir) {
  const db = initFirebase();
  if (!db) throw new Error("Firebase no está configurado todavía en data.js.");
  const id = slugAnime(animeNombre);
  const ref = db.collection("seguimiento").doc(id);
  if (seguir) {
    await ref.set({ [usuario]: true }, { merge: true });
  } else {
    await ref.set({ [usuario]: firebase.firestore.FieldValue.delete() }, { merge: true });
  }
}



/* Crea un <img> con fallback bonito si la imagen no existe todavía */
function crearImagenConFallback(src, alt) {
  const wrap = document.createElement("div");
  wrap.className = "img-wrap";

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";

  img.onerror = () => {
    wrap.classList.add("img-fallback");
    const inicial = document.createElement("span");
    inicial.className = "img-fallback-letra";
    inicial.textContent = (alt || "?").trim().charAt(0).toUpperCase();
    wrap.innerHTML = "";
    wrap.appendChild(inicial);
  };

  wrap.appendChild(img);
  return wrap;
}

/* --------------------------------------------------------
   Corazones flotantes (animación de entrada en la home)
-------------------------------------------------------- */
function lanzarCorazones(cantidad = 12) {
  const contenedor = document.getElementById("hearts-layer");
  if (!contenedor) return;

  const emojis = ["💗", "💕", "🩷", "💖"];

  for (let i = 0; i < cantidad; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const top = Math.random() * 80;
    const left = Math.random() * 80;
    const duracion = 1.3 + Math.random() * 0.7;
    const retraso = Math.random() * 1.6;
    const tam = 4 + Math.random() * 3.2;

    heart.style.top = `${top}vh`;
    heart.style.left = `${left}vw`;
    heart.style.animationDuration = `${duracion}s`;
    heart.style.animationDelay = `${retraso}s`;
    heart.style.fontSize = `${tam}rem`;

    contenedor.appendChild(heart);
    setTimeout(() => heart.remove(), (duracion + retraso) * 1000 + 200);
  }
}

/* --------------------------------------------------------
   Vigía de medianoche: si el día cambia mientras la página
   sigue abierta, vuelve a ejecutar el callback (23:59 -> 00:00)
-------------------------------------------------------- */
function vigilarCambioDeDia(callback) {
  let claveActual = getTodayKey();
  setInterval(() => {
    const claveNueva = getTodayKey();
    if (claveNueva !== claveActual) {
      claveActual = claveNueva;
      callback();
    }
  }, 20000); // comprueba cada 20s, suficiente para no perderse las 23:59
}

/* Crea un slot cuadrado para un gif decorativo, con fallback.
   claseExtra permite añadir tamaño/inclinación (ver style.css) */
function crearGifSlot(src, claseExtra = "") {
  const wrap = document.createElement("div");
  wrap.className = "gif-item" + (claseExtra ? " " + claseExtra : "");

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.loading = "lazy";

  img.onerror = () => {
    wrap.classList.add("img-fallback");
    wrap.innerHTML = "🎞️";
  };

  wrap.appendChild(img);
  return wrap;
}

/* --------------------------------------------------------
   Búsqueda automática de imagen por nombre de anime.
   Mira primero en ANIME_COMPLETADOS y luego en ANIME_PLANEADOS,
   así que si ya pusiste la imagen ahí, no hace falta repetirla
   en el calendario ni en ningún otro sitio.
-------------------------------------------------------- */
function buscarImagenAnime(nombre) {
  const normalizar = (s) => (s || "").toLowerCase().trim();
  const buscarEn = (lista) => (lista || []).find(a => normalizar(a.nombre) === normalizar(nombre));

  let encontrado = null;
  if (typeof ANIME_COMPLETADOS !== "undefined") encontrado = buscarEn(ANIME_COMPLETADOS);
  if (!encontrado && typeof ANIME_PLANEADOS !== "undefined") encontrado = buscarEn(ANIME_PLANEADOS);

  return encontrado ? encontrado.imagen : "images/placeholder-anime.jpg";
}

/* --------------------------------------------------------
   Efecto parallax suave y ligero (sin librerías)
-------------------------------------------------------- */
function initParallax(imgId, factor = 0.18) {
  const img = document.getElementById(imgId);
  if (!img) return;
  const wrap = img.parentElement;
  let ticking = false;

  function actualizar() {
    const rect = wrap.getBoundingClientRect();
    const centro = rect.top + rect.height / 2 - window.innerHeight / 2;
    const offset = centro * -factor;
    img.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(actualizar);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  actualizar();
}

/* --------------------------------------------------------
   Revelado al hacer scroll (fluido, sutil)
-------------------------------------------------------- */
let _revealObserver = null;

function activarRevelados() {
  const elementos = document.querySelectorAll(".reveal:not(.in-view), .pop-in:not(.in-view)");
  if (!elementos.length) return;

  if (!("IntersectionObserver" in window)) {
    elementos.forEach(el => el.classList.add("in-view"));
    return;
  }

  if (!_revealObserver) {
    _revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          _revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }

  elementos.forEach(el => _revealObserver.observe(el));
}

/* --------------------------------------------------------
   Resalta el enlace activo en la barra de navegación
-------------------------------------------------------- */
function marcarNavActiva() {
  const actual = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".bottom-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === actual) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  marcarNavActiva();
  activarRevelados();
});

/* Red de seguridad: si por lo que sea el observador no llega a
   disparar en algún navegador, forzamos visibles los elementos que
   ya están en pantalla poco después de cargar la página. */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.in-view), .pop-in:not(.in-view)").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("in-view");
      }
    });
  }, 1200);
});
