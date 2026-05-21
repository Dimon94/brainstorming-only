---
name: brainstorming-only
description: "Standalone brainstorming for shaping ideas, choices, product directions, workflows, designs, or technical approaches through collaborative discussion. Use when the user wants ideation, clarification, alternatives, trade-off analysis, or a decision summary without starting a spec, plan, commit, implementation, scaffold, code change, or downstream workflow."
---

# Brainstorming-Only

Use this skill to help the user think clearly before any downstream work exists. The output is discussion, options, decisions, and a concise summary. It is intentionally decoupled from implementation, planning, spec writing, and commits.

<HARD-GATE>
Do not invoke implementation, planning, design-doc, commit, PR, scaffold, or code-editing workflows from this skill. Do not transition to `writing-plans` or any other follow-up skill. If the user later asks for implementation or planning, treat that as a separate request after this brainstorming session ends.
</HARD-GATE>

## Workflow

1. **Frame the topic**
   - Restate the user's goal in one or two sentences.
   - If the request is ambiguous, name the ambiguity directly.
   - If project context matters and is locally available, inspect only the minimum evidence needed to avoid guessing.

2. **Ask targeted questions**
   - Ask one question at a time when the answer will materially change the direction.
   - Prefer multiple-choice questions when they reduce effort for the user.
   - Do not ask questions whose answer can be inferred from the user's request or local evidence.

3. **Generate options**
   - Offer 2-3 distinct approaches, concepts, or directions.
   - Lead with the recommended option when there is enough evidence to recommend one.
   - For each option, state the main upside, trade-off, and when it fits.

4. **Stress-test the options**
   - Check assumptions, failure modes, hidden complexity, audience fit, and constraints.
   - Point out weak ideas plainly, but keep the tone constructive.
   - Remove ideas that do not serve the user's stated goal.

5. **Converge**
   - Summarize the strongest direction and the reason it wins.
   - Capture open questions separately from decisions.
   - End with a compact brainstorming outcome, not an implementation plan.

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
