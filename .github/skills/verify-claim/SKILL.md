---
name: verify-claim
description: 'Verify a factual claim before it enters a CCDV-F lesson, reference sheet, or the capstone. Use when fact-checking Claude/Anthropic API or SDK details — model IDs, pricing, context sizes, beta headers, cache multipliers/TTLs, rate limits, error types, tool-use/streaming shapes, MCP or Agent SDK APIs — or when deciding whether to mark a fact PROVISIONAL. Grounds each claim in a primary source (official docs, official SDK GitHub repos via #githubRepo, the cookbook), flags volatile facts PROVISIONAL because this environment has no web-fetch, and records provenance.'
---

# Verify a claim

The CCDV-F material is fact-sensitive and primary-source-grounded. Before any non-trivial claim
lands in a lesson, reference sheet, or the capstone, run it through this loop. Full policy:
[AGENTS.md](../../../AGENTS.md) › "Content correctness". Source catalogue:
[study/RESOURCES.md](../../../study/RESOURCES.md).

## When to use

- Adding or editing a fact about the Claude/Anthropic API or SDK: a model ID, price, context /
  output size, beta header, `cache_control` multiplier or TTL, rate limit, `error.type`, tool-use
  or streaming shape, batch limit, or an MCP / Agent SDK symbol.
- Deciding whether a fact should be stated plainly or flagged **PROVISIONAL**.
- Reviewing a lesson or sheet for unsourced or stale claims.

## The loop

1. **Isolate the claim.** Write the single assertion you're checking (one field, id, number, or
   shape). A vague claim can't be verified.

2. **Classify it** — this picks the source:
   - **Volatile** — model IDs, pricing, context/output sizes, beta headers, cache multipliers/TTLs,
     rate limits. These drift, and this environment has **no web-fetch**, so they usually end up
     **PROVISIONAL** (see step 5).
   - **SDK / library code** — client init, `messages.create` params, streaming events, `usage`
     fields, Agent SDK / MCP shapes. Verifiable *now* against the official GitHub repos.
   - **Conceptual / behavioural** — workflow-vs-agent, context engineering, guardrail design.
     Ground in the official docs / engineering posts.

3. **Pick the primary source** (in order of authority; catalogue in
   [study/RESOURCES.md](../../../study/RESOURCES.md)):
   1. Official docs — `platform.claude.com/docs`, `code.claude.com/docs`.
   2. Official SDK source — `anthropics/anthropic-sdk-python`, `anthropics/claude-agent-sdk-python`,
      `modelcontextprotocol/python-sdk`.
   3. Official cookbook — `anthropics/anthropic-cookbook`.

   The compass guide and community links are **not authoritative** — a map, not a source.

4. **Verify.**
   - **SDK / code** → read the actual symbol in the repo with the GitHub tool, e.g.
     `#githubRepo anthropics/anthropic-sdk-python`, and search for the class / method / field.
     Confirm the exact name and shape; don't paraphrase from memory.
   - **Docs-based** → confirm against the doc page. With no web-fetch, if you can't confirm it from
     the repos or provided context, treat it as unverified (step 5) — don't guess.

5. **Record the outcome.**
   - **Verified** → cite the source where the claim lives: a `.callout--source` on a reference
     sheet, an inline link in a lesson, a one-line comment in the capstone.
   - **Unverifiable + volatile** → keep the fact but mark it **PROVISIONAL** and tell the reader to
     confirm on the live page. Match the existing PROVISIONAL wording (see any reference sheet).
   - **Contradicted** → fix it. For model facts, respect the generation caveat — current gen =
     Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5; `4.x` = previous gen; keep both where the guide notes them.

6. **Log provenance** (content edits) — add a line to the session log in
   [study/NOTES.md](../../../study/NOTES.md) recording what you verified and against which source.
   That log is the repo's running record of how each fact was checked.

## Quick reference

| Claim type | Primary source | If unverifiable here |
|------------|----------------|----------------------|
| Model ID / pricing / context size | models & pricing docs | **PROVISIONAL** |
| `cache_control` TTL / multiplier | prompt-caching docs | **PROVISIONAL** |
| Beta header / rate limit | docs | **PROVISIONAL** |
| `messages.create` / streaming / `usage` shape | `anthropic-sdk-python` via `#githubRepo` | verify now — don't ship unverified |
| Agent SDK / MCP symbol | `claude-agent-sdk-python` / `modelcontextprotocol/python-sdk` | verify now |
| `error.type` / HTTP status | errors docs + SDK | verify now |
| Workflow / context / guardrail concept | Anthropic engineering posts | cite the post |
