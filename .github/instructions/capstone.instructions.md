---
applyTo: "study/capstone/**"
description: "Constraints for the runnable CCDV-F capstone (study/capstone/capstone.py) — Python, live Claude API calls, no test suite."
---

# Editing the CCDV-F capstone

Full context lives in [AGENTS.md](../../AGENTS.md); this is the enforceable checklist.
[capstone.py](../../study/capstone/capstone.py) is the one runnable script in the repo — a
support-triage app on the Claude Messages API. Its module docstring is the spec; keep it accurate.

## It makes live API calls — there is no test suite

- **Python is the language** (the rest of the repo is HTML/CSS/JS). Keep it **single-file** and
  dependency-light: standard library plus `anthropic` only. It needs `pip install anthropic` and a
  real `ANTHROPIC_API_KEY`, and **makes live, billable calls**.
- **No mocks, no offline mode, no test suite — do not invent one.** The repo has no tests by design;
  "verifying" this file means a careful read, not a new test harness.

## Keep the teaching surface intact

The script deliberately exercises the whole course in one pass. Don't remove or hollow out these
pieces — each one is the point:

- **prompt caching** — a large, stable `SYSTEM` block with `cache_control` (watch `cache_read` on a rerun).
- **tool-use loop** — `run_tool_loop`, iterating while `stop_reason == "tool_use"`.
- **guardrail** — `guard_tool_call`, a PreToolUse-style deny for suspicious tool input.
- **structured output** — `triage`, forcing a single named tool via `tool_choice`.
- **streaming** — `stream_reply`, via `client.messages.stream`.
- **usage reporting** — token counts (incl. `cache_read_input_tokens`) printed for cost visibility.

## Correctness

- `MODEL = "claude-sonnet-5"` is **PROVISIONAL** — verify the id on the live models page before
  relying on it; no web-fetch here, so check the official GitHub SDK examples. See
  [study/RESOURCES.md](../../study/RESOURCES.md).
- Verify any Messages API shape (`cache_control`, `tool_result`, `tool_choice`, streaming events)
  against [anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python).
- Commit as `docs:` for comments/teaching text, or `fix:` / `feat:` if you change runtime behaviour
  (Conventional Commits — see [cchk.toml](../../cchk.toml)).
