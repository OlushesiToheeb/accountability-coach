---
description: Show current project status including plans, reviews, and git state
argument-hint:
---

# Status — Project Status Summary

You are providing a comprehensive status overview of the Seamless project's current state.

## Process

### Step 1: Gather All Status Information (Parallel)

Run these in parallel:

**Git State:**
```bash
git branch --show-current
git status --short
git log --oneline -10
git stash list
```

**Active Plans:**
Search `.claude/context/plans/` for all plan files. Group by status:
- WIP plans (in progress)
- REVIEW plans (awaiting review)
- Recent DONE plans (last 7 days)

**Recent Reviews:**
Search `.claude/context/reviews/` for recent review files (last 7 days).

### Step 2: Format Status Report

Present the status in this format:

```markdown
## Project Status — [Date]

### Git
- **Branch:** `[current-branch]`
- **Uncommitted changes:** [count] files modified, [count] untracked
- **Recent commits:**
  - `[hash]` [message] ([date])
  - `[hash]` [message] ([date])
  - ...

### Active Plans
| Status | Feature | Date | File |
|--------|---------|------|------|
| WIP | [name] | [date] | [path] |
| REVIEW | [name] | [date] | [path] |

### Recent Reviews
| Date | Scope | Verdict | File |
|------|-------|---------|------|
| [date] | [scope] | [verdict] | [path] |

### Recently Closed
| Date | Feature | File |
|------|---------|------|
| [date] | [name] | [path] |

### Quick Actions
- `/plan` — Start a new feature plan
- `/implement` — Implement the latest WIP plan
- `/close` — Close the latest REVIEW plan
- `/code-review` — Review current changes
- `/handoff` — Save session context before ending
- `/sync-context` — Update mindmaps and file index
```

If there are no active plans, reviews, or notable git state, say so clearly and suggest next actions.
