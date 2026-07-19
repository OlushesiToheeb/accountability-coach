---
description: Finalize a completed feature plan from REVIEW to DONE
argument-hint: [plan-file-path-or-feature-name]
---

# Close — Finalize Plan to DONE

You are finalizing a completed feature. This skill verifies everything is done, updates documentation, and marks the plan as DONE.

## Rules

- **ONLY** close plans that are in REVIEW status
- **DO NOT** close plans with unchecked todos or acceptance criteria
- **DO NOT** push to remote
- **DO** update affected mindmaps
- **DO** commit all changes

## Process

### Step 1: Find the Plan

1. If a path or feature name is provided, find the matching REVIEW plan
2. Otherwise, find the most recent REVIEW plan in `.claude/context/plans/`
3. If no REVIEW plan exists, tell the user there's nothing to close

### Step 2: Verify Completion

Read the plan and check:

- [ ] **All todos are checked** — Every `- [ ]` should be `- [x]`
- [ ] **All acceptance criteria are met** — Every criterion checked
- [ ] **Tests pass:**
  ```bash
  # Run in affected workspace(s)
  cd backend && npm run test -- --run  # if backend
  cd frontend && npm run build         # if frontend
  ```
- [ ] **Lint passes:**
  ```bash
  cd backend && npm run lint   # if backend
  cd frontend && npm run lint  # if frontend
  ```

If any check fails:
- Tell the user what's incomplete
- Suggest running `/implement` to finish remaining work
- Do NOT proceed with closing

### Step 3: Update Mindmaps

Read the plan's "Files to Create" and "Files to Modify" tables. For each affected area:

1. Read the relevant mindmap from `.claude/context/mindmaps/`
2. Add any new files, routes, endpoints, components, or entities
3. Remove any deleted items
4. Update any renamed or moved items

### Step 4: Update Plan Status

1. Change the plan's `Status` field from `REVIEW` to `DONE`
2. Add a closing entry to the Implementation Log:
   ```
   | YYYY-MM-DD HH:MM | CLOSED — All todos complete, tests pass, mindmaps updated |
   ```
3. Rename the plan file: replace `REVIEW` with `DONE` in the filename
   - Example: `2026-03-05-REVIEW-whatsapp-templates.md` → `2026-03-05-DONE-whatsapp-templates.md`

### Step 5: Commit

```bash
git add .claude/context/
git commit -m "chore: close [feature-name] plan — mark as DONE

- All todos and acceptance criteria verified
- Mindmaps updated for new/changed files
- Tests and lint passing"
```

### Step 6: Summary

Tell the user:
- The plan is closed
- Which mindmaps were updated
- Suggest creating a PR with `/pr-review` if not already done
