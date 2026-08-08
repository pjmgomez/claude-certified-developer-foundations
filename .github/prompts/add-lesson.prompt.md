---
mode: agent
description: "Scaffold a new CCDV-F study lesson and register it in the course map and catalog."
---

# Add a study lesson

Create a new lesson in the `study/` web app and wire it into all three places that must stay in
sync. Full conventions: [AGENTS.md](../../AGENTS.md) and
[lessons.instructions.md](../instructions/lessons.instructions.md).

## Gather inputs

Use anything the user provided in `${input:details}`. For anything missing, infer from
[study/assets/catalog.js](../../study/assets/catalog.js) and ask only if still ambiguous:

- **Number** — next 4-digit zero-padded sequential id (unless the user gives one).
- **Slug**, **title**, **target phase**, **domain / weight**, and the **topic** to teach.

## Steps

1. **Create `study/lessons/NNNN-slug.html`** by copying the structure of an existing lesson
   ([0006-tool-use-loop.html](../../study/lessons/0006-tool-use-loop.html)). Fill in this skeleton:

   ```html
   <!doctype html>
   <html lang="en">
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>Phase N · TITLE</title>
     <link rel="stylesheet" href="../assets/styles.css">
     <script src="../assets/theme.js"></script>
   </head>
   <body>
   <main>
     <header class="lesson-head">
       <div class="lesson-kicker">Phase N · PHASE NAME</div>
       <h1>TITLE</h1>
       <p class="lesson-sub">One-sentence hook.</p>
       <div class="badges">
         <span class="badge">Domain X.Y · TOPIC</span>
         <span class="badge badge--weight">Domain X = Z%</span>
       </div>
     </header>

     <p>Lead paragraph — plain-language explanation, then a concrete win.</p>

     <h2>Do it</h2>
     <ol class="steps">
       <li>A hands-on step with a runnable snippet:
         <pre><code>… Python (primary language) …</code></pre></li>
     </ol>

     <h2>Check yourself</h2>
     <div class="quiz">
       <script type="application/json">
       [
         {
           "stem": "A question that tests understanding?",
           "options": ["Correct answer text", "Plausible distractor one", "Plausible distractor two", "Plausible distractor thr"],
           "answer": 0,
           "explain": "Why the first option is right and the others are not."
         }
       ]
       </script>
     </div>

     <nav class="lesson-nav">
       <a href="PREV-slug.html">&larr; Previous title</a>
       <a href="NEXT-slug.html">Next &middot; Next title &rarr;</a>
     </nav>

     <footer class="course-foot">CCDV-F &middot; Lesson NNNN &middot; Reference:
       <a href="../reference/SHEET.html">related reference sheet</a></footer>
   </main>
   <script src="../assets/quiz.js"></script>
   </body>
   </html>
   ```

2. **Register it in the course map** — add
   `<li><a href="lessons/NNNN-slug.html">Title</a></li>` inside the `<ol>` of the matching
   `.phase` block in [study/index.html](../../study/index.html), in lesson order.

3. **Register it in the catalog** — add `{ id: "NNNN-slug", title: "Title" }` to the matching
   phase in [study/assets/catalog.js](../../study/assets/catalog.js). The `id` must equal the
   filename slug.

4. **Fix the neighbours' nav** — point the previous lesson's "Next" link and this lesson's
   `lesson-nav` at the right files.

## Rules

- Quiz JSON: `answer` is a 0-based index (author the correct option first); keep all `options`
  the same length; valid JSON only (no trailing commas) or the quiz silently vanishes.
- Reuse existing `styles.css` classes; don't invent styles.
- Ground claims in primary sources; mark volatile facts (model IDs, pricing, beta headers, cache
  multipliers) **PROVISIONAL**. No web-fetch here — verify SDK code against the official GitHub repos.
- Report the three (or four) files you changed so the user can review before committing (`docs:`).
