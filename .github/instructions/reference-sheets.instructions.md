---
applyTo: "study/reference/**"
description: "Conventions for authoring or editing CCDV-F reference sheets (study/reference/*.html) — the print-oriented cheat sheets."
---

# Authoring CCDV-F reference sheets

Full context lives in [AGENTS.md](../../AGENTS.md); this is the enforceable checklist. Reference
sheets are **not** lessons — the lesson rules in [lessons.instructions.md](./lessons.instructions.md)
(quizzes, three-place sync, tracking) **do not apply here**.

## Structure — copy an existing sheet

Copy the shape of an existing sheet (e.g.
[models-pricing.html](../../study/reference/models-pricing.html)):

- `<main class="sheet">` wraps the page (lessons use a bare `<main>`).
- Header is `.lesson-head` with `.lesson-kicker` = **"Reference sheet"**, an `<h1>`, a `.lesson-sub`,
  and one or more `<span class="badge">Domain N.M · Topic</span>` inside `.badges`.
- Link `../assets/styles.css` and load `../assets/theme.js` in `<head>` (the shared light/dark
  toggle — the *only* script a sheet includes). **No `.quiz`, no `.lesson-nav`.**
- Close with `<footer class="course-foot">` linking the lesson(s) the sheet supports, e.g.
  `used by <a href="../lessons/0011-model-selection.html">Lesson 0011</a>`.

## Not tracked — do not register it

Unlike a lesson, a reference sheet is **not** in [catalog.js](../../study/assets/catalog.js), **not**
in the [index.html](../../study/index.html) course-map `<ol>`, and **not** counted by the progress
tracker or report. Adding one touches **one file only**; lessons point to it from their `course-foot`.

## Style & correctness

- Reuse existing `styles.css` classes (`.sheet`, `.lesson-head`, `.badges`, `.badge`, `.callout--*`,
  `table`, `<pre><code>`); don't invent styles. Asset path is `../assets/…` (sheets live one level down).
- Lead a volatile sheet with a `.callout--warn` **PROVISIONAL** banner and cite primary sources in a
  `.callout--source`. Mark volatile facts (model IDs, pricing, beta headers, cache multipliers)
  **PROVISIONAL** — this environment has no web-fetch; verify SDK code against the official GitHub
  repos. See [study/RESOURCES.md](../../study/RESOURCES.md).
- Commit as `docs:` (Conventional Commits — see [cchk.toml](../../cchk.toml)).
