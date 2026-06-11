# Project Context Docs

Read this when brainstorming is tied to a local project and may resolve durable
terms, boundaries, relationships, or hard-to-reverse decisions.

## Contents

- Persistence boundary
- Finding context docs
- Lazy file creation
- During the session
- `CONTEXT.md` format
- ADR rules and format

## Persistence Boundary

Durable knowledge persists only through project-owned context docs:

- `CONTEXT.md` for glossary terms, domain boundaries, and relationships.
- Existing `CONTEXT-MAP.md` for repos that already have multiple contexts.
- `docs/adr/*.md` for sparse architecture decision records.

Do not create a separate session journal, hidden local persistence directory,
checkpoint file, recovery cache, quote log, or `~/.brainstorming` data.

## Finding Context Docs

Before the first substantial answer, inspect only narrow files relevant to the
topic:

- If `CONTEXT-MAP.md` exists at the project root, read it first. Then read only
  relevant context `CONTEXT.md` files and applicable `docs/adr/*.md` files.
- If no `CONTEXT-MAP.md` exists but root `CONTEXT.md` exists, treat the project
  as a single context and read that file plus applicable `docs/adr/*.md` files.
- If neither exists, continue normally. Do not mention `CONTEXT-MAP.md` and do
  not suggest creating it.

## Lazy File Creation

Create files only when there is something durable to write:

- If no `CONTEXT.md` exists, create one when the first domain term, boundary, or
  relationship is resolved.
- If no `docs/adr/` exists, create it only when the first ADR-worthy decision is
  reached.
- Do not create or suggest `CONTEXT-MAP.md` when the project does not already
  have one. If it exists, update it only when a new context or relationship is
  explicitly confirmed.

## During The Session

- Challenge user language against existing `CONTEXT.md` terms. If the glossary
  defines a term one way and the user seems to mean another, call out the
  conflict immediately and ask which meaning should win.
- Sharpen vague language by proposing a precise canonical term before
  continuing.
- Use concrete scenarios and edge cases when domain relationships are fuzzy.
- Cross-reference with code when the user states how something works. If code
  and conversation contradict each other, surface the contradiction and ask
  which source is authoritative.
- When a term is resolved, update the applicable `CONTEXT.md` inline instead of
  batching updates for the end of the session.

## `CONTEXT.md` Format

`CONTEXT.md` is a glossary only. It must not contain implementation detail,
scratch notes, task prose, specs, plans, or memory dumps.

Prefer the existing local format. If creating a new file, use:

```markdown
# Context

## Glossary

- **Term**: Definition in business/domain language. Include the boundary when it
  prevents confusion with nearby terms.
```

Good entry:

```markdown
- **Sponsor**: The person who can fund, staff, or politically defend an internal
  project. A sponsor is not necessarily the daily user.
```

Bad entry:

```markdown
- **Sponsor**: Stored in the `users.sponsor_id` column and handled by
  `SponsorService`.
```

## ADR Rules And Format

Offer an ADR only when all three are true:

1. **Hard to reverse** - changing the decision later has meaningful cost.
2. **Surprising without context** - a future reader will wonder why this path
   was chosen.
3. **Real trade-off** - there were genuine alternatives and one was selected for
   specific reasons.

If any condition is missing, skip the ADR.

Number ADRs sequentially under `docs/adr/`. Prefer the existing local format. If
creating the first ADR, use:

```markdown
# 0001-short-title

## Status

Accepted

## Context

What pressure or constraint forced this decision?

## Decision

What did we choose?

## Consequences

What becomes easier, harder, or intentionally out of scope?
```
