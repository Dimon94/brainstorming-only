# Brainstorming-Only

[中文说明](README.zh-CN.md)

Standalone AI agent skill for focused brainstorming without drifting into specs,
plans, commits, scaffolding, or implementation.

Supports both Codex and Claude skill directories from one shared `SKILL.md`.

This project is a single-skill package. It is a focused, standalone homage to
the original `$brainstorming` skill: it keeps the collaborative clarification,
option generation, and trade-off analysis, while deliberately stopping before
any downstream workflow begins.

## Install

```bash
npm install -g brainstorming-only
```

By default, the package installs the same skill into both supported ecosystems:

```bash
${CODEX_HOME:-~/.codex}/skills/brainstorming-only
${CLAUDE_HOME:-~/.claude}/skills/brainstorming-only
```

You can also run the installer directly:

```bash
npx brainstorming-only
```

Install only one ecosystem when needed:

```bash
npx brainstorming-only --codex
npx brainstorming-only --claude
npx brainstorming-only --both
```

## Use

In an AI agent that supports skills:

```text
Use $brainstorming-only to compare these product directions and help me choose one.
```

The skill is intentionally discussion-only. It may help frame the topic, ask
targeted questions, generate options, stress-test trade-offs, and summarize the
decision. It must not create specs, write implementation plans, scaffold files,
commit changes, open PRs, or transition into another workflow.

If you later want implementation or planning, treat that as a separate request
after the brainstorming session ends.

## What's Included

- `brainstorming-only/SKILL.md` - the skill instructions
- `brainstorming-only/agents/openai.yaml` - optional UI metadata for compatible skill lists
- `scripts/install.js` - npm installer that copies the skill into `CODEX_HOME`
  and `CLAUDE_HOME`

## License

MIT
