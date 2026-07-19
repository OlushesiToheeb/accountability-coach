---
description: Structured debugging workflow for investigating and fixing bugs
argument-hint: [bug-description-or-error-message]
---

# Debug — Structured Debugging

You are a senior engineer systematically debugging an issue in the Seamless project. You follow a structured approach: reproduce, locate, diagnose, fix, verify.

## Rules

- **ALWAYS** read COMMON-MISTAKES.md first — the bug might be a known pitfall
- **ALWAYS** use mindmaps to locate relevant code quickly
- **MINIMIZE** the fix — change as little code as possible
- **ALWAYS** write a regression test for the fix
- **UPDATE** COMMON-MISTAKES.md if the bug is a new recurring pattern
- **DO NOT** refactor surrounding code while debugging

## Process

### Step 1: Understand the Bug

Parse the bug description to identify:
- **What is broken?** (observed behavior)
- **What should happen?** (expected behavior)
- **How to reproduce?** (steps, inputs, conditions)
- **Where does it happen?** (endpoint, page, component, service)

If the description is vague, ask the user targeted questions with `AskUserQuestion`.

### Step 2: Check Known Pitfalls

Read `.claude/context/COMMON-MISTAKES.md` and check if this bug matches a known pattern:
- Sequelize serialization issues (SEQ-002, SEQ-003)
- Missing auth decorators (NEST-001)
- React Query cache issues (RQ-001)
- Missing `'use client'` (NEXT-001)
- etc.

If it matches a known pattern, skip to Step 5 with the documented fix.

### Step 3: Locate via Mindmaps

Read the relevant mindmap to quickly find the affected code:
- `.claude/context/mindmaps/backend.md` — for API/service bugs
- `.claude/context/mindmaps/frontend.md` — for UI/component bugs
- `.claude/context/mindmaps/api.md` — for endpoint-specific bugs
- `.claude/context/mindmaps/data.md` — for data/schema bugs
- `.claude/context/mindmaps/integrations.md` — for integration bugs
- `.claude/context/mindmaps/whatsapp.md` — for WhatsApp-specific bugs

### Step 4: Diagnose

Trace the execution path:

1. **Entry point** — Where does the request/action enter? (controller, page, event handler)
2. **Data flow** — Follow the data through services, queries, transformations
3. **Failure point** — Where does the actual behavior diverge from expected?
4. **Root cause** — What is the underlying reason? (not just the symptom)

Read the relevant source files. Check:
- Error logs (if provided)
- Related test files (do they cover this case?)
- Recent changes to the affected files (`git log --oneline -10 -- [file]`)

### Step 5: Minimal Fix

Implement the smallest possible fix:
- Fix the root cause, not the symptom
- Don't change unrelated code
- Follow existing patterns and conventions
- Check COMMON-MISTAKES.md to avoid introducing new pitfalls

### Step 6: Regression Test

Write a test that:
- Fails without the fix (RED)
- Passes with the fix (GREEN)
- Covers the specific scenario that was broken

Backend tests: Vitest, colocated `*.spec.ts`
Frontend tests: Vitest + testing-library

### Step 7: Verify

Run verification in affected workspace(s):
```bash
cd backend && npm run test -- --run   # if backend
cd backend && npm run lint             # if backend
cd frontend && npm run lint            # if frontend
cd frontend && npm run build           # if frontend
```

### Step 8: Update Knowledge Base

If this bug represents a new recurring pattern:
1. Add an entry to `.claude/context/COMMON-MISTAKES.md`
2. Follow the format: Code, Symptom, Cause, Fix
3. Add to the appropriate section

### Step 9: Document & Summarize

Present to the user:

```markdown
## Bug Fix Summary

### Root Cause
_What caused the bug_

### Fix
_What was changed and why_

### Files Modified
- `file.ts:42` — Description of change

### Regression Test
- `file.spec.ts` — What the test verifies

### COMMON-MISTAKES.md Updated
- [Yes/No] — [If yes, which entry was added]
```
