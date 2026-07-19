# Accountability Coach — Monorepo

A mobile-first AI accountability & habit coach. This repo holds the product design, the
backend, the mobile app, the database schema, and the `.claude/` AI development workflow — all
in one place.

> **Structure mirrors the `seamless` project pattern:** a monorepo (backend + app in one repo)
> with a `.claude/` AI workflow (skills + commands). The `.claude/` contents here are a starter
> to be reconciled with `seamless`'s exact files.

## Layout

```
accountability-coach/
├── docs/          Product design — the PRD, behavioral engine, AI + technical architecture
│                  (start at docs/README.md)
├── backend/       NestJS + TypeScript API (the coach brain, sensing loop, governor)
├── app/           React Native + Expo mobile app (iOS + Android)
├── database/      Sequelize models + migrations (PostgreSQL)
└── .claude/       AI development workflow — commands (interview → planner → implement) + skills
```

## Where to start

- **Understand the product:** [`docs/README.md`](docs/README.md) → the founding brief, the
  behavioral engine (doc 02), AI architecture (doc 03), and the technical build spec (doc 09).
- **Build order:** `docs/09-technical-architecture.md` §7 — the Phase-1 sequence
  (skeleton → onboarding → check-ins → state machine → NMT/comeback → governor → chat).

## Quickstart

Each package is independent for now (npm workspaces wire them together at the root).

```bash
# Database
cd database && npm install && npm run sync:dev      # dev; use npm run migrate for prod

# Backend
cd backend && npm install && npm run start:dev      # http://localhost:3000/health

# App
cd app && npm install && npx expo start
```

Prereqs: Node 20+, PostgreSQL 15+, and the Expo Go app (or a simulator) for the mobile client.

## The AI workflow (`.claude/`)

Custom slash commands drive spec-driven development:

- **`/interview`** — turn a fuzzy feature idea into a crisp spec by asking the right questions.
- **`/planner`** — turn a spec into a phased, doc-grounded implementation plan.
- **`/implement`** — execute a plan step, following project conventions, and verify it.

See [`.claude/README.md`](.claude/README.md).

## Status

PRD v1 complete + technical build spec (doc 09). Monorepo scaffold in place; Phase-1 code
starts next (doc 09 §7). Naming parked (docs/06 §6f); Phase 0 skipped (D6).
