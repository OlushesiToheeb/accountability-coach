# 08 — Savage Mode: Evidence & Guardrails

> **Role:** behavioral-safety design, grounded in reception research (2026-07-19 sweep of how
> harsh-tone accountability apps are actually received — Overlord, Carrot Fit, drill-sergeant
> AI coaches, the Goggins genre). **Bottom line: the research validates the design in docs 02
> §6 and 03 §4–5 rather than changing it — but it upgrades several "we think" calls to
> "evidence says," and it sharpens the single rule that makes Savage a moat instead of a
> gimmick.** Decision D3 (ship Savage behind a day-14 unlock) stands, reinforced.

---

## 1. What the reception evidence actually says

| Finding | Source signal | What it means for us |
|---|---|---|
| **No universal motivational style.** "The same coaching input produces measurably different physiological responses in different athletes" | Sports-psych framing repeated across coach-app reviews | Intensity *must* be per-user. A single fixed tone (harsh **or** soft) is wrong for most of your users by construction. This is the whole thesis, now evidence-backed |
| **Harsh works — for a self-selecting few.** Directness "resonated and was surprisingly helpful" for procrastination/self-doubt; audience = people who perform best under pressure, prove-others-wrong types, those whose inner monologue is already harsh | Drill-sergeant AI coach reviews | Savage has a real, valuable audience. Don't kill it — **gate it to the people it fits, by making them opt in and ask for more.** |
| **Harsh backfires — physiologically.** People who shut down under pressure "dread their workouts… cortisol spikes just thinking about it"; "coaching that doesn't fit you actively hurts you by making you avoid the activity" | Same | This is the avoidance spiral (doc 01-C1) with a biological mechanism. Applying Savage to the wrong user or wrong moment doesn't just underperform — it causes the exact churn we're built to prevent. **State-gating is not caution, it's core function.** |
| **Novelty decay is the #1 killer.** Carrot Fit's own reviewers: "the real problem is that it's a novelty" | Carrot Fit reviews | Generic insults ("meatbag," "flabby") are funny once, then wallpaper. **A fixed savage *character* decays. Personalized challenge from the user's own commitments does not.** This is the line between gimmick and moat (see §3) |
| **Harsh + body/weight = radioactive.** Carrot Fit drew activist backlash, calls to ban it, and "shames you into starving yourself" accusations | Reclaim/Vice/Global News coverage | The sensitive-domain hard cap (doc 03 §5) is not optional politeness — it's brand and App-Store survival. Carrot Fit is the cautionary tale, and it lived exactly in the domain we wall off |
| **The market is already moving to personality choice.** "Several fitness apps now offer multiple coaching personalities specifically because generic pressure produces drop-off" | Coach-app roundups | Validates adjustable intensity as a *direction the category is heading* — we're not inventing an odd feature, we're doing the sophisticated version (consented range + state adaptation, not just a persona picker) |
| **Demand for the harsh register is real and monetizable** | Goggins-genre apps (Goggins Motivation, "Locked In", AI-Goggins wake-up calls); Overlord is **YC-backed** | People will install and pay for tough. But the Goggins apps are *novelty/content*, not sustained coaching — they prove appetite, not retention. Our job is to make tough *last*, which novelty can't |

## 2. Tone-harsh vs. behavior-harsh — keep the axes separate

The research surfaced **two different "hardcore" products that are often conflated:**

- **Behavior enforcement (Overlord, Forfeit):** surveillance + consequences — blocks your
  apps, bricks your devices at 11pm, charges up to $100/violation, texts your friends.
  Polarizing; reception explicitly caps it — "only practical if you're comfortable trading
  privacy for enforcement."
- **Tone harshness (Carrot Fit, Savage):** *how the coach talks.* No surveillance, no wallet.

**Our Savage mode is tone, not enforcement.** We are not building surveillance or device
control. This keeps us out of the privacy-tradeoff ceiling Overlord hits, and it keeps Savage
a *conversational register* governed by the personality system (doc 03 §4) — not a set of
punishments. (Optional financial stakes, if ever added, are a separate opt-in module per doc
07 §7, with Pact's grave as the guardrail — and explicitly *not* part of Savage.)

## 3. The one rule that makes Savage a moat instead of a gimmick

**Savage challenges the user with their own words and commitments — never with generic
insults.**

Carrot Fit calls everyone "meatbag." That's funny once and dead by week two (novelty decay,
§1). Contrast the doc 03 §4 Savage sample: *"You want your kids to copy you — right now the
lesson is 'quit when it's boring.'"* That lands because it's **theirs** — their stated why
(doc 03 §1 commitment ledger), quoted back. Personalized challenge:

- doesn't decay (every week there are new commitments and new receipts to hold them to);
- can't be replicated by a generic "harsh AI" wrapper (it requires the structured memory moat);
- stays on the right side of cruelty (it attacks the *gap between their commitment and their
  action*, never their worth, body, or a comparison to others).

This is why Savage is defensible where Carrot Fit is a novelty: **it's the receipts, not the
insults.**

## 4. Guardrails (evidence-backed, consolidating docs 02 §6 / 03 §4–5)

1. **Opt-in + earned, never default or early.** Self-selection *is* the safety mechanism — the
   audience harsh fits are the ones who'll seek it. Day-14 unlock + preview-consent (three real
   sample messages) stands (D3). The unlock also filters for the pressure-responder audience
   the evidence says it fits.
2. **Hard sensitive-domain exclusion.** Body/weight, disordered-eating-adjacent, mental
   health, grief, addiction: Savage *never* available, opt-in regardless. Carrot Fit is the
   proof of what happens otherwise. Non-negotiable, enforced in code (doc 03 §5), not prompt.
3. **State-gating is core, not caution.** Never Savage on a user in Wobbling/Lapsed/Dormant or
   showing distress — the cortisol/avoidance evidence means this *causes* the churn we prevent.
   The governor refuses to schedule L5 for down-state users (doc 02 §6.3).
4. **Receipts, not insults** (§3) — the defining content rule.
5. **Spice, not meal.** Savage is a register the coach *visits* when the user is coasting or
   negotiating with themselves — not where it lives. Frequency-capped (one L5 / 48h, doc 02
   §6.1). Novelty decay says a wall-to-wall savage coach burns out; a rare, earned sharp edge
   compounds.
6. **Legible shifts.** Announce the register change ("I'm going to be more direct today,
   because you're negotiating with yourself") — doc 03 §4. Silent harshness reads as a mood
   swing; announced harshness reads as coaching the user consented to.
7. **Instant, permanent escape hatch.** "Ease up" caps intensity immediately and is logged to
   the contract (doc 02 §6.2). No friction, no "are you sure," no decay of the setting.
8. **Measure drop-off per user.** The category lesson is "generic pressure produces drop-off."
   Track, per Savage user, whether L5 interventions are followed by action or by silence/mute;
   auto-throttle and downshift anyone the evidence says it's *not* working on (doc 03 §6). Tone
   that isn't producing action is tone that's producing avoidance — treat the two-ignores rule
   as a safety signal here, not just an engagement one.

## 5. Net: what changed vs. what held

- **Held (now evidence-backed):** ship Savage (D3); earn it; cap it by domain and state; make
  it opt-in; the whole adjustable-intensity thesis.
- **Sharpened:** the receipts-not-insults rule (§3) is promoted from a nice sample to *the*
  load-bearing design constraint — it's what separates a defensible product from Carrot Fit's
  novelty, and it's inseparable from the memory moat.
- **New guardrail:** per-user drop-off monitoring on Savage as a *safety* signal (§4.8),
  because the evidence ties harsh-misfit directly to avoidance, not just disengagement.
- **Clarified scope:** Savage = tone (governed by personality system); enforcement/stakes =
  a separate, later, optional module — we are not building Overlord.

**Still owed (next research pass):** first-hand *longitudinal* reception — do Savage/tough-love
users retain at 4–12 weeks, or is the whole register a week-one novelty even when
personalized? The sweep found appetite and short-term efficacy; the retention question is the
one that decides how much product surface Savage deserves. Cheapest way to answer it is our own
Phase-1 beta data (doc 05), not more desk research.
