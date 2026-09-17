/* ============================================================
   BALLKNOWLEDGE ACADEMY — script.js
   Lógica compartida por todas las páginas.
   No hace falta tocar este archivo para actualizar contenido:
   eso se hace en data.js
   ============================================================

   ------------------------------------------------------------
   INICIO DE SESIÓN
   ------------------------------------------------------------
   Solo hay dos usuarios válidos, escritos aquí abajo. Si algún
   día quieres cambiar una contraseña (o el nombre de usuario),
   edita este objeto — es lo único que necesitas tocar.
   ------------------------------------------------------------ */
const USUARIOS_VALIDOS = {
  "Sajón-sensei 999": "yotsuba67",
  "Hori_mogger67": "horimierda"
};

/* Devuelve el usuario que ha iniciado sesión en este dispositivo,
   o null si todavía no ha iniciado sesión nadie. */
function getUsuarioActual() {
  return localStorage.getItem("bka_usuario");
}

function mostrarPantallaLogin() {
  document.body.style.overflow = "hidden";

  const tieneImagen = typeof IMAGEN_LOGIN !== "undefined" && IMAGEN_LOGIN;
  const imagenHtml = tieneImagen
    ? `<div class="login-imagen-wrap"><img src="${IMAGEN_LOGIN}" alt="" onerror="this.parentElement.classList.add('img-fallback'); this.remove();"></div>`
    : `<div class="login-imagen-wrap img-fallback">🎓</div>`;

  const overlay = document.createElement("div");
  overlay.id = "login-overlay";
  overlay.innerHTML = `
    ${imagenHtml}
    <div class="login-card">
      <h1>Ballknowledge Academy</h1>
      <p>Inicia sesión para entrar</p>
      <form id="login-form">
        <input type="text" id="login-usuario" placeholder="Usuario" autocomplete="username" required>
        <input type="password" id="login-clave" placeholder="Contraseña" autocomplete="current-password" required>
        <button type="submit">Entrar</button>
        <p class="login-error" id="login-error"></p>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("login-usuario").value.trim();
    const clave = document.getElementById("login-clave").value;
    const error = document.getElementById("login-error");

    if (USUARIOS_VALIDOS[usuario] && USUARIOS_VALIDOS[usuario] === clave) {
      localStorage.setItem("bka_usuario", usuario);
      overlay.remove();
      document.body.style.overflow = "";
    } else {
      error.textContent = "Usuario o contraseña incorrectos.";
    }
  });
}

/* Se ejecuta nada más cargar el archivo, antes que cualquier
   otra cosa de la página. */
if (!getUsuarioActual()) {
  document.addEventListener("DOMContentLoaded", mostrarPantallaLogin);
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
    const valores = usuarios
      .map(u => u[stat.key])
      .filter(v => v !== null && v !== undefined && v !== "");
    subnotas[stat.key] = valores.length
      ? truncar1(valores.reduce((a, b) => a + Number(b), 0) / valores.length)
      : null;
  });

  const finales = usuarios
    .map(u => u.final)
    .filter(v => v !== null && v !== undefined && v !== "");
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
      if (datos) anime.notasUsuarios = datos;
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
