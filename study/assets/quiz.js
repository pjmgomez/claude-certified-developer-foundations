// Reusable quiz widget for CCDV-F lessons. No dependencies.
// A .quiz element holds a <script type="application/json"> array of questions:
//   [{ "stem": "...", "options": ["...","..."], "answer": 0, "explain": "..." }]
// Renders each question with option buttons and gives immediate, automatic feedback.
(function () {
  function render(container) {
    var dataEl = container.querySelector('script[type="application/json"]');
    if (!dataEl) return;
    var questions;
    try { questions = JSON.parse(dataEl.textContent); } catch (e) { return; }

    questions.forEach(function (q) {
      var qEl = document.createElement('div');
      qEl.className = 'quiz__q';

      var stem = document.createElement('p');
      stem.className = 'quiz__stem';
      stem.textContent = q.stem;
      qEl.appendChild(stem);

      var opts = document.createElement('div');
      opts.className = 'quiz__opts';
      var feedback = document.createElement('div');
      feedback.className = 'quiz__feedback';
      var answered = false;

      q.options.forEach(function (text, i) {
        var btn = document.createElement('button');
        btn.className = 'quiz__opt';
        btn.type = 'button';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          Array.prototype.forEach.call(opts.children, function (c, ci) {
            c.setAttribute('disabled', 'disabled');
            if (ci === q.answer) c.classList.add('quiz__opt--correct');
            else if (ci === i) c.classList.add('quiz__opt--wrong');
          });
          var right = i === q.answer;
          feedback.innerHTML = '<b>' + (right ? 'Correct.' : 'Not quite.') + '</b> ' + q.explain;
          feedback.classList.add('quiz__feedback--shown');
        });
        opts.appendChild(btn);
      });

      qEl.appendChild(opts);
      qEl.appendChild(feedback);
      container.appendChild(qEl);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.quiz').forEach(render);
  });
})();
