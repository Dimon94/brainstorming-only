# Recommendation Reliability

Use this reference before making a non-trivial recommendation in a
brainstorming session. The goal is to reduce decision noise without exposing
raw chain-of-thought or turning the response into a meeting transcript.

This is a DecideNext Tactic, not a workflow state. It returns a recommendation
confidence signal or a blocking-question need to the Session Orchestrator; the
orchestrator still chooses the Response Shape.

## Trigger

A recommendation is non-trivial when a wrong answer would materially affect:

- architecture boundaries, API contracts, data models, or long-term maintenance;
- product direction, positioning, pricing, adoption, or user workflow;
- team process, project governance, migration cost, or hard-to-reverse choices;
- a decision with weak evidence but meaningful downstream consequences.

Skip this check for naming polish, lightweight ideation, low-risk preferences,
or obvious local choices where a second pass would not change the outcome.

## Second-Sample Pass

Before converging on a non-trivial recommendation, run an internal
`second-sample pass`:

1. State the first recommendation internally.
2. Re-evaluate the decision from a different named perspective, such as a
   skeptical buyer, target user, future maintainer, caller, operator,
   competitor, reviewer, or budget owner.
3. Compare the second result against the first recommendation.
4. Decide whether to keep the recommendation, change it, lower confidence, or
   ask a blocking question.

Do not reveal raw chain-of-thought. Expose only a decision trace summary when it
changes what the user needs to know.

## Output Rule

If the second-sample pass is stable, hide the check and output only the final
recommendation with a concise reason.

If the second-sample pass is unstable, include a short `second-sample check`:

```text
second-sample check:
- First recommendation: <A/B/C>
- Second-sample result: <changed recommendation or lower confidence>
- Disagreement source: <assumption, constraint, evidence gap, or risk>
- Final move: <change recommendation, keep but lower confidence, or ask a blocking question>
```

Also show the check for high-impact decisions when the user needs a confidence
source, but keep it to decision nodes rather than hidden reasoning.

## Decision Roundtable

For high-complexity non-trivial recommendations, upgrade the second-sample pass
to a `Decision Roundtable`. This is an escalation mechanism, not a fourth
brainstorming posture.

Upgrade when at least two complexity signals are present, or when the user
explicitly asks for a roundtable, subAgent, multi-expert, or independent-view
analysis:

- high impact on architecture, product direction, user workflow, or governance;
- hard to reverse after adoption;
- conflicting perspectives between callers, maintainers, users, operators,
  security, performance, business, or migration needs;
- weak evidence with high downstream consequence;
- external reality or ecosystem best practice could materially change the
  recommendation.

Use 3 independent perspectives by default and at most 5. Pick perspectives for
the specific problem rather than using a fixed expert list. For architecture
questions, useful defaults are:

- Caller/User Contract: caller experience, interface boundaries, misuse risk;
- Future Maintainer: complexity, readability, migration, and test surface;
- Reliability/Operations: performance, failure modes, observability, recovery.

Each perspective must independently produce a recommendation, not just a
comment. The main assistant acts as judge: compare assumptions, risks, evidence
quality, reversibility, and local constraints. Do not decide by vote; a minority
view can overturn the majority when it identifies a serious irreversible risk.

## Roundtable Output

If the roundtable is stable, hide the roundtable and output only the final
recommendation with a concise reason.

If disagreement affects the final recommendation, include a compressed
`roundtable check`:

```text
roundtable check:
- Agreement: <which perspectives aligned>
- Disagreement: <which perspective objected and why>
- Final move: <change recommendation, keep but lower confidence, or ask a blocking question>
```

Only expand each perspective into 3-5 bullets when the user explicitly asks to
see the roundtable.

## External Calibration Seat

External calibration is an optional roundtable seat, not a default seat.

Use it only when external reality can materially affect the decision or when the
user explicitly asks for outside guidance. Before live search, use the External
calibration privacy gate from `SKILL.md`: show generalized search terms and ask
the user to confirm, edit, or skip. Do not search for project names, company
names, proprietary concepts, customer names, or sensitive details.

The external seat does not vote. It answers:

- Common practice: what mature users or ecosystems commonly do;
- Current caution: what recent or real-world failure modes matter;
- Implication: what this means for the current recommendation.

If external advice conflicts with local evidence or the user's first-hand
experience, name the conflict and ask which source of truth should carry more
weight before converging.
