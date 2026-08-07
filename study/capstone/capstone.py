"""CCDV-F capstone: a support-triage assistant on the Claude Messages API.

One script that exercises the whole course:
  - prompt caching    : a large, stable system prompt cached with cache_control
  - tool use          : a lookup_order tool run in a tool-use loop
  - a guardrail       : a PreToolUse-style guard that denies suspicious tool input
  - structured output : a forced triage_summary tool with an enum'd schema
  - streaming         : the final customer-facing reply, streamed token by token
  - evaluation        : usage token counts printed for cost visibility

Run:
  export ANTHROPIC_API_KEY=sk-ant-...
  pip install anthropic
  python capstone.py

Rerun within ~5 min and watch cache_read jump. Verify the model id on the live
models page before shipping.
"""

import json

import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5"  # verify the current id on the models page

# A big, stable policy block — the kind of prefix worth caching.
POLICY = (
    "You are Acme Support Triage. Classify each request, look up the order when an "
    "id is given, and never take destructive action. Be concise and accurate. " * 40
)
SYSTEM = [{"type": "text", "text": POLICY, "cache_control": {"type": "ephemeral"}}]

LOOKUP_TOOL = {
    "name": "lookup_order",
    "description": "Look up one order by its id (format 'ORD-1234'). Returns status and items.",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string", "description": "e.g. 'ORD-1234'"}},
        "required": ["order_id"],
    },
}

ORDERS = {"ORD-1234": {"status": "shipped", "items": ["widget"]}}


def guard_tool_call(name, tool_input):
    """PreToolUse-style guard: deny anything that isn't a clean order id."""
    if name == "lookup_order":
        oid = tool_input.get("order_id", "")
        if not oid.startswith("ORD-") or "/" in oid or ".." in oid:
            return "DENY: refusing suspicious order id."
    return None  # allow


def run_tool_loop(messages):
    resp = client.messages.create(
        model=MODEL, max_tokens=500, system=SYSTEM, tools=[LOOKUP_TOOL], messages=messages
    )
    while resp.stop_reason == "tool_use":
        messages.append({"role": "assistant", "content": resp.content})
        results = []
        for block in resp.content:
            if block.type != "tool_use":
                continue
            denied = guard_tool_call(block.name, block.input)
            if denied:
                results.append(
                    {"type": "tool_result", "tool_use_id": block.id, "content": denied, "is_error": True}
                )
            else:
                order = ORDERS.get(block.input["order_id"], {"status": "not found"})
                results.append(
                    {"type": "tool_result", "tool_use_id": block.id, "content": json.dumps(order)}
                )
        messages.append({"role": "user", "content": results})
        resp = client.messages.create(
            model=MODEL, max_tokens=500, system=SYSTEM, tools=[LOOKUP_TOOL], messages=messages
        )
    messages.append({"role": "assistant", "content": resp.content})
    return messages


def triage(messages):
    """Force a structured summary via a single named tool."""
    summary_tool = {
        "name": "triage_summary",
        "description": "Record the triage decision for this ticket.",
        "input_schema": {
            "type": "object",
            "properties": {
                "category": {"type": "string", "enum": ["shipping", "refund", "other"]},
                "priority": {"type": "string", "enum": ["low", "med", "high"]},
                "next_step": {"type": "string"},
            },
            "required": ["category", "priority", "next_step"],
        },
    }
    resp = client.messages.create(
        model=MODEL, max_tokens=300, system=SYSTEM, tools=[summary_tool],
        tool_choice={"type": "tool", "name": "triage_summary"}, messages=messages,
    )
    block = next(b for b in resp.content if b.type == "tool_use")
    return block.input, resp.usage


def stream_reply(messages):
    with client.messages.stream(model=MODEL, max_tokens=300, system=SYSTEM, messages=messages) as stream:
        for event in stream:
            if event.type == "text":
                print(event.text, end="", flush=True)
    print()


def main():
    messages = [{"role": "user", "content": "Where is my order ORD-1234? It never arrived."}]
    messages = run_tool_loop(messages)

    summary, usage = triage(
        messages + [{"role": "user", "content": "Summarize this ticket as structured triage."}]
    )
    print("STRUCTURED SUMMARY:", json.dumps(summary))
    print(
        f"usage: in={usage.input_tokens} out={usage.output_tokens} "
        f"cache_read={usage.cache_read_input_tokens or 0}"
    )

    print("\nCUSTOMER REPLY:")
    stream_reply(messages + [{"role": "user", "content": "Write a short, friendly reply to the customer."}])


if __name__ == "__main__":
    main()
