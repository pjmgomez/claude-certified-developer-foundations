// Machine-readable course catalog — the single source of truth for the progress report.
// Mirrors the visual map in index.html; keep the two in sync if lessons change.
window.COURSE_CATALOG = [
  { phase: "Phase 0 · Setup", lessons: [
    { id: "0001-setup-and-first-contact", title: "Your first words with Claude" }
  ]},
  { phase: "Phase 1 · Core API mechanics", lessons: [
    { id: "0002-messages-api-anatomy", title: "The shape of a Message" },
    { id: "0003-streaming-sse", title: "Streaming, event by event" },
    { id: "0004-multimodal-input", title: "Images & documents in" },
    { id: "0005-errors-and-recovery", title: "When calls go wrong" }
  ]},
  { phase: "Phase 2 · Tools & MCP", lessons: [
    { id: "0006-tool-use-loop", title: "The tool-use loop" },
    { id: "0007-directing-tools", title: "Directing tools" },
    { id: "0008-writing-good-tools", title: "Writing tools Claude uses well" },
    { id: "0009-mcp-server", title: "Build an MCP server" },
    { id: "0010-choosing-your-mechanism", title: "Choosing your mechanism" }
  ]},
  { phase: "Phase 3 · Models & optimization", lessons: [
    { id: "0011-model-selection", title: "Choosing a model" },
    { id: "0012-thinking-and-effort", title: "Thinking & effort" },
    { id: "0013-tokens-and-sampling", title: "Tokens, sampling & non-determinism" },
    { id: "0014-prompt-caching", title: "Prompt caching" },
    { id: "0015-batch-api", title: "The Batch API" }
  ]},
  { phase: "Phase 4 · Prompt & context engineering", lessons: [
    { id: "0016-prompt-engineering", title: "Prompt engineering essentials" },
    { id: "0017-steering-output", title: "Steering output" },
    { id: "0018-structured-outputs", title: "Structured outputs" },
    { id: "0019-context-engineering", title: "Context engineering" },
    { id: "0020-context-editing-memory", title: "Context editing, compaction & memory" }
  ]},
  { phase: "Phase 5 · Agents & workflows", lessons: [
    { id: "0021-workflow-vs-agent", title: "Workflow vs agent" },
    { id: "0022-workflow-patterns", title: "The five workflow patterns" },
    { id: "0023-agent-sdk", title: "The Claude Agent SDK" },
    { id: "0024-subagents-and-hooks", title: "Subagents & hooks" },
    { id: "0025-agent-frameworks", title: "Agent frameworks" }
  ]},
  { phase: "Phase 6 · Claude Code & config", lessons: [
    { id: "0026-claude-md-hierarchy", title: "The CLAUDE.md hierarchy" },
    { id: "0027-rules-skills-commands", title: "Rules, Skills & Commands" },
    { id: "0028-agents-and-memory", title: "Agents & Agent Memory" },
    { id: "0029-configuration-management", title: "Configuration management" },
    { id: "0030-application-design", title: "Application design across interfaces" }
  ]},
  { phase: "Phase 7 · Security & safety", lessons: [
    { id: "0031-prompt-injection", title: "Prompt injection & jailbreaks" },
    { id: "0032-guardrails", title: "Guardrails & safe deployment" },
    { id: "0033-claude-hooks", title: "Claude hooks for guardrails" },
    { id: "0034-data-leakage-pii", title: "Data leakage & PII" },
    { id: "0035-secrets-and-keys", title: "Identity, secrets & keys" }
  ]},
  { phase: "Phase 8 · Capstone & readiness", lessons: [
    { id: "0036-capstone", title: "Capstone: build & operate one app" },
    { id: "0037-exam-readiness", title: "Exam readiness" }
  ]}
];
