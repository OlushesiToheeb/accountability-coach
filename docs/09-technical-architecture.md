# 09 — Technical Architecture & Phase-1 Build Spec

> **Role:** engineering design. This turns the behavioral engine (doc 02) and AI system (doc
> 03) into something buildable: stack, data model, API surface, the coach-tick job, the LLM
> orchestration layer, and the single outbound governor — then maps Phase-1 scope (doc 05 §3)
> onto those components. Opinionated on stack (tuned to a solo full-stack dev who already ships
> React Native + a TypeScript/NestJS backend on Render), with alternatives flagged. Model
> names/prices are current-as-of-writing and should be reconfirmed against the API docs at
> build time.

---

## 1. Stack (recommended, with rationale)

| Layer | Choice | Why / alternative |
|---|---|---|
| **Mobile** | **React Native + Expo** (D2); EAS Build; `expo-notifications`; `expo-router` | Cross-platform in one codebase (D2). Expo gives OTA updates + painless push. OS dictation covers voice (doc 04 §8) — no custom audio pipeline in v1 |
| **Backend** | **NestJS (TypeScript)** | Same language as the app (shared types), and you already run it on clipscript. Alt: Fastify if you want lighter |
| **DB** | **PostgreSQL** + **Sequelize** (`sequelize-typescript`) | Relational fits the state machine, event stream, and ledger cleanly. No vectors needed in v1 — memory is *structured*, not RAG (doc 03 §1). Add `pgvector` only if v2 semantic recall needs it |
| **Jobs/queue** | **pg-boss** (Postgres-backed) | The nightly coach-tick + retries + scheduled sends. pg-boss avoids standing up Redis — one less moving part for a solo dev. Alt: BullMQ if you already want Redis |
| **LLM** | **Anthropic Claude API**, zero-retention | Tiered (see §5). Haiku 4.5 for volume, Sonnet 5 for stakes, Opus 4.8 for the hardest tone/diagnosis calls |
| **Push** | **Expo Push** → APNs/FCM | Simplest server-initiated push for a solo dev; revisit direct APNs/FCM only if you outgrow it |
| **Auth** | **Anonymous device identity** first; optional **Sign in with Apple** to sync | Protects the <60s onboarding (doc 04 §1) and the no-friction privacy posture (doc 03 §7). Real account only when the user wants multi-device |
| **Hosting** | **Render** (web service + managed Postgres) | You already use it. Alt: Fly.io/Railway |

**Non-negotiable architectural invariant (doc 03 §8):** *no code path may contact the user
except through the Outbound Governor (§6).* Enforced by making the notification/push client a
private dependency of the governor module — nothing else imports it.

## 2. Data model (v1)

Core tables (schema sketch; implemented as Sequelize models in `database/src/models/`;
timestamps/`id` uuid implied). **The intervention + prescription logs ship in v1 even though
learning is v2** — the corpus is the moat (doc 02 §9, doc 03 §8).

```
User            id, tz, created_at,
                style_contract (jsonb: {allowedRange, current, easeUpUntil, history}),
                quiet_hours (jsonb), notif_budget int default 3,
                sensitivities (text[]),            // domain flags (doc 03 §5)
                savage_unlocked_at, distress_state

Goal            id, user_id→User, raw_goal, why_verbatim, why_date,
                shape enum(habit|project|outcome|hybrid), domain,
                sensitive bool, lagging_metric (jsonb?), created_at

Habit           id, goal_id→Goal, slot int,
                definition, implementation_intention, two_minute_floor,
                schedule (jsonb: {days[], window}),
                state enum(calibration|building|wobbling|lapsed|dormant|comeback|
                           consolidating|graduated),
                state_since, created_at

Milestone       id, goal_id→Goal, title, target_week, done bool   // project goals

Event           id, habit_id→Habit, user_id,
                type enum(completion|floor|miss|snooze|dismiss|backfill),
                reason_tap enum(forgot|no_time|didnt_feel|too_hard|life)?,   // doc 02 §4
                note?, occurred_at, logged_at, source enum(app|lockscreen|inferred)

Commitment      id, user_id→User, text_verbatim, said_on,
                kind enum(why|promise|floor), source          // the receipts (doc 03 §1)

Prescription    id, habit_id→Habit, diagnosis enum(law1|law2|law3|law4|none),
                prescription, framed_experiment, review_on,
                outcome (jsonb: {completionDelta, verdict})?, created_at

Intervention    id, user_id→User, habit_id?, level enum(L1..L5), kind,
                channel enum(push|inapp), context (jsonb), opener_text,
                sent_at, responded enum(acted|snoozed|dismissed|silent)?,
                response_within_h float?                       // governor log = corpus

ConversationSummary  id, user_id, thread_id, summary(≤200 tok), last_exchanges (jsonb),
                     created_at

OutboundQueued  id, user_id, level, payload (jsonb), deeplink (jsonb),
                scheduled_for, status enum(queued|sent|suppressed|failed),
                suppressed_reason?                              // governor decisions, audited

DeviceToken     id, user_id, expo_token, platform, active
```

Deletion (doc 03 §7): "delete my data" = cascade delete of all rows for `user_id`, verifiable.

## 3. API surface (REST; tRPC is a fine alt for end-to-end types)

| Method + path | Purpose | Notes |
|---|---|---|
| `POST /onboarding` | goal + why → generated plan | LLM synthesis (§5, T2). Returns habit + intention + floor + window |
| `POST /onboarding/confirm` | user accepts/edits plan → creates Goal+Habit | Kicks off Calibration state |
| `GET /today` | the Today screen payload | Deterministic (T0): rep, window, chain, check-in state |
| `POST /habits/:id/checkin` | `done` / `floor` / `miss(+reason,note)` | T0 write; triggers event-driven interrupts (§4) |
| `POST /habits/:id/backfill` | log a past day | Guilt-free (doc 04 §3) |
| `POST /chat` | user message → coach reply | Picks context recipe + tier (§5). Streamed |
| `GET /chat/:threadId` | thread history/summary | |
| `POST /style` | `ease_up` / `go_harder` / `set(style)` | Updates contract instantly (doc 02 §6.2) |
| `POST /savage/unlock` | preview-consent flow | Gated ≥14 days + baseline (doc 08) |
| `GET /weekly-review` | 5-card review payload | Generated on tick (§4), cached |
| `POST /goals`, `PATCH /habits/:id` | edit plan, windows, milestones | |
| `POST /devices` | register Expo push token | |
| `POST /me/delete` | full data delete | doc 03 §7 |

## 4. The coach tick + interrupts (the sensing loop — the moat)

**Nightly per-user batch job** (`pg-boss` cron, staggered by tz so it runs pre-wake):

```
for each active user:
  load events + habit states + contract
  → runStateMachine()        // §2 states, pure function (doc 02 §2)
  → runDiagnosisTriggers()   // reason accumulation / wobbling (doc 02 §5)
  → planTomorrow()           // reminder windows, NMT setups, celebration checks
  → generateOutbound()       // notification payload + deep-link opener PAIRS (doc 03 §2),
                             //   T1 default, escalate flagged users to T2
  → governor.enqueue(candidates)   // §6 decides what actually sends
```

**Event-driven interrupts** (real-time, not nightly):

- `completion` → instant T0 ack; if prior state ∈ {lapsed,dormant} → **Comeback** transition +
  celebration (doc 04 §4). State changes never wait for midnight.
- `miss` while floor still viable tonight → **one** L2 same-day offer via governor (doc 02 §7).
- inbound `chat` → live conversation (T1/T2 by recipe).
- `distress` flag from classifier → immediate clamp to supportive + protocol (doc 03 §5).

**State machine** = a pure, unit-tested function `nextState(habit, events, now)`. Keep it
deterministic and inspectable (doc 02 §2) — no LLM in the transition logic; the LLM only writes
the *words*, never decides state.

## 5. LLM orchestration layer

A `CoachLLM` service, one method per interaction type. Each method: (1) assembles the fixed
**context recipe** with its token budget (doc 03 §2), (2) applies **safety + style resolution
in code** (personality axes → resolved style, then state caps, then safety clamps — doc 03 §4),
(3) calls the right **tier**, (4) returns text or a structured object.

| Tier | Used for | Model (reconfirm at build) |
|---|---|---|
| **T0** none | check-off, streak/consistency math, scheduled sends of precomputed copy, state transitions | — |
| **T1** small/fast | routine acks, notification copy, summarization, celebration lines | **Haiku 4.5** |
| **T2** frontier | onboarding synthesis, diagnosis, L4/L5 challenges, weekly review, re-planning | **Sonnet 5**, → **Opus 4.8** for the hardest tone/diagnosis |

- **Structured outputs** (tool-use / JSON schema) for onboarding synthesis (goal classification,
  doc 02 §1) and diagnosis — validated at the tool layer so the model retries on mismatch.
- **Prompt-injection hygiene** (doc 03 §5): user text is quoted as *data*; style bounds + safety
  state live in code, never in prompt-editable content; commitment quotes rendered verbatim +
  dated.
- **Deep-link contract:** notification + its conversation opener generated as one unit on the
  tick and cached; the model only generates live from turn 2 (doc 03 §2) — latency + coherence win.
- **Cost guardrails:** per-user daily token ceiling; degrade to shorter recipes under load;
  conversation-length governor caps runaway threads (doc 04 §5).

## 6. The Outbound Governor (single choke point)

One module. Every candidate message — from the tick or an interrupt — passes through
`governor.send(candidate)`, which enforces, in order (doc 02 §6, doc 03 §8):

1. **Budget** (≤ `user.notif_budget`/day, default 3) and **quiet hours**.
2. **State caps** — refuses L4+ for lapsed/dormant/wobbling users regardless of what asked
   (never kick someone down, doc 02 §6.3).
3. **Safety clamps** — distress → supportive only; sensitive domain → no savage (doc 03 §5).
4. **Cooldowns** — 1×L3+/habit/24h, 1×L4+/48h, 1×L5/48h.
5. **Two-ignores rule** — same-shape intervention ignored twice → retire that shape 7d, change
   tactic.
6. **Log every decision** to `Intervention` / `OutboundQueued` (sent *and* suppressed, with
   reason) — this is the corpus + the audit trail.

Because the push/notification client is imported *only* here, spam and dark-pattern engagement
mechanics are architecturally impossible, not just policy-discouraged — the claim doc 01-C10 /
doc 03 §8 makes in public.

## 7. Phase-1 build order (maps doc 05 §3 → components)

Ship in this sequence; each step is demoable.

1. **Skeleton** — Expo app + NestJS + Postgres + auth (device id) + `/devices`. CI + Render.
2. **Onboarding → first rep** (doc 04 §1) — `POST /onboarding` (T2 synthesis) + confirm; the
   First Rep celebration; post-value push permission ask. *Activation instrumented from day 1.*
3. **Today + check-ins** (doc 04 §3) — `/today`, `/checkin`, backfill; lock-screen actionable
   notifications (done/floor/not-today). T0 only.
4. **State machine** (doc 02 §2) — pure function + `state_since`; the nightly tick shell.
5. **NMT + Comeback** (doc 02 §7, doc 04 §4) — interrupts + the tomorrow-morning setup; the save
   celebration. *This is the hypothesis-testing core (doc 05 §1) — instrument comeback rate.*
6. **Governor + notifications** (§6) — budgets, quiet hours, deep-link openers, the gallery
   (doc 04 §7). Everything outbound routes here.
7. **Basic chat** (doc 04 §5), Coach style only — `/chat` with recipes + tiering; one-next-action
   rule; brevity governor.
8. **Logging schema live** — `Prescription` + `Intervention` written from the first
   intervention, even though diagnosis/learning is thin in Phase 1 (doc 02 §9). *Do not defer
   this — retrofitting the corpus later starts the moat a year late.*

Deferred to Phase 2+ (already scoped out, doc 05 §2): Four-Laws diagnosis conversations, Firm/
Minimal/Savage styles, weekly review generation, the learning loop. Their tables exist in v1;
their logic lands later.

## 8. Open technical questions (for the next pass)

1. **REST vs. tRPC** — tRPC's end-to-end types are attractive with an all-TS stack; REST is more
   portable. Lean tRPC for solo-dev velocity unless a non-TS client is foreseen.
2. **Streaming chat transport** — SSE (simple, one-way) vs. WebSocket. SSE likely enough for v1.
3. **Where does the app live** — an `/app` folder in this repo, or its own repo? (This repo is
   currently docs-only; recommend a separate `accountability-coach-app` repo to keep design vs.
   code history clean, or a monorepo with `/docs` + `/app` + `/api`.)
4. **Distress classifier** — cheap first-pass (keyword + a T1 classification call) vs. a proper
   fine-tune; v1 = the cheap version, but validate recall on a red-team set (doc 03 §6) before
   any Savage ships.
