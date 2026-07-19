# Common Mistakes — Accountability Coach

A living knowledge base of recurring bugs, pitfalls, and gotchas. **Read this before any
significant work, and add to it whenever a non-obvious bug is fixed.**

Updated: 2026-07-19 (initial scaffold)

---

## Backend (NestJS / Sequelize)

_This project shares its backend stack (NestJS + Sequelize + PostgreSQL) with the `seamless`
project. The following patterns are ported from there because they apply to any NestJS/Sequelize
codebase — verify each against this repo's actual conventions before relying on it._

- **Set `paranoid: true` on entities** that need soft deletes, or deleted rows keep appearing in
  queries. Standard table options: `@Table({ timestamps: true, paranoid: true, underscored: true })`.
- **Call `.toJSON()` before returning a model** from a service, or responses leak Sequelize
  metadata / `dataValues` wrappers and circular refs.
- **Exclude sensitive columns via `defaultScope`** (passwords, tokens, secrets) so they never
  serialize into API responses.
- **Wrap multi-step writes in a transaction** (`sequelize.transaction`) and thread
  `{ transaction: t }` through every operation, or a mid-sequence failure leaves partial data.
- **Don't import entities/services directly across modules** — export from the source module,
  import the module, inject via constructor. Direct imports cause circular-dependency errors.
- **Throw NestJS exceptions** (`BadRequestException`, `NotFoundException`, …), not raw `Error`,
  so the global filter produces correct HTTP status codes.

## App (React Native / Expo)

_None recorded yet._

## Database (migrations)

_None recorded yet._

---

_When you hit a gotcha that cost real time, add it here with: symptom → cause → fix._
