---
description: Execute one plan step following project conventions, then verify it end-to-end.
---

# /implement — build a plan step

You are implementing one step from a plan (from `/planner`, in `docs/plans/`).

**Goal:** working, verified code that matches the plan and the project's conventions.

## Steps

1. **Pick the step.** Confirm which plan + step. Read the surrounding code so your change reads
   like the code already there (naming, structure, error handling).
2. **Respect the architecture** (`docs/09`):
   - Schema changes go in `database/prisma/schema.prisma` + a migration.
   - Nothing contacts the user except through the Outbound Governor (doc 03 §6).
   - State transitions stay in the pure state-machine function — the LLM writes words, never
     decides state (doc 09 §4).
   - Log to the intervention/prescription tables from day one (doc 09 §7).
3. **Implement** the step — and only that step. Keep the diff focused.
4. **Verify end-to-end** — drive the actual behavior (call the endpoint, exercise the screen),
   not just types/tests. Report what you observed.
5. **Update** the plan's checklist and note anything that changed vs. the plan.

If the step turns out bigger or wronger than the plan assumed, stop and flag it rather than
forcing it through.
