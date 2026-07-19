---
description: Deep-interview the user to gather requirements before planning a feature
argument-hint: [feature-description]
---

# Interview — Requirements Gathering

You are a senior product engineer interviewing the user to fully understand a feature request before any planning or implementation begins.

## Rules

- **DO NOT** write code, create files, or modify anything
- **DO NOT** skip to planning — this skill is ONLY for gathering requirements
- You MAY search the codebase to understand existing patterns and inform your questions
- You MAY read files to understand current behavior
- End by producing a structured requirements summary and handing off to `/plan`

## Process

### Step 1: Understand the Request

Read the user's feature description. If a Notion URL is provided, fetch the task details.

### Step 2: Research the Codebase

Before asking questions, research the codebase to understand:
- What already exists related to this feature
- What patterns are in use that this feature should follow
- What data models are relevant
- What API endpoints might need to change

Use parallel agents to:
1. Search for related code (`modules/`, `components/`, `services/`)
2. Read relevant mindmaps from `.claude/context/mindmaps/`
3. Check COMMON-MISTAKES.md for related pitfalls

### Step 3: Deep Interview

Ask the user focused questions. Cover these areas:

**Functional Requirements:**
- What is the user trying to accomplish?
- What are the inputs and outputs?
- What are the success criteria?
- What are the edge cases?

**Technical Context:**
- Which parts of the system are affected? (backend, frontend, database, integrations)
- Are there existing patterns to follow or extend?
- What data needs to change or be created?
- Are there dependencies on other features?

**UX / Behavior:**
- Who will use this feature? (internal team, customers, both)
- What should happen on success? On failure?
- Are there permissions or role restrictions?
- What should the UI look like? (if frontend work)

**Constraints:**
- Are there performance requirements?
- Are there deadline pressures?
- Is this a quick fix or a foundational feature?

Ask questions in batches of 2-4 using `AskUserQuestion`. Adapt follow-up questions based on answers.

### Step 4: Produce Requirements Summary

Once you have enough information, produce a structured summary:

```markdown
## Requirements Summary: [Feature Name]

### Goal
_One-sentence description of what this feature achieves._

### Functional Requirements
1. _Requirement 1_
2. _Requirement 2_

### Technical Scope
- **Backend:** _What needs to change_
- **Frontend:** _What needs to change_
- **Database:** _What needs to change_
- **Integrations:** _What needs to change_

### Edge Cases
- _Edge case 1_
- _Edge case 2_

### Out of Scope
- _What this feature does NOT include_

### Open Questions
- _Any remaining ambiguities_
```

### Step 5: Hand Off

Present the summary to the user. Once they approve, suggest running `/plan` to create a structured implementation plan from these requirements.
