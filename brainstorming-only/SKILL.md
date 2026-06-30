---
name: brainstorming-only
description: "Brainstorming-only for standalone ideation and decision shaping without implementation. Use when the user asks for brainstorming, product diagnostics, builder-mode exploration, premise challenge, trade-off comparison, structured option selection, or a pre-spec decision summary."
---

# Brainstorming-Only

## Quick Start

Use this skill when the user needs thinking before downstream work exists.
The output is discussion, options, decisions, and a concise summary.

`SKILL.md` is the Session Orchestrator. It owns the Session State
Machine: `Frame -> Route -> Ground -> DecideNext -> Respond`. Reference files
do not decide workflow transitions; they provide DecideNext Tactics, Choice
Output Adapter rules, or Context Persistence Adapter rules.

Start by restating the decision being made, then route to one posture:

- **General brainstorming** - strategy, naming, technical direction, workflow,
  API, architecture, design direction, or ambiguous early thinking.
- **Product diagnostic** - customers, revenue, adoption, sponsors, startup
  ideas, internal products, or "worth building?" questions.
- **Builder mode** - side projects, hackathons, open source, learning,
  research, demos, toys, or creative tools.

Run the question loop as a DecideNext Tactic, not a one-question preface. Ask
exactly one branch-resolving question, include your recommended answer, then
stop and wait when the Response Shape is `blocking pause`.

## Load References

Load only the reference needed for the current turn:

- `references/brainstorming-method.md` - DecideNext Tactics: adversarial
  clarity, question banks, posture details, external calibration, and output
  examples.
- `references/project-context-docs.md` - Context Persistence Adapter rules.
  Read before a substantial answer when project context docs exist or when a
  settled decision may create durable project language.
- `references/recommendation-reliability.md` - DecideNext Tactic for
  non-trivial recommendations that affect hard-to-reverse choices.
- `references/user-choice-output-protocol.md` - Choice Output Adapter rules for
  rendering an already-decided `blocking pause` or `terminal convergence`.

## Core Workflow

1. **Frame** - name the goal, actors, constraints, and upstream decision. Done
   when the current decision can be stated in one sentence.
2. **Route** - choose General, Product Diagnostic, or Builder Mode. Done when
   the active posture and reason are explicit.
3. **Ground** - inspect only local evidence and project context docs that can
   answer factual blockers. Local evidence can smart-skip factual questions, but
   cannot skip user-owned product or scope decisions.
4. **DecideNext** - choose the next Response Shape using DecideNext Tactics:
   question loop, challenge, options, stress-test, recommendation reliability,
   and external calibration. Done when the next shape is `blocking pause`,
   `terminal convergence`, or `normal answer`.
5. **Respond** - render exactly one Response Shape. `blocking pause` stops and
   waits; `terminal convergence` summarizes settled decisions and open
   questions; `normal answer` handles lightweight responses.
   Response Shapes are: blocking pause, terminal convergence, or normal answer.

## Persistence

Durable knowledge persists only through project context docs. Do not create a
separate session journal, hidden local persistence directory, checkpoint file,
recovery cache, or quote log.

Project context persistence is a Context Persistence Adapter side effect after a
confirmed durable fact. Run it after `DecideNext` has a settled decision and
before `Respond` renders. It does not control the question loop. When local
brainstorming resolves a durable term, boundary, relationship, or ADR-worthy
decision, follow
`references/project-context-docs.md`.

## Choices

Use the same A/B/C option shape for terminal convergence and blocking pauses.
Use host-native structured choice UI only when the user's selection is required
before the next reasoning step is valid. The Session Orchestrator chooses the
Response Shape before the Choice Output Adapter renders it.

## Boundaries

This skill may discuss ideas, goals, constraints, success criteria, options,
trade-offs, rough concepts, outlines, diagrams in text, decision tables, and
summaries. It may inspect existing files or docs only when needed to ground the
conversation. It may update narrow project context docs according to
`references/project-context-docs.md`.

This skill must not create specs, implementation plans, scaffolds, commits, PRs,
roadmaps, dev servers, dependency installs, broad test runs, or code changes.
It must not invoke implementation, planning, design-production, writing-plans,
or release workflows. If the user asks to proceed into planning or
implementation, stop using this skill and treat that as a separate request.
