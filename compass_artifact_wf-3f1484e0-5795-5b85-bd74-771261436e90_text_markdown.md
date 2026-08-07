# Claude Certified Developer – Foundations (CCDV-F v1.0, July 2026): Comprehensive Study Reference

## TL;DR
- The exam is dominated by **Applications & Integration (33.1%)** and **Model Selection & Optimization (16.8%)**; master the Messages API (streaming SSE events, tool use, prompt caching, batch), the current model lineup (Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5), and adaptive thinking + effort levels, and you cover roughly half the exam.
- Several blueprint terms are current, model-generation-sensitive concepts: **adaptive thinking** (replaces `budget_tokens`), **effort levels** (minimal/low/medium/high), **fast mode** (research preview, Opus only), **cache check-pointing** (`cache_control` breakpoints/TTLs), and Claude Code **Rules** (`.claude/rules/`). Study the exact API field names and file paths, not just the ideas.
- The single most important architectural lesson (from "Building Effective Agents") is: **start simple, prefer workflows over agents, and only add autonomy when it demonstrably improves outcomes**; every optimization domain (cost, context, security) flows from that principle.

## Key Findings
- All Anthropic developer docs now live at **platform.claude.com/docs** (Claude Platform Docs) and **code.claude.com/docs** (Claude Code); older docs.anthropic.com / docs.claude.com URLs redirect.
- Current flagship models as of Aug 2026: **Claude Fable 5** ($10/$50), **Claude Opus 5** ($5/$25), **Claude Sonnet 5** ($3/$15, introductory $2/$10 through Aug 31 2026), **Claude Haiku 4.5** ($1/$5), per MTok. Fable/Opus/Sonnet 5 have 1M-token context and 128K max output; Haiku 4.5 has 200K/64K.
- Prompt caching: cache read (hit) = 10% of the standard input price (0.1×); 5-min write = 1.25×; 1-hour write = 2×. Per Anthropic's pricing docs, caching "pays off after just one cache read for the 5-minute duration, or after two cache reads for the 1-hour duration." Batch API = flat 50% discount, up to 24h turnaround.
- HTTP error taxonomy is a near-certain exam topic: 400/401/402/403/404/413/429/500/504/529 with specific `error.type` strings.

## DOMAIN 1: Agents and Workflows (14.7%)

### 1.1 Agent Architecture (4.5%)
The canonical primary source is Anthropic's **"Building Effective Agents"** (Erik Schluntz & Barry Zhang, Dec 19 2024). Core definitions:
- **Workflows**: systems where LLMs and tools are orchestrated through *predefined code paths*. Predictable, consistent, best for well-defined tasks.
- **Agents**: systems where LLMs *dynamically direct their own processes and tool usage*, maintaining control over how they accomplish tasks. Flexible, model-driven, best when steps can't be predicted.

**Decision criterion**: "find the simplest solution possible, and only increase complexity when needed." Optimizing a single LLM call with retrieval + in-context examples is often enough. Agents trade latency and cost for better task performance; use them only for open-ended problems where you can't hardcode a path and you can trust the model's decision-making in a sandboxed/guardrailed environment.

**The augmented LLM** is the foundational building block: an LLM enhanced with retrieval, tools, and memory.

**Five workflow patterns** (memorize these — the blueprint calls them out explicitly):
1. **Prompt chaining** — decompose into fixed sequential subtasks; each call processes the prior output; add programmatic "gates" between steps. Trades latency for accuracy.
2. **Routing** — classify input, direct to a specialized follow-up (e.g., route easy queries to Haiku, hard ones to Opus/Sonnet). Enables separation of concerns.
3. **Parallelization** — two variants: **sectioning** (independent subtasks in parallel) and **voting** (same task run multiple times for diverse outputs / higher confidence).
4. **Orchestrator-workers** — a central LLM dynamically breaks down tasks, delegates to worker LLMs, synthesizes results. Differs from parallelization because subtasks are NOT predefined — the orchestrator determines them. Ideal for coding across many files.
5. **Evaluator-optimizer** — one LLM generates, another evaluates and gives feedback in a loop. Best when clear eval criteria exist and iterative refinement adds measurable value.

**Manager/supervisor hierarchies & subagents**: subagents each have their own context window and are the right choice when context isolation or parallelism is the goal; a manager agent delegates to them. Three core principles when building agents: (1) maintain **simplicity**, (2) prioritize **transparency** (show planning steps), (3) craft the **agent-computer interface (ACI)** through thorough tool documentation/testing.

### 1.2 Agent Construction with Claude (5.3%)
The **Claude Agent SDK** (formerly Claude Code SDK; renamed ~Sept 29 2025 alongside Sonnet 4.5) is "Claude Code as a library." Available in **Python** (`pip install claude-agent-sdk`, requires Python 3.10+) and **TypeScript** only. For other languages, run the CLI as a subprocess with `-p` and `--output-format stream-json`.
- Core primitive: `query()` — an async function returning an AsyncIterator of response messages. For multi-turn/stateful work with full tool access, use **`ClaudeSDKClient`**.
- Options object renamed from `ClaudeCodeOptions` → **`ClaudeAgentOptions`** (v0.1.0+ breaking change).
- The SDK gives you the same **agent loop, tools, and context management** that power Claude Code: how Claude plans, calls tools, and decides when a task is done.
- **Deployment models**: self-hosted (you run the SDK/CLI with your own API key) vs. Anthropic/managed. Note: Anthropic does not allow third-party developers to offer claude.ai login for products built on the SDK — use API key auth.
- **Hooks** for deterministic actions: same lifecycle events as Claude Code (PreToolUse, PostToolUse, Stop, etc.) exposed as Python/TS callbacks — validate, log, block, transform.
- Provider routing: the SDK can target Anthropic API, Amazon Bedrock, and Google Vertex AI.
- Relevant Anthropic engineering posts: "Effective harnesses for long-running agents" (agents working across many context windows via memory files and a re-initializing harness).

### 1.3 Agent Patterns and Frameworks (4.9%)
- **Tool-use loop**: model emits `tool_use` → your code executes → return `tool_result` → repeat until `stop_reason` is `end_turn`.
- **Frameworks** named in "Building Effective Agents": Claude Agent SDK, **Strands Agents SDK by AWS** (model-driven loop; runs inside Amazon Q, Kiro, AWS Glue; deploys via Bedrock AgentCore, Lambda, Fargate; uses OpenTelemetry), Rivet (GUI), Vellum (GUI).
- **LangGraph**: graph-based orchestration (nodes = steps, edges = control flow); best for stateful, long-running, multi-actor workflows with cycles, persistence, durable execution, and human-in-the-loop checkpoints; observability via LangSmith.
- **PydanticAI**: type-safe Python agents; runtime validation of outputs with automatic retry on malformed responses; strong testing story (TestModel, FunctionModel, `Agent.override`, pytest); built-in Usage Limits (caps on request/response/total tokens and tool calls); stateless by default; observability via Logfire.
- Anthropic's guidance: start with the API directly; if you use a framework, understand the underlying code, since abstraction layers obscure prompts/responses and make debugging harder.

## DOMAIN 2: Applications and Integration (33.1%) — heaviest domain

### 2.1 Understanding Requirements (3.4%)
Translate business requirements → functional requirements (what the app must do) and infrastructure requirements (compute, data access, latency, throughput, security). Agents add the most value for tasks that require both conversation and action, have clear success criteria, enable feedback loops, and integrate meaningful human oversight (per the customer-support and coding case studies in "Building Effective Agents").

### 2.2 Systems Life Cycle (2.8%)
Standard SDLC phases (requirements → design → implementation → testing → deployment → maintenance) applied to LLM apps. Anthropic's overlay: start with simple prompts, optimize with comprehensive evaluation, and add multi-step agentic systems only when simpler solutions fall short; measure performance and iterate.

### 2.3 Claude API Mechanics (6.8%)
**Messages API** (`POST /v1/messages`): core fields `model`, `messages` (array of `{role, content}`), `max_tokens`, `system`, `temperature`, `top_p`, `top_k`, `stop_sequences`, `tools`, `tool_choice`, `thinking`, `stream`.

**Streaming (SSE)** — set `"stream": true`. Event flow:
- `message_start` (Message object with empty content) →
- for each content block: `content_block_start` → one or more `content_block_delta` → `content_block_stop` →
- one or more `message_delta` (top-level changes; `usage` token counts are cumulative) →
- `message_stop`.
- Delta types inside `content_block_delta`: **`text_delta`** (text), **`input_json_delta`** (tool-use partial JSON — a string you concatenate then parse), **`thinking_delta`** (extended/adaptive thinking). Streams may include any number of **`ping`** events, and **error** events (e.g., `overloaded_error` = HTTP 529 in non-streaming context).

**Vision/image input**: content blocks of type `image` with `source` (base64 or URL). **Documents**: `document` content blocks (PDF support).

**Extended/adaptive thinking**: see Domain 5.

**Prompt caching**: `cache_control` breakpoints; see Domain 5.4.

**Third-party vendors**:
- **Amazon Bedrock** — model IDs like `anthropic.claude-opus-4-...`; adaptive thinking configured via `additionalModelRequestFields` with `thinking` + `output_config.effort`.
- **Google Vertex AI / Gemini Enterprise Agent Platform** — dated versions use `@` (e.g., `claude-haiku-4-5@20251001`); structured outputs gated by org policy `constraints/vertexai.allowedPartnerModelFeatures`.
- **Microsoft Foundry** — supported.

**Message Batches API**: `POST /v1/messages/batches`. Per Anthropic's batch-processing docs, "A Message Batch is limited to either **100,000 Message requests or 256 MB in size, whichever is reached first**"; each request has `custom_id` + `params` (mirrors Messages body). Processed asynchronously, "most batches completing within 1 hour"; "**Batches expire if processing does not complete within 24 hours. Batch results are available for 29 days after creation.**" **50% discount on input and output.** Batches are scoped to a Workspace. Not supported in batch: streaming, interactive multi-turn tool loops.

**Realtime vs batch tradeoff**: use realtime (synchronous/streaming) for anything user-facing; use batch for offline evals, bulk document processing, classification, dataset labeling — anything tolerant of up to 24h latency.

### 2.4 Software Engineering Foundations (7.4%)
- **REST APIs**: Claude API is REST over HTTPS; `x-api-key` header, `anthropic-version` header, JSON request/response bodies.
- **JSON**: request/response format; tool inputs/outputs; structured outputs.
- **Async programming**: SDKs offer sync and async clients (`anthropic.Anthropic()` vs `anthropic.AsyncAnthropic()`); run parallel tool calls with `asyncio.gather` / `Promise.all`.
- **Version control / SDLC integration**: Claude Code integrates with Git hooks, CI/CD, headless mode for automation.
- **Code review & refactoring**: agentic coding patterns (SWE-bench); human review remains crucial for alignment with broader system requirements.

### 2.5 Claude Application Design (8.6%)
- **How Claude interprets instructions across interfaces**: Claude Code, Claude Desktop, claude.ai, the API, and SDKs each layer instructions differently (system prompt, CLAUDE.md, user turns). Instruction placement matters — Claude follows instructions in user messages well; use the system prompt for high-level role/scene-setting.
- **Content boundaries**: separate trusted instructions from untrusted data (use XML tags / distinct fields).
- **Schema design**: design tool `input_schema` (JSON Schema) carefully; use structured outputs for guaranteed schema compliance.
- **Session hygiene**: manage conversation state, clear stale context, use `/clear` and `/compact` in Claude Code.
- **Plugin management**: plugins are self-contained `.claude-plugin/plugin.json` directories bundling skills, agents, hooks, and MCP servers.

### 2.6 Configuration Management (4.1%)
- **CLAUDE.md**: project memory/instructions (see Domain 3 for the full hierarchy).
- **settings.json**: `~/.claude/settings.json` (user), `.claude/settings.json` (project), `.claude/settings.local.json` (local, gitignored), plus enterprise managed policy settings.
- **Model version pinning**: **aliases** (e.g., `claude-sonnet-4-5`) are convenience pointers to the latest dated snapshot for pre-4.6 models; **date-pinned strings** (e.g., `claude-sonnet-4-5-20250929`) are fixed snapshots. Since the 4.6 generation, **dateless IDs** (e.g., `claude-opus-4-6`, `claude-opus-5`) are themselves pinned snapshots, NOT evergreen pointers — Anthropic's versioning docs warn this is "a common misconception." Pin explicit versions in production.
- **Prompt versioning**: version prompts alongside code; changing `tool_choice`, thinking config, or `budget_tokens` invalidates prompt cache breakpoints.
- **Plugin dependencies**: managed via plugin manifests.

## DOMAIN 3: Claude Code (3.1%)
- **CLAUDE.md hierarchy** (load order, broad → specific; all concatenated, not overriding): managed policy (`/Library/Application Support/ClaudeCode/CLAUDE.md`, `/etc/claude-code/CLAUDE.md`, or `C:\Program Files\ClaudeCode\CLAUDE.md`) → user (`~/.claude/CLAUDE.md`) → project (`./CLAUDE.md` or `./.claude/CLAUDE.md`) → local (`./CLAUDE.local.md`, gitignored). Files above cwd load in full at launch; subdirectory files load on demand. Target under 200 lines. Import syntax `@path`, max depth 4 hops.
- **/init**: analyzes the codebase and generates a starting CLAUDE.md (build commands, test instructions, conventions). If CLAUDE.md exists, it suggests improvements rather than overwriting. `CLAUDE_CODE_NEW_INIT=1` enables an interactive multi-phase flow (CLAUDE.md + skills + hooks, subagent exploration, reviewable proposal). It also reads Cursor rules (`.cursor/rules/`, `.cursorrules`) and Copilot rules (`.github/copilot-instructions.md`).
- **Rules**: markdown files in `.claude/rules/`, auto-loaded alongside CLAUDE.md (no import needed). Unscoped rules load at launch with the same priority as `.claude/CLAUDE.md`; path-scoped rules use YAML frontmatter `paths:` globs to load only when working with matching files. User-level rules in `~/.claude/rules/` (loaded before project rules, so project rules win).
- **Skills**: folders in `.claude/skills/` with a `SKILL.md` (YAML frontmatter name + description loaded at startup ~50–100 tokens; body loads on invoke — **progressive disclosure**). Custom commands have been merged into skills (`.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`). Keep SKILL.md body under ~500 lines. Bundled skills include `/doctor`, `/code-review`, `/debug`, `/loop`.
- **Commands (slash commands)**: built-in fixed-logic (`/clear`, `/compact`, `/model`, `/cost`, `/context`, `/memory`, `/init`, `/doctor`, `/hooks`, `/permissions`) and custom/skill-backed. `$ARGUMENTS` (or `$1`, `$ARGUMENTS[N]`) passes trailing text.
- **Agents (subagents)**: markdown in `.claude/agents/` (or `~/.claude/agents/`) with YAML frontmatter (name, description, optional `model` + tool access); invoked via the Agent tool; each runs in its own fresh context window; only the final message returns. Built-ins: Explore, Plan, general-purpose. Nest up to 5 levels. Subagents do not inherit skills unless listed explicitly.
- **Agent Memory (auto memory)**: Claude-written learnings in `~/.claude/projects/<project>/memory/` with `MEMORY.md` entrypoint; "the first 200 lines of MEMORY.md, or the first 25KB, whichever comes first, are loaded at the start of every conversation." Topic files load on demand. Toggle via `/memory`, `autoMemoryEnabled`, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`. Distinct from CLAUDE.md (which you write) — auto memory is what Claude writes.
- **Session management**: `--continue` / `--resume`; **headless mode** (`-p`, no TTY, reuses settings/hooks/permissions — powers CI, cron, pre-commit, GitHub Action); **streaming mode** (`--output-format stream-json`). Note `PermissionRequest` hooks do not fire in headless mode; a `permissionDecision: "defer"` pauses a call for a wrapping process.

## DOMAIN 4: Eval, Testing, and Debugging (2.6%)
**HTTP/API error taxonomy** (from platform.claude.com/docs/en/api/errors):
- **400 `invalid_request_error`** — malformed request (also catches other 4XX not listed).
- **401 `authentication_error`** — bad/revoked/expired API key (or bad AWS SigV4 on Bedrock).
- **402 `billing_error`** — billing/payment issue.
- **403 `permission_error`** — key lacks permission for the resource.
- **404 `not_found_error`**.
- **413 `request_too_large`** — payload exceeds limit.
- **429 `rate_limit_error`** — your account hit a rate limit (RPM/ITPM/OTPM) or an acceleration limit; carries a `retry-after` header.
- **500 `api_error`** — internal error; retry with backoff, contact support with request ID if persistent.
- **504 `timeout_error`** — request timed out; use streaming for long requests.
- **529 `overloaded_error`** — API temporarily overloaded across all users (not your account).

**Recovery strategies**: retryable = 429, 500, 504, 529 (with exponential backoff + jitter, honoring `retry-after`); non-retryable without changing the request = 400/401/402/403/404/413. Per Anthropic's errors docs, "the official SDKs automatically retry transient failures (such as connection errors, rate limits, and 5xx server errors) with exponential backoff, **twice by default**, honoring the retry-after header when present." **Idempotency**: use idempotency keys / `custom_id`s; **model/provider fallback** for 529. Read `anthropic-ratelimit-*` headers for remaining headroom.

**Trace analysis / isolating problem origin**: log every `tool_use_id` with input and result; log `stop_reason` per turn (unexpected `end_turn` where you expected `tool_use` = unclear description or wrong `tool_choice`); replay the full message array to reproduce. `stop_reason` values (`end_turn`, `max_tokens`, `tool_use`, `refusal`, `stop_sequence`) are part of a successful 200, not errors — distinguishing model-output issues from integration-layer issues.

**Evals & structured output validation**: design evals with clear success criteria and test cases; use the Message Batches API for large eval runs; validate structured output (see Domain 6.3); monitor production quality by analyzing outputs for signs of failure/injection and iterating.

## DOMAIN 5: Model Selection and Optimization (16.8%)

### 5.1 LLM Fundamentals (5.2%)
- **Tokens**: units of text; output is priced ~5× input at base rates. (Note: third-party analyses claim newer Claude tokenizers emit more tokens per unit of text for some workloads; treat any specific percentage as indicative, not official — verify by measuring tokens with the model you deploy.)
- **Context window**: all text the model can reference including its own output — "working memory." 200K (Haiku 4.5) up to 1M (Fable/Opus/Sonnet 5).
- **Sampling**: `temperature` (0–1; higher = more random), `top_p` (nucleus), `top_k`. Don't tune temperature and top_p simultaneously.
- **Non-determinism**: same input can produce varied output; deterministic enough at low temperature to often reproduce bad calls.
- **Model options**: fast mode, extended thinking, adaptive thinking, effort levels (below).
- **Prompting techniques**: zero-shot, single-shot, multi-shot (few-shot).

### 5.2 Technical Fundamentals (6.1%)
SDKs (Python, TypeScript, Ruby, PHP, etc.) wrap the REST API; streaming uses SSE (unidirectional server→client over HTTP), **not** WebSockets. MCP transports can use stdio, HTTP/SSE, or (draft) WebSocket.

### 5.3 Model Selection and Tradeoffs (2.7%)
Current lineup (API model IDs / aliases; verify against the live models page — these change):
- **Claude Opus 5** (`claude-opus-5`, $5/$25) — strongest reasoning; complex agentic coding, enterprise work; highest cost/latency; adaptive thinking; recommended default for complex work.
- **Claude Sonnet 5** (`claude-sonnet-5`, $3/$15, intro $2/$10 through Aug 31 2026) — balanced workhorse; strong coding + tool use, fast enough for interactive work; adaptive thinking.
- **Claude Haiku 4.5** (`claude-haiku-4-5`, ID `claude-haiku-4-5-20251001`, $1/$5) — fastest, cheapest; classification, routing, high-volume/low-latency; 200K context, 64K max output; **supports classic extended thinking** but not adaptive thinking.
- **Claude Fable 5** (`claude-fable-5`, $10/$50) — Anthropic's most capable widely released model; 1M context, 128K output; **adaptive thinking always on** (no extended-thinking toggle).
- **Claude Mythos 5 / Mythos Preview** (`claude-mythos-5`, `claude-mythos-preview`, $10/$50) — invitation-only (Project Glasswing, defensive cybersecurity).

**Adaptive thinking support & effort**: Fable/Opus/Sonnet 5 and Opus 4.6+/Sonnet 4.6 support **adaptive thinking**; the `effort` parameter (soft guidance) defaults to `high` on the Claude API/Claude Code. Recent Opus/Sonnet models support `effort` to trade intelligence for latency/cost within one model. Choosing-a-model guidance: pick the cheapest tier that clears your eval bar, escalating Sonnet → Opus → Fable.

**Breaking behavior changes**: `thinking.type: "enabled"` + `budget_tokens` is **deprecated** on the 4.6 models and **removed** (returns HTTP 400) on Opus 4.7+ and the Claude 5 models — migrate to `thinking.type: "adaptive"` + `effort`. On the newest models, `thinking.display` defaults to `"omitted"` (set `"summarized"` explicitly to see reasoning). Dateless IDs are pinned snapshots. Pin and re-test on every model upgrade.

### 5.4 Cost and Token Management (2.8%)
- **Pricing (per MTok, standard)**: Fable 5 $10/$50; Opus 5 $5/$25; Sonnet 5 $3/$15 (intro $2/$10 through Aug 31 2026, reverting to $3/$15 Sept 1); Haiku 4.5 $1/$5. Batch = 50% off. Fast mode (Opus 5 / Opus 4.8 only) = $10/$50. A US-only data-residency multiplier (`inference_geo:"us"`, 1.1×) applies on Claude 4.6+. These change over time — verify against the official pricing page.
- **Prompt caching multipliers** (Anthropic pricing docs): cache **read/hit = 10% of standard input (0.1×)**; **5-minute cache write = 1.25× base**; **1-hour cache write = 2× base**. The docs state caching "pays off after just one cache read for the 5-minute duration (1.25x write), or after two cache reads for the 1-hour duration (2x write)." Default TTL is 5 minutes; opt into 1-hour with `cache_control: {type:"ephemeral", ttl:"1h"}` (API) or `ENABLE_PROMPT_CACHING_1H=1` (Claude Code); force 5m with `FORCE_PROMPT_CACHING_5M=1`.
- **Cache check-pointing** = placing `cache_control` breakpoints. Two modes: **automatic caching** (single `cache_control` at top level; system moves the breakpoint forward as conversation grows) and **explicit breakpoints** (place `cache_control` on individual content blocks). Longer-TTL entries must appear before shorter-TTL ones. Cache usage appears in response `usage`: `cache_creation.ephemeral_5m_input_tokens`, `cache_read_input_tokens`, etc.
- **Token budgeting/tracking**: read `usage` (`input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`); use the token-counting endpoint; restrict tool responses (Claude Code caps tool responses at **25,000 tokens by default**).
- **Cost modeling**: choose the cheapest model that clears the quality bar (validate with an eval), then layer batching + caching + context controls.

## DOMAIN 6: Prompt and Context Engineering (11.0%)

### 6.1 Context Engineering (3.8%)
Primary source: Anthropic's **"Effective context engineering for AI agents"** (Sept 29 2025). Context is a finite resource; the goal is the smallest possible set of high-signal tokens. Strategies:
- **Prevent context drift/bloat**: prune/truncate tool outputs (pagination, range selection, filtering, sensible defaults; Claude Code truncates tool responses at 25,000 tokens by default); steer the agent toward token-efficient strategies (many small targeted searches vs. one broad one).
- **Compaction**: server-side summarization of older context. Beta header **`compact-2026-01-12`**; strategy `compact_20260112` in `context_management.edits`. Available for Claude 4.6+ and Mythos Preview. The recommended strategy for long-running conversations.
- **Context editing** (beta header **`context-management-2025-06-27`**): `clear_tool_uses_20250919` strategy clears old tool results (config knobs: `trigger`, `keep`, `clear_at_least`, `exclude_tools`); also thinking-block clearing. Add `memory` to `exclude_tools` so clearing doesn't wipe memory writes.
- **Memory tool**: file-based CRUD memory that persists across conversations (`/memories` directory); supports just-in-time retrieval. Per Anthropic's "Managing context on the Claude Developer Platform," "combining the memory tool with context editing improved performance by 39% over baseline. Context editing alone delivered a 29% improvement. In a 100-turn web search evaluation, context editing enabled agents to complete workflows that would otherwise fail…while reducing token consumption by 84%."
- **Context isolation via subagents**: each subagent has its own context window; return only distilled results to the parent.

### 6.2 Prompt Engineering (4.6%)
Primary source: platform.claude.com prompt-engineering docs. Techniques:
- **Be clear and direct**; give explicit instructions.
- **Multishot (few-shot) examples** — wrap in `<example>` tags; combine with CoT.
- **System vs. user placement**: system prompt for high-level role/scene-setting; put most task instructions in user turns.
- **XML tags**: Claude was trained on XML structure; use semantically meaningful tags (`<instructions>`, `<data>`, `<example>`, `<thinking>`, `<answer>`). No fixed tag names required.
- **Chain of thought (CoT)**: let Claude think step-by-step (with thinking off, use `<thinking>`/`<answer>` tags). With adaptive thinking, manual CoT is largely unnecessary — lower the `effort` level instead.
- **Prefilling**: seed the assistant turn (e.g., `{` to force JSON). Note: prefilling is **incompatible with JSON structured outputs**, and on Opus 5 with thinking disabled the model may emit internal XML tags.
- **Output constraints**, **iterative refinement** (test-driven), **input sanitization** (see Domain 7).
- Tools: prompt generator, prompt improver, Workbench (console.anthropic.com/workbench).

### 6.3 Output Handling (2.6%)
- **Structured outputs** (public beta; beta header `structured-outputs-2025-11-13` on some models, GA on others — verify per model): two complementary features.
  - **JSON outputs** — `output_config.format` (Python convenience param `output_format=`) with `{type:"json_schema", schema:{...}}`; constrains Claude's *response text* to valid JSON via grammar-constrained decoding. Response lands in `content[0].text` as guaranteed-valid JSON.
  - **Strict tool use** — `strict: true` on a tool; guarantees tool-call *arguments* match `input_schema`. Use inside agent/function-calling loops.
  - Can be combined in one request. Incompatible with citations and prefilling. Schema compiled + cached ~24h. Supports a subset of JSON Schema (unsupported keywords like `minimum` become description hints your code must still validate). SDK helper: `client.messages.parse()`.
- **Defensive parsing / skepticism**: validate all output; don't trust confident-sounding output; force a single tool (`tool_choice: {type:"tool", name:"..."}`) for structured output when you know the schema, rather than parsing free-form text.

## DOMAIN 7: Security and Safety (8.1%)

### 7.1 AI Application Security (3.2%)
Primary source: "Mitigate jailbreaks and prompt injections" (platform.claude.com). Two threat models:
- **Jailbreaks / direct prompt injection** — the user is the adversary.
- **Indirect prompt injection** — the user is trusted but Claude processes adversarial third-party content (web pages, emails, documents, tool results).

Mitigations (layer them): **harmlessness screens** (use lightweight Claude Haiku 4.5 to pre-screen input before the main model); treat all retrieved/tool content as untrusted; use distinct system/user fields and XML boundaries; input validation (a "speed bump," not a wall); output monitoring; for computer/browser use, Anthropic runs classifiers that detect injections and steer Claude to ask for confirmation. Anthropic also builds injection resistance into training via RL. Per security firm Gray Swan's combined direct+indirect benchmark (reported by Vellum), Claude Opus 4.5's single-attempt "attack success rate of just 4.7%…is significantly lower than that of Gemini 3 Pro (12.5%) and GPT-5.1 (21.9%)"; The Decoder notes it rises to ~33.6% at 10 attempts and ~63% at 100 attempts — i.e., meaningful residual risk remains and no agent is immune.

**Data leakage / PII**: minimize PII in prompts; note structured outputs are HIPAA-eligible but PHI must not be in schema definitions (schemas cached separately). **AAA/CIA**: authentication, authorization, confidentiality, privacy, integrity.

### 7.2 Guardrails and Safe Deployment (2.3%)
- **Content policy**: Anthropic Usage Policy / Terms of Service.
- **Guardrail layering**: prompt-level guard prompts + classifier/LLM-as-judge (Llama Guard, ShieldGemma, PromptGuard, NeMo Guardrails) + deterministic controls. Prompt guardrails alone are insufficient (they share the same computational substrate as the threats).
- **Secure-by-design**: privacy, IAM, least privilege, egress allowlists (restrict outbound network access to limit exfiltration; note even allowlisted endpoints can be abused, so combine with output filtering).

### 7.3 Claude Hooks (1.0%)
Claude Code hooks are shell commands / HTTP calls / MCP tools / prompts that run at lifecycle events, configured in settings.json with three nesting levels (event → matcher group → handler). Key events: **PreToolUse** (runs before a tool; can block — exit code 2 denies, 0 allows, 1 warns; a `deny` is evaluated before permission-mode checks, so it blocks even under `bypassPermissions`/`--dangerously-skip-permissions`), **PostToolUse** (after success; auto-format/lint — cannot undo), **UserPromptSubmit** (inject context or reject a prompt), **Stop/SubagentStop**, **SessionStart/SessionEnd**, **PreCompact/PostCompact**, **Notification**, **PermissionRequest** (does NOT fire in headless mode). Matchers support regex (e.g., `Edit|Write`). PreToolUse is the recommended place for destructive-action guardrails. Hooks are the deterministic "must-do" layer; CLAUDE.md is the "should-do" layer.

### 7.4 Identity, Secrets, and Key Management (1.6%)
- **API keys**: `x-api-key` header; store in env vars / secret managers, never in code; rotate; scope by workspace; keys can expire/be revoked (401). Separate dev/prod keys and workspaces.
- **Identity validation & access approval**: validate identity, verify access level, monitor authorized access via audit logs; use IAM roles on Bedrock/Vertex (SigV4 on AWS).
- **Least privilege**: pre-approve safe tools (`allowed_tools`), deny dangerous ones; ask-rules for risky actions.

## DOMAIN 8: Tools and MCPs (10.6%)

### 8.1 Tool Implementation (4.4%)
- **Tool definition**: `name`, `description`, `input_schema` (JSON Schema). Tool descriptions deserve as much prompt engineering as prompts (include example usage, edge cases, input format, boundaries — "poka-yoke" your tools; prefer absolute over relative filepaths).
- **How it works**: model returns `stop_reason: "tool_use"` + `tool_use` block(s) → your code executes → return `tool_result` block(s) (match each to its call via `tool_use_id`; put tool_results before any text; set `is_error: true` on failures).
- **Client vs. server tools**: **client tools** (user-defined + Anthropic-schema tools like `bash`, `text_editor`) run in your app; **server tools** (`web_search`, `web_fetch`, `code_execution`, `tool_search`, `memory`) run on Anthropic infrastructure.
- **`tool_choice`** — four options: `auto` (default when tools present; model decides), `any` (must use some tool), `tool` (force a specific tool: `{type:"tool", name:"..."}`), `none` (default when no tools). Changing `tool_choice` invalidates cached message blocks.
- **Parallel tool use**: Claude 4+ makes parallel calls by default; multiple `tool_use` blocks in one assistant message; return all results in one user message. Disable with `disable_parallel_tool_use: true` (with `tool_choice` any/tool).
- **Tool Runner (SDK, beta)** — auto-executes tools, appends results, manages the loop, supports automatic compaction; catches exceptions → `is_error: true` tool_result.
- **Programmatic tool calling** — Claude calls your tools from code in the code-execution container (cuts round trips); can't force via `tool_choice`, incompatible with `disable_parallel_tool_use` and recursive `$ref` schemas (returns 400 "Circular $ref detected").

### 8.2 MCP Server Development (2.1%)
MCP (Model Context Protocol) is an open, JSON-RPC 2.0, stateful client-server protocol standardizing how AI apps connect to tools/data. **Primitives**: **Tools** (executable functions with JSON-Schema inputs), **Resources** (URI-addressed read-only data), **Prompts** (reusable templates); advanced: **Sampling** (server asks client's LLM to generate) and **Roots** (client-provided scoped access boundaries). **Transports**: **stdio** (local subprocess), **Streamable HTTP** (remote, HTTP + optional SSE), WebSocket (draft). Lifecycle: initialization → capability negotiation → normal operation (`tools/list`, `tools/call`, `resources/list`, `prompts/list`, etc.) → shutdown. Security: explicit user consent, trust boundaries; the STDIO transport is not sandboxed and local servers run with client privileges. Claude apps configure MCP via `claude mcp add` (Claude Code) or `mcp_servers={...}` (SDK).

### 8.3 Agentic Customization (4.1%)
When to use which extension mechanism:
- **Built-in tools** — fastest for common actions (web search, code execution, file ops); no maintenance.
- **Custom tools** — for your own APIs/logic; you control execution.
- **Agent Skills** — modular, filesystem-based, progressive-disclosure knowledge/workflows (SKILL.md with YAML frontmatter `name`/`description`); load on demand, minimal context cost until triggered (only name+description, ~50–100 tokens, occupy context until invoked); portable folders; open standard across claude.ai, Claude Code, API, and third-party agents. Best for procedural domain expertise. Live in `~/.claude/skills/` (personal) or `.claude/skills/` (project).
- **MCPs** — for standardized, reusable connections to external systems shared across many clients/agents. Note MCP tool descriptions consume context tokens constantly (unlike skills' progressive disclosure), so tool-set sizing matters for selection accuracy.

## Recommendations
1. **First 2 weeks — cover the 50%**: Drill Domain 2 (API mechanics, streaming events, batch, config) and Domain 5 (models, adaptive thinking, effort, pricing, caching). Build a small app that streams, uses tools, caches a system prompt, and reads `usage`.
2. **Weeks 3–4 — agents, context, tools**: Read "Building Effective Agents" and "Effective context engineering for AI agents" end-to-end; implement each of the 5 workflow patterns and one autonomous agent with the Agent SDK; build one MCP server (stdio) exposing a tool, a resource, and a prompt.
3. **Week 5 — Claude Code, security, eval/debug**: Practice CLAUDE.md hierarchy, Rules, Skills, `/init`, and a PreToolUse guardrail hook; memorize the HTTP error table and retry/idempotency patterns; implement structured outputs (both `output_config.format` and `strict: true`).
4. **Throughout — memorize exact identifiers**: model IDs, error `type` strings, SSE event names, `tool_choice` values, beta headers, cache multipliers, file paths.
5. **Benchmarks that change your plan**: If you cannot reliably explain the difference between adaptive vs. extended thinking, `output_config.format` vs. `strict: true`, 429 vs. 529, and workflow vs. agent — go back to primary docs before sitting the exam. If you can, shift remaining time to the low-weight domains (Claude Code 3.1%, Eval/Debug 2.6%) only to shore up specific gaps.

## Most valuable official documentation URLs per domain
- **Agents/Workflows**: anthropic.com/engineering/building-effective-agents; anthropic.com/engineering/effective-harnesses-for-long-running-agents; code.claude.com/docs/en/agent-sdk/overview
- **API/Integration**: platform.claude.com/docs/en/build-with-claude/streaming; .../batch-processing; .../prompt-caching; platform.claude.com/docs/en/api/errors
- **Claude Code**: code.claude.com/docs/en/memory; .../hooks; .../skills; .../sub-agents
- **Model Selection/Optimization**: platform.claude.com/docs/en/about-claude/models/overview; .../pricing; .../models/model-ids-and-versions; .../build-with-claude/adaptive-thinking; .../effort; .../fast-mode
- **Prompt/Context Engineering**: anthropic.com/engineering/effective-context-engineering-for-ai-agents; platform.claude.com/docs/en/build-with-claude/context-editing; .../compaction; .../structured-outputs; prompt-engineering overview
- **Security/Safety**: platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks; anthropic.com/research/prompt-injection-defenses
- **Tools/MCP**: platform.claude.com/docs/en/agents-and-tools/tool-use/overview; modelcontextprotocol.io; platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

## Caveats
- **Blueprint premise vs. current docs**: The exam guide's examples reference Opus 4.6/4.7/4.8 and Sonnet 4.6 as if current. Per official docs on Aug 1 2026, those are **previous-generation**; the current flagships are **Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5**. Expect the exam to accept either generation's identifiers; know both.
- **"Priority tier"** is not a current official term — speed is governed by **fast mode** (research preview; Opus 5 / Opus 4.8 only; `speed:"fast"`; $10/$50 per MTok; Claude API only, not Batch or partner clouds) and the **effort** parameter; rate-limit usage tiers are **Start/Build/Scale**.
- **Numbers change**: pricing, cache TTL defaults (Anthropic adjusted default cache behavior in early 2026), context sizes, rate limits, and beta headers evolve — always verify against the live pricing/models pages before the exam.
- **Beta features**: structured outputs, compaction (`compact-2026-01-12`), context editing (`context-management-2025-06-27`), and the Tool Runner are beta or newly-GA; availability varies by model and may require beta headers.
- **Secondary sources**: where official docs were thin (framework comparisons, prompt-injection benchmark numbers, some pricing history), reputable third-party sources (Langfuse, AWS Builder Center, Speakeasy, Vellum, The Decoder) were used and are flagged as such; treat exact third-party pricing/token-inflation figures as indicative, not authoritative.