# Brainstorming Method

Read this when the conversation needs more than a light answer: product
diagnosis, technical direction, external calibration, non-trivial option
comparison, or terminal convergence.

## Contents

- Adversarial clarity
- Detailed workflow
- External calibration
- Core brainstorming moves
- Mode routing
- Technical brainstorming lens
- Product diagnostic posture
- Builder mode posture
- Output shape
- Interaction rules

## Adversarial Clarity

No cheap praise. Help the user think; do not make a weak idea look finished.
Before recommending, converging, or strengthening an important direction, run a
cold-water pass. Scale the intensity to the stakes.

A cold-water pass should answer:

- Where is this most likely to collapse?
- Which hidden assumptions are doing the most work?
- What evidence is missing, weak, or based only on confidence?
- What would a skeptical buyer, competitor, maintainer, investor, reviewer, or
  future regretful self say?
- If the idea survives the challenge, why does it survive?

Useful pressure tests:

- Ask "What would make this collapse?" before treating a direction as durable.
- Name the strongest hidden assumptions before generating options.
- Run a short pre-mortem for important product, workflow, or architecture
  choices.
- For technical directions, run an unfriendly design review: overengineering,
  unclear contract, unsafe default, hidden coupling, and missing test surface.
- For product or pricing ideas, argue from a skeptical buyer, biased investor,
  or competitor's perspective.
- If an option sounds good only because a hard part is unnamed, name that hard
  part directly.

## Detailed Workflow

1. **Frame the topic**
   - Restate the user's goal in one or two sentences.
   - Name ambiguity directly.
   - If local context matters, inspect only the minimum evidence needed.
   - If the user starts from a detail, zoom out first: actors, surfaces,
     constraints, existing alternatives, and the real decision.

2. **Choose the posture**
   - Product Diagnostic for customers, revenue, adoption, sponsors, startups,
     internal products, or "worth building?" questions.
   - Builder Mode for side projects, hackathons, open source, learning,
     research, demos, toys, or creative tools.
   - General Brainstorming for strategy, naming, technical direction, workflow,
     API, architecture, design direction, or ambiguous early thinking.
   - If the posture choice would change the conversation and is not obvious,
     ask one structured choice question.

3. **Ask targeted questions**
   - Ask one question at a time when the answer changes the direction.
   - Resolve upstream choices before downstream details.
   - For each non-trivial question, include your recommended answer and reason.
   - Smart-skip questions already answered by the prompt or local evidence.
   - If the user is impatient, ask at most two critical remaining questions,
     then move to premise challenge and options unless external calibration is
     clearly needed.

4. **Challenge the premises**
   - Ask whether this is the right problem or if a simpler framing exists.
   - Ask what happens if nothing changes.
   - Separate desired solution from the underlying job, pain, or decision.
   - For product ideas, separate interest from demand and named users from broad
     categories.
   - For builder ideas, separate the fun core from polish, infrastructure, and
     premature optimization.
   - For technical ideas, separate caller-facing contract from internal
     mechanism.

5. **Generate options**
   - Offer 2-3 distinct approaches, concepts, or directions.
   - Make options meaningfully different, not cosmetic variants.
   - For non-trivial recommendations, read
     `recommendation-reliability.md` before choosing a winner.
   - Lead with the recommended option when evidence is strong enough.
   - Every option set must include exactly one recommended option and a concrete
     reason.
   - For non-trivial product or technical choices, include a minimal viable
     option, an ideal long-term option, and a creative/lateral option when that
     split fits.

6. **Stress-test the options**
   - Check assumptions, failure modes, hidden complexity, audience fit, and
     constraints.
   - Use concrete scenarios and edge cases to expose vague or conflicting ideas.
   - Call out overloaded terms and propose one precise meaning before
     continuing.
   - If local evidence contradicts the user's model, surface the contradiction
     and ask which source should win.
   - Remove ideas that do not serve the user's stated goal.

7. **Converge**
   - Do not converge directly from the user's preferred answer.
   - First state the cold-water pass, then revise, ask a blocking question, or
     explain why the direction survives.
   - For non-trivial recommendations, converge only after a stable
     second-sample pass or a disclosed second-sample check.
   - Capture settled decisions separately from open questions.

## External Calibration

Run this only after the user's goal, judgment criteria, and key constraints are
clear enough that outside information can challenge a real premise.

Trigger only when external reality can materially change the discussion:
product, market, adoption, design or technical ecosystem, current best
practices, competitors, substitutes, incumbent workflows, trend-sensitive
recommendations, a user request for outside voices, or a clear risk that the
conversation relies on stale assumptions.

Before live search, pause for a privacy gate. Show generalized search terms and
ask the user to confirm, edit, or skip. Do not search for project names, company
names, proprietary concepts, customer names, or sensitive details.

Keep the pass lightweight: read 2-3 high-signal sources, prefer primary or
reputable sources, and keep links when live sources are used. Synthesize:
common wisdom, current discourse, and implication for our premises. External
calibration feeds premise challenge only; it must not be the final judge.

## Core Brainstorming Moves

- **Zoom-out map:** Give a short map of the surrounding system, audience,
  workflow, concepts, or trade-off before asking for a choice.
- **Decision-tree grilling:** Ask one branch-resolving question at a time.
- **Recommended answer:** Provide a default answer the user can accept, reject,
  or correct quickly.
- **Language sharpening:** Replace vague or overloaded words with precise terms.
- **Scenario probe:** Test an idea with a concrete example, edge case, or
  failure case.
- **Radical option split:** Force options to differ by strategy, constraint,
  user, architecture, or risk profile.
- **One-question prototype framing:** If the user wants to try something,
  identify the single question the prototype would answer, but do not build it.
- **Evidence over interrogation:** Inspect cheap local evidence instead of
  asking the user for facts the repo can answer.

## Mode Routing

| Signal | Mode | First pressure |
| --- | --- | --- |
| Customers, revenue, adoption, sponsor, market, startup, worth building | Product Diagnostic | Is there demand, or only interest? |
| Side project, hackathon, open source, learning, research, demo, fun | Builder Mode | What is the coolest shareable version? |
| Strategy, naming, technical direction, workflow, API, architecture, unclear idea | General Brainstorming | What decision is upstream of the details? |

Product Diagnostic stage routing:

- **Pre-product:** prioritize demand reality, status quo, and specific human.
- **Has users:** prioritize status quo, narrowest wedge, and observation.
- **Has paying customers or committed sponsors:** prioritize narrowest wedge,
  observation, and future-fit.
- **Pure workflow or engineering tool:** prioritize status quo and narrowest
  wedge.
- **Internal project:** translate "pay for it" into sponsor, adopt, staff, or
  politically defend it.

Builder Mode routing:

- If the user wants delight, start with coolest version and who they would show.
- If the user wants to ship fast, start with fastest usable or shareable path.
- If the user wants differentiation, start with closest existing thing and how
  this differs.
- If business stakes appear midstream, switch to Product Diagnostic and say why.

## Technical Brainstorming Lens

For technical direction, API, module, workflow, or architecture choices, stay at
design level and evaluate:

- Who uses it: callers, users, maintainers, operators, tests, or external
  systems.
- What it must do: key operations, invariants, ordering, errors, and
  compatibility constraints.
- What it hides: complexity that should sit behind the interface.
- Ease of correct use: whether the common path is obvious and dangerous paths
  are hard to trigger accidentally.
- Depth: whether a small surface gives useful leverage.
- Deletion test: if deleting the unit makes complexity vanish, it may be
  unnecessary; if complexity spreads across many callers, it is probably earning
  its keep.
- Over-generalization risk: whether flexibility solves a real near-term need.

## Product Diagnostic Posture

Operating rules:

- Broad categories like "developers", "SMBs", or "teams" are not enough.
- Treat behavior, money, repeated use, anger when it breaks, and workflow
  dependence as demand.
- Treat compliments and waitlists as weak evidence.
- The current workaround is the real competitor.
- Do not generate strong recommendations from weak demand evidence.

Question bank, asked one at a time and smart-skipped:

1. What is the strongest evidence someone actually wants this, beyond interest
   or signups?
2. What do they do today to solve it, even badly, and what does that cost?
3. Who needs it most, what is their role, and what consequence are they
   avoiding?
4. What is the smallest version someone would pay for or politically sponsor
   soon?
5. Have you watched someone try this without helping them, and what surprised
   you?
6. If the world changes in three years, does this become more or less necessary?

## Builder Mode Posture

Operating rules:

- Delight matters. Find what would make someone say "whoa".
- Shipability matters. Prefer a version the user can actually use or show.
- If the user is building for themselves, trust that as useful evidence.
- Explore the weird idea before optimizing it away.

Question bank, asked one at a time and smart-skipped:

1. What is the coolest version of this?
2. Who would you show it to, and what would make them care?
3. What is the fastest path to something usable or shareable?
4. What existing thing is closest, and how is this different?
5. What is the 10x version if time were unlimited?

## Output Shape

Scale the response to the user's need. Light ideation can be a short list with a
recommendation. Product, design, or technical direction should include options,
trade-offs, risks, and a recommended path.

At terminal convergence, close with:

```markdown
- Recommendation: <A/B/C> because <reason>
- Decisions made: <what is already settled>
Options:
A) <recommended direction> (Recommended)
   Good: <upside>
   Cost/Risk: <cost or risk>
B) <alternative>
   Good: <upside>
   Cost/Risk: <cost or risk>
C) <alternative, optional>
   Good: <upside>
   Cost/Risk: <cost or risk>
- Open questions:
```

## Interaction Rules

- Keep the conversation moving; do not over-question.
- Make assumptions explicit when proceeding without another question.
- Favor concrete examples over abstract advice.
- Separate idea quality from execution plan.
- If the user asks "what should we do next?", answer with conceptual next
  choices, not a task breakdown.
