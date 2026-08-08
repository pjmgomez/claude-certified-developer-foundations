# Contributing

Thanks for helping improve the CCDV-F study repo. This guide covers how to propose changes; for the
full picture of how the repo is laid out, read [AGENTS.md](AGENTS.md).

## Ways to contribute

- Fix or clarify study content (lessons, reference sheets, the source guide).
- Report a content error or a broken page with the bug report template.
- Suggest a new lesson, reference sheet, or topic with the feature request template.

## What you'll need

There is **no build system, package manager, or test suite** — nothing to compile. The study app is
plain HTML/CSS/JS you open in a browser, and the only automated check is commit-check (below).

To run that check locally before you push (optional):

```bash
pip install pre-commit
pre-commit install --hook-type commit-msg --hook-type pre-commit
```

## Commits and branches

Both are enforced by [commit-check](https://commit-check.com) in CI; the policy lives in
[cchk.toml](cchk.toml).

**Commits** follow [Conventional Commits](https://www.conventionalcommits.org):
`<type>(<scope>): <description>`.

- The subject is imperative and **not** capitalized, 5–80 characters. WIP commits are rejected.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`. Content edits are almost always `docs:`.
- Example: `docs: clarify batch API expiry window`.

**Branches** follow [Conventional Branch](https://conventionalbranch.org): `<type>/<description>`, for
example `feature/add-domain-8-notes` or `fix/streaming-event-order`.

## Editing the study app

A few conventions that are easy to miss (see [AGENTS.md](AGENTS.md) for the full detail):

- **Keep a lesson in sync across three places** or the progress tracker silently desyncs: the page
  (`study/lessons/NNNN-slug.html`), the course map in [study/index.html](study/index.html), and the
  catalog in [study/assets/catalog.js](study/assets/catalog.js). The catalog `id` must equal the
  filename slug.
- **Asset paths depend on depth.** Root pages link `assets/…`; pages under `lessons/` and `reference/`
  link `../assets/…`.
- **Quiz and review JSON must be valid** — a malformed block fails silently and the quiz simply
  disappears. The correct option is authored first (`answer: 0`); keep all options the same length.

## Content accuracy

The material is fact-sensitive and grounded in primary sources. Verify API/SDK claims against the
official docs and SDK repos before changing API fields, model IDs, pricing, or error codes, and flag
volatile facts (model IDs, pricing, beta headers) as **PROVISIONAL** until checked. Sources are
catalogued in [study/RESOURCES.md](study/RESOURCES.md).

## Pull requests

- Keep each pull request focused on a single change.
- Link the issue it resolves and fill in the pull request template.
- Make sure commit-check passes.
