# 01 — Critique & Positioning

> **Role:** Lead PM + strategist pass over the founding brief (doc 00). This document does the
> job the brief asked for: challenge assumptions, find weaknesses, propose fixes. Each
> challenge names what the brief says, why it breaks in the real world, and what to do
> instead. Decisions that need founder sign-off are collected in doc 05.

## What the brief gets right (keep, don't relitigate)

Before the critique: five calls in the brief are correct and should be treated as settled.

1. **Intervention over reminders.** This is the wedge. Every habit app can send "Reminder."
   None of them can notice, diagnose, and redesign. Correct hill to die on.
2. **Four Laws as an internal decision engine, invisible to the user.** Using the framework
   as a diagnostic taxonomy rather than book content is exactly right — it's also what keeps
   the product from being a copyright/trademark problem and from feeling like homework.
3. **Chat as the heart, every conversation ends in one next action.** Correct, and the
   "one next action" rule is the thing that keeps chat from degrading into a journaling app.
4. **User-controlled personality range.** Consent-based intensity is both the ethical
   position and the differentiated one.
5. **Sub-60-second time-to-value instinct.** Right instinct; needs one amendment (C7).

Now the weaknesses, in order of how much damage they'd do if unaddressed.

---

## C1. The comeback loop is the product, and the brief doesn't design it

**Brief says:** when the user falls behind, the AI notices, challenges, asks why, adapts.

**The problem — the accountability paradox:** the moment the product is most valuable
(user is slipping) is exactly the moment the user least wants to open it. Opening the app
after three missed days feels like facing a disappointed parent. The dominant failure mode of
an accountability product is not "challenge wasn't firm enough" — it's **avoidance spiral**:
miss → shame → avoid app → notifications now feel like accusations → mute → uninstall.
Behavioral science has a name for the trigger: the *what-the-hell effect* (Polivy & Herman) —
one violation of a commitment cascades into abandoning it entirely, not because the person
stopped caring but because the broken state feels unrecoverable.

A challenge-first framing makes this worse. Pressure applied to someone already ashamed
produces avoidance, not action.

**What to do instead:** invert the design priority. The most important conversation in this
product is not the one that prevents a miss — it's **the one that happens after a miss**.
"Never Miss Twice" should be promoted from a bullet in the feature list to the **organizing
principle of the entire product**:

- Re-entry after absence must be shame-free and backlog-free. No wall of missed tasks. No
  "you missed 4 days." The first message after silence is future-facing: today's rep, sized
  down, nothing to catch up on.
- Recoveries are celebrated as loudly as streaks. "That's a save" is a first-class moment.
  The headline user stat is the **never-miss-twice rate**, not the longest streak.
- Challenge-grade intensity is only ever applied to users in a position of strength (coasting,
  negotiating with themselves) — never to users who are down. "Never kick someone who's
  already on the floor" is a hard engine rule (see doc 02, escalation governor).

There's direct empirical cover for lapse-tolerance: in Lally et al. (2010), the standard
habit-formation study (median 66 days to automaticity), missing a single day had no
measurable effect on long-term habit formation. The science says one miss doesn't matter;
the product should make the user *feel* that, and then make the second day the whole game.

**Consequence for metrics:** the make-or-break number for this product is
**comeback rate** — % of first misses followed by a completion the next day. See doc 05.

## C2. "Not a niche app" confuses architecture with go-to-market

**Brief says:** works for students, professionals, entrepreneurs, fitness, business,
relationships — anyone with meaningful goals.

**The problem:** "for everyone" is a distribution decision disguised as a product decision,
and it's the standard cause of death for horizontal consumer products. Without a beachhead:
your App Store screenshots are generic ("achieve your goals!"), your coaching voice can't be
tuned (a founder grinding on a startup and a student cramming for finals need different
registers), your early reviews say "nice but generic," and paid acquisition has no channel.

**What to do instead:** keep the *architecture* horizontal (the engine genuinely is
goal-agnostic) but pick one beachhead for launch tuning and marketing. Recommendation:

> **Beachhead:** 24–38 year-old professionals pursuing one self-improvement goal alongside a
> job — fitness, learning, or a side project. Reached through self-improvement content
> channels. One-line wedge: **"For people who've read Atomic Habits and still can't stick to
> anything."**

That audience is enormous (the book has sold 20M+ copies — those are pre-qualified,
pre-educated buyers), already believes in the framework, and has subscription willingness.
Note the legal line: the wedge targets the *audience*, the marketing never claims
affiliation or endorsement — the pitch is "behavior-science-based accountability."

Relationships and business goals stay out of launch marketing entirely; they arrive
naturally as second goals from retained users.

## C3. Goal taxonomy: not every goal reduces to a daily habit

**Brief says:** Goal → System → Daily Actions → Habits → Identity.

**The problem:** that pipeline silently assumes every goal is habit-shaped. Real goals come
in three shapes, and the engine must not force-fit:

| Shape | Example | What it actually needs |
|---|---|---|
| **Habit goal** | run 3×/week, read daily, sleep by 11 | The brief's pipeline, as designed |
| **Project goal** | launch the podcast by October, pass the bar | Milestones + scheduled **working sessions** + next-action tracking |
| **Outcome goal** | lose 10 kg, get promoted, hit $10k MRR | Decomposition into the other two + honest leading/lagging framing |

Force-converting a project goal produces fake habits ("work on podcast — daily") that decay
within a week, and the AI looks stupid at the exact moment it's supposed to look insightful.
Outcome goals are worse: the user can execute perfectly and the scale not move — if the app
only tracks reps, it celebrates while the user quietly concludes it isn't working.

**What to do instead:** the intake step classifies goal shape (see doc 02 §1) and runs a
different template per shape. Project goals get a *working-session habit* (the repeatable
part) plus a weekly milestone check (the progress part). Outcome goals always get the
leading-vs-lagging conversation up front ("we control the reps; the outcome follows — here's
how we'll know if the system needs changing"), plus a monthly system-level retrospective:
**"is this system actually moving the goal?"** — which prevents the app from optimizing
adherence to a system that isn't working.

## C4. "The AI notices you're slipping" overpromises what the system can sense

**Brief says:** the assistant notices when users fall behind.

**The problem:** notice *from what data*? The MVP's sensors are self-reported check-ins, app
opens, and notification interactions. If the user stops checking in, the AI is blind —
and **silence is ambiguous**: they might be slipping, doing the habit without logging, on
vacation, or gone. Worse, the AI's only channel to a silent user is push notifications — a
lossy, throttled channel the user can disable in one gesture. An engine that treats silence
as failure will accuse a user who ran every day and just stopped logging. That single
misfire costs more trust than ten good interventions earn.

**What to do instead:**

1. **Make the channel itself a sensor.** Actionable notifications: *Done / Snooze /
   Struggling* buttons on the lock screen. A one-tap check-in that never requires opening the
   app keeps signal flowing at near-zero user cost.
2. **Infer with humility.** Silence triggers questions, not accusations: "Did the runs happen
   and the logging didn't? One tap either way." Backfill must be easy and judgment-free —
   log-data honesty is a data-quality feature (see doc 02 §7).
3. **An explicit escalation ladder over silence** (day 1: light nudge → day 2: never-miss-
   twice move → day 3–4: state check + downshift offer → day 7: dormancy protocol — one
   honest message, then stop). Spec in doc 02 §6. Persistence without adaptation reads as
   spam.
4. **Cold-start honesty.** In week one the AI knows almost nothing; it should say so and act
   like a good coach in session one — asking sharp questions — rather than faking
   personalized insight it can't have (see C6).

## C5. Savage mode is the marketing hook and the liability — gate it with trust, not just a toggle

**Brief says:** Savage is explicit opt-in; AI may become more aggressive when appropriate;
never abusive.

**The problem, in three layers:**

1. **Safety:** the population that seeks out an accountability app over-indexes on people in
   fragile seasons. "Aggressive AI" × user with depression, an eating-disorder-adjacent
   fitness goal, or a bad week is a genuine harm scenario — and one screenshot of the AI
   being cruel to a struggling person is a brand-ending PR event. A toggle at signup is not
   informed consent for what Savage feels like on day 20.
2. **Coherence:** a stranger being savage is not accountability, it's a gimmick. Directness
   lands in proportion to demonstrated investment — a coach who has receipts ("you told me
   this mattered because your dad...") has earned sharpness; an app you installed yesterday
   hasn't.
3. **Drift:** "AI rotates styles based on context" without constraints reads as erratic.
   Personality inconsistency is the fastest way to break the relationship illusion.

**What to do instead — earned intensity:**

- **Savage unlocks, it isn't selected.** Available only after ~2 weeks of relationship and a
  demonstrated baseline (the coach has receipts to challenge with). The unlock is itself a
  shareable moment — this converts the safety constraint into a retention/virality mechanic.
- **Consent with preview:** opting in shows three real sample messages of what Savage sounds
  like. Users consent to a register they've seen, not a word.
- **Hard state gating regardless of opt-in:** never savage on a user in Lapsed/struggling
  state (C1's rule), never on sensitive domains (body/weight, mental health, grief,
  addiction), automatic drop to supportive floor on any distress signal. "Ease up" honored
  instantly and permanently until countermanded. Full spec: doc 03 §4–5.
- **Style changes are legible:** "I'm going to be more direct with you today, because you're
  negotiating with yourself" — announced shifts read as coaching; silent shifts read as mood
  swings.

And to name the tension honestly: "the app that roasts you into the gym" is extremely
shareable and will drive installs. The recommendation is not to kill Savage — it's to ship it
with the trust-gate so the viral clip is always a user who visibly asked for it.

## C6. Identity statements at minute one will feel like a horoscope

**Brief says:** onboarding generates an identity statement from the goal, in under a minute.

**The problem:** identity language is *earned vocabulary*. An AI that met you 45 seconds ago
declaring "You are becoming a disciplined writer" produces either eye-roll (Barnum statement)
or, worse, pressure without evidence. James Clear's own mechanism is votes: every rep is a
vote for the identity — the identity claim follows the evidence, never precedes it.

**What to do instead — identity as output, not input:**

- Onboarding captures the goal and **the user's why, in their own words** (one sentence,
  typed or spoken). This is quietly the most load-bearing moment in the product: every future
  high-leverage intervention ("you said this mattered because...") depends on having the
  user's verbatim words. Store the quote, date it, never paraphrase it into something
  stronger than what was said.
- The AI proposes the habit + two-minute version + reminder window (that's the sub-60s
  promise, kept).
- Identity language enters **only when evidence exists**, always attached to the ledger:
  "Three sessions this week. That's not 'trying to write' — that's what a writer's week looks
  like." The evidence ledger (total votes cast) is the identity UI; there is no identity
  statement screen in v1.

## C7. Zero-friction onboarding vs. zero-commitment users — resolve with the First Rep

**Brief says:** onboarding under one minute, no questionnaires.

**The problem:** friction filters, but it also *invests*. A user who spent nothing feels
nothing walking away (commitment/consistency and effort-justification effects are real).
Sub-60s to value is right; sub-60s to *first action* is the actual target worth designing
for.

**What to do instead:** keep the 60-second setup, then immediately convert setup into
action: **"Your first rep is now — here's the two-minute version. Go. I'll wait."** The
correct place for onboarding friction is *the habit itself*. This makes activation
(first rep < 24h, ideally < 5 minutes) an onboarding outcome rather than a hope, and the
user's first experience of the product is doing, not configuring. Notification permission is
asked *after* the first rep, with contextual copy ("I can only have your back if I can reach
you") — permission grant rates are dramatically higher post-value than at cold start.

## C8. Notifications are a spendable trust budget, not a free channel

**Brief says:** notifications should be contextual and deep-link into conversation.

Right, and it undersells the constraint: **for this product the notification layer is the
product** — the app open is downstream of it. Every notification spends from a finite
attention account; habituation and banner-blindness are the default outcome, and iOS/Android
actively demote spammy senders.

**Additions to the brief:**

- **Hard budget:** default ≤3/day, user-adjustable, enforced architecturally by a single
  "initiative governor" through which all coach-initiated contact flows (doc 03 §6). Quiet
  hours on by default.
- **Every notification type is measured on action rate** and auto-throttled when ignored —
  per-user. Two ignored interventions of the same shape = back off and change tactic.
- **The deep-link promise is a contract:** if the notification says "one action protects your
  week," the chat must open mid-thought, already knowing the context — notification and
  conversation-opener are generated as a pair (doc 03 §2).
- **The anti-gallery matters as much as the gallery:** guilt-monger notifications ("Everyone
  else finished today 😢", "I miss you") are banned by policy, not just by taste — see doc
  04 §7.

## C9. Defensibility: "ChatGPT with memory + reminders" will exist — what's the moat?

The brief doesn't ask the question, and everyone else will. A general assistant can already
be prompted into a decent accountability coach; within the product's lifetime, big assistants
will ship habit/reminder features natively.

**The honest answer, which should shape build priorities:**

1. **The sensing loop.** A chat assistant speaks when spoken to. This product runs a
   server-side per-user coach tick that evaluates state and *initiates* — the value is
   delivered at the moment of weakness without being summoned. That loop (state machine +
   notification governor + deep-linked conversations) is real product infrastructure a chat
   window doesn't have.
2. **The intervention-outcome corpus.** Every intervention is logged with what happened next
   (did the user act within N hours?). Over time this yields per-user and population-level
   knowledge of *which move works on whom, when* — a dataset no general assistant is
   collecting and the basis for the engine becoming measurably better than generic advice
   (doc 02 §8).
3. **Accumulated relationship as switching cost.** "It knows exactly how I fail and what
   gets me moving" is why year-two users stay. This only compounds if memory is structured
   (commitments ledger, receipts, prescription history) rather than a transcript (doc 03 §1).

None of these are defaults — each is a build choice. If we don't build the tick, the corpus,
and structured memory, we are in fact a ChatGPT wrapper and will lose.

## C10. Success ends the subscription: name the graduation problem and align with it

**The problem nobody puts in their PRD:** if the product works, the habit becomes automatic
(median ~66 days) and the user needs the coach *less*. Standard retention thinking will read
that as churn and fight it with engagement mechanics — which is how you end up an app that
manufactures dependence, the accusation every AI-companion product now faces.

**What to do instead — align the business with the user's actual arc:**

- **Seasons, not subscriptions-to-a-habit.** The product's unit is a goal arc (~8–12 weeks:
  calibrate → build → consolidate → graduate). Graduation is a designed, celebrated event —
  and its final beat is the invitation: "What's next?" A person who just proved they can
  become a runner has five more identities queued. The subscription is to *the coach who
  already knows how you work*, across arcs — not to one habit's reminders.
- **Maintenance mode is cheap and real:** graduated habits drop to near-zero touch with a
  weekly pulse; the coach's attention moves to the new arc.
- **Metrics follow:** graduations are counted and celebrated separately from churn;
  graduated-user win-backs are scheduled on fresh-start landmarks (new month, new year,
  birthday-adjacent — the *fresh start effect*, Milkman et al.). Outcome metrics rank above
  engagement metrics in every roadmap decision, and we hold that line even when it hurts DAU.
- **Pricing that fits arcs:** annual as the default anchor (~$70–90/yr) with monthly
  (~$12–15/mo) available — the user is buying a year of becoming, not a month of reminders.
  Free tier = tracker without the coach brain (logging, streak math, dumb reminders); the
  brain is the paid product. Human accountability (a coach at $100–300/mo, Focusmate,
  bootcamps) is the price anchor, not other $3 habit trackers.

---

## Competitive frame (summary)

| Alternative | What it proves | Why we win / where we lose |
|---|---|---|
| Habit trackers (Streaks, Habitica, Loop) | People want to log | They're logging tools with no opinion. We intervene. They're also free — we must be visibly smarter, not marginally. |
| Duolingo | Personality + notification pressure retains at scale; streaks work *and* wound (they had to invent streak freezes) | Proof that a character with attitude is a moat. Cautionary tale on streak-loss churn → we ship lapse-tolerant scoring from day 1 |
| Human accountability (coach, gym buddy, mastermind, Focusmate) | Accountability is worth $100+/mo | We're 10× cheaper, always available, never awkward. We lose on genuine social stakes — mitigate later with partner features (post-MVP) |
| General AI assistants (ChatGPT etc.) | Users will try "be my accountability coach" for free | See C9 — sensing loop, corpus, structured memory, or we deserve to lose |
| Doing nothing / notes app | The default | The real competitor. Sub-60s onboarding + First Rep exists to beat this |

## Naming (parking lot, not urgent)

Criteria: implies a *person who holds the line*, not a tool; verb-able; not habit-cliché.
Candidates to test: **Anchor**, **Keystone**, **Corner** (as in coach's corner), **Vera**
(named-coach direction), **Onward**. Decision needed before TestFlight branding, not before
engine build.

## Amended product principles

The brief's principles stand, with four additions from this critique:

1. **Comeback over streak.** (C1 — the product is the recovery loop.)
2. **Earned intensity.** (C5 — challenge scales with relationship depth and user strength.)
3. **Sense honestly.** (C4 — infer with humility; never fake certainty or personalization.)
4. **Graduate loudly.** (C10 — success is the point; the business model serves the arc.)
