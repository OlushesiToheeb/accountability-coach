# Codebase Map — Accountability Coach

High-level architecture and navigation guide. For detailed maps, see `mindmaps/`.
Run `/sync-context` to refresh this file from the codebase.

Last updated: 2026-07-19 (initial scaffold)

---

## System Architecture

```
┌──────────────────────────────┐
│      app/  (Expo / RN)       │   Mobile app — iOS + Android
│   onboarding · check-ins ·   │
│        coach chat            │
└───────────────┬──────────────┘
                │ HTTPS (REST)
┌───────────────▼──────────────┐
│     backend/  (NestJS)       │   Coach brain
│  ┌────────────────────────┐  │
│  │ sensing loop           │  │   ingest check-ins → derive state
│  │ state machine          │  │   onboarding → active → NMT → comeback
│  │ governor               │  │   when/how to intervene
│  │ chat                   │  │   conversational surface
│  └────────────────────────┘  │
└───────────────┬──────────────┘
                │ Sequelize
┌───────────────▼──────────────┐
│   database/  (PostgreSQL)    │   models + migrations
└──────────────────────────────┘
```

## Workspaces

### `backend/` — NestJS + TypeScript
- `src/app.module.ts` — root module
- `src/main.ts` — bootstrap
- `src/health/` — health check
- `.env.example` — required env vars
- _(modules for sensing / state-machine / governor / chat to be added per Phase-1 order)_

### `app/` — React Native + Expo
- `App.tsx` / `index.ts` — entry
- `src/screens/` — screens
- `app.json` — Expo config

### `database/` — Sequelize + PostgreSQL
- `src/sequelize.ts` — connection
- `src/models/` — model definitions
- `src/sync.ts` — dev schema sync
- `migrations/` — Sequelize migrations
- `config/config.js` + `.sequelizerc` — CLI config

## Design docs (source of truth)

`docs/00`–`09`. Build spec: `docs/09-technical-architecture.md`. Product logic:
`docs/02-behavioral-engine.md`, `docs/03-ai-architecture.md`.
