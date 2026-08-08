---
mode: agent
description: "Scaffold a new CCDV-F reference sheet in study/reference/ and wire its reciprocal links to the lesson(s) it supports."
---

# Add a reference sheet

Create a print-oriented cheat sheet in the `study/` web app. Reference sheets are **not** lessons:
no quiz, no numbering, and **not** registered in the catalog or course map. Full conventions:
[AGENTS.md](../../AGENTS.md) and
[reference-sheets.instructions.md](../instructions/reference-sheets.instructions.md).

## Gather inputs

Use anything the user provided in `${input:details}`. Infer the rest and ask only if still ambiguous:

- **Slug** — kebab-case filename (no number), e.g. `caching-batch`. Sheets are slug-named, not
  sequential (see [study/reference/](../../study/reference/)).
- **Title**, **domain / topic** for the `.badge`, and the **lesson(s)** the sheet supports.

## Steps

1. **Create `study/reference/SLUG.html`** by copying the structure of an existing sheet
   ([models-pricing.html](../../study/reference/models-pricing.html)). Fill in this skeleton:

   ```html
   <!doctype html>
   <html lang="en">
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>Reference · TITLE</title>
     <link rel="stylesheet" href="../assets/styles.css">
     <script src="../assets/theme.js"></script>
   </head>
   <body>
   <main class="sheet">
     <header class="lesson-head">
       <div class="lesson-kicker">Reference sheet</div>
       <h1>TITLE</h1>
       <p class="lesson-sub">One line — what to reach for this sheet for.</p>
       <div class="badges"><span class="badge">Domain X.Y · TOPIC</span></div>
     </header>

     <!-- If the sheet carries volatile facts (model IDs, pricing, beta headers, cache
          multipliers), lead with a PROVISIONAL banner. Otherwise omit this callout. -->
     <div class="callout callout--warn">
       <span class="callout__label">Everything below is PROVISIONAL</span>
       Confirm on the live docs before you ship — this environment can't reach them.
     </div>

     <!-- Body: tables, <pre><code>, prose. Reuse styles.css classes; invent nothing. -->

     <div class="callout callout--source">
       <span class="callout__label">Primary source</span>
       <a href="https://platform.claude.com/docs/…">Official doc</a>.
     </div>
     <footer class="course-foot">CCDV-F reference &middot; used by
       <a href="../lessons/NNNN-slug.html">Lesson NNNN</a>.</footer>
   </main>
   </body>
   </html>
   ```

2. **Wire the reciprocal link** — in each supporting lesson, point the `course-foot`
   `Reference: <a href="../reference/SLUG.html">…</a>` at the new sheet, and make the sheet's own
   footer name those lessons. (The sheet ↔ lesson link is the only cross-reference; there is no index entry.)

## Rules — how a sheet differs from a lesson

- **Do not** add the sheet to [catalog.js](../../study/assets/catalog.js), the
  [index.html](../../study/index.html) course-map `<ol>`, or the progress tracker — sheets are **not
  tracked**. Creating one normally touches just the new file (plus a lesson footer for the link).
- **Only script is `../assets/theme.js`** (the shared light/dark toggle, in `<head>`); **no `.quiz`,
  no `.lesson-nav`.** Use `<main class="sheet">` and link `../assets/styles.css`.
- Reuse existing `styles.css` classes; don't invent styles. Ground claims in primary sources; mark
  volatile facts **PROVISIONAL** — no web-fetch here, so verify SDK code against the official GitHub repos.
- Report the files you changed so the user can review before committing (`docs:`).
