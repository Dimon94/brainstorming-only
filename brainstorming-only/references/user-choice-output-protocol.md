# User Choice Output Protocol

Use this reference when a brainstorming session reaches a real user decision. Host-native choice UI is preferred over prose. Text blocks are fallback only.

Use for posture selection, premise approval, approach selection, scope trade-offs, and any choice that changes the rest of the brainstorming session. Do not use for every lightweight clarification.

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

## Claude Code AskUserQuestion Format

When Claude Code or a gstack-style host exposes a real `AskUserQuestion` tool, send the decision brief as a tool call, not prose. Do not simulate this by writing Markdown.

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
  Good: <concrete upside>
  Cost/Risk: <honest downside>
B) <option label>
  Good: <concrete upside>
  Cost/Risk: <honest downside>
C) <option label, optional>
  Good: <concrete upside>
  Cost/Risk: <honest downside>
Net: <one-line synthesis of the trade-off>
```

Rules:

1. First decision in a skill invocation is `D1`; increment each later decision.
2. `ELI10` is always present and plain language.
3. Recommendation is always present, including neutral taste calls.
4. Put `(recommended)` on exactly one option.
5. Use completeness scores only when options differ by coverage; otherwise use the kind-note.
6. Keep options mutually exclusive.
7. Stop after the tool call and wait.

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
