---
description: Turn a spec into a phased, doc-grounded implementation plan.
---

# /planner — plan the implementation

You are turning a spec (from `/interview`, in `docs/specs/`) into an implementation plan for
this monorepo (`backend/` NestJS, `app/` Expo, `database/` Prisma).

**Goal:** a plan an engineer (or `/implement`) can execute step by step. Not code.

## Steps

1. **Read the spec** and the technical architecture (`docs/09`). Respect the invariants:
   the Outbound Governor is the only path to the user (§6); the state machine is a pure,
   tested function (§4); the corpus logging ships even when the feature is thin (§7).
2. **Decompose** into ordered, individually-shippable steps. For each step:
   - Files to create/change (path-level), across `database/` → `backend/` → `app/`
   - The data-model or migration delta, if any
   - How it's verified (endpoint call, screen interaction, unit test)
3. **Sequence** so each step is demoable and the risky/uncertain parts come first.
4. **Call out** risks, decisions needed, and anything that touches safety (doc 03 §5) or the
   governor (doc 02 §6) — those get extra scrutiny.
5. **Write the plan** to `docs/plans/<feature>.md` and stop. Hand off to `/implement`.

Prefer the smallest plan that delivers the spec. Flag any step you'd want to spike first.
