/* Ballknowledge Academy — literary academy UI layer (keeps data.js untouched) */
(function () {
  const guides = {
    "index.html": ["natsuki", "Natsuki", ["Qué pasa ¿te has perdido? Aquí solo hablamos de manga y anime de romance, si no te interesa puedes ir dándote la vuelta.", "C-cómo?!! Que si quieres estar aquí y seguir aprendiendo sobre esta academia?", "Pues siéntete libre de indagar en sus diferentes apartados y personalizar tu perfil al fondo de esta misma página.", "T-te lo he dicho solo por educación! No te hagas ideas raras de mí b-baka!."]],
    "planeados.html": ["mai", "Mai", ["Que aburrida estoy en la sección de planeados de esta biblioteca. Aquí solo hay animes que la gente no tiene tiempo de ver.", "Cómo!? Puedes verme? Y escucharme?", "Pues que desgracia que hayas tenido que ser tú el único que pueda reconocerme. Si necesitas algo más no acudas a mi."]],
    "resenas.html": ["chica-3", "Chica 3", ["¡Bienvenido a las reseñas!", "Aquí puedes consultar nuestras valoraciones y sus categorías.", "¡Que disfrutes explorando la academia!"]],
    "calendario.html": ["waguri", "Waguri", ["H-hola! Aquí podrás consultar el calendario de episodios.", "La organización es fundamental! Por eso anunciamos aquí los episodios que tocan cada día para que no te pierdas ninguno.", "También puedes elegir si estar al día o no, a si que no tengas presión.", "¡Nos vemos mañana con más y mejor!"]],
    "ruleta.html": ["marin", "Marin", ["¡Holiii:)! ¿No sabes qué anime elegir? ¡No te preocupes! La ruleta puede decidir por ti.", "Hay veces que no sale el anime más chuli, pero como en el cosplay, hay que seguir adelante a pesar de las adversidades no?.", "Basta ya de hablar! dale a la palanca y a ver que sale. Suertee!"]],
    "listas.html": ["chica-6", "Chica 6", ["Este rincón reúne nuestras listas musicales.", "Canciones que acompañan las historias y momentos de la academia.", "A veces una melodía también cuenta una historia."]]
  };
  function setupMusic() {
    let audio = document.getElementById('academy-bgm');
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'academy-bgm';
      audio.src = 'audio/academy-theme.mp3';
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = .35;
      document.body.appendChild(audio);
    }

    let dock = document.getElementById('bka-music-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'bka-music-dock';
      dock.className = 'bka-music-dock';
      dock.innerHTML = '<button type="button" class="bka-music-toggle" aria-label="Reproducir música" title="Reproducir música">▶</button><input class="bka-music-volume" type="range" min="0" max="100" step="1" aria-label="Volumen de música"><span class="bka-music-status" role="status">Preparando música…</span>';
      document.body.appendChild(dock);
    }
    const playButton = dock.querySelector('.bka-music-toggle');
    const dockRange = dock.querySelector('.bka-music-volume');
    const status = dock.querySelector('.bka-music-status');
    const range = document.getElementById('academy-volume');
    const mute = document.getElementById('academy-mute');

    if (!window.__bkaMusicInitialized) {
      window.__bkaMusicInitialized = true;
      let vol = Number(localStorage.getItem('bka_music_volume'));
      if (!Number.isFinite(vol) || vol < 0 || vol > 1) vol = .35;
      audio.volume = vol;
      audio.muted = localStorage.getItem('bka_music_muted') === 'true';
      const savedTime = Number(sessionStorage.getItem('bka_music_time') || localStorage.getItem('bka_music_time') || 0);

      const updateStatus = () => {
        if (audio.error) {
          status.textContent = 'Falta audio/academy-theme.mp3';
          playButton.disabled = true;
          return;
        }
        playButton.disabled = false;
        playButton.textContent = audio.paused ? '▶' : 'Ⅱ';
        playButton.setAttribute('aria-label', audio.paused ? 'Reproducir música' : 'Pausar música');
        playButton.title = audio.paused ? 'Reproducir música' : 'Pausar música';
        status.textContent = audio.paused ? 'Música en pausa' : 'Reproduciendo';
      };
      audio.addEventListener('loadedmetadata', () => {
        if (Number.isFinite(savedTime) && savedTime > 0 && audio.duration && savedTime < audio.duration) audio.currentTime = savedTime;
        audio.play().catch(() => { status.textContent = 'Pulsa ▶ para escuchar'; });
      }, { once: true });
      audio.addEventListener('timeupdate', () => {
        const t = String(audio.currentTime || 0);
        sessionStorage.setItem('bka_music_time', t);
        localStorage.setItem('bka_music_time', t);
      });
      window.addEventListener('pagehide', () => {
        const t = String(audio.currentTime || 0);
        sessionStorage.setItem('bka_music_time', t);
        localStorage.setItem('bka_music_time', t);
      });
      audio.addEventListener('play', updateStatus);
      audio.addEventListener('pause', updateStatus);
      audio.addEventListener('error', updateStatus);
      playButton.addEventListener('click', () => {
        if (audio.paused) audio.play().then(updateStatus).catch(() => {
          status.textContent = audio.error ? 'Falta audio/academy-theme.mp3' : 'No se pudo iniciar la música';
        });
        else { audio.pause(); updateStatus(); }
      });
      const start = () => audio.play().catch(() => { status.textContent = audio.error ? 'Falta audio/academy-theme.mp3' : 'Pulsa ▶ para escuchar'; });
      document.addEventListener('pointerdown', start, { once: true });
      document.addEventListener('keydown', start, { once: true });
      audio.load();
      updateStatus();
    }

    const syncVolume = value => {
      const vol = Math.max(0, Math.min(1, Number(value) / 100));
      audio.volume = vol;
      localStorage.setItem('bka_music_volume', String(vol));
      if (vol > 0 && audio.muted) {
        audio.muted = false;
        localStorage.setItem('bka_music_muted', 'false');
      }
    };
    if (dockRange) {
      dockRange.value = String(Math.round(audio.volume * 100));
      if (!dockRange.dataset.musicBound) {
        dockRange.dataset.musicBound = 'true';
        dockRange.addEventListener('input', () => syncVolume(dockRange.value));
      }
    }
    if (range) {
      range.value = String(Math.round(audio.volume * 100));
      if (!range.dataset.musicBound) {
        range.dataset.musicBound = 'true';
        range.addEventListener('input', () => {
          syncVolume(range.value);
          if (dockRange) dockRange.value = range.value;
          if (mute) {
            mute.textContent = audio.muted ? '🔊' : '🔇';
            mute.setAttribute('aria-pressed', String(audio.muted));
          }
        });
      }
    }
    if (mute) {
      mute.textContent = audio.muted ? '🔊' : '🔇';
      mute.setAttribute('aria-pressed', String(audio.muted));
      if (!mute.dataset.musicBound) {
        mute.dataset.musicBound = 'true';
        mute.addEventListener('click', () => {
          audio.muted = !audio.muted;
          localStorage.setItem('bka_music_muted', String(audio.muted));
          mute.textContent = audio.muted ? '🔊' : '🔇';
          mute.setAttribute('aria-pressed', String(audio.muted));
          if (!audio.muted) audio.play().catch(() => {});
        });
      }
    }
  }
  function setupGuide() {
    const page = window.BKA_currentPage || (location.hash ? location.hash.slice(1) + '.html' : (location.pathname.split('/').pop() || 'index.html'));
    document.body.classList.remove('page-index', 'page-resenas', 'page-planeados', 'page-calendario', 'page-ruleta', 'page-listas');
    document.body.classList.add('page-' + page.replace('.html', ''));
    const previousGuide = document.getElementById('academy-guide');
    if (previousGuide) previousGuide.remove();
    window.__bkaGuideUsed = window.__bkaGuideUsed || {};
    const item = guides[page]; if (!item || window.__bkaGuideUsed[page]) return;
    const root = document.createElement('aside'); root.id = 'academy-guide';
    root.innerHTML = '<button class="guide-mini" type="button" aria-label="Abrir guía"><img src="assets/characters/' + item[0] + '-mini.png?v=20261109d" alt="Guía ' + item[1] + '"></button><span class="guide-portrait" hidden><img src="assets/characters/' + (item[0] === 'natsuki' ? 'natsuki-dialog-1.webp?v=20261108c' : item[0] === 'waguri' ? 'waguri-dialog-1.png?v=20261109d' : item[0] === 'marin' ? 'marin-dialog-1.png?v=20261121a' : item[0] === 'mai' ? 'mai-dialog-1.png?v=20261123a' : item[0] + '.png') + '" alt="' + item[1] + '"></span><div class="guide-dialog" hidden><div class="guide-heading"><strong>' + item[1] + '</strong></div><p class="guide-line"></p><button type="button" class="guide-next">Continuar ›</button></div>';
    document.body.appendChild(root);
    const mini = root.querySelector('.guide-mini'), portrait = root.querySelector('.guide-portrait'), panel = root.querySelector('.guide-dialog'), line = root.querySelector('.guide-line'), next = root.querySelector('.guide-next'); let i = 0; const miniImg = mini.querySelector('img'); if (miniImg) miniImg.addEventListener('error', () => { miniImg.style.display = 'none'; mini.classList.add('guide-image-missing'); mini.dataset.guideName = item[1]; });
    if (item[0] === 'natsuki' || item[0] === 'waguri' || item[0] === 'marin' || item[0] === 'mai') { const miniImg = mini.querySelector('img'); if (miniImg) miniImg.style.animation = 'natsukiMiniBounces 13s ease-in-out infinite'; }
    function closeGuide() {
      root.classList.add('guide-closing'); panel.classList.add('guide-closing'); portrait.classList.add('guide-closing');
      if (item[0] !== 'mai') mini.hidden = false;
      const fade = el => el && typeof el.animate === 'function' ? el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 850, easing: 'ease-in', fill: 'forwards' }) : null;
      const panelFade = fade(panel), portraitFade = fade(portrait);
      let miniFade = null;
      if (item[0] === 'mai') {
        mini.hidden = false; mini.style.opacity = '1';
        miniFade = mini.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1250, easing: 'ease-in-out', fill: 'forwards' });
      }
      window.setTimeout(() => {
        panel.hidden = true; portrait.hidden = true;
        [panelFade, portraitFade, miniFade].forEach(animation => { if (animation) animation.cancel(); });
        panel.style.opacity = ''; portrait.style.opacity = '';
        if (item[0] === 'mai') { mini.hidden = true; mini.disabled = true; mini.style.opacity = ''; root.classList.add('guide-used'); window.__bkaGuideUsed[page] = true; }
        else mini.style.opacity = '';
        root.classList.remove('guide-closing'); panel.classList.remove('guide-closing'); portrait.classList.remove('guide-closing'); i = 0;
      }, item[0] === 'mai' ? 1300 : 900);
    }
    function advance() { if (i >= item[2].length) { closeGuide(); return; } line.textContent = item[2][i]; const portraitImg = portrait.querySelector('img'); if (portraitImg && item[0] === 'natsuki') portraitImg.src = 'assets/characters/natsuki-dialog-' + [1, 2, 3, 4][i] + '.webp?v=20261108c'; if (portraitImg && item[0] === 'waguri') { portrait.dataset.waguriFrame = String(i + 1); portraitImg.src = 'assets/characters/waguri-dialog-' + [1, 2, 3, 4][i] + '.png?v=20261109e'; } if (portraitImg && item[0] === 'marin') { portrait.dataset.marinFrame = String(i + 1); portraitImg.src = 'assets/characters/marin-dialog-' + [1, 2, 3][i] + '.png?v=20261121a'; } if (portraitImg && item[0] === 'mai') { portrait.dataset.maiFrame = String(i + 1); portraitImg.src = 'assets/characters/mai-dialog-' + [1, 2, 3, 4][i] + '.png?v=20261123a'; } i++; line.style.animation = 'none'; line.offsetHeight; line.style.animation = ''; next.textContent = i >= item[2].length ? 'Cerrar ✕' : 'Continuar ›'; }
    mini.addEventListener('click', () => { mini.hidden = true; portrait.hidden = false; panel.hidden = false; i = 0; advance(); }); next.addEventListener('click', advance); line.addEventListener('click', advance);
  }
  function setupLogout() { const button = document.getElementById('academy-logout'); if (!button) return; button.addEventListener('click', async () => { button.disabled = true; try { localStorage.removeItem('bka_usuario'); await firebase.auth().signOut(); location.replace('login.html'); } catch (error) { button.disabled = false; console.error('No se pudo cerrar la sesión:', error); alert('No se pudo cerrar la sesión. Inténtalo de nuevo.'); } }); }
  window.BKA_initPage = function (page) {
    if (page) window.BKA_currentPage = page;
    setupMusic();
    setupGuide();
    setupLogout();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.BKA_initPage(window.BKA_currentPage), { once: true });
  } else {
    window.BKA_initPage(window.BKA_currentPage);
  }
})();
