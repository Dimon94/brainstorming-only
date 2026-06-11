---
name: brainstorming-only
description: "Facilitates standalone brainstorming for shaping ideas, product directions, workflows, designs, and technical choices without starting implementation. Use when the user asks for ideation, product diagnostics, builder-mode riffing, decision-tree questioning, premise challenge, trade-off analysis, structured option selection, or a decision summary before specs, plans, scaffolds, commits, PRs, or code changes."
---

# Brainstorming-Only

## Quick Start

Use this skill to help the user think clearly before downstream work exists.
The output is discussion, options, decisions, and a concise summary.

Start by restating the decision being made, then choose one posture:

- **General brainstorming** - strategy, naming, technical direction, workflow,
  API, architecture, design direction, or ambiguous early thinking.
- **Product diagnostic** - customers, revenue, adoption, sponsors, startup
  ideas, internal products, or "worth building?" questions.
- **Builder mode** - side projects, hackathons, open source, learning,
  research, demos, toys, or creative tools.

Ask one decision-relevant question at a time. For meaningful questions, provide
your recommended answer so the user can accept, reject, or correct it quickly.
If local files can answer a question, inspect the narrow evidence instead of
asking.

## Load References

Load only the reference needed for the current turn:

- `references/brainstorming-method.md` - detailed workflow, adversarial
  clarity, posture routing, external calibration, question banks, technical
  lens, and terminal output shape.
- `references/project-context-docs.md` - local project glossary/ADR persistence.
  Read before the first substantial answer when project context docs exist or
  when the discussion may resolve durable project language.
- `references/recommendation-reliability.md` - required before non-trivial
  recommendations that affect hard-to-reverse choices.
- `references/user-choice-output-protocol.md` - required before a blocking
  structured choice.

## Core Workflow

1. **Frame** - name the goal, actors, constraints, and upstream decision.
2. **Route** - choose General, Product Diagnostic, or Builder Mode.
3. **Ground** - inspect relevant local evidence and project context docs when
   they exist.
4. **Question** - ask only branch-resolving questions; smart-skip what is
   already answered.
5. **Challenge** - run a cold-water pass before validating or recommending an
   important direction.
6. **Options** - generate 2-3 genuinely different options, with exactly one
   recommended option when enough evidence exists.
7. **Stress-test** - use concrete scenarios, edge cases, hidden assumptions, and
   local contradictions.
8. **Converge** - summarize the strongest direction, settled decisions, open
   questions, and A/B/C options.

## Persistence

Durable knowledge persists only through project context docs. Do not create a
separate session journal, hidden local persistence directory, checkpoint file,
recovery cache, or quote log.

When local project brainstorming resolves a durable term, boundary,
relationship, or ADR-worthy decision, follow
`references/project-context-docs.md`.

## Choices

Use the same A/B/C option shape for terminal convergence and blocking pauses.
Use host-native structured choice UI only when the user's selection is required
before the next reasoning step is valid. Before doing that, read
`references/user-choice-output-protocol.md`.

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
