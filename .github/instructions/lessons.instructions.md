---
applyTo: "study/lessons/**,study/index.html,study/assets/catalog.js,study/assets/review-bank.js"
description: "Conventions for authoring or editing CCDV-F study lessons and quiz/review questions in study/."
---

# Authoring CCDV-F lessons

Full context lives in [AGENTS.md](../../AGENTS.md); this is the enforceable checklist.

## A lesson lives in three places — keep them in sync

Adding or renaming a lesson means editing **all three**, or the progress tracker and
report silently desync (nothing warns you):

1. **Page** — `study/lessons/NNNN-slug.html`, copied from an existing lesson
   (e.g. [0006-tool-use-loop.html](../../study/lessons/0006-tool-use-loop.html)). Numbering is
   4-digit zero-padded and sequential. Link `../assets/styles.css`, load `../assets/theme.js` in `<head>` (the shared light/dark toggle), and load `../assets/quiz.js` before `</body>`.
2. **Course map** — an `<li><a href="lessons/NNNN-slug.html">Title</a></li>` inside the `<ol>`
   of the correct `.phase` block in [study/index.html](../../study/index.html). `progress.js`
   scrapes the `.phase` › `<ol>` › `<li>` shape, so keep it.
3. **Catalog** — `{ id: "NNNN-slug", title: "Title" }` in the matching phase of
   [study/assets/catalog.js](../../study/assets/catalog.js). The **`id` must equal the filename
   slug** (without `.html`).

## Quiz & review-bank rules

Quiz JSON shape (lesson `.quiz` blocks and `review-bank.js` items):

```json
{ "stem": "...", "options": ["A", "B", "C", "D"], "answer": 0, "explain": "..." }
```

- `answer` is a **0-based index**; author the correct option first (`answer: 0`).
- All `options` the **same length** — no formatting tells.
- **Valid JSON only**: no trailing commas, `answer` in range. Malformed JSON fails silently and
  the quiz vanishes (`quiz.js` swallows the error).
- `review-bank.js` items add `id` (`d<domain>-<n>`, e.g. `d8-3`) and `domain`.

## Style & correctness

- Reuse existing `styles.css` classes (`.lesson-head`, `.badges`, `.badge--weight`, `.callout--*`,
  `ol.steps`, `.quiz`); don't invent styles.
- Ground every non-trivial claim in a primary source. Mark volatile facts (model IDs, pricing,
  beta headers, cache multipliers) **PROVISIONAL** — this environment has no web-fetch; verify SDK
  code against the official GitHub repos. See [study/RESOURCES.md](../../study/RESOURCES.md).
- Commit as `docs:` (Conventional Commits — see [cchk.toml](../../cchk.toml)).
