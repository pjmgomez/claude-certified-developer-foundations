# Claude Development (CCDV-F) Resources

Curated, high-trust sources for this workspace. Knowledge for explainers is drawn from here,
not from memory. Wisdom comes from the communities listed.

> **Verification status.** Doc URLs are compiled from the compass study guide's per-domain
> list; Anthropic migrated docs to `platform.claude.com/docs` and `code.claude.com/docs`, so
> confirm each resolves. Facts that drift (model IDs, pricing, beta headers, cache
> multipliers) are marked **PROVISIONAL** in lessons until checked against the live pages.

## Knowledge

### Primary — official documentation
- [Building Effective Agents — Anthropic Engineering](https://www.anthropic.com/engineering/building-effective-agents)
  The canonical source for workflow-vs-agent and the five workflow patterns. Use for: Domain 1.
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  Context as a finite resource; pruning, compaction, memory. Use for: Domain 6.1.
- [Streaming Messages — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/streaming)
  SSE event flow and delta types. Use for: Phase 1 streaming.
- [Errors — Claude Platform Docs](https://platform.claude.com/docs/en/api/errors)
  HTTP/error-type taxonomy and SDK retry behaviour. Use for: Phase 1 / Domain 4.
- [Prompt caching — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
  `cache_control`, TTLs, multipliers. Use for: Phase 3 cost. **PROVISIONAL** numbers.
- [Batch processing — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
  Limits (100k/256MB), 24h window, 50% discount. Use for: Phase 3 batch.
- [Models overview / pricing / model IDs & versions — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/overview)
  Model lineup, context/output, versioning. Use for: Phase 3. **PROVISIONAL** IDs/prices.
- [Adaptive thinking / effort — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
  Adaptive vs extended thinking, effort levels. Use for: Phase 3.
- [Tool use overview — Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
  Tool loop, `tool_choice`, client vs server tools. Use for: Phase 2.
- [Structured outputs — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
  `output_config.format` vs strict tool use. Use for: Phase 4.3.
- [Mitigate jailbreaks & prompt injection — Claude Platform Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)
  Threat models and layered mitigations. Use for: Domain 7.
- [Claude Agent SDK overview — Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/overview)
  `query()` vs `ClaudeSDKClient`, options, hooks. Use for: Phase 5.
- [Claude Code: memory / hooks / skills / sub-agents — Claude Code Docs](https://code.claude.com/docs/en/memory)
  CLAUDE.md hierarchy, hook events, Skills, subagents. Use for: Phase 6.
- [Model Context Protocol — modelcontextprotocol.io](https://modelcontextprotocol.io)
  Primitives, transports, lifecycle. Use for: Phase 2 MCP.

### Primary — official source code (verify SDK usage here)
- [anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python)
  Canonical Python client. Use for: exact install, client init, `messages.create`, streaming, `usage`.
- [anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)
  Canonical Agent SDK. Use for: `query()`, `ClaudeSDKClient`, `ClaudeAgentOptions`.
- [anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook)
  Official worked examples. Use for: lab patterns (tools, caching, vision).

### Secondary — in-repo index (not authoritative)
- [compass study guide](../compass_artifact_wf-3f1484e0-5795-5b85-bd74-771261436e90_text_markdown.md)
  Dense blueprint-organised overview + per-domain URL list. Use as a map; verify every fact
  against a primary source before it enters a lesson or reference sheet.
- [CCDV-F Exam Guide (PDF)](../instructor_6nizmqk8tpzpfjvt6qmmav7rh_public_1783542875_Claude+Certified+Developer+–+Foundations+Exam+Guide.pdf)
  Blueprint weights and the three published sample questions. Use for: coverage + item style.

## Wisdom (Communities)
_Candidates — verify each is active and well-moderated before recommending in a lesson._
- Anthropic Developer Discord — real-time help from builders. Use for: debugging, design critique.
- Anthropic developer forum / community site — searchable Q&A. Use for: grounded how-tos.
- r/ClaudeAI, r/Anthropic (Reddit) — mixed signal; use for: trends, gotchas, not authority.

## Gaps
- **No web-fetch in this environment.** Live verification of doc URLs, current model IDs, and
  pricing is deferred to the learner or a web-capable agent. Phase 0 teaches self-verification.
- **Community links unverified.** Confirm the Discord invite and forum URL before recommending.
- **Practice items.** Only three official sample questions exist; self-authored practice
  (respecting the NDA) fills the gap for full-blueprint drilling.
