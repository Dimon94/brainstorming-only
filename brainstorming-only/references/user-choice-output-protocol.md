# User Choice Output Protocol

Use this reference when a brainstorming session reaches a real user decision. Host-native choice UI is preferred over prose. Text blocks are fallback only.

Use for posture selection, premise approval, approach selection, scope trade-offs, and any choice that changes the rest of the brainstorming session. Do not use for every lightweight clarification.

## Contents

- Decision Brief
- Strict Self-Check
- Pros / Cons Quality Bar
- Codex Host Format
- Claude Code MCP Elicitation
- gstack AskUserQuestion Format
- Fallback Text

## Decision Brief

Prepare this brief before choosing the host output format:

- `D<N>` number and short title.
- One-sentence question.
- Plain-language stakes: what becomes better or worse depending on the choice.
- Recommendation and why.
- 2-3 mutually exclusive options.
- For each option: label, upside, cost/risk, and when it fits.
- Completeness note when options differ by coverage, or "options differ in kind" when coverage is not comparable.
- Net impact: what the selected option changes downstream.

## Strict Self-Check

Before calling a structured choice tool or emitting fallback text, verify:

- `D<N>` title exists and increments from the previous decision.
- The question asks one decision, not multiple hidden decisions.
- The options are mutually exclusive and cover the realistic paths.
- The recommended option is first for Codex and marked `(Recommended)` or `(recommended)` everywhere else.
- The recommendation has a concrete reason, not "best balance" without saying what is being balanced.
- Stakes are explicit: what becomes worse if the user picks wrong.
- Completeness is scored only when coverage differs; otherwise use the kind-note.
- Pros/cons meet the quality bar below.
- The response stops after asking and waits for the user's answer.

If any item fails, rewrite the question before asking it.

## Pros / Cons Quality Bar

Each real option must include:

- At least one concrete upside tied to the user's outcome.
- At least one honest cost, risk, or lost alternative.
- A "when it fits" condition unless the host format is too short.
- Specific nouns from the current topic. Avoid empty words like "simple", "flexible", "robust", or "better" unless followed by what becomes simpler, flexible, or better.

For rich hosts such as gstack AskUserQuestion, use at least two pros and one con per option when the decision is non-trivial. For compact Codex `request_user_input`, compress the strongest upside and cost/risk into the option description.

Bad:

```text
A) Fast
   Good: quick
   Cost/Risk: less complete
```

Good:

```text
A) Minimal protocol fix (recommended)
   Good: Fixes the false Claude Code AskUserQuestion contract without expanding runtime dependencies.
   Cost/Risk: Leaves broader office-hours diagnostics for a separate iteration.
   When it fits: Use when the goal is correcting host compatibility with the smallest durable edit.
```

## Codex Host Format

When Codex exposes `request_user_input`, use that tool first. Ask exactly one decision question per pause point.

Use this shape:

```json
{
  "questions": [
    {
      "header": "<12 chars max>",
      "id": "<stable_snake_case_id>",
      "question": "<one sentence question>",
      "options": [
        {
          "label": "<short label> (Recommended)",
          "description": "<one sentence impact or tradeoff>"
        },
        {
          "label": "<short label>",
          "description": "<one sentence impact or tradeoff>"
        }
      ]
    }
  ]
}
```

Rules:

1. Ask one decision question, then stop and wait.
2. Provide 2-3 mutually exclusive options.
3. Put the recommended option first and suffix its label with `(Recommended)`.
4. Keep `header` 12 characters or fewer.
5. Use a stable snake_case `id`.
6. Keep labels short and put trade-offs in descriptions.
7. Do not add an "Other" option. Codex clients may add free-form Other automatically.

Mapping:

- `header`: shortest useful title, not the full `D<N>` line.
- `id`: decision title in snake_case, stable across retries.
- `question`: one sentence containing the question and recommendation if natural.
- `options[].label`: 1-5 words, with `(Recommended)` only on the first option.
- `options[].description`: one sentence with upside and cost/risk. Include completeness only if it changes the decision.

## Claude Code MCP Elicitation

When the host is Claude Code, use MCP elicitation as the required structured-input path unless the official Claude Code / MCP protocol changes. Do not downgrade Claude Code to prose or generic structured input just because other hosts use different choice mechanisms.

Minimum shape:

- Single-select field with enum values `A`, `B`, and optional `C`.
- Field prompt contains the one-sentence question and stakes.
- Option labels contain the short label and recommended marker.
- Field or option descriptions contain the recommendation, upside, and cost/risk.

If a Claude Code runtime claims to support skills but does not expose MCP elicitation to the current agent, state the missing host capability explicitly before using the fallback text block. Do not simulate MCP elicitation with Markdown, XML, comments, or a fake tool call.

## gstack AskUserQuestion Format

When a gstack-style host exposes a real `AskUserQuestion` tool, send the decision brief as a tool call, not prose. Do not simulate this by writing Markdown.

Use this content shape inside the tool:

```text
D<N> - <one-line question title>
Project/branch/task: <one short grounding sentence, or "Brainstorming session: <topic>">
ELI10: <plain English explanation of the choice and stakes, 2-4 short sentences>
Stakes if we pick wrong: <what breaks, what user loses, or what discussion path becomes wasteful>
Recommendation: <choice> because <one-line reason>
Completeness: A=X/10, B=Y/10
  OR: Note: options differ in kind, not coverage - no completeness score.
Pros / cons:
A) <option label> (recommended)
  Good: <concrete upside, specific to the current topic>
  Good: <second concrete upside for non-trivial decisions>
  Cost/Risk: <honest downside or lost alternative>
  When it fits: <condition where this option is right>
B) <option label>
  Good: <concrete upside, specific to the current topic>
  Good: <second concrete upside for non-trivial decisions>
  Cost/Risk: <honest downside or lost alternative>
  When it fits: <condition where this option is right>
C) <option label, optional>
  Good: <concrete upside, specific to the current topic>
  Good: <second concrete upside for non-trivial decisions>
  Cost/Risk: <honest downside or lost alternative>
  When it fits: <condition where this option is right>
Net: <one-line synthesis of the trade-off>
```

Rules:

1. First decision in a skill invocation is `D1`; increment each later decision.
2. `ELI10` is always present and plain language.
3. Recommendation is always present, including neutral taste calls.
4. Put `(recommended)` on exactly one option.
5. Use completeness scores only when options differ by coverage; otherwise use the kind-note.
6. Keep options mutually exclusive.
7. Each option needs at least two pros and one con for non-trivial decisions; one-way hard-stop confirmations may state that no real alternative exists.
8. Stop after the tool call and wait.

## Fallback Text

If no structured choice tool is available, emit this fixed text block and stop:

```text
D<N> - <decision title>
Question: <one sentence question>
Stakes: <what becomes better or worse depending on the choice>
Recommendation: <A/B/C> because <reason>
Completeness: <coverage score or "options differ in kind">
Options:
A) <label> (recommended)
   Good: <upside>
   Cost/Risk: <cost or risk>
B) <label>
   Good: <upside>
   Cost/Risk: <cost or risk>
C) <label, optional>
   Good: <upside>
   Cost/Risk: <cost or risk>
Impact: <what changes downstream>
Reply with A, B, or C.
STOP: wait for the user answer before continuing.
```

Fallback rules:

1. Do not call the fallback block a native selector.
2. Do not continue in the same turn after asking.
3. Do not invent XML tags, comments, or hidden protocol markers.
