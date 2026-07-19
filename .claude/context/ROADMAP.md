# Accountability Coach — Roadmap

## Source of Truth

Product design lives in [`docs/`](../../docs/README.md). The build sequence is defined in
`docs/09-technical-architecture.md` §7 (Phase-1 order).

## Key Objectives

_Update as scope evolves. Run `/status` to see current WIP plans._

1. **Sensing loop** — capture check-ins and derive user state (streaks, misses, momentum)
2. **State machine** — model the accountability lifecycle (onboarding → active → NMT → comeback)
3. **Governor** — decide when/how the coach intervenes (tone, cadence, escalation)
4. **Coach chat** — the conversational surface over the behavioral engine

## Build Order (Phase 1)

Per `docs/09-technical-architecture.md` §7:

1. Skeleton (backend + app + database wired, health check green)
2. Onboarding
3. Check-ins
4. State machine
5. NMT / comeback flow
6. Governor
7. Chat

## Active Workspaces

| Workspace  | Stack                     | Purpose                                  |
|------------|---------------------------|------------------------------------------|
| `backend`  | NestJS + TypeScript       | Coach brain — sensing loop, governor, API |
| `app`      | React Native + Expo       | Mobile app (iOS + Android)               |
| `database` | Sequelize + PostgreSQL    | Models + migrations                      |

## How to Track Progress

- `/status` — current WIP plans and recent git activity
- `/planner` (or `plan` skill) — turn a spec into a phased plan under `context/plans/`
- `/implement` — execute a plan step
- `/sync-context` — refresh `mindmaps/` + `codebase-map.md` from the codebase
