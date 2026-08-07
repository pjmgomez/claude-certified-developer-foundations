# claude-certified-developer-foundations

[![Commit Check](https://github.com/pjmgomez/claude-certified-developer-foundations/actions/workflows/commit-check.yml/badge.svg)](https://github.com/pjmgomez/claude-certified-developer-foundations/actions/workflows/commit-check.yml)
[![commit-check](https://img.shields.io/badge/commit--check-enabled-brightgreen?logo=Git&logoColor=white&color=%232c9ccd)](https://github.com/commit-check/commit-check)

## Commit & branch conventions

This repository uses [**commit-check**](https://github.com/commit-check/commit-check) to keep
Git history consistent. The policy lives in [`cchk.toml`](./cchk.toml) and is enforced at
two points:

- **Pull requests** — the [`Commit Check`](./.github/workflows/commit-check.yml) GitHub
  Actions workflow validates commit messages and the branch name on every PR.
- **Locally (optional)** — [`.pre-commit-config.yaml`](./.pre-commit-config.yaml) runs the
  same checks before you commit.

What the policy expects:

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/),
  e.g. `feat: add login page` or `fix(auth): handle expired token`.
- Branch names follow [Conventional Branch](https://conventionalbranch.org/),
  e.g. `feature/add-login` or `fix/expired-token`.

### Enable the local hooks

```bash
pip install pre-commit
pre-commit install --hook-type commit-msg --hook-type pre-commit
```
