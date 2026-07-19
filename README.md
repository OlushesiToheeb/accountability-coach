# AI Accountability & Habit Coach — Product Design

A mobile-first AI accountability partner: it turns a goal into a system, senses when you're
slipping, diagnoses *why* (not just *that*), and intervenes — with an intensity you control.
Built on the behavior-change science of Atomic Habits, without ever reading like the book.

**Status:** PRD v1 — design phase. No code yet; next step is the Phase 1 build (doc 05 §3 —
Phase 0 was skipped per decision D6).

## The one-paragraph thesis

Habit apps track; this product *coaches*. Its core loop is not the reminder but the
**comeback**: the make-or-break moment of any goal is the day after a miss, and the entire
product — engine states, notification budgets, tone system, metrics — is organized around
winning that moment ("Never Miss Twice" as organizing principle, not feature). The moat is a
sensing loop that acts without being summoned, structured memory of the user's own
commitments ("receipts"), and a logged intervention→outcome corpus that makes the coaching
measurably better over time.

**Sharpened by competitive research (doc 07):** proactive AI intervention already ships —
but at two fixed extremes (Overlord = always harsh; Habit Coach AI/Finch = always gentle). No
one occupies the **controllable middle**: a coach you can turn up or down, that reads your
state and never kicks you when you're down. That — plus shame-free-but-serious comebacks and
commitment memory that actually persists — is the open position.

## Reading order

| Doc | What it is |
|---|---|
| [00 — Founding Brief](00-founding-brief.md) | The founder's original PRD, verbatim. Source of truth; later docs amend it explicitly |
| [01 — Critique & Positioning](01-critique-and-positioning.md) | Ten challenges to the brief (C1–C10), competitive frame, beachhead, pricing, amended principles |
| [02 — Behavioral Engine](02-behavioral-engine.md) | The decision engine: goal taxonomy, habit state machine, miss-reason diagnostics, Four Laws prescription trees, Never-Miss-Twice protocol, intervention governor rules |
| [03 — AI Architecture](03-ai-architecture.md) | Memory stores, context recipes, model tiering & cost, personality-as-constrained-range, safety stack, evals, the sensing loop |
| [04 — UX & Flows](04-ux-flows.md) | Onboarding (with copy), daily loop, miss→comeback arc, chat rules, weekly review, notification gallery & anti-gallery |
| [05 — MVP Scope & Metrics](05-mvp-scope-and-metrics.md) | What v1 proves, scope in/out, phased build with kill criteria, metrics tree, risk register, decision log |
| [06 — Naming & Brand](06-naming-and-brand.md) | Name criteria, candidates (real-word + coined/ownable Round 2), collision blocklist, ranked shortlists, vetting checklist, the persona-vs-abstract brand fork |
| [07 — Competitive Landscape](07-competitive-landscape.md) | 2025–2026 market map: AI-native coaches (Overlord, Habit Coach AI, Rocky, Actimate, Keel, Cadence…), incumbent trackers, adjacent stakes/human models, Duolingo benchmark; positioning matrix, validated gaps, pricing/WTP, naming landscape, cautionary tales, market-convergence warning |
| [08 — Savage Mode: Evidence & Guardrails](08-savage-mode-evidence.md) | Reception research on harsh-tone apps (Carrot Fit, Overlord, drill-sergeant coaches) → concrete Savage-mode guardrails; the "receipts not insults" rule; tone-harsh vs. behavior-harsh scope |

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
- **Decided 2026-07-18 (05 §6):** beachhead = Atomic Habits audience · platform = React
  Native, iOS + Android together · Savage ships behind day-14 unlock · pricing $12–15/mo,
  ~$79/yr · Phase 0 skipped — the Phase 1 beta is the script lab.
- **Naming (2026-07-19, doc 06 §6e–f):** ~22 names tested (dictionary + coined + persona) —
  **all taken.** Ballast and Stedd each looked clear on a narrow check, then a founder Google
  search caught live `.io`/`.ai`/store collisions (two false-positives). **Lesson: this
  environment can't definitively clear a name** — WebSearch misses `.io`/`.ai` startups + exact
  store matches. Revised strategy: stop chasing short 2-syllable coinages (class is picked
  over), shift to higher-entropy compounds / 3-syllable coinages / unexpected nouns, and clear
  every candidate with a live browser check (founder-run). Naming is **not** on the build
  critical path (needed at TestFlight branding, D5) — parkable.
- **Savage-mode reception (2026-07-19, doc 08):** research validates D3 — harsh tone works for
  a self-selecting few, decays as novelty, turns radioactive on body/weight. Design rule
  sharpened to "**receipts, not insults**"; Savage is tone (not Overlord-style enforcement).
- **⚠ Convergence:** the market is racing toward this concept — Keel Habits already ships a
  "bounce-back rate over streaks" comeback mechanic. Defensibility must be execution depth
  (governor, memory, safety, sensing loop), not the idea. Speed matters (doc 07 §0).

## Working agreement

Doc 00 is the founding source of truth; docs 01–05 are the current design. When a decision
here is overturned, update the doc *and* the snapshot above — this repo is the single place
where "what are we building?" has an answer.
