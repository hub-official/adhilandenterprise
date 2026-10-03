/**
 * Adhiland Finance — Theme manager
 * Spec: 03_SPEC_DESIGN_SYSTEM.md §3
 */
(function () {
  'use strict';

  const KEY = 'adh_theme';

  function getTheme() {
    try {
      const t = localStorage.getItem(KEY);
      return t === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  }

  function setTheme(name) {
    const t = name === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
    // Update toggle button if present
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', t === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
      btn.title = t === 'dark' ? 'Tema terang' : 'Tema gelap';
      if (window.AdhShell && window.AdhShell.icon) btn.innerHTML = window.AdhShell.icon(t === 'dark' ? 'sun' : 'moon', 17);
    }
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // Expose
  window.AdhTheme = { get: getTheme, set: setTheme, toggle: toggleTheme };

  // Init toggle binding when DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
      // Sync icon
      const t = getTheme();
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      if (window.AdhShell && window.AdhShell.icon) btn.innerHTML = window.AdhShell.icon(t === 'dark' ? 'sun' : 'moon', 17);
    }
  });
})();
