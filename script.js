/* ============================================================
   BALLKNOWLEDGE ACADEMY — script.js
   Lógica compartida por todas las páginas.
   No hace falta tocar este archivo para actualizar contenido:
   eso se hace en data.js
   ============================================================ */

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
function activarRevelados() {
  const elementos = document.querySelectorAll(".reveal, .pop-in");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach(el => el.classList.add("in-view"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elementos.forEach(el => obs.observe(el));
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
