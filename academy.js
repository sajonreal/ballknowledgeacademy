/* Ballknowledge Academy — literary academy UI layer (keeps data.js untouched) */
(function () {
  const guides = {
    "index.html": ["sayori", "Sayori", ["¡Bienvenido a nuestra academia literaria!", "Aquí guardamos los animes que nos han hecho sentir algo especial, nuestras notas y los próximos capítulos.", "Personaliza tu perfil y ajusta la música al final de esta página. ¡Que empiece nuestra historia!"]],
    "resenas.html": ["yuri", "Yuri", ["Esta es nuestra biblioteca de reseñas.", "Cada anime tiene su valoración y desglose. Puedes dejar tu puntuación y comparar opiniones.", "Lee con calma; cada historia merece unas líneas."]],
    "planeados.html": ["natsuki", "Natsuki", ["¡Aquí están los animes pendientes!", "Revisa prioridades y comentarios para decidir qué historia abrir después.", "No dejes que la lista se convierta en una montaña de tareas, ¿vale?"]],
    "calendario.html": ["monika", "Monika", ["Bienvenido al calendario de la academia.", "Organizamos episodios por día y podemos seguir las series que nos interesan.", "¡Un capítulo a la vez, disfruta la historia!"]],
    "ruleta.html": ["sayori", "Sayori", ["¿No sabes qué anime elegir?", "La ruleta escoge al azar entre nuestros planeados. Toca la palanca y deja que el destino decida.", "¡Suerte!"]],
    "listas.html": ["yuri", "Yuri", ["Este rincón reúne nuestras listas musicales.", "Canciones que acompañan las historias y momentos de la academia.", "A veces una melodía también cuenta una historia."]]
  };
  function setupMusic() {
    let audio = document.getElementById('academy-bgm');
    if (!audio) { audio = document.createElement('audio'); audio.id = 'academy-bgm'; audio.src = 'audio/academy-theme.mp3'; audio.loop = true; audio.preload = 'none'; audio.volume = .35; document.body.appendChild(audio); }
    const range = document.getElementById('academy-volume'), mute = document.getElementById('academy-mute');
    let vol = Number(localStorage.getItem('bka_music_volume')); if (!Number.isFinite(vol) || vol < 0 || vol > 1) vol = .35;
    audio.volume = vol; audio.muted = localStorage.getItem('bka_music_muted') === 'true';
    if (range) range.value = String(Math.round(vol * 100));
    if (mute) { mute.textContent = audio.muted ? '🔊 Activar' : '🔇 Silenciar'; mute.setAttribute('aria-pressed', String(audio.muted)); }
    if (range) range.addEventListener('input', () => { audio.volume = Number(range.value) / 100; localStorage.setItem('bka_music_volume', String(audio.volume)); if (audio.volume > 0 && audio.muted) { audio.muted = false; localStorage.setItem('bka_music_muted', 'false'); } if (mute) { mute.textContent = audio.muted ? '🔊 Activar' : '🔇 Silenciar'; mute.setAttribute('aria-pressed', String(audio.muted)); } });
    if (mute) mute.addEventListener('click', () => { audio.muted = !audio.muted; localStorage.setItem('bka_music_muted', String(audio.muted)); mute.textContent = audio.muted ? '🔊 Activar' : '🔇 Silenciar'; mute.setAttribute('aria-pressed', String(audio.muted)); if (!audio.muted) audio.play().catch(() => {}); });
    const start = () => audio.play().catch(() => {}); document.addEventListener('pointerdown', start, { once: true }); document.addEventListener('keydown', start, { once: true });
  }
  function setupGuide() {
    const page = location.pathname.split('/').pop() || 'index.html', item = guides[page]; if (!item || document.getElementById('academy-guide')) return;
    const root = document.createElement('aside'); root.id = 'academy-guide';
    root.innerHTML = '<button class="guide-mini" type="button" aria-label="Abrir guía"><img src="assets/characters/' + item[0] + '-mini.png" alt="Guía ' + item[1] + '" onerror="this.remove()"></button><div class="guide-dialog" hidden><div class="guide-heading"><span class="guide-large-sprite"><img src="assets/characters/' + item[0] + '.png" alt="' + item[1] + '" onerror="this.remove()"></span><strong>' + item[1] + '</strong></div><p class="guide-line"></p><button type="button" class="guide-next">Continuar ›</button></div>';
    document.body.appendChild(root);
    const mini = root.querySelector('.guide-mini'), panel = root.querySelector('.guide-dialog'), line = root.querySelector('.guide-line'), next = root.querySelector('.guide-next'); let i = 0;
    function advance() { if (i >= item[2].length) { panel.hidden = true; mini.hidden = false; i = 0; return; } line.textContent = item[2][i++]; line.style.animation = 'none'; line.offsetHeight; line.style.animation = ''; next.textContent = i >= item[2].length ? 'Cerrar ✕' : 'Continuar ›'; }
    mini.addEventListener('click', () => { mini.hidden = true; panel.hidden = false; i = 0; advance(); }); next.addEventListener('click', advance); line.addEventListener('click', advance);
  }
  function setupLogout() { const button = document.getElementById('academy-logout'); if (!button) return; button.addEventListener('click', () => { localStorage.removeItem('bka_usuario'); const overlay = document.getElementById('login-overlay'); if (overlay) overlay.remove(); if (typeof mostrarPantallaLogin === 'function') mostrarPantallaLogin(); else location.reload(); }); }
  document.addEventListener('DOMContentLoaded', () => { setupMusic(); setupGuide(); setupLogout(); });
})();