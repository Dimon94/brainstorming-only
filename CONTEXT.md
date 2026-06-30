# Context

## Glossary

- **Project Context Persistence**: The side-effect step that records an already-resolved durable term, relationship, or ADR-worthy decision into project-owned context docs. It accepts confirmed facts only, not candidate facts. Its output reports persisted, offered, skipped, or failed; only failure blocks the brainstorming session. It does not decide whether the brainstorming session continues, and it does not defer confirmed inline updates to the end of the session.
- **Choice Output Adapter**: The host-specific rendering module for already-decided brainstorming choices. It renders blocking pauses or terminal options for Codex, Claude, gstack-style hosts, or fallback text, but does not decide posture, recommendation reliability, or whether the session should stop or continue.
- **Choice Packet Input**: The already-prepared choice payload passed to the Choice Output Adapter. It contains the question, stakes, mutually exclusive options, recommendation, optional Reliability Note, and blocking-or-terminal intent that upstream brainstorming flow has already settled.
- **Choice Packet Validation**: The fail-closed completeness check performed by the Choice Output Adapter before rendering. It may reject an incomplete Choice Packet Input, but it must not invent missing recommendations, infer blocking intent, or run recommendation reliability.
- **Choice Packet Intent**: The explicit upstream decision that tells the Choice Output Adapter whether the same A/B/C option shape is being rendered as a blocking pause or as terminal convergence.
- **Reliability Note**: The optional visible summary of an unstable second-sample check or roundtable check. Upstream recommendation reliability decides whether the note exists; the Choice Output Adapter only renders it when it is present in the Choice Packet Input.
- **Choice Host Selection**: The Choice Output Adapter's rendering-environment decision. It selects the available host renderer, such as Codex native input, Claude MCP elicitation, gstack-style tooling, or fallback text, without changing the Choice Packet Intent.
