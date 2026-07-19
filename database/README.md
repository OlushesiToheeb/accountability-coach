# database — Sequelize + PostgreSQL

The models (`src/models/`) are the doc 09 §2 data model in code: users, goals, habits, events,
the commitment ledger, and — from day one — the prescription + intervention logs that become
the moat (docs/02 §9). ORM: **Sequelize** (via `sequelize-typescript`).

## Setup

```bash
npm install
cp .env.example .env          # point DATABASE_URL at your Postgres

# Dev: sync models straight to the DB while iterating
npm run sync:dev

# Prod / shared: use migrations instead
npm run migration:generate -- create-core-tables   # author a migration
npm run migrate
```

## Layout

```
src/
├── models/index.ts   all 11 models + enum sets + the `models` array
├── sequelize.ts      createSequelize() — builds the instance wired to the models
├── sync.ts           dev-only sequelize.sync()
└── index.ts          barrel — models + createSequelize
config/config.js      sequelize-cli config (reads DATABASE_URL)
migrations/           sequelize-cli migrations (author for prod)
```

## Notes

- **Enums** encode the behavioral engine: `HABIT_STATES` (the state machine, docs/02 §2),
  `REASON_TAPS` (the miss-diagnostic sensor, docs/02 §4), `INTERVENTION_LEVELS` L1–L5 (the
  governor ladder, docs/02 §6), `DIAGNOSES` law1–law4 (the Four Laws).
- The backend consumes these models via `@nestjs/sequelize` (register `models` in
  `SequelizeModule.forRoot`) or by importing `createSequelize()` directly.
- `underscored: true` maps camelCase attributes to snake_case columns; `onDelete: 'CASCADE'`
  on the associations makes "delete my data" (docs/03 §7) a clean cascade.
