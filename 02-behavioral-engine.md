# 02 — The Behavioral Engine

> **Role:** Behavioral psychologist + systems designer. This is the product's decision
> engine: how goals become systems, how the app senses state, how it diagnoses failure, and
> which intervention it deploys. Everything here is deliberately implementable as rules +
> logged outcomes first (v1 = deterministic, inspectable), with learning added later (§8).
> The Four Laws (Atomic Habits) are the diagnostic taxonomy; Gollwitzer's implementation
> intentions, the fresh-start effect, and self-determination theory fill the gaps the book
> doesn't cover. The user never sees any of this vocabulary.

---

## 1. Goal intake: classify before you decompose

Every goal is classified at intake into one of three shapes (critique C3). The classifier is
the first LLM call of the relationship and its output is structured, not prose:

```
GoalIntake {
  raw_goal: string            // user's words, verbatim — never overwritten
  why: string                 // user's words, verbatim — the single most valuable field
  shape: habit | project | outcome | hybrid
  domain: fitness | learning | craft | business | wellbeing | relationships | other
  sensitive: bool             // body/weight, mental health, grief, addiction → engine caps (doc 03 §5)
  proposed_habit: {...}       // see below
  lagging_metric?: {...}      // outcome goals only
  milestones?: [...]          // project goals only
}
```

**Decomposition per shape:**

- **Habit goal** ("run consistently", "read every day") → one keystone habit, directly.
- **Project goal** ("launch the podcast by October") → a *working-session habit* (the
  repeatable unit: "45-min podcast block, Mon/Wed/Fri") + 3–6 milestones with target weeks.
  Daily coaching runs on the sessions; weekly coaching checks the milestone drift.
- **Outcome goal** ("lose 10 kg") → decomposed into 1–2 leading habits + the lagging metric,
  with the leading/lagging contract made explicit in onboarding copy: *"We can't control the
  scale. We can control the reps. If four honest weeks of reps don't move it, we change the
  system — not the effort."* A monthly system retrospective is auto-scheduled.

**Habit sizing rules (applied to every proposed habit):**

- Frequency ≥3×/week. Below that, automaticity doesn't form (context repetition is the
  mechanism; Lally et al. 2010 — median 66 days to automaticity, and single missed days
  don't measurably hurt formation. This number also sets *our* expectations: an arc is 8–12
  weeks, and the product must never imply 21-day magic).
- Every habit ships with its **two-minute floor** pre-negotiated at creation ("full rep: 30-min
  run · floor: shoes on, out the door, 2 minutes"). The floor is not a fallback invented
  during failure — it's part of the habit's definition, so downshifting later carries no
  shame surcharge.
- Every habit gets an **implementation intention**, not a time slot: "After [existing anchor],
  I [habit] at [place]" — the after-X format outperforms bare reminders by a wide margin
  (Gollwitzer & Sheeran 2006 meta-analysis, d ≈ .65; this is the single best-evidenced move
  in the entire behavior-change literature, which is why cue design is checked first in every
  diagnosis, §5).
- **One new habit at a time** is the default and the strong recommendation in copy. Slots
  exist for up to 3, but slot 2 unlocks only after slot 1 reaches Building state. Constraint
  is a feature: "we do one thing until you'd bet on yourself, then we add."

## 2. The habit state machine

Each habit instance moves through states. State determines: notification budget, allowed
intervention intensity, tone caps, and what "success" means this week. All thresholds below
are v1 defaults, expected to be tuned.

| State | Entry condition | Coach posture | Max intensity (see §6) | Notif budget/day |
|---|---|---|---|---|
| **Calibration** (days 1–7) | habit created | Experimenter. Failures here are *sizing errors owned by the coach*, not user failures: "we sized it wrong, let's cut it down" | L2 | 2 |
| **Building** (≈ weeks 2–8) | ≥70% completion in Calibration week | Full coaching. This is where the engine earns its keep | L4 (L5 if Savage unlocked) | 2–3 |
| **Wobbling** | early-warning triggers: 7-day rate drops ≥25% from trailing 28-day; or 2 snoozes in 3 days; or completions drifting ≥90min later than usual | Diagnostician. Runs the Four Laws check (§5) *before* the crash, not after | L3 | 2 |
| **Lapsed** | 2 consecutive misses, or 7-day rate <40% | Rescuer. **Hard cap on intensity regardless of style opt-ins** — never kick someone on the floor. Only moves allowed: never-miss-twice, downshift, state-check | L2 | 1–2 |
| **Dormant** | 7 days no signal (no check-ins, no opens, no notification actions) | Withdrawn-with-dignity. One honest message, then silence with scheduled fresh-start revival (§6.4) | L1 | ~1/week |
| **Comeback** | first completion after Lapsed/Dormant | Celebrant. This transition gets the loudest positive moment in the app — louder than streaks | L1 (celebration only) | 1 |
| **Consolidating** (≈ weeks 8–12) | 4 consecutive weeks ≥80% | Reducer. Coach deliberately steps back; user should feel ownership transferring | L3 | 1 |
| **Graduated** | user reports automaticity + 6 weeks ≥80%; confirmed in a graduation conversation | Alumni mode: weekly pulse, zero daily touch. Triggers the "what's next?" arc invitation (critique C10) | L1 | ≤1/week |

Transitions fire on the nightly coach tick (doc 03 §6) plus event-driven interrupts
(a completion can move Lapsed → Comeback instantly; state changes never wait for midnight to
celebrate).

**Design note — Wobbling is the money state.** Every other habit app has two states: fine
and gone. The entire "notices you're slipping" promise lives in detecting Wobbling and
intervening *while the user is still reachable*. The three trigger heuristics above are
deliberately cheap and interpretable; §8 upgrades them with learned risk later.

## 3. Signals: what the engine can actually see

Honest inventory (critique C4). Everything downstream must degrade gracefully as signal
thins.

| Signal | Source | Reliability | Notes |
|---|---|---|---|
| Completion / miss + timestamp | check-in (app or lock-screen action) | Medium — self-report | Lateness vs. window is itself a signal |
| **Miss reason (one tap)** | miss flow: `forgot / no time / didn't feel like it / too hard / life happened` | High value | **This is the diagnostic sensor** — see §4 |
| Snooze / dismiss / ignore | notification interactions | High | Two ignores of same intervention shape = tactic change (§6) |
| App opens, chat initiated | client events | High | Opens without check-in = ambivalence signal |
| Chat content | user messages | High, sparse | Mood/overwhelm cues feed safety layer (doc 03 §5) |
| Explicit statements | "this week is brutal", "ease up" | Highest | Always outranks inference; stored to the contract immediately |
| Silence | absence of all of the above | **Ambiguous — never treat as failure** | Drives the humble-escalation ladder (§6.4), phrased as questions |

Two data-quality rules, because a coach fed lies coaches the lie:

1. **Make honesty cheap.** "Didn't do it" is one neutral tap, visually equal to "done" — not
   a red X. Backfill ("actually I did run yesterday, forgot to log") is one tap from the next
   check-in, no guilt copy. Social-desirability pressure is the enemy of the dataset.
2. **Never litigate self-report.** The coach believes the user. If the pattern of claims and
   outcomes diverges wildly (perfect logging, zero progress feeling in chat), that's a
   *system retrospective* conversation, not an accusation.

## 4. The miss taxonomy is the Four Laws diagnostic, in disguise

The five miss-reason taps map directly onto which Law is failing — every miss becomes
labeled diagnostic data without the user ever being interrogated:

| Tap | Primary hypothesis | Law |
|---|---|---|
| "forgot" | cue failure — habit isn't obvious | **1 — Obvious** |
| "no time" | scheduling/friction failure (or an over-full life the plan ignored) | **3 — Easy**, sometimes re-planning |
| "didn't feel like it" | craving failure — habit isn't attractive; check reward too | **2 — Attractive** (secondary: 4) |
| "too hard" | effort failure — habit oversized | **3 — Easy** (two-minute floor) |
| "life happened" | no design failure — grace, no diagnosis, NMT protocol only | none — do **not** pathologize noise |

One tap is a data point; the engine diagnoses on *accumulation* (≥2 of the same reason in 7
days, or Wobbling entry) — reacting to every single miss with a redesign conversation would
be exhausting and statistically illiterate.

## 5. Diagnosis → prescription: the Four Laws decision tree

Triggered by: reason accumulation (§4), Wobbling entry, or the user asking for help. The
conversation follows a strict shape: **one probe question max → one prescribed change →
framed as an experiment with a review date.** Never two changes at once — otherwise neither
the user nor the engine learns what worked.

### Law 1 — Make it obvious (checked first; best evidence base)
- **Symptoms:** "forgot" taps; completions at random times; low notification response.
- **Probe:** "Where were you supposed to be when this was meant to happen?"
- **Prescriptions:** rewrite the implementation intention onto a *real* existing anchor
  ("after I pour my morning coffee" beats "at 7am"); habit-stack onto an observed routine;
  physical environment cue (shoes by the door, book on the pillow); retune the reminder
  window to when completions *actually* happen (the engine has the timestamps — use them).

### Law 2 — Make it attractive
- **Symptoms:** "didn't feel like it" taps; dread language in chat; long open-to-action gaps.
- **Probe:** "What's the version of this you'd almost look forward to?"
- **Prescriptions:** temptation bundling (podcast/playlist only during the habit — Milkman);
  reframe from avoid-goal to approach-goal; pair with a person or place they like; replay
  their own why, verbatim, dated ("On March 3rd you said: '…' — still true?"). The
  self-determination-theory point matters here: pressure from *their own stated values* is
  autonomy-supportive; pressure from the app's expectations is introjected and predicts
  dropout. Always challenge with their words, not ours.

### Law 3 — Make it easy
- **Symptoms:** "too hard" / "no time" taps; partial completions; long time-to-start.
- **Probe:** "What's the annoying part — starting it, or finishing it?"
- **Prescriptions:** invoke the two-minute floor *as strategy, not defeat* ("we're protecting
  the identity, not the workout — floor reps count"); friction audit (prep the night before;
  move the where/when); scope cut with explicit consent ("smaller but never zero"). If "no
  time" persists ≥2 weeks: the plan is wrong, not the person — trigger re-planning, offer to
  shrink frequency honestly rather than let 5×/week fail into 0.

### Law 4 — Make it satisfying
- **Symptoms:** completes but joylessly; Wobbling despite ease; "what's the point" energy;
  the classic week-3–5 dip when novelty is gone and results aren't visible yet.
- **Probe:** "When you finish, how does it actually feel — anything, or nothing?"
- **Prescriptions:** attach an immediate reward ritual; make the check-off itself satisfying
  (this is a UX requirement, doc 04 §3); surface the ledger ("47 sessions total — scroll
  back to week one"); goal-gradient framing near milestones ("2 sessions from your best
  month"); *never* fake external rewards for intrinsically-motivated users — extrinsic
  rewards can crowd out intrinsic motivation (overjustification effect), so reward
  prescriptions attach to users showing low intrinsic signal, not everyone.

**The experiment loop:** every prescription is logged
(`prescription, timestamp, review_date`) and reviewed on schedule ("3 days ago we moved the
run to lunch. Verdict?"). Outcome (completion delta over the window) is written back. This
log is the engine's memory of *what works on this user* — and, aggregated, the
intervention-outcome corpus that is the product's long-term moat (critique C9).

## 6. The intervention governor: escalation, cooldowns, and floors

All coach-initiated contact flows through one governor (single architectural choke point,
doc 03 §6) enforcing:

### 6.1 Intensity ladder
- **L1 — Presence:** celebrations, weekly review, morning brief. Always allowed.
- **L2 — Nudge:** contextual reminder, NMT move, downshift offer.
- **L3 — Question:** "what happened?" / state check / diagnosis probe.
- **L4 — Challenge:** commitment-gap confrontation: *"You said X. You're doing Y. Which is
  true?"* Requires Firm+ style and Building state.
- **L5 — Direct challenge (Savage register):** requires explicit opt-in + unlock (critique
  C5) + Building/Consolidating state + no sensitive domain + no distress flags. Cooldown: one
  L5 per 48h max.

### 6.2 Cooldowns and adaptation
- Max one L3+ intervention per habit per 24h; max one L4+ per 48h.
- **Two ignored interventions of the same shape → that shape is retired for this user for 7
  days and a different tactic is tried.** Persistence without adaptation is spam.
- Every "ease up" instantly caps intensity at L2 for 72h and adjusts the standing contract;
  "go harder" raises the ceiling one level within the user's allowed range.

### 6.3 Floors (non-negotiable, style-independent)
- Lapsed/Dormant users get L2 max. Nobody gets challenged on the floor.
- Distress signals (doc 03 §5) drop everything to supportive mode.
- No challenge references body, appearance, worth, or comparisons to other users, in any
  style, ever. Challenge targets the gap between *their* commitment and *their* action.

### 6.4 The silence ladder (Dormant protocol)
Day 1 of silence: L2 nudge with one-tap check-in. Day 2: NMT move ("yesterday's gone —
today's rep is the whole game; here's the floor version"). Day 3–4: state check, question
form, with a downshift and a "pause this goal" option offered honestly. Day 7: the dignity
message — *"I'm not going to keep pinging you. The plan's here when you want it, and so am
I. One tap brings it back."* — then silence, with revival scheduled on the next fresh-start
landmark (Monday / new month; the fresh-start effect is one of the most reliable re-entry
levers we have). Pause/stop options are surfaced at every rung — a user who mutes us in
Settings is lost; a user who tells us "pause" is retained.

## 7. Never Miss Twice: the core mechanic, fully specified

- **Detection:** habit window closes without a check-in → miss recorded provisionally
  (backfill can flip it, §3).
- **Timing rule:** the NMT conversation happens **the next morning**, not at 11:58pm.
  Late-night guilt produces nothing but bad sleep and app-avoidance. Exception: if the window
  just closed and the floor version is still viable tonight, one L2 offer, once: "2 minutes
  before bed still counts. Floor rep?"
- **Content rule:** zero backlog framing (missed day is never shown as a debt), zero streak
  mourning. The message is forward-only: *"One miss is a data point, not a verdict.
  Tomorrow's rep is the one that decides which way this goes. I've set you up with the floor
  version — 2 minutes."* The next day's target auto-downshifts to the floor unless the user
  overrides.
- **The save:** completing the day after a miss = an **NMT save**, celebrated explicitly and
  recorded as a first-class stat: *"That's a save. Most people never learn this move —
  missing once is human, missing twice is a choice, and you just made the right one."*
- **Second consecutive miss** → Lapsed state: intensity floor engages, diagnosis waits until
  re-entry (a lapsed user needs a door, not a quiz).

## 8. Scoring, streaks, and what we refuse to build

- **Consistency %** (rolling 7-day and 28-day, over *scheduled* days) is the primary number.
  A **consistent week** = ≥80% of scheduled reps.
- The chain the user builds is **consecutive consistent weeks** — coarse-grained on purpose:
  one bad Tuesday cannot vaporize 60 days of identity evidence. Duolingo needed streak
  freezes to patch daily-streak loss-aversion churn; we design the wound out instead of
  selling the bandage.
- **The ledger** (total reps ever, per habit — "votes for the identity") only goes up.
  Displayed prominently; this is the identity UI (critique C6).
- **NMT saves** and **comebacks** are counted and displayed with pride equal to streaks.
- **We refuse:** daily-streak-loss framing, XP/points/levels, leaderboards, red missed-day
  calendars. Every one of these imports extrinsic pressure that either crowds out intrinsic
  motivation or turns one bad day into a churn event. The reward is evidence of becoming —
  not gems.

## 9. Learning loop (v2+, but the schema ships in v1)

v1 is rules + logged outcomes. Because §5's experiment loop writes
`(user_state, diagnosis, prescription, outcome)` and §6 logs
`(intervention, context, response_within_Nh)` from day one, v2 can:

- rank prescriptions per user (simple bandit over the template library);
- learn per-user best contact times and notification phrasings from response rates;
- upgrade Wobbling detection from 3 heuristics to a small risk model (features: rate trend,
  completion-time drift, snooze pattern, days since last chat).

The moat is the logged corpus. **Ship the logging schema in v1 even though v1 doesn't learn** —
retrofitting it later means starting the moat a year late.
