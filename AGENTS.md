# AGENTS.md

Study/reference repository for the **Claude Certified Developer – Foundations (CCDV-F v1.0)** exam. Two things live here: the **source study guide** ([compass markdown](compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md) plus the official exam PDFs) and **[`study/`](study/)** — a self-contained web app that teaches the material (37 lessons, 14 reference sheets, spaced-review and progress tracking) plus one runnable Python capstone.

## Repository type

No package manager, bundler, or build system — **there is nothing to compile and no `package.json` anywhere**. But this is not purely docs: `study/` is a static site you run in a browser, and [study/capstone/capstone.py](study/capstone/capstone.py) is a runnable script. The only automated check is commit-check (below); there is **no test suite — do not invent one**.

## Commit & branch conventions (enforced in CI)

Commit messages and branch names are validated by [commit-check](https://commit-check.com) on every PR to `main` via [.github/workflows/commit-check.yml](.github/workflows/commit-check.yml). Policy source of truth: [cchk.toml](cchk.toml); human summary: [README.md](README.md).

- **Commits** — [Conventional Commits](https://www.conventionalcommits.org): `<type>(<scope>): <description>`.
  - Subject: imperative mood, **not** capitalized, 5–80 characters. WIP commits are rejected.
  - Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Content edits are almost always `docs:`.
  - Example: `docs: clarify batch API expiry window`.
- **Branches** — [Conventional Branch](https://conventionalbranch.org): `<type>/<description>`, e.g. `feature/add-domain-8-notes` or `fix/streaming-event-order`.

Run the same checks locally (optional) — see [.pre-commit-config.yaml](.pre-commit-config.yaml):

```bash
pip install pre-commit && pre-commit install --hook-type commit-msg --hook-type pre-commit
```

## The `study/` web app

Static, zero-dependency site — open the HTML directly (`file://`) or serve it:

```bash
cd study && python3 -m http.server
```

Then open http://localhost:8000/index.html in your browser.

No transpiler or modules: JS loads via classic `<script src>` tags and shares state through `window` globals plus `localStorage`. One shared stylesheet, [study/assets/styles.css](study/assets/styles.css), drives every page.

**Asset paths depend on depth.** Root pages (e.g. [study/index.html](study/index.html)) link `assets/…`; pages under [study/lessons/](study/lessons/) and [study/reference/](study/reference/) link `../assets/…`. Get this wrong and the page renders unstyled.

**Scripts loaded per page** (kept deliberately minimal). **Every page** also loads `assets/theme.js` (root) / `../assets/theme.js` (lessons and reference) in `<head>` — the shared System/Light/Dark theme toggle, which sets `<html data-theme>` before first paint — so the table lists only the *page-specific* scripts:

| Page | Page-specific scripts (every page also loads `theme.js`) |
|------|---------|
| `index.html` | `assets/progress.js` |
| `lessons/*.html` | `../assets/quiz.js` |
| `reference/*.html` | none |
| `review.html` | `assets/review-bank.js`, `assets/review.js` |
| `progress.html` | `assets/catalog.js`, `assets/review-bank.js`, `assets/report.js` |

**Shared state:** globals `window.COURSE_CATALOG` ([study/assets/catalog.js](study/assets/catalog.js)) and `window.REVIEW_BANK` ([study/assets/review-bank.js](study/assets/review-bank.js)); `localStorage` keys `ccdvf-progress-v1` (lesson completion), `ccdvf-review-v1` (Leitner review boxes), and `ccdvf-theme-v1` (System/Light/Dark choice). Reuse existing CSS classes (`.lesson-head`, `.badges` / `.badge--weight`, `.callout--source` / `--lab` / `--warn` / `--teacher`, `ol.steps`, `.quiz__*`, `.sheet`) rather than inventing styles; small page-specific tweaks go in an inline `<style>`.

## Adding or editing a lesson

A lesson lives in **three places that must stay in sync** — miss one and the progress tracker and report silently desync (nothing warns you). The `/add-lesson` prompt scaffolds all three; the same rules apply to hand edits.

1. **The page** — `study/lessons/NNNN-slug.html`, copied from an existing lesson (e.g. [study/lessons/0006-tool-use-loop.html](study/lessons/0006-tool-use-loop.html)). Numbering is 4-digit zero-padded and sequential. It must link `../assets/styles.css`, load `../assets/theme.js` in `<head>` (the shared theme toggle), and load `../assets/quiz.js` before `</body>`.
2. **The course map** — an `<li><a href="lessons/NNNN-slug.html">Title</a></li>` inside the `<ol>` of the correct `.phase` block in [study/index.html](study/index.html). [study/assets/progress.js](study/assets/progress.js) scrapes this exact `.phase` › `<ol>` › `<li>` shape to place completion checkboxes, so keep the structure.
3. **The catalog** — `{ id: "NNNN-slug", title: "Title" }` in the matching phase of [study/assets/catalog.js](study/assets/catalog.js). **The `id` must equal the filename slug** (without `.html`); [study/assets/report.js](study/assets/report.js) keys the readiness report off it.

Reference sheets ([study/reference/](study/reference/)) are different: `<main class="sheet">`, no quiz, no `.lesson-nav`, and (besides the shared `theme.js`) no page-specific script; they are **not** in the catalog and **not** tracked.

## Quiz & review-bank format

Each lesson ends with an embedded quiz; the daily drill pulls from a central bank. Both use the same item shape:

```html
<div class="quiz"><script type="application/json">
[
  { "stem": "...", "options": ["A", "B", "C", "D"], "answer": 0, "explain": "..." }
]
</script></div>
```

- `answer` is a **0-based index** into `options` (the repo authors the correct option first, so `answer: 0`). The renderer ([study/assets/quiz.js](study/assets/quiz.js) and [study/assets/review.js](study/assets/review.js)) **shuffles option order at display time**, so authoring correct-first is a convenience, not a position tell.
- Keep **all options the same length** — no formatting tells ([study/NOTES.md](study/NOTES.md) quiz rule).
- Malformed or missing JSON **fails silently** — [study/assets/quiz.js](study/assets/quiz.js) swallows it and the quiz simply disappears. Validate the JSON (no trailing commas; `answer` in range).
- Review-bank items in [study/assets/review-bank.js](study/assets/review-bank.js) add two fields: `id` (`d<domain>-<n>`, e.g. `d8-3`) and `domain`.

## The capstone

[study/capstone/capstone.py](study/capstone/capstone.py) is a runnable support-triage app that exercises the whole course (prompt caching, a tool-use loop, a PreToolUse-style guard, forced-tool structured output, streaming, and `usage` reporting). It needs `pip install anthropic` and a real `ANTHROPIC_API_KEY`, and **makes live API calls** — it is not offline-testable and has no mocks. `MODEL = "claude-sonnet-5"` (verify the id).

## Content correctness

The material is **fact-sensitive and primary-source-grounded**:

- Verify API/SDK claims against the official docs (`platform.claude.com/docs`, `code.claude.com/docs`) and the official SDK repos before changing API fields, model IDs, pricing, or error codes. This environment has **no web-fetch tool** — verify SDK *code* against the official GitHub repos, and flag volatile facts (model IDs, pricing, beta headers, cache multipliers) **PROVISIONAL** until checked live. Sources are catalogued in [study/RESOURCES.md](study/RESOURCES.md).
- Respect the model-generation caveat (current gen = Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5; 4.x = previous gen). Keep both generations' identifiers where the guide already notes them.
- The source guide uses `## DOMAIN N` headings, **bold** term leads, and inline `code` for API fields, file paths, and identifiers — match that style.
- [study/NOTES.md](study/NOTES.md) is the running state-of-project log (roadmap plus a dated session log recording what each fact was verified against); [study/MISSION.md](study/MISSION.md) is the why.

## Chat customization files

Repo-scoped instructions, prompts, and skills that steer AI coding agents. **Keep them in sync when the conventions above change** — each is the enforceable checklist for one part of `study/`.

| File | Applies to | Purpose |
|------|-----------|---------|
| [.github/instructions/lessons.instructions.md](.github/instructions/lessons.instructions.md) | `study/lessons/**`, `index.html`, `catalog.js`, `review-bank.js` | Lesson authoring: three-place sync and quiz/review JSON rules |
| [.github/instructions/reference-sheets.instructions.md](.github/instructions/reference-sheets.instructions.md) | `study/reference/**` | Reference-sheet structure (`.sheet`, no quiz, not tracked) |
| [.github/instructions/capstone.instructions.md](.github/instructions/capstone.instructions.md) | `study/capstone/**` | Capstone constraints: live API calls, no tests, keep the teaching surface intact |
| [.github/prompts/add-lesson.prompt.md](.github/prompts/add-lesson.prompt.md) | `/add-lesson` | Scaffolds a new lesson across all three places |
| [.github/prompts/add-reference-sheet.prompt.md](.github/prompts/add-reference-sheet.prompt.md) | `/add-reference-sheet` | Scaffolds a reference sheet and wires its lesson links |
| [.github/skills/verify-claim/SKILL.md](.github/skills/verify-claim/SKILL.md) | `/verify-claim` (auto) | Fact-check a claim against a primary source; mark volatile facts PROVISIONAL |

## Key files

| Path | Purpose |
|------|---------|
| [study/index.html](study/index.html) | Course map; the control surface `progress.js` decorates |
| [study/lessons/](study/lessons/) | 37 lesson pages (`NNNN-slug.html`) |
| [study/reference/](study/reference/) | 14 print-oriented reference sheets |
| [study/assets/catalog.js](study/assets/catalog.js) | `COURSE_CATALOG` — source of truth for the report |
| [study/assets/quiz.js](study/assets/quiz.js) | Renders per-lesson quizzes from embedded JSON |
| [study/assets/review-bank.js](study/assets/review-bank.js) | `REVIEW_BANK` — spaced-review question bank |
| [study/assets/review.js](study/assets/review.js) | Leitner spaced-repetition engine (`review.html`) |
| [study/assets/progress.js](study/assets/progress.js) | Completion checkboxes on the course map |
| [study/assets/report.js](study/assets/report.js) | Printable readiness report (`progress.html`) |
| [study/assets/styles.css](study/assets/styles.css) | Shared design system for every page (light + Material 3–derived dark scheme) |
| [study/assets/theme.js](study/assets/theme.js) | Shared System/Light/Dark theme toggle, loaded in every page's `<head>` |
| [study/capstone/capstone.py](study/capstone/capstone.py) | Runnable capstone app (needs `anthropic` + API key) |
| [study/MISSION.md](study/MISSION.md) / [study/NOTES.md](study/NOTES.md) / [study/RESOURCES.md](study/RESOURCES.md) / [study/GLOSSARY.md](study/GLOSSARY.md) | Why / state log / sources / vocabulary |
| [compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md](compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md) | Source study guide (8 domains) |
| [cchk.toml](cchk.toml) / [README.md](README.md) | commit-check policy and human summary |
| `*.pdf` (repo root) | Official exam guide, certification terms, exam policy |
