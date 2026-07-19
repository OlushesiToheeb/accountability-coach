---
description: Review a PR and optionally create one via gh CLI
argument-hint: [review-only | full | PR-number]
---

# PR Review — Thorough Standards-Based PR Review

You are a senior engineer performing a thorough, standards-based review of a pull request in the Seamless project. You review against all project checklists and conventions, using parallel agents for speed on large PRs.

## Modes

- **`/pr-review`** or **`/pr-review review-only`** — Review current branch changes (default)
- **`/pr-review full`** — Review + fix issues + push + create PR via `gh pr create`
- **`/pr-review #123`** — Review an existing PR by number

## Rules

- **ALWAYS** review against ALL applicable standards (backend, frontend, database, cross-cutting)
- **ALWAYS** read COMMON-MISTAKES.md before reviewing
- In `review-only` mode: DO NOT modify code
- In `full` mode: fix issues, then push and create PR
- Use `gh` CLI for all GitHub operations
- Do NOT save review artifacts to files — present findings directly to the user

---

## Process

### Step 1: Determine Mode & Scope

Parse the argument:
- No argument or "review-only" → Review current branch (default)
- "full" → Review + create PR
- "#123" or number → Review existing PR

### Step 2: Gather Changes & PR Metadata

**For current branch review:**
```bash
git rev-parse --abbrev-ref HEAD
git log --oneline develop..HEAD
git diff --name-only develop...HEAD
```

**For existing PR:**
```bash
gh pr view [number] --json title,body,baseRefName,headRefName,files,additions,deletions,changedFiles
gh pr diff [number] --name-only
git fetch origin [headRefName] && git checkout [headRefName]
git log --oneline origin/[baseRefName]..HEAD
```

### Step 3: Classify Changed Files

Group all changed files into categories:
- **Backend** — `backend/src/**` (services, controllers, entities, DTOs, modules, processors, types, utils)
- **Frontend** — `frontend/src/**` (pages, components, hooks, API modules, types, utils)
- **Database** — `database-migration/migrations/**`
- **Other** — config, CI, docs, package files

Count files per category. This determines which review agents to launch.

### Step 4: Load Standards (Parallel)

Read ALL of these in parallel — they are the review authority:

1. `.claude/context/templates/review-checklist.md` — Master checklist
2. `.claude/context/COMMON-MISTAKES.md` — Known pitfalls
3. `backend/CLAUDE.md` — Backend conventions (if backend changes)
4. `frontend/CLAUDE.md` — Frontend conventions (if frontend changes)
5. `database-migration/CLAUDE.md` — Database conventions (if migration changes)

### Step 5: Launch Parallel Review Agents

This is the core of the review. Launch specialized agents **in parallel** based on which file categories have changes. Each agent must read the full file (not just the diff) for every file it reviews.

**IMPORTANT:** Always launch agents for all affected categories simultaneously in a single message. Do not wait for one to finish before launching the next.

---

#### Agent: Backend Services & Controllers (if backend service/controller files changed)

Prompt the agent with:
- The list of changed service and controller files
- Standards to check:
  - Every service has `private readonly logger = new Logger('ServiceName')`
  - Controllers use `@RequireAuth()` for protected routes
  - Controllers use `@RequireAuth({ permissions: [...] })` for permission-gated routes
  - Controllers use `ParseUUIDPipe` for UUID path parameters
  - Controllers use `@SessionUser()` for user context
  - NestJS exceptions used (not raw `throw new Error()`)
  - `@Injectable()` with constructor DI on services
  - `sequelize.transaction()` for multi-step DB operations
  - `.toJSON()` on Sequelize models before returning in responses
  - Response shape matches `{ status, statusCode, data, message }`
  - No direct cross-module entity/service imports (use DI)
  - Constants in `constants.config.ts`, not scattered
  - Import order: NestJS → third-party → local
  - Bull queue processors have `@Processor()` and class-level Logger
  - BigNumber for financial calculations (not native JS arithmetic)
  - No division-by-zero risks in rate/amount calculations
- Report: violations with file:line, logic bugs, missing error handling, missing transactions, security concerns

#### Agent: Backend Entities, DTOs & Types (if entity/DTO/type files changed)

Prompt the agent with:
- The list of changed entity, DTO, and type files
- Standards to check:
  - Entities: `@Table({ timestamps: true, paranoid: true, underscored: true })`
  - UUID primary keys by default
  - Column names: snake_case in DB, camelCase in code
  - `defaultScope` excluding sensitive fields where applicable
  - DTOs: `class-validator` decorators + `@ApiProperty()` on all fields
  - Update DTOs extend `PartialType(CreateDto)`
  - Query/pagination DTOs extend `PaginationDto`
  - Types in `/src/types/` barrel-exported via `index.ts`
  - Enum names: PascalCase; enum values: `SCREAMING_SNAKE_CASE`
  - File naming: kebab-case with correct suffixes (.entity.ts, .dto.ts, .type.ts)
- Report: violations with file:line

#### Agent: Frontend Components & Pages (if frontend component/page files changed)

Prompt the agent with:
- The list of changed component and page files
- Standards to check:
  - `'use client'` directive on interactive components
  - `cn()` from `@/lib/utils` for ALL conditional Tailwind classes (never string concatenation)
  - React Query for server state (not useState/useContext for server data)
  - Icons only from `lucide-react` (default `h-4 w-4`)
  - Design system compliance:
    - Buttons/Cards/Inputs: `rounded-xl`
    - Filter pills: `rounded-full`
    - Never `rounded-md` or `rounded-lg` on containers
    - Success: `emerald-*` (not green), Error: `red-*` (not rose), Warning: `amber-*`, Info: `blue-*`, In Progress: `purple-*`
    - Text hierarchy: `text-gray-900` headings → `text-gray-700` body → `text-gray-500` captions → `text-gray-400` placeholders
    - Page titles: `text-2xl font-bold tracking-tight text-gray-900`
    - Section headings: `text-lg font-semibold text-gray-900`
  - `errorLogger` instead of `console.error`
  - `useToast()` for notifications (not alert/window.confirm)
  - No bare `fetch()` or `axios` — must use BaseAPI
  - Form pattern: Zod schema + react-hook-form + zodResolver
  - Custom form hooks return `{ form, isSubmitting, error, onSubmit }`
  - Components organized in `modules/{feature}/components/`
- Report: violations with file:line, design system issues, potential bugs, accessibility concerns

#### Agent: Frontend Hooks, API Modules, Types & Utils (if frontend hook/API/type/util files changed)

Prompt the agent with:
- The list of changed hook, API module, type, and utility files
- Standards to check:
  - API modules extend `BaseAPI` class — use `this.post<T>()`, `this.get<T>()`, etc.
  - Hooks use `QUERY_KEYS` pattern (nested object, not inline strings)
  - Form hooks return `{ form, isSubmitting, error, onSubmit }`
  - Types in `src/types/*.ts` with `UPPER_SNAKE_CASE` enum values
  - `errorLogger` instead of `console.error`
  - `getWithMeta()` when API metadata is needed
  - Enums match backend values
  - File naming: kebab-case
- Report: violations with file:line

#### Agent: Database Migrations (if migration files changed)

Prompt the agent with:
- The list of changed migration files
- Standards to check:
  - Goose format with `-- +goose Up/Down` and `-- +goose StatementBegin/End`
  - File named `YYYYMMDDhhmmss_description.sql`
  - UUID primary keys: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - Audit columns: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`
  - Soft delete: `deleted_at TIMESTAMPTZ` (nullable)
  - `TIMESTAMPTZ` (not `TIMESTAMP`) for all timestamp columns
  - FK naming: `CONSTRAINT fk_[table]_[referenced_field]`
  - Index naming: `idx_[table]_[column(s)]`
  - Indexes on all FK columns
  - Status fields: `VARCHAR(50)` with CHECK constraints
  - Financial values: `DECIMAL(20,8)`
  - Down migration reverses all Up changes
  - `'Africa/Lagos'` timezone for timestamp conversions
  - No unnamed inline FKs (always use explicit CONSTRAINT syntax)
- Report: violations with file:line, missing indexes, data integrity concerns

#### Agent: Module Wiring & Tests (if module/test files changed)

Prompt the agent with:
- The list of changed module and test files
- Standards to check:
  - Module imports/exports are correct and complete
  - No circular dependencies (check for `forwardRef` usage)
  - Services properly registered as providers
  - Entities registered in `SequelizeModule.forFeature`
  - Queue processors have matching `BullModule.registerQueue`
  - Test quality: meaningful assertions, covers success + error paths
  - No overlooked wiring issues (every @InjectModel, @InjectQueue, and constructor param resolves)
- Report: wiring issues, missing registrations, test gaps

---

### Step 6: Compile & Format Review

After all agents return, compile findings into a single review grouped by area:

```
## Backend

### CRITICAL
[findings]

### HIGH
[findings as table: #, File, Issue]

### MEDIUM
[findings as table]

## Frontend

### HIGH
[findings as table]

### MEDIUM
[findings as table]

### LOW
[findings as table]

## Database Migrations

### MEDIUM
[findings as table]

### LOW
[findings as table]

## What's Done Well
[positive observations — good patterns, solid test coverage, etc.]

## Verdict
APPROVE / REQUEST_CHANGES / COMMENT
[1-2 sentence summary of what blocks or what looks good]
```

### Step 7: Mode-Specific Actions

**Review-Only Mode (default):**
- Present the compiled review to the user
- State the verdict: APPROVE / REQUEST_CHANGES / COMMENT

**PR Number Mode (`/pr-review #123`):**
- Present the compiled review to the user
- Ask if they want to post it as a comment on the PR via `gh pr review [number] --comment --body "..."`

**Full Mode:**
If there are CRITICAL or WARNING issues:
1. Fix each issue
2. Run tests, lint, build
3. Commit fixes:
   ```bash
   git add [fixed files]
   git commit -m "fix: address review findings for [feature]"
   ```

Then create the PR:
```bash
git push -u origin [branch-name]

gh pr create --title "[PR title]" --body "$(cat <<'EOF'
## Summary
- [bullet points]

## Test plan
- [ ] Unit tests pass
- [ ] Lint passes
- [ ] Build succeeds
- [ ] Manual testing of [specific scenarios]

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 8: Summary

Present:
- Total findings by severity (CRITICAL / HIGH / MEDIUM / LOW)
- Verdict with reasoning
- PR URL (if created or reviewed)
