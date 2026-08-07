# Mission: Claude Development (CCDV-F)

## Why
Become genuinely competent at building, integrating, and shipping production-grade
Claude applications, agents, and workflows — competent enough to independently own that
work. The Claude Certified Developer – Foundations (CCDV-F) exam is the milestone that
proves it; passing should fall out of real skill, not cramming.

## Success looks like
- Stream a Claude response over SSE and reconstruct it, and handle the full error taxonomy
  (429/500/504/529 vs 400/401/…) with correct retry behaviour.
- Build a working tool-use loop and stand up a tiny MCP server (tool + resource + prompt).
- Pick the right model for a task and cut cost with prompt caching and the Batch API, reading
  `usage` to prove it.
- Write prompts that behave — XML boundaries, few-shot, system-vs-user placement — and get
  guaranteed-valid structured output.
- Build a small agent with the Claude Agent SDK, and know when a workflow beats an agent.
- Configure Claude Code (CLAUDE.md hierarchy, Rules, Skills, settings.json) and write a
  PreToolUse hook that blocks a destructive action.
- Defend an agent against direct and indirect prompt injection.
- Pass CCDV-F (scaled ≥ 720) as a byproduct of the above.

## Constraints
- Python is the primary lab language (TypeScript shown where it illuminates).
- Steady weekly pace, no fixed exam date — depth over speed.
- Can run code, but has no Anthropic API access yet — Phase 0 gets the environment set up.
- Learns by building: tight feedback loops, retrieval practice, spacing, interleaving.
- Every claim grounded in primary sources; volatile facts (pricing, model IDs) are verified,
  never asserted from memory.

## Out of scope
- General software-engineering fundamentals (REST, JSON, async, git, CLI) — already owned.
- Non-Claude LLM providers, beyond light context on reaching Claude via Bedrock/Vertex.
- Exam braindumps or leaked items — the certification NDA is respected. Only the published
  sample questions and self-authored practice are used.
