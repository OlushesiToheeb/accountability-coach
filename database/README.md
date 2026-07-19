# database — Prisma + PostgreSQL

The schema (`prisma/schema.prisma`) is the doc 09 §2 data model in code: users, goals, habits,
events, the commitment ledger, and — from day one — the prescription + intervention logs that
become the moat (docs/02 §9).

## Setup

```bash
npm install
cp .env.example .env         # point DATABASE_URL at your Postgres
npx prisma migrate dev       # create the DB + first migration
npx prisma generate          # generate the client
npx prisma studio            # browse the data
```

## Notes

- **Enums** encode the behavioral engine: `HabitState` (the state machine, docs/02 §2),
  `ReasonTap` (the miss-diagnostic sensor, docs/02 §4), `InterventionLevel` L1–L5 (the
  governor ladder, docs/02 §6), `Diagnosis` law1–law4 (the Four Laws).
- The backend consumes the generated `@prisma/client`. Keep the schema as the single source of
  truth for the data model; update it here, migrate, then use it from `../backend`.
