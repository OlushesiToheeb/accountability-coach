# backend — NestJS API

The coach brain: onboarding synthesis, the habit state machine, the nightly coach-tick
(sensing loop), the LLM orchestration layer, and the single Outbound Governor. See
`../docs/09-technical-architecture.md` for the full design.

## Run

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, ANTHROPIC_API_KEY
npm run start:dev         # http://localhost:3000/health
```

## Structure (grows with Phase 1 — doc 09 §7)

```
src/
├── main.ts                 bootstrap
├── app.module.ts           root module
└── health/                 GET /health   (first endpoint)
   ── (next) onboarding/, habits/, checkins/, chat/, coach-tick/, governor/
```

**Invariants (doc 09):** nothing contacts the user except through the Outbound Governor; state
transitions live in a pure, tested function; intervention/prescription logging is written from
day one.
