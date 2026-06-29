---
name: brainstorming-only
description: "Brainstorming-only for standalone ideation and decision shaping without implementation. Use when the user asks for brainstorming, product diagnostics, builder-mode exploration, premise challenge, trade-off comparison, structured option selection, or a pre-spec decision summary."
---

# Brainstorming-Only

## Quick Start

Use this skill when the user needs thinking before downstream work exists.
The output is discussion, options, decisions, and a concise summary.

Start by restating the decision being made, then choose one posture:

- **General brainstorming** - strategy, naming, technical direction, workflow,
  API, architecture, design direction, or ambiguous early thinking.
- **Product diagnostic** - customers, revenue, adoption, sponsors, startup
  ideas, internal products, or "worth building?" questions.
- **Builder mode** - side projects, hackathons, open source, learning,
  research, demos, toys, or creative tools.

Run the question loop, not a one-question preface. Ask exactly one
branch-resolving question, include your recommended answer, then stop and wait.
After the user answers, ask the next unresolved branch question or converge only
when no blocking branch remains. Local evidence can smart-skip factual
questions, but cannot skip user-owned product or scope decisions.

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

1. **Frame** - name the goal, actors, constraints, and upstream decision. Done
   when the current decision can be stated in one sentence.
2. **Route** - choose General, Product Diagnostic, or Builder Mode. Done when
   the active posture and reason are explicit.
3. **Ground** - inspect only local evidence and project context docs that can
   answer factual blockers. Done when factual blockers are answered or left as
   user-owned choices.
4. **Question Loop** - ask one branch-resolving question with your recommended
   answer, then stop. Done across turns when no blocking product, scope, or
   contract choice remains.
5. **Challenge** - run a cold-water pass before validating or recommending an
   important direction. Done when the strongest failure mode or hidden
   assumption is named.
6. **Options** - generate 2-3 genuinely different options, with exactly one
   recommended option when enough evidence exists. Done when the options differ
   by strategy, constraint, user, architecture, or risk profile.
7. **Stress-test** - use concrete scenarios, edge cases, hidden assumptions, and
   local contradictions. Done when conflicts that could change the
   recommendation are surfaced.
8. **Converge** - summarize only after the question loop is closed. Done when
   settled decisions and open questions are clear, with no implementation order,
   task breakdown, or "next fix first" language.

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
