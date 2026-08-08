# Security Policy

This repository is an educational study and reference kit, not a deployed service. The main security
consideration is the capstone script ([study/capstone/capstone.py](study/capstone/capstone.py)), which
makes live Claude API calls using your own `ANTHROPIC_API_KEY`.

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue.

- Use GitHub's private vulnerability reporting: the repository's **Security** tab →
  **Report a vulnerability**.

Please include what you found, how to reproduce it, and the potential impact. We will acknowledge your
report, keep you updated as we look into it, and credit you unless you prefer to remain anonymous.

## Keep secrets out of the repo

- Never commit API keys. Provide `ANTHROPIC_API_KEY` through your environment, not in source.
- `.env` files and common key/certificate patterns are already covered by [.gitignore](.gitignore).
- If you believe a key was committed, rotate it immediately and report it privately.
