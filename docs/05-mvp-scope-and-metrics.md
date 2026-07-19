# 05 — MVP Scope, Metrics & Risks

> **Role:** Lead PM closing the loop: what we build first, how we know it's working, what
> can kill it, and the decisions that need founder sign-off. Principle for every scope call:
> **the MVP must prove the coaching loop changes behavior — everything else is optional.**
> A beautiful tracker with a chatbot proves nothing; the market has fifty of those.

---

## 1. What the MVP must prove (the two hypotheses)

1. **The comeback hypothesis (product):** users with the coach recover from their first miss
   at a meaningfully higher rate than users with reminders alone. If NMT-save rates don't
   beat a reminders-only baseline, the intervention engine — the entire premise — isn't
   landing, and no amount of feature-adding fixes that.
2. **The relationship hypothesis (retention):** by week 4, users describe the product as
   *someone*, not *something* ("my coach noticed…" in feedback), and W4 retention beats
   habit-tracker norms.

The MVP is the smallest product that can falsify these. Hence the scope below.

## 2. Scope table

### IN (v1)

| Feature | Scope note |
|---|---|
| Onboarding | Exactly as doc 04 §1 — incl. First Rep and post-value permission ask |
| Goals & habits | **One active goal**, habit slots ≤3 but slot 2 gated (doc 02 §1). Habit + project shapes; outcome goals accepted but decomposed with the leading/lagging contract |
| State machine | All states, doc 02 §2 — this *is* the product |
| Check-ins | Doc 04 §3 incl. lock-screen actions + reason taps + backfill |
| Four Laws diagnosis v1 | Rule-based (doc 02 §5), full prescription + experiment loop **with outcome logging from day one** (the corpus, critique C9) |
| NMT protocol + Comeback flow | Doc 02 §7 / doc 04 §4 — the crown jewels |
| Chat | Doc 04 §5 rules; tiered models (doc 03 §3) |
| Notifications | Governor + budgets + gallery; notification/opener pairs |
| Styles | Coach · Firm · Minimal at launch; **Savage ships behind the day-14 trust unlock** (critique C5 — the lock is a feature and a marketing beat) |
| Weekly review | Doc 04 §6, 5 cards |
| Safety stack | Doc 03 §5 complete — not negotiable, not deferrable |
| Voice | OS dictation + voice-note why/miss-note only (doc 04 §8) |
| Platform | React Native (Expo), single codebase, iOS + Android shipped together (D2 — decided). Operational note: stagger the *marketing* push per store so review/QA surprises surface on one storefront first |

### OUT (v1) — each with the reason

| Cut | Why |
|---|---|
| Automatic style rotation | Needs data + trust; erratic personality is worse than static (critique C5). Ship "announced shifts" only |
| Calendar / wearable / screen-time integrations | Sensing v2. The self-report + notification-action loop must work first |
| Accountability partners / social | Different product muscle; adds moderation surface; post-PMF |
| Advanced analytics dashboards | The weekly review IS the analytics; dashboards are tracker-thinking |
| AI voice replies | Cost + latency + novelty risk; text coach must earn love first |
| Learned models (risk scoring, bandits) | v2 — but their logging schema ships in v1 (doc 02 §9) |
| Identity statement screens | Identity is earned output, not a feature (critique C6) |

## 3. Build order (phases with kill/pivot criteria)

**Phase 0 — SKIPPED (decision D6, 2026-07-18).** The manual coach-in-the-loop pilot was cut
on a founder insight the design should honor: part of this product's value is that people
confide goals and failures to an AI *because it isn't a person*. A human-delivered WhatsApp
pilot distorts exactly the psychology it would try to measure — pilots would perform for a
watching founder (social desirability), then behave differently with the app.
**Consequence:** script validation moves into Phase 1 — the first ~50 beta users are the
script lab. Every coaching message variant logs its outcome from day one (the doc 02 §5
experiment loop), and Phase 1's gates below now carry the burden Phase 0 would have carried.

**Phase 1 — The loop (6–8 weeks).** Onboarding → habit → check-ins → state machine →
NMT → basic chat (Coach style only) → governor + notifications. TestFlight, 50–100 users.
→ **Gate to Phase 2:** activation (first rep <24h) ≥60%; comeback rate after first miss
≥40%; users who hit a miss and *return* rather than ghost ≥50%.

**Phase 2 — The brain (4–6 weeks).** Four Laws diagnosis + prescriptions + experiment loop;
weekly review; Firm/Minimal styles; reason-tap analytics.
→ **Gate:** prescription acceptance ≥50%; weekly review open rate ≥60%; W4 retention ≥25%.

**Phase 3 — The edge (4 weeks).** Savage unlock + full eval/safety suites; comeback/share
moments polish; paywall + pricing test.
→ **Gate to scale spend:** trial→paid ≥8–12%; the coach-vs-reminders A/B (§4) shows a real
NMT lift.

## 4. Metrics tree

**North star: Weekly Consistent Users (WCU)** — users completing ≥80% of *scheduled* reps in
the rolling week. It's an outcome metric a DAU-chaser can't game: it only grows if users
actually do their reps. (DAU is explicitly not a goal — a perfect day in this product is two
notifications, one tap, zero minutes of screen time.)

**The product-works metric: NMT save rate** — % of first misses followed by a completion
within 24–48h. Proven via the honest experiment: **coach arm vs. reminders-only arm** on the
same app shell. This A/B is Phase 3's centerpiece; a positive result is both the
green-light to scale and the marketing asset ("users with the coach were N× more likely to
recover from a missed day").

| Layer | Metric | v1 target |
|---|---|---|
| Activation | first rep < 24h of install | ≥60% |
| Activation | notification opt-in (post-value ask) | ≥70% |
| Core loop | check-in response rate (any of 3 buttons) | ≥70% |
| Core loop | **NMT save rate** | ≥40% (vs. reminders-only baseline) |
| Core loop | comeback-vs-ghost after first miss (returned within 72h) | ≥50% |
| Coaching | prescription acceptance / experiment completion | ≥50% / ≥60% |
| Trust | notification action rate (floor per type; auto-throttle below it) | ≥25% |
| Trust | "ease up" usage (healthy = nonzero; alarm if >20%/wk — tone miscalibrated) | 2–10% |
| Retention | W4 / W12 retention | ≥25% / ≥12% |
| Retention | graduation rate + graduate→new-goal conversion | track; convert ≥40% |
| Business | trial→paid; 12-mo LTV vs. CAC | ≥8–12%; LTV ≥3× CAC |

**Anti-metrics (watched to stay low):** session length (long sessions = the chat is
sprawling, doc 04 §5), notifications/user/day vs. action rate (spam drift), Savage
enablement among flagged-sensitive users (must be zero — enforced, then verified).

## 5. Risk register

| # | Risk | Sev | Mitigation |
|---|---|---|---|
| R1 | **Avoidance-spiral churn** — challenged users ghost | Critical | The entire C1 architecture: comeback-first design, state intensity caps, backlog-free re-entry. Watch comeback-vs-ghost weekly |
| R2 | **A Savage-mode screenshot goes viral for the wrong reason** | Critical | Trust-gate + preview consent + state/domain caps + red-team suite (doc 03 §5–6) + audit log of every L5 send. Incident response drafted before launch |
| R3 | **Coaching feels generic** ("ChatGPT wrapper") | High | Receipts (verbatim whys), pattern-card insights, prescription memory — the structured-memory stack (doc 03 §1). If week-4 users can't cite one "it knows me" moment, escalate to founder |
| R4 | **Notification fatigue → channel death** | High | Governor budgets, per-type action-rate floors with auto-throttle, quiet hours default-on |
| R5 | **LLM cost blowout** | Medium | Tiering + recipes + ceilings (doc 03 §3); free tier consumes ~zero inference |
| R6 | **Self-report data is dirty** → engine misdiagnoses | Medium | Honesty-cheap design (doc 02 §3); diagnose on accumulation not single events; never litigate |
| R7 | **Platform risk: general assistants ship habit coaching** | Medium | Speed + the three moats (sensing loop, corpus, relationship — critique C9). We can't out-model them; we can out-*loop* them |
| R8 | **App review / health-adjacent scrutiny** | Medium | Sensitive-domain registry, crisis protocol, no medical claims, age gate 16+ |
| R9 | **Dependence/ethics criticism** ("app engineered to be needed") | Medium | Graduation as a public, celebrated feature; governor invariant (no path to user except through budgeted governor); publish the coaching philosophy openly |
| R10 | **Coaching scripts ship untested on humans** (Phase 0 skipped, D6) | Medium→High | Phase 1 beta doubles as the script lab: intervention-outcome logging live from day one, message variants A/B'd on the first ~50 users, eval suite freezes winners as tests before scale. Watch Phase 1 gates closely — they now do Phase 0's job |

## 6. Decision log (founder sign-off)

| # | Decision | Outcome | Status |
|---|---|---|---|
| D1 | Beachhead | Atomic Habits audience: 24–38 professionals, one self-improvement goal; "read the book, still can't stick" wedge (critique C2) | ✅ Decided 2026-07-18 |
| D2 | Platform | React Native (Expo), single codebase — iOS + Android launched together. (Amends the doc's iOS-first recommendation; see §2 IN-table note on staggered marketing) | ✅ Decided 2026-07-18 |
| D3 | Savage at launch | Yes — behind the day-14 trust unlock + full safety stack (critique C5) | ✅ Decided 2026-07-18 |
| D4 | Pricing | $12–15/mo, ~$79/yr anchor, 14-day full-coach trial; free tier = tracker without the brain | ✅ Decided 2026-07-18 |
| D5 | Name | Candidate list + shortlist in doc 06; availability vetting before final call. Branding workstream queued behind it (doc 06 §5) | 🔶 In progress |
| D6 | Phase 0 commitment | **Skipped** — founder call: users confide in an AI precisely because it isn't a person; a human-run pilot distorts the psychology it would measure. Script validation folds into the Phase 1 beta (§3) | ✅ Decided 2026-07-18 |

## 7. Open questions for the next working session

1. **Multi-habit tension:** when slot 2 unlocks, does the weekly review unify or stay
   per-habit? (Leaning: unified review, per-habit ledgers.)
2. **Project-goal working sessions:** do sessions need in-app timers/focus mode, or is
   check-in enough for v1? (Leaning: check-in only; timers are scope creep.)
3. **The graduation conversation script** — doc 02 defines the trigger; the ceremony and the
   "what's next" flow need the doc-04 treatment.
4. **Win-back mechanics for churned (not graduated) users** — fresh-start revival exists
   (doc 02 §6.4); is there an ethical re-onboarding for 90-day-gone users?
5. **What does the founder's Phase-0 coaching diary look like** — template needed so the
   manual phase produces structured data the engine can inherit.
