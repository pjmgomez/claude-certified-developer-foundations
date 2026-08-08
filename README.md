# Claude Certified Developer – Foundations (CCDV-F) study repo

[![Commit Check](https://github.com/pjmgomez/claude-certified-developer-foundations/actions/workflows/commit-check.yml/badge.svg)](https://github.com/pjmgomez/claude-certified-developer-foundations/actions/workflows/commit-check.yml)
[![commit-check](https://img.shields.io/badge/commit--check-enabled-brightgreen?logo=Git&logoColor=white&color=%232c9ccd)](https://github.com/commit-check/commit-check)

A self-study kit for the **Claude Certified Developer – Foundations (CCDV-F v1.0)** exam: a
browser-based course that teaches the material and a runnable capstone that puts it into practice.

## What's inside

Two things live here:

- **A study web app** ([study/](study/)) — a static, zero-dependency site with 37 lessons, 14
  reference sheets, per-lesson quizzes, a spaced-repetition drill, and local progress tracking.
- **The source study guide** — the
  [compass study guide](compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md)
  covering the 8 exam domains, plus the official Anthropic exam PDFs it is grounded in.

It also ships one runnable **capstone** ([study/capstone/capstone.py](study/capstone/capstone.py)) — a
support-triage app that exercises the whole course against the Claude Messages API.

## Why

The exam is fact-sensitive and primary-source-grounded. This repo keeps the material, its sources, and
a way to practise it in one place, so studying stays active — quizzes, spaced review, and a real
capstone — rather than passive reading.

## Getting started

### Prerequisites

- A modern web browser, for the study app.
- Python 3, to serve the site locally and to run the capstone.
- For the capstone only: the `anthropic` SDK and a real `ANTHROPIC_API_KEY`. It makes **live API
  calls**.

### Run the study app

The site is plain HTML/CSS/JS — open [study/index.html](study/index.html) directly, or serve it:

```bash
cd study && python3 -m http.server   # then open http://localhost:8000/index.html
```

### Run the capstone

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
python study/capstone/capstone.py
```

## Repository structure

| Path | Purpose |
| --- | --- |
| [study/](study/) | The study web app — lessons, reference sheets, review, progress — and the capstone. |
| [study/lessons/](study/lessons/) | 37 lesson pages. |
| [study/reference/](study/reference/) | 14 print-oriented reference sheets. |
| [study/capstone/capstone.py](study/capstone/capstone.py) | Runnable capstone app (needs `anthropic` + an API key). |
| [compass study guide](compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md) | Source study guide covering the 8 exam domains. |
| [AGENTS.md](AGENTS.md) | Full guide to the repo's structure and conventions. |
| `*.pdf` | Official Anthropic exam guide, certification terms, and exam policy. |

## Commit and branch conventions

This repo uses [commit-check](https://github.com/commit-check/commit-check) to keep Git history
consistent. The policy lives in [cchk.toml](cchk.toml) and is enforced at two points: the
[Commit Check](.github/workflows/commit-check.yml) GitHub Actions workflow validates every pull
request, and [.pre-commit-config.yaml](.pre-commit-config.yaml) runs the same checks locally
(optional).

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org) —
  `<type>(<scope>): <description>`, imperative and not capitalized, 5–80 characters. Content edits are
  almost always `docs:`. Example: `docs: clarify batch API expiry window`.
- **Branches** follow [Conventional Branch](https://conventionalbranch.org) — `<type>/<description>`,
  for example `feature/add-domain-8-notes`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## Getting help

Have a question or hit a problem? Open an issue using the
[bug report](.github/ISSUE_TEMPLATE/bug_report.md) or
[feature request](.github/ISSUE_TEMPLATE/feature_request.md) template. For how the repo is laid out,
see [AGENTS.md](AGENTS.md); for how to propose a change, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing

Contributions are welcome — please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or
pull request.

## Security

Found a security issue? Please follow [SECURITY.md](SECURITY.md) rather than opening a public issue.

## Maintainers

Maintained by [pjmgomez](https://github.com/pjmgomez).

## License

Released under the Apache License 2.0 — see [LICENSE](LICENSE).
