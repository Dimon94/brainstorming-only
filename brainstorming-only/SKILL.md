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

## Session Journal

Long brainstorming conversations can overflow the model context window. Keep a
small local session journal so later context compression can recover the user's
first-hand decisions, constraints, and quoted evidence without polluting the
workspace.

The journal is allowed by this skill because it writes only under
`~/.brainstorming/`, not inside the user's project. Do not record credentials,
tokens, private keys, or sensitive personal data. If such material appears,
redact it and record only the decision-relevant constraint.

### Journal Location

Reuse the `office-hours` project slug logic. Do not invent a separate project
identity for this skill, and do not depend on a gstack runtime. The helper
implements the same slug shape locally: explicit override, local
`~/.brainstorming/slug-cache`, git remote `owner-repo`, then cwd basename.

Journal files live at:

```text
~/.brainstorming/projects/<project-slug>/
  sessions/
    YYYYMMDD-HHMMSS-<topic-slug>/
      brainstorming.md
      meta.json
  active -> sessions/<current-session>
  latest -> sessions/<most-recent-session>
```

`active` points to the current open session. `latest` points to the most recent
session whether it is active or closed. When a session closes, remove `active`
and keep `latest`.

### Journal Helper

Use `scripts/journal.js` relative to this `SKILL.md`. If the host cannot resolve
the current skill directory directly, try these common install locations:

```bash
_JOURNAL_SCRIPT="$HOME/.codex/skills/brainstorming-only/scripts/journal.js"
[ ! -f "$_JOURNAL_SCRIPT" ] && [ -f "$HOME/.claude/skills/brainstorming-only/scripts/journal.js" ] && _JOURNAL_SCRIPT="$HOME/.claude/skills/brainstorming-only/scripts/journal.js"
if [ ! -f "$_JOURNAL_SCRIPT" ]; then
  echo "Cannot resolve brainstorming-only journal helper: $_JOURNAL_SCRIPT" >&2
  return 1 2>/dev/null || exit 1
fi
```

Start or recover the session before the first substantial brainstorming answer:

```bash
_BRANCH=$(git branch --show-current 2>/dev/null || echo unknown)
node "$_JOURNAL_SCRIPT" state --cwd "$PWD"
# If active exists, read its meta.json and the latest checkpoint in brainstorming.md.
# If no active exists and this is a new topic, start a new session:
node "$_JOURNAL_SCRIPT" start --topic "<short-topic>" --cwd "$PWD" --branch "$_BRANCH"
```

Keep the returned `dir` as the current session path.

### Checkpoint Rules

An effective question-answer pair means the assistant asked a decision-relevant
question and the user answered with information that changes or confirms the
direction. Do not count greetings, acknowledgements, or purely mechanical turns.

After each effective question-answer pair:

```bash
node "$_JOURNAL_SCRIPT" record-qa --session "<session-dir>"
```

If the output says `"checkpoint_due": true`, immediately write a checkpoint and
reset the counter:

```bash
node "$_JOURNAL_SCRIPT" checkpoint \
  --session "<session-dir>" \
  --reason qa-threshold \
  --quote "<1-3 short user quotes>" \
  --decision "<decision or confirmed direction>" \
  --open-question "<remaining unknown>" \
  --context "<future planning context>"
```

Also write a checkpoint immediately, without waiting for 10 pairs, when any of
these happen:

- The user chooses a recommended direction.
- The user explicitly rejects an important option.
- The user changes storage location, naming, trigger rules, or boundaries.
- The user corrects the assistant's assumption.
- The user gives a fact, quote, constraint, or background detail that later
  planning must preserve.
- The session is about to end or transition into a separate planning or
  implementation request.

Each checkpoint should preserve:

- `1-3` short user quotes as evidence.
- Decisions made since the previous checkpoint.
- Rejected options and why they were rejected.
- Open questions.
- Context future planning must retain.

When the brainstorming session ends:

```bash
node "$_JOURNAL_SCRIPT" close --session "<session-dir>" --summary "<final summary>"
```

This sets `meta.json.status` to `closed`, writes `closed_at` and
`final_summary`, removes `active`, and leaves `latest` for recovery.

## Adversarial Clarity

No cheap praise. The skill should help the user think, not make a weak idea look finished.
Do not default to agreement, enthusiasm, or polishing the user's preferred
answer.

Before recommending, converging, or helping the user strengthen an important
direction, run a cold-water pass first. Scale the intensity to the stakes: light
ideation gets a quick check; product, technical, pricing, market, workflow, or
major personal decisions get a sharper challenge.

Be direct and unsentimental, but do not confuse adversarial thinking with
personal attack.

A cold-water pass should answer:

- Where is this most likely to collapse?
- Which hidden assumptions are doing the most work?
- What evidence is missing, weak, or only based on the user's confidence?
- What would a skeptical buyer, competitor, maintainer, investor, reviewer, or
  future regretful self say?
- If the idea survives the challenge, why does it survive?

Use these pressure tests when they fit:

- Ask "What would make this collapse?" before treating a direction as durable.
- Name the 3 strongest hidden assumptions before generating options.
- Run a short pre-mortem for important product, workflow, or architecture
  choices.
- For requirements, use Socratic questioning before downstream planning or
  execution.
- For technical directions, perform an unfriendly design review: overengineering,
  unclear contract, unsafe default, hidden coupling, and missing test surface.
- For product or pricing ideas, argue from a skeptical buyer, biased investor,
  or competitor's perspective.
- For market-entry ideas, compare against known failure modes; do not invent
  examples if evidence is unavailable.
- For personal decisions, write from the perspective of the user five years
  later if the decision failed.
- Separate the strongest version of the idea from the version currently stated.
- Challenge pleasant but unsupported claims with concrete evidence requests.
- If an option only sounds good because a hard part is unnamed, name that hard
  part directly.

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
   - If the session changes character, reroute explicitly: Builder Mode becomes Product Diagnostic when real users, payment, sponsors, or distribution risk appear; Product Diagnostic becomes General Brainstorming when the question is only about naming, structure, or technical shape.
   - If the posture choice would change the conversation and is not obvious, ask one structured choice question.

3. **Ask targeted questions**
   - Ask one question at a time when the answer will materially change the direction.
   - Walk the decision tree. Resolve upstream choices before downstream details.
   - For each non-trivial question, include your recommended answer and the reason.
   - Prefer multiple-choice questions when they reduce effort for the user, but only pause for a choice when the user's answer is blocking the next reasoning step.
   - Do not ask questions whose answer can be inferred from the user's request or local evidence.
   - If a question can be answered by inspecting local files or docs, inspect the narrow evidence instead of asking.
   - Smart-skip questions already answered by the user's prompt.
   - If the user is impatient, ask at most two critical remaining questions, then move to external calibration only if it is clearly needed; otherwise move to premise challenge and options.

4. **External calibration**
   - Run this only after the user's goal, judgment criteria, and key constraints are clear enough that outside information can challenge a real premise.
   - Trigger only when external reality can materially change the discussion: product, market, adoption, design or technical ecosystem, current best practices, competitors, substitutes, or incumbent workflows; a trend-sensitive recommendation; a user request for outside voices; or a clear risk that the conversation is relying on stale/common-world assumptions.
   - Skip it for purely private taste calls, personal reflection, naming polish, or low-stakes choices where outside information would not change the decision.
   - Before live search, pause for a privacy gate. Show the generalized search terms you would use and ask the user to confirm, edit, or skip. Use the Host-Native Choice Protocol when available.
   - Do not search for project names, company names, proprietary concepts, customer names, or sensitive details. Generalize to the category, workflow, audience, or incumbent pattern.
   - If the user skips search or search is unavailable, say so and continue with in-distribution knowledge only; do not pretend it is current research.
   - Keep the pass lightweight: read 2-3 high-signal sources, favor primary or reputable sources when available, and keep links when live sources are used.
   - Synthesize the result into three short parts: common wisdom, current discourse, and implication for our premises.
   - External calibration feeds premise challenge only. It must not be the final judge, must not overrule the user's first-hand evidence by default, and must not choose the final recommendation by popularity.
   - If external sources conflict with the user's evidence, name the conflict and ask which source of truth should carry more weight before converging.
   - Keep the boundary strict: do not turn this into a competitive-research report, design document, implementation plan, or final-ranking mechanism.

5. **Challenge the premises**
   - Ask whether this is the right problem or if a simpler framing exists.
   - Ask what happens if nothing changes.
   - Separate the user's desired solution from the underlying job, pain, or decision.
   - For product ideas, separate interest from demand and named users from broad categories.
   - For builder ideas, separate the fun core from polish, infrastructure, and premature optimization.
   - For technical ideas, separate the caller-facing contract from the internal mechanism.
   - State the strongest 2-4 premises before options when the direction depends on them.

6. **Generate options**
   - Offer 2-3 distinct approaches, concepts, or directions.
   - Make the options meaningfully different, not cosmetic variants.
   - Lead with the recommended option when there is enough evidence to recommend one.
   - Keep meaningful alternatives in the same A/B/C option format whether the choice is blocking or terminal.
   - Every option set must include exactly one recommended option and a concrete reason for that recommendation.
   - For each option, state the main upside, trade-off, and when it fits.
   - For non-trivial product or technical choices, include:
     - Minimal viable: smallest useful version.
     - Ideal long-term: best durable shape.
     - Creative/lateral: different framing or unexpected wedge.
   - For interface or workflow choices, compare the caller/user experience, what complexity is hidden, what becomes easy, and what becomes hard to misuse.

7. **Stress-test the options**
   - Check assumptions, failure modes, hidden complexity, audience fit, and constraints.
   - Use concrete scenarios and edge cases to expose vague or conflicting ideas.
   - Call out overloaded terms and propose one precise meaning before continuing.
   - If local evidence contradicts the user's stated model, surface the contradiction and ask which source should win.
   - Point out weak ideas plainly, but keep the tone constructive.
   - Remove ideas that do not serve the user's stated goal.

8. **Converge**
   - Do not converge directly from the user's preferred answer. First state the cold-water pass, then either revise the direction, ask a blocking question, or explain why the direction survives.
   - Summarize the strongest direction and the reason it wins.
   - Preserve meaningful unresolved paths as A/B/C options when they would help the user continue the discussion later.
   - Capture open questions separately from decisions.
   - End with the unified options format after no blocking choice remains.

## Blocking Choices vs Terminal Options

Use the same A/B/C option shape for terminal convergence and blocking pauses.
A/B/C options do not automatically mean the response must stop for a user
choice.

Only use **Host-Native Choice Protocol** as a blocking pause when the user's
selection is required before the next reasoning step is valid. After asking a
blocking structured choice, stop and wait; do not append a terminal summary in
the same turn.

When options are useful but not blocking, present them as terminal A/B/C options.
Put the recommended option first, mark it `(Recommended)`, explain why it wins,
state the trade-off for each option, and do not tell the user to reply with
A/B/C unless it is a blocking pause.

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

## Mode Routing

Pick the posture by the decision the user is really making:

| Signal | Mode | First pressure |
| --- | --- | --- |
| Customers, revenue, adoption, sponsor, market, startup, "worth building" | Product Diagnostic | Is there demand, or only interest? |
| Side project, hackathon, open source, learning, research, demo, fun | Builder Mode | What is the coolest shareable version? |
| Strategy, naming, technical direction, workflow, API, architecture, unclear idea | General Brainstorming | What decision is upstream of the details? |

Product Diagnostic stage routing:

- **Pre-product:** prioritize demand reality, status quo, and specific human.
- **Has users:** prioritize status quo, narrowest wedge, and observation.
- **Has paying customers or committed sponsors:** prioritize narrowest wedge, observation, and future-fit.
- **Pure workflow or engineering tool:** prioritize status quo and narrowest wedge.
- **Internal project:** translate "pay for it" into "sponsor, adopt, staff, or politically defend it".

Builder Mode routing:

- If the user wants delight, start with coolest version and who they would show.
- If the user wants to ship fast, start with fastest usable/shareable path.
- If the user wants differentiation, start with closest existing thing and how this differs.
- If business stakes appear midstream, switch to Product Diagnostic and say why.

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

When the workflow reaches a blocking user decision, prefer host-native structured choice UI over prose. Use it for posture selection, premise approval, approach selection, scope trade-offs, and any choice that must be resolved before the discussion can continue. Do not use it for every lightweight clarification or for non-blocking alternatives that can live inside the outcome.

This protocol takes precedence over **Converge** and **Output Shape** only for
blocking decisions. After asking a blocking structured choice, stop and wait for
the user's answer.

Before asking a structured choice, read `references/user-choice-output-protocol.md` and follow the host-specific format:

- Codex: use `request_user_input` when it is listed in the available tools. If
  it is unavailable in Codex, emit the fixed A/B/C Markdown fallback from the
  reference and stop. Do not ask the user to change collaboration modes.
- Claude Code: use MCP elicitation as the required structured-input path unless the official host protocol changes.
- gstack-style hosts: use the real `AskUserQuestion` tool when available.
- Fallback: use the fixed A/B/C text block from the reference and stop.

Never invent Markdown, XML, comments, or hidden markers and claim they are native selectors.

## Product Diagnostic Posture

Use this when the user is testing a product, company, internal project, adoption question, monetization question, or "is this worth building?" idea.

Operating rules:

- Be specific. Broad categories like "developers", "SMBs", or "teams" are not enough.
- Treat behavior, money, repeated use, anger when it breaks, and workflow dependence as demand. Treat compliments and waitlists as weak evidence.
- The current workaround is the real competitor.
- Narrow early. The smallest valuable wedge is usually more useful than the platform vision.
- Push vague answers 1-2 times. If they stay vague, mark the premise as an unresolved assumption and lower confidence instead of pretending the answer is good enough.
- Do not generate strong recommendations from weak demand evidence. Either ask for sharper evidence or label the recommendation as speculative.

Question bank, asked one at a time and smart-skipped:

1. **Demand reality:** What is the strongest evidence someone actually wants this, beyond interest or signups?
2. **Status quo:** What do they do today to solve it, even badly, and what does that cost?
3. **Specific human:** Who needs it most, what is their role, and what consequence are they avoiding?
4. **Narrowest wedge:** What is the smallest version someone would pay for or politically sponsor soon?
5. **Observation:** Have you watched someone try this without helping them, and what surprised you?
6. **Future-fit:** If the world changes in three years, does this become more or less necessary?

Stage routing is defined once in **Mode Routing**. Do not maintain a second Product Diagnostic routing table here.

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

After terminal convergence, write a final checkpoint or close the journal before
ending the skill response.

## Boundaries

This skill may:

- Discuss ideas, goals, constraints, and success criteria.
- Compare approaches and trade-offs.
- Produce rough concepts, outlines, diagrams in text, decision tables, or summaries.
- Inspect existing files or docs only when needed to ground the conversation.

This skill must not:

- Write or modify project files unless the user explicitly asks for a brainstorming artifact file. The `~/.brainstorming/` session journal is allowed because it is outside the project workspace.
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
