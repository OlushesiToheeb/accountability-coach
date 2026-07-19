---
description: Autonomously implement a feature from a WIP plan
argument-hint: [plan-file-path-or-feature-name]
---

# Implement — Autonomous Multi-Phase Implementation

You are a senior full-stack engineer implementing a feature from a pre-approved plan. You work autonomously through ALL phases, committing tested code. You do not return to the user until all phases are complete.

## Rules

- **ONLY** implement from an approved WIP plan — never implement without a plan
- **ALWAYS** read COMMON-MISTAKES.md before starting
- **ALWAYS** read relevant CLAUDE.md conventions before writing code
- **ALWAYS** run tests, lint, and build after each phase
- **ALWAYS** run `skeptic-reviewer` for full code review after all phases are committed — fix CRITICAL/HIGH findings before moving to REVIEW
- **BUILD THE PR STACK LOCALLY** — one branch per row of the plan's PR Breakdown, each stacked on the row it Depends on. Keep every PR ≤20 files (never >30; tests & lockfiles excluded). One PR = one reviewable idea.
- **COMMIT** to the current PR's branch after each completed slice, with a descriptive message
- push to remote which pushes and open the whole stack
- **DO NOT** modify code outside the plan scope
- **DO NOT** skip tests
- **DO NOT** return to the user between phases — run everything to completion

## Process

### Step 1: Load the Plan

1. If a plan path or feature name is provided, find the matching plan
2. Otherwise, find the most recent WIP plan in `.claude/context/plans/`
3. If no WIP plan exists, tell the user to run `/plan` first

Read the plan thoroughly. Identify:
- All phases (or single phase if no phases)
- All todos per phase
- All files to create/modify
- Acceptance criteria
- **What to test for** per phase (if specified)
- **Done when** criteria per phase (if specified)
- **PR Breakdown** — the ordered PRs (PR 1, PR 2, …), their layer/scope, file budgets, and Depends-on chain. This drives the branch/PR structure below.

### Step 2: Pre-Implementation Setup

**Read in parallel:**
1. `.claude/context/COMMON-MISTAKES.md` — avoid known pitfalls
2. Relevant CLAUDE.md files:
   - `backend/CLAUDE.md` (if backend work)
   - `frontend/CLAUDE.md` (if frontend work)
   - `database-migration/CLAUDE.md` (if DB work)
3. Relevant mindmaps from `.claude/context/mindmaps/`
4. Existing code files that will be modified (understand current state)

**Set up the PR stack:**

Each row of the plan's **PR Breakdown** becomes its own branch and (later) its own PR. Don't create all the branches up front — create each as you reach it in the loop, based on the row it Depends on:

- **PR 1** (Depends on: —) branches off `develop`:
  ```bash
  git checkout develop && git checkout -b feature/[name]-1-[slice]
  ```
- **PR 2** (Depends on: PR 1) branches off PR 1's branch — this is what keeps PR 2's diff small:
  ```bash
  git checkout feature/[name]-1-[slice] && git checkout -b feature/[name]-2-[slice]
  ```
- …and so on up the stack. Independent rows (blank Depends-on) branch off `develop` directly.

Name branches `feature/[plan-branch]-[N]-[short-slice]` so the stack order is obvious.

**How stacked PRs work on GitHub (gh CLI, manual):** a PR's diff is shown relative to its *base* branch — so basing PR 2 on PR 1's branch means PR 2 displays only its own changes (a clean, small review). open PRs with `gh pr create --base <branch-below>`. PRs merge **bottom-up**: merge PR 1 into `develop`, retarget PR 2's base to `develop`, merge PR 2, and so on. If a lower PR gets review changes, rebase the branches above it onto the new commits ("restack") before they merge.

### Step 3: Execute the PR-Stack Loop

Walk the **PR Breakdown rows in order** (PR 1, then PR 2, …). For each PR row, first create its branch (stacked per Step 2), then run the loop below over the todos that belong to that PR (a PR maps to a phase or part of one). If the plan has no PR Breakdown, run the loop once per phase on a single branch.

For each PR row, execute this loop:

#### 3a. Execute Todos
Work through each todo in order:
- Before each step, read all files that will be modified
- Implement the change
- Follow conventions from CLAUDE.md
- Check COMMON-MISTAKES.md before writing patterns that have known pitfalls
- Mark each todo as done in the plan file as you complete it (`- [x]`)
- Add a brief note to the **Implementation Log** section
- For any UI work, use the `/frontend-design` skill
- **Guidance convention (recommended, not required):** For a phase that creates user-facing UI (buttons, forms, pages, controls) and warrants a tour, verify that:
  1. `data-guide` attributes are added to the key interactive elements
  2. A guided-tour flow (a `TourFlow`) is added to the module's file under `frontend/src/lib/tours/flows/<module>.ts` and surfaced via `frontend/src/lib/tours/registry.ts`
  Tours are frontend-only and stateless — no backend or saved progress. Not every feature needs one: skip for bug fixes, backend/API-only, or infrastructure. If the plan includes an "In-App Guidance" section, execute those todos in the relevant phase. See `frontend/CLAUDE.md` "In-App Guidance Convention" for the flow format.

#### 3b. Simplify
- Run `/simplify` to refine the code modified in this phase for clarity, consistency, and maintainability
- Preserves all functionality — only improves readability and structure

#### 3c. Write Tests
- Use the `/test-write` skill to write tests for the changes made in this phase
- Reference the plan's **What to test for** section for scope (if the phase specifies it)
- If tests aren't feasible for a step, document why in the Implementation Log
- Test the behavior added in this phase
- Focus on the happy path and critical edge cases

#### 3d. Run Tests & Verify
Run verification commands for the affected workspace(s):

**Backend (if applicable):**
```bash
cd backend && npm run test -- --run
cd backend && npm run lint
cd backend && npm run build
```

**Frontend (if applicable):**
```bash
cd frontend && npm run lint
cd frontend && npm run build
```

**Database (if applicable):**
- Verify migration syntax is correct (SQL parse check)

If any verification step fails:
1. Read the error carefully
2. Fix the issue
3. Re-run verification
4. Do NOT proceed to commit until all checks pass

#### 3e. Commit the PR
Commit to the current PR's branch — only the files for this PR (keep it ≤20):
```bash
git add [files for this PR]
git commit -m "feat: [plan-name] — PR [N]: [one reviewable idea]

- [Summary of what was implemented]
- [Summary of what was tested]"
```

Log "PR N — DONE YYYY-MM-DD (X files)" in the Implementation Log. If the slice crept over 20 files, stop and split it into two PR rows before continuing.

#### 3f. Proceed to the Next PR
- If more PR rows remain, create the next branch stacked on this one (per Step 2) and loop back to 3a.
- If all PR rows are done, continue to step 4.

### Step 4: Code Review

After ALL PRs are committed, run the `skeptic-reviewer` agent against all changed files across the full stack (the top branch vs `develop`).

```bash
git diff --name-only develop...HEAD
```

The skeptic runs a full code review: security, data integrity, standards compliance (against STANDARDS.md), code quality, cross-checks — and delivers a verdict.

**If verdict is REJECT or REQUEST CHANGES:** fix every CRITICAL and HIGH finding, re-run the skeptic to confirm, then commit the fixes:
```bash
git add [fixed files]
git commit -m "fix: code review findings — [summary of fixes]"
```

**If verdict is APPROVE WITH NOTES or APPROVE:** note any MEDIUM/LOW findings in the Implementation Log and proceed.

### Step 5: Post-Implementation

Before proceeding, confirm:
1. **Tests written and passing** — all phases have tests, all pass
2. **Code reviewed** — skeptic-reviewer passed (Step 4 complete)
3. **No orphaned files or unjustified edits** — every changed file is in the plan's Files to Create/Modify table. If any file was changed that isn't in the plan, justify it in the Implementation Log or revert it.

Then:
1. **Verify all acceptance criteria** in the plan are met
2. **Update plan status** — Change status from `WIP` to `REVIEW` in the plan file
3. **Add final summary** to the Implementation Log
4. **Rename plan file** — Change `WIP` to `REVIEW` in filename
5. **Final commit:**
```bash
git add .claude/context/plans/
git commit -m "chore: [plan-name] ready for review"
```

### Step 6: Summary

Present a summary to the user:
- What was implemented (per PR in the stack)
- The **PR stack**, bottom-up: branch name, one-line title, and file count for each PR row
- Tests passing, verification passed, commits made
- Code review result (verdict + any MEDIUM/LOW notes)
- Any issues encountered and how they were resolved

## Error Handling

- If a test fails and you can't fix it after 2 attempts, document the failure in the plan's Implementation Log and continue
- If lint/build fails, fix it before committing
- If you discover the plan is incomplete or wrong, update the plan file with notes and ask the user for guidance
- Never force or skip checks to get past errors
