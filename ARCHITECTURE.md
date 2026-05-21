# Architecture

`brainstorming-only` is intentionally small. It ships one agent skill, a local
installer, and a journal helper for long brainstorming sessions.

## Package Layout

```text
brainstorming-only/
  SKILL.md
  agents/openai.yaml
  references/user-choice-output-protocol.md
  scripts/journal.js
scripts/
  install.js
test/
  journal.test.js
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

`SKILL.md` is the runtime contract. It keeps the agent in a discussion-only
mode:

- Frame the topic.
- Choose a brainstorming posture.
- Ask targeted decision questions.
- Challenge premises.
- Generate and stress-test options.
- Converge only when no blocking choice remains.

The hard boundary is deliberate: this skill does not start implementation,
planning, scaffolding, commits, or PR work. If the user wants those steps, they
are separate requests after the brainstorming session ends.

## Structured Choices

The choice protocol lives in
`brainstorming-only/references/user-choice-output-protocol.md`.

The skill prefers host-native choice UI:

- Codex: `request_user_input` when available in the current tool list.
- Claude Code: MCP elicitation when available.
- gstack-style hosts: a real `AskUserQuestion` tool when available.

Plain text A/B/C choices are fallback only. Codex decision pauses do not use
plain Markdown as a fake native UI when `request_user_input` is unavailable.

## Session Journal

`brainstorming-only/scripts/journal.js` manages a local recovery journal:

```text
~/.brainstorming/projects/<project-slug>/
  sessions/
    YYYYMMDD-HHMMSS-<topic-slug>/
      brainstorming.md
      meta.json
  active -> sessions/<current-session>
  latest -> sessions/<most-recent-session>
```

The journal exists so long conversations can survive model context compression.
It records compact checkpoints, key decisions, open questions, and a few short
user quotes as evidence.

`meta.json` includes recovery fields:

- `checkpoint_count`
- `last_checkpoint_at`
- `qa_since_checkpoint`
- `decision_count`
- `status`
- `closed_at`
- `final_summary`

The helper's project slug logic is standalone:

1. `BRAINSTORMING_PROJECT_SLUG` or `SLUG`
2. `~/.brainstorming/slug-cache`
3. git remote shape `owner-repo`
4. current directory basename

It does not call any gstack runtime command, runtime environment path, telemetry
hook, or gstack-owned slug cache.

## Privacy Boundary

The journal is local-only and outside the project workspace. The skill tells the
agent to redact credentials, tokens, private keys, and sensitive personal data.
The package does not require network access, telemetry, or a gstack runtime.

## Verification

The repository uses Node's built-in test runner:

```bash
npm test
npm run pack:check
```

The tests cover journal behavior, session close semantics, project slug
independence from gstack runtime files, and key skill text contracts.
