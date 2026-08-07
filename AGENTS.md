# AGENTS.md

Study/reference repository for the **Claude Certified Developer – Foundations (CCDV-F v1.0)** exam. This is content, not code: an 8-domain study guide plus the official exam PDFs.

## Repository type

Documentation only — there is **no application code, and no build, test, or run system**. Do not invent or run build/test commands. The only automated checks are commit-check (below).

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

## Editing the study content

Main file: [compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md](compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md), organized by the 8 exam domains.

- The content is **fact-sensitive**. Verify claims against the official docs (`platform.claude.com/docs`, `code.claude.com/docs`) before changing API fields, model IDs, pricing, or error codes.
- Respect the model-generation caveats in the guide's **Caveats** section (current gen = Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5; 4.x = previous gen). Keep both generations' identifiers where the guide already notes them.
- Match the existing style: `## DOMAIN N` headings, **bold** term leads, and inline `code` for API fields, file paths, and identifiers.

## Key files

| Path | Purpose |
|------|---------|
| [README.md](README.md) | Commit/branch conventions overview |
| [cchk.toml](cchk.toml) | commit-check policy (source of truth) |
| [.github/workflows/commit-check.yml](.github/workflows/commit-check.yml) | CI enforcement on PRs to `main` |
| [.pre-commit-config.yaml](.pre-commit-config.yaml) | Optional local git hooks |
| [compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md](compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md) | Main study guide (8 domains) |
| `*.pdf` (repo root) | Official exam guide, certification terms, and exam policy |
