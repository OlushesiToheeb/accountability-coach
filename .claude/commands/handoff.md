---
description: Save session context for continuity between sessions
argument-hint: [optional-notes]
---

# Handoff — Session Continuity

You are preserving the current session's context so the next session can pick up seamlessly.

## Process

### Step 1: Find Active Plan

Check `.claude/context/plans/` for any WIP or REVIEW plans. If one exists, update it with current progress.

### Step 2: Gather Current State

Run these in parallel:

```bash
# Current branch and recent commits
git branch --show-current
git log --oneline -5

# Uncommitted changes
git status

# Any stashed work
git stash list
```

### Step 3: Update Active Plan

If there's a WIP plan, add an Implementation Log entry:

```markdown
| [timestamp] | HANDOFF — [summary of current state] |
```

Include:
- **Accomplished**: What was completed this session
- **In Progress**: What's partially done (include `file:line` references)
- **Blocked**: What couldn't be done and why
- **Next Steps**: What should be done next
- **Context That Would Be Lost**: Anything not captured in code/commits that the next session needs to know

### Step 4: Run Sync-Context

After updating the plan, run the sync-context workflow:
1. Check if any mindmaps need updating based on files changed this session
2. Update any outdated entries in mindmaps
3. Update file-index.md if new files were created

### Step 5: Summary

Present a handoff summary:

```markdown
## Handoff Summary — [Date]

### Branch: `[branch-name]`

### Session Accomplishments
- [What was done]

### Current State
- [In-progress work with file:line references]
- [Uncommitted changes summary]

### For Next Session
1. [First thing to do]
2. [Second thing to do]

### Active Plan
- [Plan file path and status]

### Context Notes
- [Anything the next session needs to know]
```
