# User Choice Output Protocol

Use this reference when a brainstorming session reaches a user-facing option set. Host-native choice UI is preferred over prose for blocking pauses. Text blocks are fallback only.

Use for posture selection, premise approval, approach selection, scope trade-offs, terminal convergence, and any choice that must be resolved before the rest of the brainstorming session can continue. Do not use for every lightweight clarification.

## Contents

- Decision Brief
- Recommendation Reliability Check
- Blocking Choices And Terminal Options
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
- Reliability note for non-trivial recommendations: stable `second-sample pass`,
  disclosed `second-sample check`, or `Decision Roundtable`.
- Net impact: what the selected option changes downstream.

## Recommendation Reliability Check

Before presenting a non-trivial recommendation, follow
`recommendation-reliability.md`. Stable reliability checks stay hidden and the
option set shows only the final recommendation. Unstable checks must disclose a
short `second-sample check` before the option set. High-complexity decisions may
use `Decision Roundtable`; if disagreement affects the final recommendation,
disclose a compressed `roundtable check`.

Never expose raw chain-of-thought. The visible output is a decision trace
summary: recommendation, disagreement source, confidence change, and final move.

## Blocking Choices And Terminal Options

A structured choice is a blocking pause, not the only way to show options. Use it only when the session needs the user to choose A/B/C before the next reasoning step is valid.

Use terminal A/B/C options as the default convergence shape when the assistant can recommend a direction and no blocking choice remains. The same visible option format appears in blocking and terminal cases; only the final instruction differs.

After using a native choice tool, MCP elicitation, gstack `AskUserQuestion`, or fallback A/B/C text for a blocking pause, stop immediately and wait. Do not append a decision summary or recommendation recap in the same turn.

## Strict Self-Check

Before calling a structured choice tool or emitting fallback text for a blocking pause, verify:

- `D<N>` title exists and increments from the previous decision.
- The question asks one decision, not multiple hidden decisions.
- The options are mutually exclusive and cover the realistic paths.
- The recommended option is first for Codex and marked `(Recommended)` or `(recommended)` everywhere else.
- The recommendation has a concrete reason, not "best balance" without saying what is being balanced.
- Non-trivial recommendations have passed a stable `second-sample pass` or disclose the `second-sample check` / `roundtable check` that changed the recommendation or confidence.
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

Codex native choice UI is the `request_user_input` tool. Use it when it is
listed in the available tools for the current turn. Codex Default mode exposes
it when the `DefaultModeRequestUserInput` feature is enabled.

Codex users can enable Default-mode native choices in `~/.codex/config.toml`:

```toml
[features]
default_mode_request_user_input = true
```

If the current host is Codex but `request_user_input` is not listed, emit the
fallback A/B/C decision block and stop. Do not ask the user to change
collaboration modes. The fallback is plain Markdown, so it must not be called or
implied to be the Codex native option UI.

When the tool is available, ask exactly one decision question per pause point.

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

If no structured choice tool is available for a blocking pause, emit this fixed text block and stop:

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
4. In Codex, use this fallback for real decision pauses when `request_user_input`
   is unavailable, and wait for the user to reply with A, B, or C.

## Terminal Options

For terminal convergence, keep the same A/B/C option shape even when the options
are useful but not blocking. Use this shape:

```text
- Recommendation: <A/B/C> because <why this direction wins>
- Decisions made: <what is already settled>
Options:
A) <recommended direction> (Recommended)
   Good: <upside>
   Cost/Risk: <cost or risk>
B) <alternative>
   Good: <upside>
   Cost/Risk: <cost or risk>
C) <alternative, optional>
   Good: <upside>
   Cost/Risk: <cost or risk>
- Open questions: <unknowns that still matter>
```

Rules:

1. Use terminal options when there are meaningful paths the user may still
   choose, reject, or combine later.
2. Put the recommended option first and mark it `(Recommended)`.
3. Do not say "Reply with A, B, or C" for terminal options; that language is
   reserved for blocking pauses.
4. Always include `Recommendation: <A/B/C> because <reason>` before the options.
5. Keep options short enough that the recommendation remains easy to scan.
