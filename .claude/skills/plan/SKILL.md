---
description: Create a structured implementation plan for a feature
argument-hint: [feature-description-or-requirements-summary]
---

# Plan — Structured Feature Planning

You are a senior software architect creating a detailed implementation plan for a feature in the Seamless project.

## Rules

- **DO NOT** write implementation code — this skill is ONLY for planning
- **DO** read code, search the codebase, and understand existing patterns thoroughly
- **DO** fill out every field in the plan template
- **DO** save the plan to `.claude/context/plans/`
- **DO** write the four top sections (Problem Statement, Proposed Solution, Expected Outcomes, Key Decisions) in plain language — "explain to a child" simplicity
- **DO** aim for a rubric score of 4–5. A score of 3 means the plan is basic — challenge the user with what information and questions are needed to push it to make it a 4-5
- Plans require user approval before implementation begins

## Process

### Step 1: Gather Context (Parallel)

Spin up parallel agents to gather all necessary context not already provided from the interview phase:

**Agent 1: Read Conventions**
- Read `backend/CLAUDE.md` (if backend work)
- Read `frontend/CLAUDE.md` (if frontend work)
- Read `database-migration/CLAUDE.md` (if DB work)

**Agent 2: Read Mindmaps**
- Read `.claude/context/mindmaps/overview.md` (always)
- Read relevant domain mindmaps (frontend.md, backend.md, api.md, data.md, etc.)

**Agent 3: Check Existing Work**
- Check `.claude/context/plans/` for related WIP plans
- Search codebase for similar implementations

**Agent 4: Understand Data Model**
- Read relevant entities/models
- Check migration files for schema context
- Understand API response formats for affected endpoints

### Step 3: Analyze Scope

Based on gathered context:
1. Identify all files that need to be created or modified
2. Identify all tests that need to be written
3. Estimate total todos

**Budget Check:**
- All plans must fit within a 3-week execution window. If the plan exceeds this budget, do not proceed. Ask the author to rescope, phase into an MVP + follow-up, or cut scope.
- A plan must not exceed 3 phases. If it needs more, split into separate plans.

**Phase Decision:**
- If **>10 todos** OR **>10 files** → break into phases (max 3)
- Each phase should be independently testable and committable
- Phase 1 should be the foundation (data model, core logic)
- Phase 2 should be the integration (API endpoints, UI)
- Phase 3 should be polish (edge cases, optimizations)
- Each phase should have a **What to test for** section specifying test coverage scope
- Each phase should have a **Done when** criteria so progress is measurable
- Phases are NOT stopping points — `/implement` will run all phases autonomously, committing each one

**PR Sizing & Breakdown (decompose by PR, not just by phase):**
- The unit of *review* is the PR, not the phase. Every plan MUST include a **PR Breakdown** (see the template): an ordered list — PR 1, PR 2, … — that together deliver the feature. This is how "one PR = one reviewable idea" gets planned up front.
- **Each PR targets ≤20 files.** 21–30 files needs a one-line "why it couldn't be split" in that row; **never exceed 30**. Tests and lockfiles don't count toward the limit.
- If any PR would exceed 20 files, split it: by layer (migration → backend → API → frontend → reveal), by capability (feature A vs feature B), or primitive-then-rollout (ship the util/type/rule, then apply per-module, enforce last).
- Tests ship **inside** the PR they cover; refactors are their **own** PR; no grab-bag PRs.
- Fill the **Depends on** column: a chain (`PR 1 → PR 2 → PR 3`) means the PRs **stack** (each branch based on the one below, merged bottom-up into `develop`); a blank means they're independent and open in parallel.
- A phase may map to one or more PRs. If a single PR genuinely can't be justified under 30 files, put the reason in Key Decisions and challenge the author to reduce the footprint before proceeding.

**Guidance Check (recommended for features with user-facing UI):**
- If the feature introduces new user-facing interactive elements (buttons, forms, pages, controls), the plan SHOULD include an "In-App Guidance" section with todos for:
  1. Adding `data-guide` attributes to the key interactive elements
  2. Adding a guided-tour flow (a `TourFlow`) to the module's file under `frontend/src/lib/tours/flows/<module>.ts`, surfaced via `frontend/src/lib/tours/registry.ts`
- A tour is **recommended, not required** — judge by the feature. Skip it for bug fixes, backend/API-only, or infrastructure work, and mark the guidance section N/A.
- Tours are **frontend-only and stateless** (react-joyride; no backend, no saved progress). Reference `frontend/CLAUDE.md` "In-App Guidance Convention" for the flow format.

### Step 4: Fill Plan Template

Read the template from `.claude/context/templates/plan-template.md` and fill every field :

- **Date**: Today's date
- **Owner**: Default to the account owner's name. Ask the user only if unclear.
- **Task**: Seamless URL or feature description
- **Branch Name**: Generate from feature name (`feature/[kebab-case-name]`)
- **Status**: WIP
- **Problem Statement**: What and why
- **Proposed Solution**: High-level approach
- **Expected Outcomes**: Measurable results
- **Key Decisions**: Core technical artifacts and major changes (bullet points: artifact + one-line reason)
- **Todos**: Specific, actionable items with checkboxes
- **PR Breakdown**: Ordered list of PRs (PR 1, PR 2, …) — each one reviewable idea ≤20 files — with layer/scope, file estimate, dependencies (stacked vs parallel), and tests-in-PR
- **Acceptance Criteria**: How to verify the feature works
- **Proposed Approach**: Detailed technical approach referencing specific files
- **Files to Create/Modify**: Complete table with purposes
- **Assumptions**: What you're assuming is true
- **Notes**: Constraints, references, prior art

The top four sections(Problem Statement, Proposed Solution, Expected Outcomes, Key decisions) make up the brief and will be presented to external stakeholders so they need to be explained simply such that a non-technical stakeholder can understand. The brief should be presentable within a 5-minute meeting slot.

### Step 5: Score the Brief

Our goals are plans that are clear and any dev on the team can start alone and questions that come up during challenge are pre answered. If a plan doesnt meet these standards. Do not accept it. Challenge the user with:

1. What specific information is missing/unclear that would push it to 5
2. What are the 2-3 hardest questions a reviewer would ask about this plan?
3. Pre-analyze these challenge questions and present them to the user with what the plan would need to contain to be a complete plan.

### Step 6: Save Plan

Save the completed plan to:
```
.claude/context/plans/YYYY-MM-DD-WIP-[feature-name].md
```

Example: `.claude/context/plans/2026-03-05-WIP-whatsapp-template-messages.md`

### Step 7: Present for Approval

Upon approval from user, create or update a task on Seamless using seamless mcp with this plan summary(four top sections) as description 
If the user requests changes, update the plan and re-present.

### Step 8: Next Steps

Once approved, inform the user they can run `/implement` to begin autonomous implementation.
