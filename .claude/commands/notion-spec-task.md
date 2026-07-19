---
description: Spec a task using the Seamless feature template and optionally push to Notion
argument-hint: [task-title-or-notion-url]
---

## Notion Spec Task Workflow

You are creating a feature specification for a task. Follow this structured process:

### Step 1: Understand the Task

Use the given description, Notion URL, or task title to understand what needs to be specced.

If a Notion URL or task title is provided:
1. Search Notion for the task using the `Notion:notion-search` skill
2. Fetch the task page to read any existing content, comments, or properties
3. Note any comments — they often contain critical context about requirements

If only a description is provided:
1. Clarify the scope and intent by asking the user targeted questions
2. Identify which part of the system is affected (frontend, backend, database, external service)

### Step 2: Gather Codebase Context

Before writing the spec, explore the codebase for relevant context:

1. **Search for related code**: Find existing components, services, modules, or endpoints related to the task
2. **Understand current state**: Read the relevant files to understand what exists today
3. **Identify patterns**: Note reusable utilities, hooks, or abstractions that apply
4. **Check data models**: Review database migrations, entities, and DTOs if the task involves data

Use the Task tool with `subagent_type=Explore` for efficient codebase exploration.

### Step 3: Write the Feature Spec

Fill out the following template with specific, actionable detail. Do NOT use vague or generic language — every section should reflect the actual codebase and task context.

```markdown
### **Problem Statement**

*What issue are we solving? Describe the current state, what's broken or missing, and why it matters.*

### **Proposed Solution**

*How will we solve it? Describe the approach at a high level. If there are multiple options, present them with a recommendation.*

### User Stories

*What are the user stories involved? Use the format: "As a [role], I want [action] so that [benefit]."*

### **Expected Outcomes**

*What changes when this is done? Be specific about observable results.*

**Todos**

- [ ] Task 1
- [ ] Task 2
```

**Guidelines for writing good specs:**

- **Problem Statement**: Reference specific files, fields, or behaviors from the codebase. Don't just describe the problem abstractly — show evidence from the code.
- **Proposed Solution**: Be concrete about what changes where. If it's a backend change, name the module/service. If it's frontend, name the component. If it's a database change, describe the migration.
- **User Stories**: Write 2-4 stories covering the primary actors. Keep them grounded in real workflows.
- **Expected Outcomes**: These should be verifiable. Someone should be able to read this list and confirm "yes, this is done" or "no, this isn't done yet."
- **Todos**: Break into atomic, actionable tasks. Each todo should be completable independently. Order them logically (database changes before backend, backend before frontend).

### Step 4: Present for Review

Present the completed spec to the user and ask if they want any changes.

### Step 5: Push to Notion (if requested)

If the user wants to push the spec to Notion:
1. If the task already exists as a Notion page, use `Notion:notion-fetch` to get the page ID, then update its content
2. If it's a new task, create a new page in the appropriate database
3. Confirm the update was successful

### Important Guidelines

- Always read relevant code before writing the spec — never spec in a vacuum
- Reference actual file paths, field names, and existing patterns from the codebase
- Keep the spec focused on the single task — don't scope-creep into adjacent improvements
- If the task is ambiguous, ask clarifying questions before writing the spec
- If there are multiple valid approaches, present options with a clear recommendation
- Include database migrations in todos when schema changes are needed
- Consider permissions, error handling, and edge cases in the proposed solution
- Read `.claude/context/mindmaps/` for quick codebase orientation before exploring
- Read `.claude/context/COMMON-MISTAKES.md` to avoid known pitfalls in the spec
- If the spec is approved and the user wants to proceed to implementation, suggest running `/plan` to create a full implementation plan using `.claude/context/templates/plan-template.md`
