# 03 — AI System Architecture

> **Role:** AI systems architect. How the coach is actually built: memory, context assembly,
> model tiering and cost control, the sensing loop, the personality system, and the safety
> stack. Design goal: a coach that feels continuous and personal while most interactions
> cost fractions of a cent — and where the expensive, high-stakes moments (diagnosis,
> challenge, weekly review) get the best model and the tightest guardrails.

---

## 1. Memory: structured stores, not a transcript

A raw chat transcript is not memory — it's a haystack that gets expensive to search and
easy to hallucinate from. The coach's memory is five typed stores, written at the moment
events happen, assembled into context on demand:

| Store | Contents | Written by | Why it exists |
|---|---|---|---|
| **Profile** | style contract (allowed range, current setting, "ease up/go harder" history), schedule shape, sensitivities/domain flags, tone preferences, timezone | onboarding + explicit user statements + settings | The coach must never re-ask what it's been told |
| **Commitment ledger** | goals + their **verbatim, dated whys**; promises made in chat ("I'll do it at 7 tomorrow"); negotiated floors; graduation criteria | intake + chat extraction (T2 model tags candidate commitments; only explicit ones stored) | **The receipts.** Every high-leverage intervention quotes this. Rule: quotes are exact and dated — never paraphrased into something stronger than what was said |
| **Event stream** | completions, misses + reason taps, notification interactions, state transitions | client + governor | The engine's ground truth (doc 02 §3) |
| **Conversation summaries** | rolling per-thread summaries (≤200 tokens each), last-3 verbatim exchanges | post-conversation T1 job | Continuity without transcript costs |
| **Prescription & intervention log** | `(state, diagnosis, prescription, review_date, outcome)` + `(intervention, context, response)` | engine | Per-user "what works" memory; the long-term corpus (critique C9) |

Deletion note: "delete my data" deletes all five stores, verifiably. The commitment ledger
is emotionally sensitive material (people's confessed failures and hopes) — see §7.

## 2. Context assembly: every interaction type has a recipe

No interaction gets "the whole history." Each type has a fixed context recipe with a token
budget, assembled server-side:

| Interaction | Recipe (typical budget) |
|---|---|
| Routine check-in ack | profile snippet + today's event + streak/consistency numbers (≤1k tokens) |
| NMT / nudge conversation | + habit state, last 7 days events, relevant why quote, active prescription (≤2.5k) |
| Diagnosis conversation | + miss-reason histogram, prescription history with outcomes, last conversation summary (≤4k) |
| Weekly review generation | + full 28-day event aggregate, ledger, milestone drift (≤6k) |
| Onboarding synthesis | goal + why only — *and the prompt explicitly says "you know nothing else about this person yet; do not fake personalization"* (cold-start honesty, critique C4) |

**The deep-link contract (critique C8):** a notification and its conversation opener are
generated *as one unit* in the nightly tick. Tapping the notification opens a chat that
continues the thought with zero re-explanation. The opener is precomputed; the model only
generates live from turn 2 onward. This is both a latency win (instant first message) and
the thing that makes notifications feel like a person rather than a system.

## 3. Model tiering and cost control

Three tiers plus a no-model tier. The check-off loop must never wait on an LLM.

| Tier | What runs here | Model class | Notes |
|---|---|---|---|
| **T0 — deterministic** | check-off, streak/consistency math, scheduled sends of precomputed copy, state machine transitions, governor rules | none | Instant UI. Logging a rep is a tap, not a conversation. The coach *reacts* in T1+ only when there's something worth saying |
| **T1 — small/fast model** | routine acks, notification copy variants, conversation summarization, celebration one-liners | small (e.g. Haiku-class) | High volume, low stakes, cache-friendly |
| **T2 — frontier model** | onboarding synthesis, diagnosis conversations, L4/L5 challenges, weekly review, re-planning, anything in Savage register | frontier (e.g. Sonnet/Opus-class) | Low volume, high stakes. Tone-critical work gets the best model *and* the eval suite (§6) |
| **Nightly batch** | per-user coach tick: state eval → next-day plan → notification payload + opener pairs | T1 with T2 escalation for flagged users | Batch pricing; results cached for the day |

**Cost sketch (order of magnitude, per active user per day):** 1 nightly tick (T1, ~2k
tokens) + 2–3 T1 acks + amortized 0.2 T2 conversations (~5k tokens) ≈ **low single-digit
cents/day** → well under $1.50/month per active user at current prices — comfortably inside
a $12–15/mo subscription, and the free tier (tracker without the brain, critique C10)
consumes ~zero inference. Guardrails: per-user daily token ceilings; degrade to shorter
recipes under load; conversation length governor (doc 04 §5) caps runaway threads.

## 4. The personality system: style is a constrained range, not a costume

A style is a point (really a small range) on four axes:

```
directness   0–4   (hint → blunt)
warmth       0–4   (neutral → openly invested)
intensity    0–4   (matches governor levels L1–L5, doc 02 §6)
humor        0–2   (off → dry → playful)
```

Named styles are presets: **Coach** (d2 w3 i2 h1) · **Firm** (d3 w2 i3 h0–1) ·
**Savage** (d4 w2 i4–5 h2 — note warmth stays ≥2: savage-but-invested is the register;
contempt is out of range by construction) · **Minimal** (d1 w1 i1 h0).

Resolution order for any given message:
1. **User contract** (allowed range + current "ease up/go harder" modifiers) sets the outer
   bounds.
2. **Habit state caps** clamp intensity (Lapsed → L2 max, etc. — doc 02 §6.3).
3. **Safety flags** clamp everything to supportive (§5).
4. Within what remains, the engine picks per context — and **announces register shifts**
   ("I'm going to be more direct with you today, because you're negotiating with yourself") —
   legible shifts read as coaching; silent ones read as mood swings (critique C5).

**One scenario, four styles** (canonical calibration set — this table is also the seed of
the tone eval suite, §6). Situation: user's 3rd "didn't feel like it" this week, Building
state, gym habit, why-quote on file: *"I want to be someone my kids copy."*

- **Coach:** "Three 'didn't feel like it's this week. That's not laziness — that's a habit
  that's lost its pull. Want to rebuild the fun version? Also, rereading what you told me on
  day one: 'someone my kids copy.' Still the mission?"
- **Firm:** "That's three this week. You didn't sign up for 'when I feel like it' — you
  signed up for 'someone my kids copy.' Feelings aren't the plan. The floor version is 2
  minutes. Which is it tonight?"
- **Savage:** "Three skips, same excuse. You want your kids to copy you — right now the
  lesson is 'quit when it's boring.' Harsh? You wrote the standard, I'm just reading it back.
  Two minutes. Shoes on. Prove yourself wrong."
- **Minimal:** "3rd skip this week. Floor version tonight — yes/no?"

Note what Savage does and doesn't do: it weaponizes *their own words and standard*, it never
attacks the person ("you're lazy" is out of range), and it lands on an action within reach.
That's the entire art, and it's testable (§6).

## 5. Safety stack

Ordered from always-on to escalation:

1. **Sensitive-domain registry (intake time).** Goals touching body/weight, mental health,
   grief, addiction get flagged (doc 02 §1): intensity capped at L3 forever, Savage never
   available on that goal regardless of opt-in, domain-specific banned framings (no
   food-restriction cheering, no body comparisons). Red-flag goals (extreme calorie targets,
   self-punishment framings) are declined and redirected at intake — kindly, with resources
   where appropriate. This is both ethics and App Store survival.
2. **Distress classifier (every inbound message + miss-pattern monitor).** Cheap classifier
   on all user text; triggers: crisis language, hopelessness, self-harm signals, or
   miss-reasons pattern-matching a life event. On trigger: style clamps to supportive,
   L3+ interventions suspended, and at explicit-risk level the coach steps out of role:
   *"This sounds bigger than habits, and I'm a habit coach — I'd be doing you a disservice
   pretending otherwise."* + region-appropriate crisis resources. The coach never plays
   therapist.
3. **Never-kick-when-down enforcement** is structural (state caps, doc 02 §6.3), not a prompt
   suggestion — the governor refuses to schedule L4+ for Lapsed users even if a prompt asks.
4. **Savage unlock gating** (critique C5): available ≥ day 14, requires preview-consent (user
   sees three real sample messages before enabling), auto-suspends on distress or Lapsed
   entry, "ease up" honored instantly and logged to the contract.
5. **Prompt-injection hygiene:** user text is quoted into prompts as data, never as
   instructions; commitment-ledger quotes are rendered verbatim with dates; system prompts
   assert that nothing in user content can change style bounds or safety state (those live
   in code, not in the prompt).

## 6. Evaluation: tone is a testable surface

The product's differentiation is *how it speaks under pressure* — so that gets CI:

- **Tone-adherence suite:** golden set of (state × style × scenario) cases — §4's table ×
  ~50 scenarios. Graded by a judge model against per-style rubrics (Savage rubric includes:
  references user's own commitment? lands on actionable next step? zero person-attacks? zero
  body/worth content?). Runs on every prompt change; regression blocks deploy.
- **Safety red-team suite:** Savage × vulnerable-user matrix (distress mid-challenge, ED
  domain, grief disclosure mid-conversation, "roast me harder" baiting). Expected behavior:
  de-escalate, clamp, step out of role. Zero tolerance for rubric violations.
- **Cold-start honesty checks:** onboarding outputs audited for fake personalization
  ("as someone who clearly values discipline…" on minute one = fail).
- **Online:** every intervention logs response-within-N-hours (doc 02 §5) — the same corpus
  that powers learning doubles as live quality monitoring; a notification type whose action
  rate decays gets auto-throttled by the governor.

## 7. Privacy and trust posture

Users hand this product their aspirations and their failures — data more sensitive than most
health apps hold. The honest stance (and marketing should say it plainly):

- **Private by policy, not by math.** Server-side LLM coaching means E2E encryption is off
  the table; don't pretend otherwise. Commit to: no ads, no data sale, no training on user
  content without explicit opt-in, encryption at rest and in transit, LLM calls via
  zero-retention API agreements.
- **One-tap full export and true delete** (all five stores, §1).
- **The receipts principle doubles as a trust feature:** the coach only ever quotes what the
  user actually said, dated. Users can view and edit their commitment ledger — memory the
  user can read is memory the user can trust.

## 8. The sensing loop (the moat, mechanically)

What separates this from "ChatGPT with a nice prompt" (critique C9) is that the system runs
*without being summoned*:

```
nightly per-user tick (batch):
  read event stream + states
  → run state machine transitions (doc 02 §2)
  → run diagnosis triggers (doc 02 §5)
  → plan tomorrow: reminder windows, NMT setups, celebration checks,
     notification payload + deep-link opener pairs (≤ budget)
  → queue through the initiative governor

event-driven interrupts (real-time):
  completion → instant ack (T0/T1) + Comeback/celebration triggers
  missed window while floor still viable → single L2 same-day offer (doc 02 §7)
  inbound chat → live conversation (T1/T2 by recipe)
  distress flag → immediate clamp + protocol (§5)

initiative governor (single choke point):
  budgets (≤3/day default) · quiet hours · state caps · cooldowns ·
  two-ignores tactic retirement · every send logged with outcome
```

**Architectural invariant: no code path can contact the user except through the governor.**
Spam and dark-pattern engagement mechanics become architecturally impossible rather than
policy-discouraged — which is exactly the kind of claim (critique C10) the brand should be
able to make in public and mean it.
