# Plan: [Feature Name]

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Owner** | [Name] |
| **Task** | [Notion URL or description] |
| **Branch** | `feature/[branch-name]` |
| **Status** | WIP / REVIEW / DONE |

---

## Problem Statement

_What problem does this feature solve? Who is affected?_

## Proposed Solution

_High-level description of the solution approach._

## Expected Outcomes

- [ ] _Outcome 1_
- [ ] _Outcome 2_

## Key Decisions

_Core technical artifacts and major changes — one bullet per item, pairing the artifact with a one-line reason. Write in plain stakeholder language: this section is part of the brief (the top four sections) and should read clearly in a 5-minute meeting. If the plan touches more than 10 files, put the anti-bloat justification for the broad footprint here so reviewers see it in the brief._

- _Artifact / decision 1 — one-line reason_
- _Artifact / decision 2 — one-line reason_

---

## Todos

### Phase 1: [Phase Name] _(optional — use phases only if >10 todos OR >10 files)_

- [ ] _Todo 1_
- [ ] _Todo 2_
- [ ] _Todo 3_

**What to test for:** _Describe the test coverage scope for this phase — what behaviors, edge cases, and integrations should be tested._

**Done when:** _Measurable criteria that confirm this phase is complete (e.g., "API returns correct response for all status types", "Component renders all states")._

### Phase 2: [Phase Name] _(if needed, max 3 phases)_

- [ ] _Todo 1_
- [ ] _Todo 2_

**What to test for:** _Test scope for this phase._

**Done when:** _Completion criteria for this phase._

### In-App Guidance _(required for features with user-facing UI)_

- [ ] Add `data-guide` attributes to key interactive elements introduced in this feature
- [ ] Add guidance registry entries to `frontend/src/lib/guidance/registry.ts` (hints for new features)
- [ ] Add matching entries to `backend/src/modules/guidance/guidance-registry.ts` (for assistant search)
- [ ] If applicable, define walkthrough steps for onboarding flows

**Done when:** Every new user-facing interactive element has a `data-guide` attribute and a corresponding registry entry. Backend registry is in sync with frontend registry.

---

## PR Breakdown

_How this feature ships: one PR = one reviewable idea. Order the rows so each builds on the one before._

_Depends on: a chain (PR 1 → PR 2 → PR 3) means the PRs **stack** — each branch is based on the one below (`gh pr create --base <branch-below>`), merged bottom-up into `develop`. Blank = independent, opened in parallel._

| PR | Title (one idea, no "and") | Layer / scope | Files (est.) | Depends on | Tests in-PR |
|----|----------------------------|---------------|--------------|------------|-------------|
| 1 | _e.g. Expand migration: add X column_ | database-migration | 1–2 | — | n/a (schema) |
| 2 | _e.g. Backend service for X (behind flag)_ | backend | 6–10 | PR 1 | Jest |
| 3 | _e.g. Frontend data layer + keystone UI_ | frontend | 5–12 | PR 2 | Vitest |

---

## Acceptance Criteria

- [ ] _Criterion 1_
- [ ] _Criterion 2_
- [ ] _All tests pass_
- [ ] _Lint + build pass in affected workspaces_
- [ ] _Guidance registry entries added for new user-facing features (if applicable)_

---

## Proposed Approach

_Detailed technical approach. Reference specific files, modules, patterns._

### Files to Create

| File | Purpose |
|------|---------|
| `path/to/file.ts` | _Description_ |

### Files to Modify

| File | Changes |
|------|---------|
| `path/to/file.ts` | _Description of changes_ |

---

## Assumptions

- _Assumption 1_
- _Assumption 2_

## Notes

- _Any additional context, references, or constraints_

---

## Implementation Log

_Updated during implementation. Track progress, decisions, and blockers._

| Timestamp | Entry |
|-----------|-------|
| _YYYY-MM-DD HH:MM_ | _What was done / decided / blocked_ |
