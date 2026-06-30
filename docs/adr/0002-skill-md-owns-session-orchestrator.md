# SKILL.md owns the Session Orchestrator

The `brainstorming-only` skill uses `SKILL.md` as the single Session
Orchestrator. It owns the five-state Session State Machine
(`Frame -> Route -> Ground -> DecideNext -> Respond`), while reference files
provide tactics, output adapters, or persistence rules behind that interface.
We chose this over making `brainstorming-method.md` or a new reference file own
the flow because the runtime entry point is what the agent sees first; splitting
control across references caused posture, recommendation, and choice-output
branches to compete for the next step.

## Considered Options

- `SKILL.md` owns the Session Orchestrator.
- `brainstorming-method.md` owns the flow.
- A new `references/session-orchestrator.md` owns the flow.

## Consequences

- Reference files must not decide workflow state transitions.
- Challenge, options, stress-test, recommendation reliability, and external
  calibration are `DecideNext` tactics, not workflow states.
- Choice output renders an already-decided Response Shape; it does not decide
  whether the session stops or continues.
