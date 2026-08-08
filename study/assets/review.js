// Spaced-repetition engine (Leitner boxes) over window.REVIEW_BANK.
// State persists in localStorage; questions interleave across domains.
(function () {
  var KEY = "ccdvf-review-v1";
  var BOX_COUNT = 5;
  // Interval before a box's item is due again, in milliseconds.
  var DAY = 86400000;
  var INTERVALS = [0, 0, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY]; // index by box 1..5
  var BOX_COLORS = ["#e0d8c8", "#eccebf", "#e8b79d", "#cf8f6a", "#1f6f5c"];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }

  function entry(state, id) {
    if (!state[id]) state[id] = { box: 1, due: 0 };
    return state[id];
  }
  function isDue(e, now) { return now >= (e.due || 0); }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function boxCounts(state) {
    var counts = [0, 0, 0, 0, 0]; // box 1..5
    window.REVIEW_BANK.forEach(function (q) {
      var b = state[q.id] ? state[q.id].box : 1;
      counts[b - 1]++;
    });
    return counts;
  }

  function App(root) {
    this.root = root;
    this.state = load();
    this.queue = [];
    this.answered = 0;
    this.correct = 0;
    this.buildQueue();
    this.render();
  }

  App.prototype.buildQueue = function (all) {
    var state = this.state, now = Date.now();
    var items = window.REVIEW_BANK.filter(function (q) {
      return all || isDue(entry(state, q.id), now);
    });
    this.queue = shuffle(items.slice());
    this.sessionTotal = this.queue.length;
    this.answered = 0;
    this.correct = 0;
  };

  App.prototype.grade = function (q, wasCorrect) {
    var e = entry(this.state, q.id);
    e.box = wasCorrect ? Math.min(BOX_COUNT, e.box + 1) : 1;
    e.due = Date.now() + INTERVALS[e.box];
    save(this.state);
  };

  App.prototype.statsBar = function () {
    var counts = boxCounts(this.state);
    var total = window.REVIEW_BANK.length;
    var now = Date.now(), state = this.state;
    var due = window.REVIEW_BANK.filter(function (q) { return isDue(entry(state, q.id), now); }).length;
    var mastered = counts[BOX_COUNT - 1];

    var wrap = document.createElement("div");
    var stats = document.createElement("div");
    stats.className = "review-stats";
    stats.innerHTML =
      '<span class="review-stat"><b>' + total + '</b> questions</span>' +
      '<span class="review-stat"><b>' + due + '</b> due now</span>' +
      '<span class="review-stat"><b>' + mastered + '</b> mastered (box 5)</span>';
    wrap.appendChild(stats);

    var bar = document.createElement("div");
    bar.className = "box-bar";
    counts.forEach(function (c, i) {
      if (c === 0) return;
      var seg = document.createElement("div");
      seg.className = "box-seg";
      seg.style.width = (100 * c / total) + "%";
      seg.style.background = BOX_COLORS[i];
      seg.title = "Box " + (i + 1) + ": " + c;
      bar.appendChild(seg);
    });
    wrap.appendChild(bar);
    return wrap;
  };

  App.prototype.render = function () {
    var self = this;
    this.root.innerHTML = "";
    this.root.appendChild(this.statsBar());

    if (this.queue.length === 0) {
      var done = document.createElement("div");
      done.className = "review-done";
      var caughtUp = this.sessionTotal === 0;
      done.innerHTML = "<h2>" + (caughtUp ? "All caught up \u2713" : "Session complete \u2713") + "</h2>" +
        "<p>" + (caughtUp
          ? "Nothing is due right now. Come back later, or drill the whole bank anyway."
          : "You answered " + this.correct + " / " + this.sessionTotal + " correctly. Spacing is doing its work \u2014 return tomorrow.") + "</p>";
      var actions = document.createElement("div");
      actions.className = "review-actions";
      actions.style.justifyContent = "center";
      var drill = document.createElement("button");
      drill.className = "btn";
      drill.textContent = "Drill all questions";
      drill.onclick = function () { self.buildQueue(true); self.render(); };
      actions.appendChild(drill);
      done.appendChild(actions);
      this.root.appendChild(done);
      this.renderReset();
      return;
    }

    var q = this.queue[0];
    var card = document.createElement("div");
    card.className = "quiz__q";

    var dom = document.createElement("div");
    dom.className = "review-domain";
    dom.textContent = q.domain;
    card.appendChild(dom);

    var stem = document.createElement("p");
    stem.className = "quiz__stem";
    stem.textContent = q.stem;
    card.appendChild(stem);

    var opts = document.createElement("div");
    opts.className = "quiz__opts";
    var feedback = document.createElement("div");
    feedback.className = "quiz__feedback";
    var answered = false;

    // Shuffle so the correct option (authored first) isn't always the first button.
    var order = shuffle(q.options.map(function (text, i) {
      return { text: text, correct: i === q.answer };
    }));

    order.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.className = "quiz__opt";
      btn.type = "button";
      btn.textContent = opt.text;
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var right = opt.correct;
        Array.prototype.forEach.call(opts.children, function (c, ci) {
          c.setAttribute("disabled", "disabled");
          if (order[ci].correct) c.classList.add("quiz__opt--correct");
          else if (ci === i) c.classList.add("quiz__opt--wrong");
        });
        self.grade(q, right);
        self.answered++;
        if (right) self.correct++;
        feedback.innerHTML = "<b>" + (right ? "Correct." : "Not quite.") + "</b> " + q.explain;
        feedback.classList.add("quiz__feedback--shown");
        next.style.display = "inline-block";
      });
      opts.appendChild(btn);
    });
    card.appendChild(opts);
    card.appendChild(feedback);

    var next = document.createElement("button");
    next.className = "btn";
    next.style.display = "none";
    next.style.marginTop = "1rem";
    next.textContent = "Next \u2192";
    next.onclick = function () { self.queue.shift(); self.render(); };
    card.appendChild(next);

    this.root.appendChild(card);

    var prog = document.createElement("div");
    prog.className = "review-progress";
    prog.textContent = (this.sessionTotal - this.queue.length + 1) + " / " + this.sessionTotal + " this session";
    this.root.appendChild(prog);
    this.renderReset();
  };

  App.prototype.renderReset = function () {
    var self = this;
    var actions = document.createElement("div");
    actions.className = "review-actions";
    var reset = document.createElement("button");
    reset.className = "btn btn--ghost btn--small";
    reset.textContent = "Reset all progress";
    reset.onclick = function () {
      if (confirm("Clear all spaced-review progress on this device?")) {
        localStorage.removeItem(KEY);
        self.state = {};
        self.buildQueue();
        self.render();
      }
    };
    actions.appendChild(reset);
    this.root.appendChild(actions);
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("review-app");
    if (root && window.REVIEW_BANK) new App(root);
  });
})();
