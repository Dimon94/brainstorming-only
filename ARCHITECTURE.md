# Architecture

`brainstorming-only` is intentionally small. It ships one agent skill and a
local installer.

## Package Layout

```text
brainstorming-only/
  SKILL.md
  agents/openai.yaml
  references/brainstorming-method.md
  references/project-context-docs.md
  references/recommendation-reliability.md
  references/user-choice-output-protocol.md
scripts/
  install.js
test/
  skill-content.test.js
```

## Install Flow

The npm package exposes one binary:

```text
brainstorming-only -> scripts/install.js
```

The installer copies the bundled `brainstorming-only/` skill directory into one
or both host locations:

```text
${CODEX_HOME:-~/.codex}/skills/brainstorming-only
${CLAUDE_HOME:-~/.claude}/skills/brainstorming-only
```

It does not modify the current project workspace. It only writes to the user's
skill directories.

## Skill Contract

`SKILL.md` is the concise runtime entry point. It keeps the agent in a
discussion-only mode and routes detailed behavior into one-level reference
files:

- Frame the topic.
- Choose a brainstorming posture.
- Ask targeted decision questions.
- Challenge premises.
- Generate and stress-test options.
- Converge only when no blocking choice remains.

Detailed brainstorming method, project-context persistence rules,
recommendation reliability, and host-specific choice handling live under
`brainstorming-only/references/`.

The hard boundary is deliberate: this skill does not start implementation,
planning, scaffolding, commits, or PR work. If the user wants those steps, they
are separate requests after the brainstorming session ends.

## Structured Choices

The choice protocol lives in
`brainstorming-only/references/user-choice-output-protocol.md`.

It is a host-rendering adapter for already-decided choice packets. Session flow,
recommendation reliability, and blocking-vs-terminal intent stay upstream of
the protocol.

The skill prefers host-native choice UI:

- Codex: `request_user_input` when available in the current tool list.
- Claude Code: MCP elicitation when available.
- gstack-style hosts: a real `AskUserQuestion` tool when available.

Plain text A/B/C choices are fallback only. Codex decision pauses do not use
plain Markdown as a fake native UI when `request_user_input` is unavailable.

## Project Context Docs

The skill has no separate recovery journal, checkpoint helper, or hidden local
cache. When a brainstorming session is tied to a local project, durable
knowledge is captured only through project-owned context docs:

- `CONTEXT.md` for resolved glossary terms, boundaries, and domain
  relationships.
- An existing `CONTEXT-MAP.md` only when the repo already uses multiple
  contexts.
- Sparse ADRs under `docs/adr/` for decisions that are hard to reverse,
  surprising without context, and the result of a real trade-off.

## Privacy Boundary

The package does not create local conversation archives or hidden recovery
directories. It does not require network access, telemetry, or a gstack runtime.

## Verification

The repository uses Node's built-in test runner:

```bash
npm test
npm run pack:check
```

The tests cover key skill text contracts, including the absence of the legacy
journal mechanism and the project-context documentation rules.
