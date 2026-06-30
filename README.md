# Brainstorming-Only

[中文说明](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/brainstorming-only.svg)](https://www.npmjs.com/package/brainstorming-only)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js >=16](https://img.shields.io/badge/node-%3E%3D16-339933.svg)](package.json)
[![GitHub stars](https://img.shields.io/github/stars/Dimon94/brainstorming-only?style=social)](https://github.com/Dimon94/brainstorming-only/stargazers)

Standalone AI agent skill for focused brainstorming without drifting into specs,
plans, commits, scaffolding, or implementation.

Supports both Codex and Claude skill directories from one shared skill bundle.

This project is a single-skill package. It is a focused, standalone homage to
the original [`$brainstorming` skill](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)
from [Superpowers](https://github.com/obra/superpowers): it keeps the
collaborative clarification, option generation, and trade-off analysis, while
deliberately stopping before any downstream workflow begins. It also adds an
[`office-hours`](https://github.com/garrytan/gstack/blob/main/office-hours/SKILL.md)-inspired
product diagnostic posture from [gstack](https://github.com/garrytan/gstack)
for sharper "is this worth building?" conversations, while staying independent
from gstack telemetry, design docs, commits, and downstream workflow machinery.

When brainstorming is tied to a local project, durable terms and hard-to-reverse
decisions are captured through project context docs: glossary-only `CONTEXT.md`
files and sparse ADRs under `docs/adr/`. It does not keep a separate session
journal, hidden local cache, or recovery directory.

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

When the discussion resolves durable project language, the skill updates the
applicable `CONTEXT.md` inline. ADRs are offered only when a decision is hard to
reverse, surprising without context, and the result of a real trade-off.

## What It Adds

- Discussion-only brainstorming with a hard boundary before specs, plans,
  scaffolds, commits, or PRs.
- Three postures: general brainstorming, product diagnostic, and builder mode.
- Adversarial clarity: the skill names weak assumptions, missing evidence, and
  failure modes instead of cheaply agreeing.
- Structured decision pauses that use the host's native choice UI when available.
- Unified A/B/C option output for both blocking pauses and terminal convergence,
  always with one recommended option and the reason it wins.
- Project context docs as the only persistence surface: glossary-only
  `CONTEXT.md` updates for resolved language and sparse ADRs for durable
  trade-off decisions.

## Modes

- **General brainstorming** - clarify a fuzzy idea, compare directions, and
  converge on a decision.
- **Product diagnostic** - pressure-test demand, current workarounds, concrete
  users, narrowest wedge, observation, and future-fit.
- **Builder mode** - explore the most delightful version of a side project,
  open source idea, learning project, demo, or hackathon concept.

## Structured Choices

The skill uses one visible option format for blocking choice pauses and terminal
convergence. If the next reasoning step requires the user to choose, the skill
uses the host's native choice UI when available. If the recommendation is already
clear, the final response still uses A/B/C options, marks one option as
recommended, and explains why that recommendation wins.

The choice protocol is only a host-rendering adapter. Upstream brainstorming
flow decides the recommendation, reliability note, and whether the choice is a
blocking pause or terminal convergence before the protocol renders it.

For Codex blocking choices, that means `request_user_input` when it is listed in
the current turn's tools. Codex can expose that tool in Default mode when this is
configured in `~/.codex/config.toml`:

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

The detailed choice rendering contract and host mapping live in
`brainstorming-only/references/user-choice-output-protocol.md`.

## Privacy And Local Data

The package no longer creates local recovery journals or hidden cache
directories. For local project discussions, durable knowledge is written only to
project-owned context docs when it has been resolved: `CONTEXT.md`,
pre-existing `CONTEXT-MAP.md`, or sparse ADRs under `docs/adr/`.

No gstack telemetry, analytics, or runtime commands are required for this
package.

## Prior Art And Attribution

`brainstorming-only` exists because other open projects made the underlying
workflow patterns concrete. This package is independently maintained and is not
affiliated with, sponsored by, or endorsed by those projects or their
maintainers. The projects below remain under their own maintainers and licenses.

We cite them directly here with respect:

- [Superpowers](https://github.com/obra/superpowers), especially its
  [`$brainstorming` skill](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md),
  shaped the collaborative clarification, alternative generation, trade-off
  framing, and explicit pre-implementation boundary that this package honors in
  a narrower discussion-only form.
- [gstack](https://github.com/garrytan/gstack), especially its
  [`office-hours`](https://github.com/garrytan/gstack/blob/main/office-hours/SKILL.md),
  inspired the sharper product diagnostic posture. This package borrows those
  ideas respectfully while staying independent from the gstack runtime,
  telemetry, and downstream workflow machinery.

## Recommended Skill Suites

If you are choosing an agent-skill workflow, this package is the intentionally
small option: use it when you want to think clearly without starting a plan or
implementation loop. For broader workflows, we recommend these adjacent skill
suites:

| Skill suite | Best fit | Work situations |
| --- | --- | --- |
| [Superpowers](https://github.com/obra/superpowers) | Developers and teams who want a broad, composable agentic software-development methodology across coding agents. | Use it when you want the agent to follow disciplined workflows for idea shaping, planning, test-driven implementation, debugging, review, and shipping rather than relying on ad hoc prompts. |
| [gstack](https://github.com/garrytan/gstack) | Founders, product builders, and high-agency teams who want stronger product judgment, design review, execution review, QA, ship, and retro loops. | Use it when the hard part is deciding what is worth building, improving taste and ambition, turning product intent into a stronger plan, and carrying that plan through a full delivery lifecycle. |
| [cc-devflow](https://github.com/Dimon94/cc-devflow) (same maintainer) | Maintainers and agent-assisted engineering teams who want a small, explicit repo workflow with one roadmap entry point, feature and bug-investigation loops, verification gates, PR review, and main-branch parity. | Use it when you need repeatable project execution: roadmap to next work item, plan or investigation, implementation, fresh verification, PR creation, review-first landing, and durable project artifacts under `devflow/`. |

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
- `brainstorming-only/references/brainstorming-method.md` - detailed brainstorming workflow, postures, pressure tests, and output shape.
- `brainstorming-only/references/project-context-docs.md` - `CONTEXT.md` and ADR persistence rules.
- `brainstorming-only/references/recommendation-reliability.md` - second-sample and roundtable recommendation checks.
- `brainstorming-only/references/user-choice-output-protocol.md` - host-specific structured choice protocol.
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
