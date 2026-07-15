# AI Accountability & Habit Coach — Product Design

A mobile-first AI accountability partner: it turns a goal into a system, senses when you're
slipping, diagnoses *why* (not just *that*), and intervenes — with an intensity you control.
Built on the behavior-change science of Atomic Habits, without ever reading like the book.

**Status:** PRD v1 — design phase. No code yet; the next step is Phase 0 (doc 05 §3).

## The one-paragraph thesis

Habit apps track; this product *coaches*. Its core loop is not the reminder but the
**comeback**: the make-or-break moment of any goal is the day after a miss, and the entire
product — engine states, notification budgets, tone system, metrics — is organized around
winning that moment ("Never Miss Twice" as organizing principle, not feature). The moat is a
sensing loop that acts without being summoned, structured memory of the user's own
commitments ("receipts"), and a logged intervention→outcome corpus that makes the coaching
measurably better over time.

## Reading order

| Doc | What it is |
|---|---|
| [00 — Founding Brief](00-founding-brief.md) | The founder's original PRD, verbatim. Source of truth; later docs amend it explicitly |
| [01 — Critique & Positioning](01-critique-and-positioning.md) | Ten challenges to the brief (C1–C10), competitive frame, beachhead, pricing, amended principles |
| [02 — Behavioral Engine](02-behavioral-engine.md) | The decision engine: goal taxonomy, habit state machine, miss-reason diagnostics, Four Laws prescription trees, Never-Miss-Twice protocol, intervention governor rules |
| [03 — AI Architecture](03-ai-architecture.md) | Memory stores, context recipes, model tiering & cost, personality-as-constrained-range, safety stack, evals, the sensing loop |
| [04 — UX & Flows](04-ux-flows.md) | Onboarding (with copy), daily loop, miss→comeback arc, chat rules, weekly review, notification gallery & anti-gallery |
| [05 — MVP Scope & Metrics](05-mvp-scope-and-metrics.md) | What v1 proves, scope in/out, phased build with kill criteria, metrics tree, risk register, decisions needed |

## Design decisions snapshot (v1)

- **Comeback over streak** — NMT save rate is the product-works metric; no daily-streak-loss
  mechanics, ever (01-C1, 02 §7–8)
- **Earned intensity** — Savage mode unlocks at day 14 behind preview-consent and hard
  state/domain caps; nobody gets challenged while they're down (01-C5, 03 §4–5)
- **Identity is output, not input** — no identity statements at onboarding; the ledger of
  reps is the identity UI (01-C6)
- **Onboarding ends in a rep, not a plan** — first two-minute rep inside the first five
  minutes (01-C7, 04 §1)
- **Sense honestly** — silence triggers questions, never accusations; lock-screen one-tap
  check-ins keep signal flowing (01-C4, 02 §3, §6.4)
- **One governor** — no code path can contact the user except through a budgeted,
  cooldown-enforcing initiative governor (03 §8)
- **Graduate loudly** — success ends the arc, not the relationship; graduations are counted
  separately from churn (01-C10)

## Working agreement

Doc 00 is the founding source of truth; docs 01–05 are the current design. When a decision
here is overturned, update the doc *and* the snapshot above — this repo is the single place
where "what are we building?" has an answer.
