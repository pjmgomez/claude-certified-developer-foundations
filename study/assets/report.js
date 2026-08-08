// Renders a printable progress report from lesson-completion and spaced-review state.
// Reads window.COURSE_CATALOG + window.REVIEW_BANK and the two localStorage keys.
(function () {
  var LESSON_KEY = "ccdvf-progress-v1";
  var REVIEW_KEY = "ccdvf-review-v1";
  var BOX_COLORS = ["#e0d8c8", "#eccebf", "#e8b79d", "#cf8f6a", "#1f6f5c"];

  function read(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("report");
    if (!root) return;
    var progress = read(LESSON_KEY);
    var review = read(REVIEW_KEY);

    var dateEl = document.getElementById("report-date");
    if (dateEl) dateEl.textContent = "Generated " + new Date().toLocaleDateString(undefined,
      { year: "numeric", month: "long", day: "numeric" });

    var printBtn = document.getElementById("print-btn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    // ---- Lessons ----
    var catalog = window.COURSE_CATALOG || [];
    var totalLessons = 0, doneLessons = 0;
    catalog.forEach(function (p) {
      p.lessons.forEach(function (l) { totalLessons++; if (progress[l.id]) doneLessons++; });
    });
    var pct = totalLessons ? Math.round(100 * doneLessons / totalLessons) : 0;

    var lessons = el("section");
    lessons.appendChild(el("h2", null, "Lessons"));
    lessons.appendChild(el("div", "report-big",
      doneLessons + " / " + totalLessons +
      ' <span style="font-size:1rem;color:var(--ink-soft)">(' + pct + "%)</span>"));
    var bar = el("div", "progress-bar");
    var fill = el("div", "progress-fill"); fill.style.width = pct + "%";
    bar.appendChild(fill);
    lessons.appendChild(bar);

    catalog.forEach(function (p) {
      var d2 = p.lessons.filter(function (l) { return progress[l.id]; }).length;
      var block = el("div", "report-phase");
      block.appendChild(el("h3", null,
        "<span>" + p.phase + '</span><span class="pc">' + d2 + "/" + p.lessons.length + "</span>"));
      var ul = el("ul", "report-list");
      p.lessons.forEach(function (l) {
        var done = !!progress[l.id];
        ul.appendChild(el("li", done ? "done" : null,
          '<span class="mark">' + (done ? "\u2713" : "\u25cb") + "</span>" + l.title));
      });
      block.appendChild(ul);
      lessons.appendChild(block);
    });
    root.appendChild(lessons);

    // ---- Spaced review ----
    var bank = window.REVIEW_BANK || [];
    var rev = el("section");
    rev.appendChild(el("h2", null, "Spaced review"));
    var mastered = 0;
    if (!bank.length) {
      rev.appendChild(el("p", "report-note", "Review bank not loaded."));
    } else {
      var now = Date.now();
      var counts = [0, 0, 0, 0, 0], due = 0;
      bank.forEach(function (q) {
        var e = review[q.id] || { box: 1, due: 0 };
        counts[(e.box || 1) - 1]++;
        if (now >= (e.due || 0)) due++;
      });
      mastered = counts[4];
      rev.appendChild(el("div", "review-stats",
        '<span class="review-stat"><b>' + bank.length + "</b> questions</span>" +
        '<span class="review-stat"><b>' + due + "</b> due now</span>" +
        '<span class="review-stat"><b>' + mastered + "</b> mastered (box 5)</span>"));
      var bbar = el("div", "box-bar");
      counts.forEach(function (c, i) {
        if (!c) return;
        var seg = el("div", "box-seg");
        seg.style.width = (100 * c / bank.length) + "%";
        seg.style.background = BOX_COLORS[i];
        seg.title = "Box " + (i + 1) + ": " + c;
        bbar.appendChild(seg);
      });
      rev.appendChild(bbar);
      if (Object.keys(review).length === 0) {
        rev.appendChild(el("p", "report-note", "Not started yet \u2014 open the spaced-review drill to begin."));
      }
    }
    root.appendChild(rev);

    // ---- Readiness verdict ----
    var verdict = el("div", "report-verdict");
    var lessonsDone = totalLessons > 0 && doneLessons === totalLessons;
    var masteredEnough = bank.length > 0 && mastered >= Math.ceil(bank.length * 0.8);
    var msg;
    if (lessonsDone && masteredEnough) {
      msg = "<b>Looking exam-ready.</b> Every lesson is complete and most review items are mastered. " +
        "Do a final timed pass of the official sample questions, then book it.";
    } else if (lessonsDone) {
      msg = "<b>Content complete \u2014 keep drilling.</b> All lessons are done; now push the spaced review " +
        "until at least 80% of items reach box 5.";
    } else {
      msg = "<b>In progress.</b> " + (totalLessons - doneLessons) + " lesson(s) to go. Work the map " +
        "top-to-bottom and start the daily spaced review as your lessons accumulate.";
    }
    verdict.innerHTML = msg;
    root.appendChild(verdict);
  });
})();
