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
docs/adr/
  0001-choice-output-adapter.md
  0002-skill-md-owns-session-orchestrator.md
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

`SKILL.md` is the concise runtime entry point and the Session Orchestrator. It
keeps the agent in discussion-only mode and owns the five-state Session State
Machine:

```text
Frame -> Route -> Ground -> DecideNext -> Respond
```

Reference files do not own workflow transitions. They plug into the
orchestrator as one-level capabilities:

- `brainstorming-method.md` provides DecideNext tactics.
- `recommendation-reliability.md` provides a DecideNext tactic for unstable
  recommendations.
- `user-choice-output-protocol.md` is the Choice Output Adapter for already
  decided response shapes.
- `project-context-docs.md` is the Context Persistence Adapter for confirmed
  durable facts and ADR-worthy decisions.

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
