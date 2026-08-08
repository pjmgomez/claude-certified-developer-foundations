// Per-lesson progress tracker for the course map.
// Adds a completion checkbox to each lesson and a progress panel; persists in localStorage.
(function () {
  var KEY = "ccdvf-progress-v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function slug(href) { var m = href.match(/lessons\/([^\/]+)\.html/); return m ? m[1] : null; }

  document.addEventListener("DOMContentLoaded", function () {
    var panel = document.getElementById("progress-panel");
    if (!panel) return;
    var state = load();
    var items = [];
    var phaseData = [];

    Array.prototype.forEach.call(document.querySelectorAll(".phase"), function (phase) {
      var ids = [];
      Array.prototype.forEach.call(phase.querySelectorAll("li"), function (li) {
        var a = li.querySelector('a[href^="lessons/"]');
        if (!a) return;
        var id = slug(a.getAttribute("href"));
        if (!id) return;
        var box = document.createElement("input");
        box.type = "checkbox";
        box.className = "lesson-check";
        box.setAttribute("aria-label", "Mark lesson complete");
        box.addEventListener("change", function () {
          if (box.checked) state[id] = true; else delete state[id];
          save(state);
          refresh();
        });
        li.insertBefore(box, li.firstChild);
        items.push({ li: li, id: id });
        ids.push(id);
      });
      if (ids.length) {
        var badge = document.createElement("span");
        badge.className = "phase-count";
        (phase.querySelector("h3") || phase).appendChild(badge);
        phaseData.push({ badge: badge, ids: ids });
      }
    });

    var total = items.length;

    panel.className = "progress-panel";
    panel.innerHTML =
      '<div class="progress-head"><span class="progress-label">Your progress</span>' +
      '<span class="progress-count"></span></div>' +
      '<div class="progress-bar"><div class="progress-fill"></div></div>' +
      '<div class="progress-actions"><span class="progress-pct"></span>' +
      '<span class="progress-buttons"><a href="progress.html">Full report \u2192</a>' +
      '<button class="btn btn--ghost btn--small" type="button">Reset progress</button></span></div>' +
      '<div class="progress-done">Every lesson complete \u2014 now drill the ' +
      '<a href="review.html">spaced review</a> daily and sit the exam with confidence.</div>';

    var fill = panel.querySelector(".progress-fill");
    var countEl = panel.querySelector(".progress-count");
    var pctEl = panel.querySelector(".progress-pct");
    var celebrate = panel.querySelector(".progress-done");

    panel.querySelector("button").addEventListener("click", function () {
      if (confirm("Clear your lesson-completion progress on this device?")) {
        state = {};
        save(state);
        refresh();
      }
    });

    function refresh() {
      var done = items.filter(function (it) { return state[it.id]; }).length;
      fill.style.width = (total ? 100 * done / total : 0) + "%";
      countEl.textContent = done + " / " + total;
      pctEl.textContent = (total ? Math.round(100 * done / total) : 0) + "% complete";
      items.forEach(function (it) {
        it.li.classList.toggle("done", !!state[it.id]);
        var b = it.li.querySelector(".lesson-check");
        if (b) b.checked = !!state[it.id];
      });
      phaseData.forEach(function (p) {
        var d = p.ids.filter(function (x) { return state[x]; }).length;
        p.badge.textContent = d + "/" + p.ids.length;
        p.badge.classList.toggle("phase-count--done", d === p.ids.length);
      });
      celebrate.style.display = (done === total && total > 0) ? "block" : "none";
    }

    refresh();
  });
})();
