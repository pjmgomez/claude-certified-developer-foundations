# Notes

Working notes and preferences for this teaching workspace. See [MISSION.md](./MISSION.md)
for the why, and [plan in session memory] for the full design rationale.

## Learner preferences
- **Primary language:** Python (show TypeScript only where it clarifies).
- **Style:** hands-on first — build the thing, then name it. Durable competence over fluency.
- **Retention:** every session opens with a short spaced, interleaved recall quiz drawn from
  earlier phases. Desirable difficulty is the point; don't make quizzes easy.
- **Grounding:** cite a primary source for every non-trivial claim. Prefer official docs and
  official SDK source over write-ups.
- **Quiz rule:** all answer options for a question are the same length — no formatting tells.

## Environment
- Can run code locally; **no Anthropic API key yet** → Phase 0 handles setup.
- This agent environment has **no general web-fetch tool**. Consequences:
  - SDK/API *code* is verified against official Anthropic GitHub repos (primary source).
  - Volatile facts (model IDs, pricing, beta headers, cache multipliers) are marked
    **PROVISIONAL** until checked against the live docs, and Phase 0 teaches the learner to
    verify them at `platform.claude.com/docs` themselves — a durable habit, not a crutch.

## Roadmap / progress
Sequenced by dependency; reps weighted by exam blueprint %. Sequence may flex to stay in the
zone of proximal development.

- [ ] **Phase 0 — Setup & first contact** (2.3 / 7.4) — lesson `0001` ready; awaiting your first live call
- [ ] **Phase 1 — Core API mechanics** — lessons `0002`–`0005` + 2 reference sheets ready (Domain 2 = 33%, Domain 4)
- [ ] **Phase 2 — Tools & MCP** — lessons `0006`–`0010` + 2 reference sheets ready (Domain 8 = 10.6%)
- [ ] **Phase 3 — Models & optimization** — lessons `0011`–`0015` + 2 reference sheets ready (Domain 5 = 16.8%)
- [ ] **Phase 4 — Prompt & context engineering** — lessons `0016`–`0020` + 2 reference sheets ready (Domain 6 = 11%)
- [ ] **Phase 5 — Agents & workflows** — lessons `0021`–`0025` + 2 reference sheets ready (Domain 1 = 14.7%)
- [ ] **Phase 6 — Claude Code & config** — lessons `0026`–`0030` + 2 reference sheets ready (Domain 3 = 3.1% + 2.5/2.6)
- [ ] **Phase 7 — Security & safety** — lessons `0031`–`0035` + 2 reference sheets ready (Domain 7 = 8.1%)
- [ ] **Phase 8 — Capstone & exam readiness** — lessons `0036`–`0037` + `capstone/capstone.py` + `index.html` course map ready

**All 8 phases authored: 37 lessons, 14 reference sheets, 1 runnable capstone, course index. Now: work through them.**

## Session log
- 2026-08-07 — Workspace created. Mission, resources skeleton, shared stylesheet, and
  Phase 0 lesson authored. Next: learner completes Phase 0 setup and first live call.
- 2026-08-07 — Phase 1 authored: `reference/http-errors.html`, `reference/streaming-events.html`,
  lessons `0002` (messages), `0003` (streaming), `0004` (multimodal), `0005` (errors). Facts verified
  against anthropic-sdk-python (SSE event order + delta types; error `type` strings; `DEFAULT_MAX_RETRIES=2`).
- 2026-08-07 — Phase 2 authored: `reference/tool-choice.html`, `reference/mcp.html`, lessons `0006`
  (tool-use loop), `0007` (directing tools), `0008` (writing good tools), `0009` (MCP server), `0010`
  (choosing a mechanism). Verified vs anthropic-sdk-python (`tool_result`/`tool_choice` shapes) and
  modelcontextprotocol/python-sdk (`MCPServer`, `@mcp.tool/resource/prompt`, `mcp.run()` stdio).
- 2026-08-07 — Phase 3 authored: `reference/models-pricing.html`, `reference/caching-batch.html`, lessons
  `0011` (model selection), `0012` (thinking & effort), `0013` (tokens & sampling), `0014` (prompt caching),
  `0015` (batch API). Verified vs anthropic-sdk-python: `cache_control` ttl 5m/1h, `usage.cache_*`, `thinking`
  adaptive/enabled(deprecated)/disabled, `output_config.effort`, `speed:fast`, `batches.create` custom_id.
- 2026-08-07 — Phase 4 authored: `reference/structured-outputs.html`, `reference/context-management.html`,
  lessons `0016` (prompt engineering), `0017` (steering output), `0018` (structured outputs), `0019` (context
  engineering), `0020` (context editing & memory). Verified: `output_config.format`/`strict:true`/`parse()`;
  `context_management.edits` (`clear_tool_uses_20250919`, `compact_20260112`), `memory_20250818` over `/memories`.
- 2026-08-07 — Phase 5 authored: `reference/workflow-patterns.html`, `reference/agent-sdk.html`, lessons
  `0021` (workflow vs agent), `0022` (five patterns), `0023` (Agent SDK), `0024` (subagents & hooks), `0025`
  (frameworks). Verified vs claude-agent-sdk-python: `query()`/`ClaudeSDKClient`/`ClaudeAgentOptions`, `@tool`
  + `create_sdk_mcp_server`, `HookMatcher`, `AgentDefinition`.
- 2026-08-08 — Added a site-wide **light/dark theme** (Material 3–derived, warm-tinted to keep the
  look). `assets/styles.css` gains `--surface`/`--on-brand`/`--accent-edge` tokens (light values equal
  the old `#fff`/`#eccebf`, so light mode is byte-identical) plus a `:root[data-theme="dark"]` scheme
  mirrored under `@media (prefers-color-scheme: dark)`; `@media print` forces light. New
  `assets/theme.js` (loaded in every page's `<head>`) applies the saved choice before first paint and
  injects a System/Light/Dark toggle; state in `localStorage` `ccdvf-theme-v1`. Wired into all 54 pages
  (incl. the 14 reference sheets — convention updated in AGENTS.md + reference-sheets.instructions.md).
  Verified: dark scheme meets WCAG AA on every text/surface pair (contrast script); toggle cycle +
  persistence + no-flash pre-paint apply (node logic test); light palette unchanged. Two pre-existing
  light callout-label contrasts (accent/warn on their soft containers, ~4.0:1) left as-is to keep the look.
- 2026-08-07 — Phase 6 authored: `reference/claude-code-files.html`, `reference/claude-code-config.html`,
  lessons `0026` (CLAUDE.md hierarchy), `0027` (Rules/Skills/Commands), `0028` (agents & memory), `0029`
  (configuration mgmt), `0030` (application design). Docs-based (compass + repo skill files + writing-for-agents);
  volatile paths/flags flagged verify-against-code.claude.com.
- 2026-08-07 — Phase 7 authored: `reference/prompt-injection.html`, `reference/hooks.html`, lessons `0031`
  (prompt injection), `0032` (guardrails), `0033` (Claude hooks), `0034` (data leakage & PII), `0035` (secrets
  & keys). Verified vs claude-agent-sdk-python: HookEvent set, `HookMatcher`, PreToolUse deny shape
  (`permissionDecision:'deny'`) + exit-code shell form; PermissionRequest not in headless.
- 2026-08-07 — Phase 8 authored: lessons `0036` (capstone) + `0037` (exam readiness), `capstone/capstone.py`
  (runnable support-triage app: caching + tool loop + guard + forced-tool structured output + streaming + usage),
  and `index.html` (course map linking all 37 lessons + 14 reference sheets). **Course content complete.**
- 2026-08-07 — Spaced-review system added: `assets/review-bank.js` (48 high-yield questions, 6/domain),
  `assets/review.js` (Leitner 5-box engine, localStorage, interleaved, progress bar), `review.html`. Linked
  from `index.html` + `0037`. Builds storage strength (spacing/interleaving) atop the per-lesson fluency quizzes.
- 2026-08-08 — Progress tracker added: `assets/progress.js` decorates the course map with a per-lesson
  completion checkbox, an overall progress bar (x / 37), and per-phase counts — all saved in localStorage
  (`ccdvf-progress-v1`). No lesson files touched; the map is the control surface.
- 2026-08-08 — Progress report added: `progress.html` + `assets/report.js` + `assets/catalog.js` (single
  source of truth for lessons). Aggregates lesson completion + spaced-review box distribution into one
  printable page with a readiness verdict; linked from the course map. Data validated via node (37 lessons,
  48 questions, 4 options each, answer index 0, 6/domain).
