// Three-way theme control (System / Light / Dark) shared by every page.
// Applies the saved choice to <html> before first paint to avoid a flash,
// then injects a fixed toggle button. State persists in localStorage.
(function () {
  var KEY = "ccdvf-theme-v1";
  var MODES = ["system", "light", "dark"];
  var LABELS = { system: "System", light: "Light", dark: "Dark" };

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  // In-memory fallback so the toggle keeps cycling even when localStorage
  // is unavailable (blocked/full) and setItem/getItem can't persist state.
  var memoryMode = null;
  function store(mode) {
    memoryMode = mode;
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }
  function current() {
    var m = saved();
    if (MODES.indexOf(m) === -1) m = memoryMode;
    return MODES.indexOf(m) === -1 ? "system" : m;
  }
  // Explicit light/dark set the attribute; "system" removes it so the
  // prefers-color-scheme media query in styles.css takes over.
  function apply(mode) {
    var root = document.documentElement;
    if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);
    else root.removeAttribute("data-theme");
  }

  // Runs in <head>, before <body> paints — no theme flash.
  apply(current());

  var ICONS = {
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="3.5" width="19" height="14" rx="2"/><path d="M8 21h8M12 17.5V21"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  };

  function build() {
    if (document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";

    function render() {
      var mode = current();
      btn.innerHTML = ICONS[mode] +
        '<span class="theme-toggle__label">' + LABELS[mode] + "</span>";
      btn.setAttribute("aria-label", "Theme: " + LABELS[mode] + " \u2014 click to change");
      btn.title = "Theme: " + LABELS[mode];
    }

    btn.addEventListener("click", function () {
      var next = MODES[(MODES.indexOf(current()) + 1) % MODES.length];
      store(next);
      apply(next);
      render();
    });

    render();
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
