/* Ballknowledge Academy — navegación SPA ligera.
   Conserva las páginas HTML como fuente de contenido y ejecuta sus scripts
   al entrar en cada sección. El reproductor vive fuera del contenedor. */
(function () {
  'use strict';

  const ROUTES = new Set([
    'index.html',
    'resenas.html',
    'planeados.html',
    'calendario.html',
    'ruleta.html',
    'listas.html'
  ]);

  let pageRoot = null;
  let navigating = false;

  function pageFromLocation() {
    const hash = (location.hash || '').replace(/^#/, '').toLowerCase();
    const fromHash = hash && (hash.endsWith('.html') ? hash : hash + '.html');
    if (fromHash && ROUTES.has(fromHash)) return fromHash;
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return ROUTES.has(file) ? file : 'index.html';
  }

  function pageKey(page) {
    return page.replace(/\.html$/i, '');
  }

  function setActiveNavigation(page) {
    document.querySelectorAll('.bottom-nav a[href]').forEach(link => {
      const target = link.getAttribute('href').split('/').pop().split('?')[0].toLowerCase();
      link.classList.toggle('active', target === page);
      if (target === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function preparePersistentShell() {
    if (pageRoot) return;
    pageRoot = document.createElement('div');
    pageRoot.id = 'bka-spa-page';
    pageRoot.style.display = 'contents';

    let persistentAudio = document.getElementById('academy-bgm');
    const nodes = Array.from(document.body.childNodes);
    nodes.forEach(node => {
      if (node === persistentAudio || (node.nodeType === 1 && (node.id === 'academy-guide' || node.tagName === 'SCRIPT'))) {
        node.remove();
      } else {
        pageRoot.appendChild(node);
      }
    });
    document.body.insertBefore(pageRoot, document.body.firstChild);
    if (persistentAudio) document.body.appendChild(persistentAudio);
  }

  function clearTransientBodyElements() {
    Array.from(document.body.children).forEach(node => {
      if (node === pageRoot || node.id === 'academy-bgm') return;
      node.remove();
    });
  }

  async function renderPage(page) {
    if (!ROUTES.has(page)) return;
    if (navigating) return;
    navigating = true;

    try {
      const response = await fetch(page, { cache: 'no-cache' });
      if (!response.ok) throw new Error('No se pudo cargar ' + page + ' (' + response.status + ').');
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const scripts = Array.from(parsed.body.querySelectorAll('script'))
        .filter(script => !script.src && (!script.type || script.type === 'text/javascript'))
        .map(script => script.textContent)
        .filter(code => code.trim());

      Array.from(parsed.body.querySelectorAll('script')).forEach(script => script.remove());
      clearTransientBodyElements();
      pageRoot.replaceChildren(...Array.from(parsed.body.childNodes));

      window.BKA_currentPage = page;
      document.title = parsed.title || 'Ballknowledge Academy';
      document.body.classList.remove('page-index', 'page-resenas', 'page-planeados', 'page-calendario', 'page-ruleta', 'page-listas');

      // Ejecuta el JavaScript específico de la página en un ámbito propio,
      // para que sus variables no choquen al volver a visitar una sección.
      for (const code of scripts) {
        try {
          new Function(code).call(window);
        } catch (error) {
          console.error('Error inicializando ' + page + ':', error);
        }
      }

      if (typeof window.BKA_initPage === 'function') window.BKA_initPage(page);
      if (typeof window.activarRevelados === 'function') window.activarRevelados();
      setActiveNavigation(page);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error de navegación SPA:', error);
      window.alert('No se ha podido abrir este apartado. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      navigating = false;
    }
  }

  function navigate(page, addHistory) {
    if (!ROUTES.has(page)) return;
    const target = new URL('index.html#' + pageKey(page), location.href);
    if (addHistory) history.pushState({ bkaPage: page }, '', target.href);
    renderPage(page);
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    const file = url.pathname.split('/').pop().toLowerCase();
    if (!ROUTES.has(file)) return;
    event.preventDefault();
    navigate(file, true);
  });

  window.addEventListener('popstate', () => {
    const page = pageFromLocation();
    renderPage(page);
  });

  function boot() {
    preparePersistentShell();
    const page = pageFromLocation();
    window.BKA_currentPage = page;
    setActiveNavigation(page);
    const initialFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page !== initialFile) renderPage(page);
    else if (typeof window.BKA_initPage === 'function') window.BKA_initPage(page);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
