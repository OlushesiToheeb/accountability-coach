# Code Review Checklist — Seamless

Use this checklist for all code reviews. Mark items as N/A if they don't apply.

---

## General

- [ ] **Requirements met** — Changes satisfy the plan/ticket requirements
- [ ] **Architecture** — Changes follow existing patterns; no unnecessary abstractions
- [ ] **Tests** — New/changed behavior has corresponding tests
- [ ] **Lint + Build** — `npm run lint` and `npm run build` pass in affected workspaces
- [ ] **Security** — No secrets committed, no injection vulnerabilities, auth checks in place
- [ ] **Performance** — No N+1 queries, unnecessary re-renders, or unbounded loops
- [ ] **No over-engineering** — No unused code, speculative features, or premature abstractions

---

## Backend (NestJS / Sequelize)

- [ ] `@RequireAuth()` on all protected controllers
- [ ] `@RequireAuth({ permissions: [...] })` for permission-gated routes
- [ ] `@SessionUser()` used for user context (not manual token parsing)
- [ ] `ParseUUIDPipe` on all UUID path parameters
- [ ] `Logger` instantiated in every new service (`private readonly logger = new Logger('ServiceName')`)
- [ ] Response shape matches `ResponseInterceptor` standard (`{ status, statusCode, data, message }`)
- [ ] `.toJSON()` called on Sequelize models before returning in responses
- [ ] Entity has `defaultScope` excluding sensitive fields where applicable
- [ ] `paranoid: true` + `timestamps: true` + `underscored: true` on all entities
- [ ] UUID primary keys on new tables
- [ ] `sequelize.transaction()` wraps multi-step operations
- [ ] DTOs use `class-validator` decorators + `@ApiProperty()` for Swagger
- [ ] NestJS exceptions used for errors (not raw `throw new Error()`)
- [ ] Bull queue processors have class-level `Logger`
- [ ] No direct cross-module entity/service imports (use DI)
- [ ] Constants in `/src/config/constants.config.ts`, not scattered in services

---

## Frontend (Next.js / React Query / Tailwind)

- [ ] `cn()` from `@/lib/utils` used for all conditional Tailwind classes
- [ ] React Query keys follow `QUERY_KEYS` nested object pattern
- [ ] API methods extend `BaseAPI` class (`this.post<T>()`, `this.postWithToast<T>()`)
- [ ] Forms use Zod schema + `react-hook-form` + `zodResolver()` pattern
- [ ] `'use client'` directive only on interactive components, contexts, and providers
- [ ] `errorLogger` from `@/lib/utils/error-logger` used (never bare `console.error()`)
- [ ] `useToast()` for user notifications (not `alert()` or `window.confirm()`)
- [ ] Enums use `UPPER_SNAKE_CASE` values matching backend
- [ ] Components organized in `modules/{feature}/components/`
- [ ] Custom form hooks return `{ form, isSubmitting, error, onSubmit }` signature
- [ ] No server state in React Context (use React Query)
- [ ] `getWithMeta()` used when API metadata is needed (not manual `.data` access)
- [ ] New user-facing interactive elements have `data-guide` attributes and guidance registry entries (see `frontend/CLAUDE.md` "In-App Guidance Convention")
- [ ] Every `data-guide` referenced in the registry actually exists in the DOM on the listed route (grep to confirm) — see `GUIDE-001`
- [ ] Noun-style guidance titles set an `assistantPrompt` override so the "Ask assistant" prefill is grammatical — see `GUIDE-002`
- [ ] Walkthrough steps whose target lives inside collapsed/closed UI declare a `prepareAction` AND the host component registers the handler via `useRegisterGuidanceAction` — see `GUIDE-003`
- [ ] Walkthrough steps whose natural action IS clicking the highlighted control declare `advanceOn: 'click'` so the tour becomes hands-on rather than read-through

---

## Database (Goose Migrations)

- [ ] Migration wrapped in `-- +goose Up/Down` and `-- +goose StatementBegin/End`
- [ ] File named `YYYYMMDDhhmmss_description.sql`
- [ ] UUID primary keys: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- [ ] Audit columns present: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`
- [ ] Soft delete: `deleted_at TIMESTAMPTZ` (nullable)
- [ ] Foreign key naming: `CONSTRAINT fk_[table]_[referenced_field]`
- [ ] Index naming: `idx_[table]_[column(s)]`
- [ ] Status fields: `VARCHAR(50)` with CHECK constraints
- [ ] Financial values: `DECIMAL(20,8)`
- [ ] Down migration reverses all Up changes
- [ ] `'Africa/Lagos'` timezone used for timestamp conversions

---

## Cross-Cutting

- [ ] No `.env*`, `credentials.json`, `*.pem`, `*.key` files read or committed
- [ ] COMMON-MISTAKES.md reviewed — no known pitfalls repeated
- [ ] Affected mindmaps still accurate after changes
- [ ] FRONTEND_STANDARDS_CHECKLIST.md referenced for frontend work (see `frontend/.claude/FRONTEND_STANDARDS_CHECKLIST.md`)

---

## Severity Guide

| Severity | Meaning | Action |
|----------|---------|--------|
| **CRITICAL** | Bug, security issue, data loss risk | Must fix before merge |
| **WARNING** | Convention violation, missing test, potential issue | Should fix before merge |
| **SUGGESTION** | Style improvement, optional enhancement | Nice to have |
