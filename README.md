# Brainstorming-Only

[中文说明](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/brainstorming-only.svg)](https://www.npmjs.com/package/brainstorming-only)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js >=16](https://img.shields.io/badge/node-%3E%3D16-339933.svg)](package.json)
[![GitHub stars](https://img.shields.io/github/stars/Dimon94/brainstorming-only?style=social)](https://github.com/Dimon94/brainstorming-only/stargazers)

Standalone AI agent skill for focused brainstorming without drifting into specs,
plans, commits, scaffolding, or implementation.

Supports both Codex and Claude skill directories from one shared `SKILL.md`.

This project is a single-skill package. It is a focused, standalone homage to
the original `$brainstorming` skill: it keeps the collaborative clarification,
option generation, and trade-off analysis, while deliberately stopping before
any downstream workflow begins. It also adds an office-hours-inspired product
diagnostic posture for sharper "is this worth building?" conversations, while
staying independent from gstack telemetry, design docs, commits, and downstream
workflow machinery.

For long sessions, it keeps a small local recovery journal under
`~/.brainstorming/`. The journal uses the same project slug shape as
`office-hours` without depending on the gstack runtime, so compressed context can
recover the latest first-hand decisions without writing into the project
workspace.

## Quick Install

Install both Codex and Claude skill copies with one command:

```bash
npx --yes brainstorming-only --both
```

Codex-only:

```bash
npx --yes brainstorming-only --codex
```

Claude-only:

```bash
npx --yes brainstorming-only --claude
```

The installer writes to:

```bash
${CODEX_HOME:-~/.codex}/skills/brainstorming-only
${CLAUDE_HOME:-~/.claude}/skills/brainstorming-only
```

Global install also works:

```bash
npm install -g brainstorming-only
brainstorming-only --codex
```

Requirements:

- Node.js 16 or newer.
- A host that supports local skill directories.
- Write access to `~/.codex/skills` or `~/.claude/skills`.

## Use

In an AI agent that supports skills:

```text
Use $brainstorming-only to compare these product directions and help me choose one.
```

The skill is intentionally discussion-only. It may help frame the topic, choose
a brainstorming posture, ask targeted questions, generate options, stress-test
trade-offs, and summarize the decision. It must not create specs, write
implementation plans, scaffold files, commit changes, open PRs, or transition
into another workflow.

During longer conversations, the skill checkpoints the session after every 10
effective question-answer pairs and immediately after key decisions. Each
checkpoint is written to:

```text
~/.brainstorming/projects/<project-slug>/sessions/<timestamp>-<topic-slug>/brainstorming.md
```

The companion `meta.json` tracks `checkpoint_count`, `last_checkpoint_at`,
`qa_since_checkpoint`, `status`, and the `active` / `latest` recovery pointers.

## What It Adds

- Discussion-only brainstorming with a hard boundary before specs, plans,
  scaffolds, commits, or PRs.
- Three postures: general brainstorming, product diagnostic, and builder mode.
- Adversarial clarity: the skill names weak assumptions, missing evidence, and
  failure modes instead of cheaply agreeing.
- Structured decision pauses that use the host's native choice UI when available.
- Context recovery journal under `~/.brainstorming/`, with checkpoints every 10
  effective question-answer pairs and immediately after key decisions.
- Standalone project slug logic inspired by `office-hours`, without depending on
  gstack runtime files, commands, telemetry, or caches.

## Modes

- **General brainstorming** - clarify a fuzzy idea, compare directions, and
  converge on a decision.
- **Product diagnostic** - pressure-test demand, current workarounds, concrete
  users, narrowest wedge, observation, and future-fit.
- **Builder mode** - explore the most delightful version of a side project,
  open source idea, learning project, demo, or hackathon concept.

## Structured Choices

When the host supports a native choice UI, the skill uses it instead of prose.
For Codex, that means `request_user_input` when it is listed in the current
turn's tools. Codex can expose that tool in Default mode when this is configured
in `~/.codex/config.toml`:

```toml
[features]
default_mode_request_user_input = true
```

Without that Codex config, the skill falls back to a fixed Markdown A/B/C choice
block and waits for the user to reply with `A`, `B`, or `C`. The Markdown block is
only a fallback; it is not native Codex option UI. For Claude Code, native choice
means MCP elicitation unless the official host protocol changes. For gstack-style
hosts, that means a real `AskUserQuestion` tool when available.

To enable the Codex setting directly, send Codex this prompt:

```text
Please enable Codex Default-mode choice popups by adding [features] default_mode_request_user_input = true to ~/.codex/config.toml, preserving all existing settings.
```

The detailed host mapping lives in
`brainstorming-only/references/user-choice-output-protocol.md`.

## Privacy And Local Data

The session journal is local-only. It writes under `~/.brainstorming/`, not the
current project directory, and it is meant for recovery after context
compression. The skill instructs agents not to record credentials, tokens,
private keys, or sensitive personal data. If sensitive material appears during a
conversation, the journal should capture only the decision-relevant constraint
and redact the secret itself.

No gstack telemetry, analytics, or runtime commands are required for this
package.

## Project Signals

Current public repository signals as of 2026-05-22:

- GitHub repository: [Dimon94/brainstorming-only](https://github.com/Dimon94/brainstorming-only)
- Stars: 0
- Watchers: 0
- npm package: [brainstorming-only](https://www.npmjs.com/package/brainstorming-only)

[![Star History Chart](https://api.star-history.com/svg?repos=Dimon94/brainstorming-only&type=Date)](https://star-history.com/#Dimon94/brainstorming-only&Date)

## Verify A Local Checkout

```bash
npm test
npm run pack:check
node scripts/install.js --codex
```

If you later want implementation or planning, treat that as a separate request
after the brainstorming session ends.

## What's Included

- `brainstorming-only/SKILL.md` - the skill instructions.
- `brainstorming-only/references/user-choice-output-protocol.md` - host-specific structured choice protocol.
- `brainstorming-only/scripts/journal.js` - local session journal helper.
- `brainstorming-only/agents/openai.yaml` - optional UI metadata for compatible skill lists.
- `scripts/install.js` - npm installer that copies the skill into `CODEX_HOME`
  and `CLAUDE_HOME`.

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## License

MIT
