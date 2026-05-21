---
name: brainstorming-only
description: "Standalone brainstorming for shaping ideas, choices, product directions, workflows, designs, or technical approaches through collaborative discussion. Use when the user wants ideation, product diagnostics, builder-mode riffing, decision-tree questioning, premise challenge, structured option selection, trade-off analysis, or a decision summary without starting a spec, plan, commit, implementation, scaffold, code change, or downstream workflow."
---

# Brainstorming-Only

Use this skill to help the user think clearly before any downstream work exists. The output is discussion, options, decisions, and a concise summary. It is intentionally decoupled from implementation, planning, spec writing, commits, and any project-specific framework.

The skill should behave like a focused thinking partner: zoom out when the user is stuck in details, grill the decision tree one branch at a time, sharpen fuzzy language, generate genuinely different options, pressure-test them with concrete scenarios, then stop at a clean decision summary.

The skill can run in three postures:

- **General brainstorming** - clarify, compare options, stress-test trade-offs.
- **Product diagnostic** - use sharper product questions for startup, internal product, business, adoption, or "worth building?" ideas.
- **Builder mode** - riff on side projects, learning projects, open source, hackathons, demos, and creative tools.

<HARD-GATE>
Do not invoke implementation, planning, design-doc, commit, PR, scaffold, or code-editing workflows from this skill. Do not transition to `writing-plans` or any other follow-up skill. If the user later asks for implementation or planning, treat that as a separate request after this brainstorming session ends.
</HARD-GATE>

## Workflow

1. **Frame the topic**
   - Restate the user's goal in one or two sentences.
   - If the request is ambiguous, name the ambiguity directly.
   - If project context matters and is locally available, inspect only the minimum evidence needed to avoid guessing.
   - If the user starts from a local detail, zoom out first: name the actors, surfaces, constraints, existing alternatives, and what decision is actually being made.

2. **Choose the posture**
   - Use Product Diagnostic when the user mentions customers, revenue, adoption, internal stakeholders, a startup, a company idea, or whether something is worth building.
   - Use Builder Mode when the user is exploring a side project, hackathon, open source, learning, research, demo, toy, or creative tool.
   - Use General Brainstorming for strategy, naming, technical direction, workflow shape, design direction, or ambiguous early thinking.
   - If the posture choice would change the conversation and is not obvious, ask one structured choice question.

3. **Ask targeted questions**
   - Ask one question at a time when the answer will materially change the direction.
   - Walk the decision tree. Resolve upstream choices before downstream details.
   - For each non-trivial question, include your recommended answer and the reason.
   - Prefer multiple-choice questions when they reduce effort for the user.
   - Do not ask questions whose answer can be inferred from the user's request or local evidence.
   - If a question can be answered by inspecting local files or docs, inspect the narrow evidence instead of asking.
   - Smart-skip questions already answered by the user's prompt.
   - If the user is impatient, ask at most two critical remaining questions, then move to premise challenge and options.

4. **Challenge the premises**
   - Ask whether this is the right problem or if a simpler framing exists.
   - Ask what happens if nothing changes.
   - Separate the user's desired solution from the underlying job, pain, or decision.
   - For product ideas, separate interest from demand and named users from broad categories.
   - For builder ideas, separate the fun core from polish, infrastructure, and premature optimization.
   - For technical ideas, separate the caller-facing contract from the internal mechanism.
   - State the strongest 2-4 premises before options when the direction depends on them.

5. **Generate options**
   - Offer 2-3 distinct approaches, concepts, or directions.
   - Make the options meaningfully different, not cosmetic variants.
   - Lead with the recommended option when there is enough evidence to recommend one.
   - For each option, state the main upside, trade-off, and when it fits.
   - For non-trivial product or technical choices, include:
     - Minimal viable: smallest useful version.
     - Ideal long-term: best durable shape.
     - Creative/lateral: different framing or unexpected wedge.
   - For interface or workflow choices, compare the caller/user experience, what complexity is hidden, what becomes easy, and what becomes hard to misuse.

6. **Stress-test the options**
   - Check assumptions, failure modes, hidden complexity, audience fit, and constraints.
   - Use concrete scenarios and edge cases to expose vague or conflicting ideas.
   - Call out overloaded terms and propose one precise meaning before continuing.
   - If local evidence contradicts the user's stated model, surface the contradiction and ask which source should win.
   - Point out weak ideas plainly, but keep the tone constructive.
   - Remove ideas that do not serve the user's stated goal.

7. **Converge**
   - Summarize the strongest direction and the reason it wins.
   - Capture open questions separately from decisions.
   - End with a compact brainstorming outcome, not an implementation plan.

## Core Brainstorming Moves

Use these moves selectively. Do not run every move mechanically.

- **Zoom-out map:** When the user is deep in a detail, give a short map of the surrounding system, audience, workflow, concepts, or trade-off before asking for a choice.
- **Decision-tree grilling:** Ask one branch-resolving question at a time. The next question should depend on the last answer.
- **Recommended answer:** When asking a meaningful question, provide your default answer so the user can accept, reject, or correct it quickly.
- **Language sharpening:** Replace vague or overloaded words with precise terms. If two terms sound similar but imply different decisions, separate them.
- **Scenario probe:** Test an idea with a concrete example, edge case, or failure case instead of debating it abstractly.
- **Radical option split:** Force options to differ by strategy, constraint, user, architecture, or risk profile. Reject near-duplicates.
- **One-question prototype framing:** If the user wants to try something, identify the single question the prototype would answer, but do not build it in this skill.
- **Evidence over interrogation:** If local context can answer a question cheaply, inspect it. Ask the user only for judgments, preferences, constraints, or missing facts.

## Technical Brainstorming Lens

When the topic is a technical direction, API, module, workflow, or architecture choice, stay at design level and evaluate:

- **Who uses it:** callers, users, maintainers, operators, tests, or external systems.
- **What it must do:** key operations, invariants, ordering, errors, and compatibility constraints.
- **What it hides:** complexity that should sit behind the interface instead of leaking to callers.
- **Ease of correct use:** whether the common path is obvious and the dangerous path is hard to trigger accidentally.
- **Depth:** whether a small surface gives useful leverage, or whether the proposal is just a shallow wrapper.
- **Deletion test:** if removing the proposed unit would make complexity vanish, it may be unnecessary. If complexity would spread across many callers, the unit is probably earning its keep.
- **Over-generalization risk:** whether flexibility is solving a real near-term need or creating configuration burden.

## Host-Native Choice Protocol

When the workflow reaches a real user decision, prefer host-native structured choice UI over prose. Use it for posture selection, premise approval, approach selection, scope trade-offs, and any choice that changes the discussion direction. Do not use it for every lightweight clarification.

Before asking a structured choice, read `references/user-choice-output-protocol.md` and follow the host-specific format:

- Codex: use `request_user_input` when available.
- Claude Code / gstack-style hosts: use the real `AskUserQuestion` tool when available.
- Fallback: use the fixed A/B/C text block from the reference and stop.

Never invent Markdown, XML, comments, or hidden markers and claim they are native selectors.

## Product Diagnostic Posture

Use this when the user is testing a product, company, internal project, adoption question, monetization question, or "is this worth building?" idea.

Operating rules:

- Be specific. Broad categories like "developers", "SMBs", or "teams" are not enough.
- Treat behavior, money, repeated use, anger when it breaks, and workflow dependence as demand. Treat compliments and waitlists as weak evidence.
- The current workaround is the real competitor.
- Narrow early. The smallest valuable wedge is usually more useful than the platform vision.
- Push once when the first answer is vague, then move on. This skill is still brainstorming-only, not interrogation-only.

Question bank, asked one at a time and smart-skipped:

1. **Demand reality:** What is the strongest evidence someone actually wants this, beyond interest or signups?
2. **Status quo:** What do they do today to solve it, even badly, and what does that cost?
3. **Specific human:** Who needs it most, what is their role, and what consequence are they avoiding?
4. **Narrowest wedge:** What is the smallest version someone would pay for or politically sponsor soon?
5. **Observation:** Have you watched someone try this without helping them, and what surprised you?
6. **Future-fit:** If the world changes in three years, does this become more or less necessary?

Routing:

- Pre-product: favor demand reality, status quo, and specific human.
- Has users: favor status quo, narrowest wedge, and observation.
- Has paying customers or committed sponsors: favor narrowest wedge, observation, and future-fit.
- Pure workflow or engineering tool: favor status quo and narrowest wedge.

## Builder Mode Posture

Use this when the user is exploring for fun, learning, open source, research, demos, side projects, or hackathons.

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

Scale the response to the user's need:

- For light ideation, give a short list of ideas with a recommendation.
- For product or design direction, give options, trade-offs, and a recommended path.
- For technical direction, give architecture-level choices and risks, but do not write code or task plans.
- For naming, messaging, or content, give candidate sets and explain the selection criteria.
- For strategy, give decision frames, sequencing logic, and key bets.

When useful, close with:

```markdown
Brainstorming outcome:
- Recommended direction:
- Why:
- Decisions made:
- Open questions:
```

## Boundaries

This skill may:

- Discuss ideas, goals, constraints, and success criteria.
- Compare approaches and trade-offs.
- Produce rough concepts, outlines, diagrams in text, decision tables, or summaries.
- Inspect existing files or docs only when needed to ground the conversation.

This skill must not:

- Write or modify project files unless the user explicitly asks for a brainstorming artifact file.
- Create specs under `docs/`, commit files, open PRs, or update roadmaps.
- Invoke `writing-plans`, implementation skills, design-production skills, or release workflows.
- Start a dev server, scaffold a project, install dependencies, or run broad test suites.
- Treat user approval of an idea as approval to implement it.

## Interaction Rules

- Keep the conversation moving; do not over-question.
- Make assumptions explicit when proceeding without another question.
- Favor concrete examples over abstract advice.
- Separate "idea quality" from "execution plan." This skill evaluates the former and stops before the latter.
- If the user asks "what should we do next?", answer with conceptual next choices, not a task breakdown.
- If the user asks to proceed into planning or implementation, stop using this skill and handle that as a new workflow.
