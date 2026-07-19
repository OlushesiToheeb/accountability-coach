---
description: Investigate and fix a bug with structured documentation
argument-hint: [bug-description-or-seamless-url]
---

## Bug Fix Workflow

You are investigating and fixing a bug. Follow this structured process:

### Step 1: Gather Context

Use the given description to understand the issue.

### Step 2: Investigate the Codebase

1. **Identify affected areas**: Search for files, components, or functions related to the bug
2. **Trace the flow**: Understand how the code executes in the problematic scenario
3. **Find the root cause**: Identify exactly what is causing the bug (not just symptoms)
4. **Review related code**: Check for similar patterns that might have the same issue

### Step 3: Document Findings

Before implementing any fix, fill out this bug report template and present it to the user:

```markdown
### **Observed Behaviour**

*Describe what is currently happening*

### **Expected Behaviour**

*Describe what should happen instead*

### **Steps to Reproduce**

1. *Step one*
2. *Step two*
3. *...*

### **Fix Approach**

*Describe how you will resolve this issue, including:*
- Which files need to be modified
- What changes will be made
- Any potential side effects to watch for
```

### Step 4: Get Approval

Present the completed bug report to the user and wait for approval before implementing the fix.

### Step 5: Implement the Fix

Once approved:
1. Make the necessary code changes
2. Run type checking to ensure no new errors
3. Verify the fix addresses the root cause
4. Summarize what was changed

### Important Guidelines

- Always read the relevant code before proposing changes
- Focus on the root cause, not just symptoms
- Keep fixes minimal and focused - don't refactor unrelated code
- Consider edge cases and potential regressions
- Document any assumptions made during investigation
