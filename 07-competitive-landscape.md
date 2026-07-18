# 07 — Competitive Landscape (2025–2026)

> **Method & confidence.** Sourced from a multi-agent deep-research sweep (2025–2026
> sources) plus manual synthesis. The verification pass was cut short by a usage limit, so
> only two claims cleared full 3-vote adversarial checking; the rest are **single-source and
> should be treated as leads to confirm, not settled fact.** Confidence is tagged per row.
> Several key sources are *vendor/competitor content marketing* (GoalsWon, Accountablo,
> Cohorty all sell competing products and rank themselves) — flagged inline. Where a store
> listing or Reddit thread is cited second-hand, it needs a direct pull before we bet on it.
> Re-running the full verified sweep after the limit resets is a cheap follow-up.

---

## 0. The one thing that changed our strategy

Going in, the thesis leaned on "everyone else just reminds; we intervene." **That gap is
partially closed** — proactive, outbound AI intervention already ships (Overlord, Habit Coach
AI, Actimate, and a cluster of "AI habit coach" apps). So "we intervene" is no longer
ownable on its own.

But the map reveals a **sharper, still-open position.** The intervention players cluster at
two fixed extremes:

- **The drill sergeant** (Overlord): punitive by default — blocks your apps, calls you,
  charges you money, texts your friends when you miss. One tone: harsh.
- **The gentle friend** (Habit Coach AI, Actimate, Finch): supportive by default, uniformly
  soft, no edge — "a mirror and friend."

**Nobody occupies the controllable middle** — a coach that moves *within a range the user
consents to*, reads their state, and dials intensity up when they're strong and all the way
down when they're on the floor. That is exactly doc 02's governor + doc 03's personality
range. Our differentiator is no longer "intervention" (taken) — it's **"intervention at an
intensity you control, that never kicks you when you're down."** Sharper, and genuinely
unoccupied.

Two more gaps survived contact with the data and are validated below: **shame-free-but-still-
serious comeback** (§3) and **structured commitment memory quoted back** (§3).

---

## 1. The players

### Category A — AI-native accountability/coach apps (our direct competitors)

| Player | What it does | Pricing | Intervention model | Confidence |
|---|---|---|---|---|
| **Overlord** (overlord.app; iOS/Android/Mac) | "AI Accountability Partner." Monitors habits 24/7; blocks apps via Screen Time, calls you if you don't wake up, charges money if you disable restrictions, **texts your friends if you miss**. The hardcore/"savage" end, already live | Not captured (has stakes/charges) | **Proactive + punitive.** Fixed drill-sergeant register | Med (single search source; needs direct pull) |
| **Habit Coach AI** (habitcoach.ai; Google Play since May 2025) | Proactive outbound: AI coach initiates daily check-ins by **phone call, text, or web chat**. Founder origin story: paid a stranger on Upwork to call him nightly at 10pm | **From $19/mo** (voice); 3-tier ladder up to weekly human calls; 7-day free trial | **Proactive + uniformly supportive.** No intensity control advertised | ✅ **High** (2 claims verified 3-0) |
| **Rocky AI** (rocky.ai) | Socratic self-reflection coach; markets memory-based check-ins on prior commitments. Runs a "Build Atomic Habits with AI Coaching" page — **already courting our beachhead** | ~$29.50/mo (one page says $14.99 — inconsistent); 14-day trial | Session-based chat; **single fixed register** | Med (one hands-on blog review) |
| **Actimate** (actimate.io) | "AI accountability partner" + ADHD planner. Atomic Habits-style identity-based habits + unlimited proactive check-ins. A Dec-2025 roundup's top pick | Not captured | **Proactive + deliberately gentle/shame-free** | Low-Med (one listicle) |
| **Habits: AI Habit Coach** (App Store id6755751406) | AI **voice calls** as accountability; voice reminders; **Apple Health integration to auto-verify habits** (a real "receipts"/proof mechanic) | Not captured | Proactive voice; auto-verification | Low (store listing, second-hand) |
| **HabitGPT by Shelpful** | ChatGPT-style habit buddy over **WhatsApp** | Not captured | Chat buddy | Low (mentioned in one roundup) |

**Takeaways:** (1) the "AI habit coach" space is *crowded with indie entrants*, mostly
2025-vintage; (2) **voice/phone calls** are the hot mechanic (Habit Coach AI, Rocky, Habits)
— worth noting our doc-04 §8 decision to defer AI voice; the market is signaling voice is a
draw, so revisit timing; (3) **auto-verification via Apple Health** (Habits app) is a receipts
idea we should steal for fitness goals; (4) nobody combines proactive intervention + adjustable
consented intensity + structured memory — the white space is real.

### Category B — Incumbent habit trackers (the "free is enough" anchor)

| Player | AI depth | Pricing | Note |
|---|---|---|---|
| **Fabulous** | Rule-based "journeys" (Duke behavioral-science positioning) + a **thin "AI Helper"** bolt-on — *not* proactive intervention | ~$39.99–79/yr | Most coaching-forward incumbent. **Cautionary billing tale:** Trustpilot ~3.2 ("Poor"), recurring subscription-trap / surprise-charge / ignored-cancellation complaints |
| **Finch** (self-care pet) | Gentle prompts | ~$9.99/mo or ~$70/yr | **The shame-free reference implementation** — bird never dies, missed days cost nothing. Huge ratings volume. *But* softens accountability to near-zero: no serious stats, no streak stakes (§3) |
| **Habitica** | None (gamified) | Free core; $4.99/mo or $29.99/yr (cosmetic) | Most generous free tier |
| **Streaks** | None | **$5.99 one-time** (iOS) | Sets the "I already paid once" anchor |
| **Habitify** | Analytics | Free (3 habits) → ~$49.99/yr | Passive tracker |

**Takeaway — the pricing gravity well:** incumbents are **$5 one-time to ~$50/yr**, and
multiple 2025 roundups actively push "free tiers cover ~80% of users." Zapier's July-2025
roundup (tested ~50 apps) **included zero AI coaches in its top 5**, noted some AI habit apps
had already shut down, and voiced skepticism about AI coaching. This is the credibility
headwind: we are priced 3–6× above what the category trains users to expect, into a space a
respected reviewer thinks is vaporware. Our answer has to be *visibly* more than a tracker or
a wrapper (the whole doc-03 sensing loop) — and our price anchor must be human coaching, never
these apps (§4).

### Category C — Adjacent accountability models (proof that accountability sells)

| Player | Model | Price signal | Lesson for us |
|---|---|---|---|
| **stickK** | Binding financial commitment contracts; loss aversion | Free; **$51M staked across 533K contracts**; claims 3× goal achievement | Huge proof of WTP for stakes — but "built in 2008," honor-code referee, **never proactively intervenes**, "app is falling apart." Pioneer that plateaued |
| **Beeminder** | Escalating pledge ladder ($5→$10→$30→$90) | Stakes-based | Quantified penalty escalation — a mechanic, not a relationship |
| **Focusmate** | Body-doubling (live video co-working) | ~$5–10/mo | Claims 161% productivity lift. Social presence, not coaching |
| **Forfeit / Accountablo** | AI + financial stakes over Slack/WhatsApp | Accountablo Pro ~$7.20/mo (annual); stakes $5 default–$50 | Accountablo = "stickK rebuilt for 2026," AI initiates + enforces money stakes. Closest to a *financial-stakes* AI coach |
| **Coach.me** | Human coaching | **~$25/week (~$100/mo)** | The human price ceiling |
| **GoalsWon / Boss as a Service** | Daily **human** coach check-ins / humans nag you | Monthly sub | People *already pay monthly for human tough-love intervention* — the exact behavior we automate cheaper |

**Effectiveness evidence base (to cite in our own marketing, after we verify it):** ASTD
research — a specific accountability *appointment* raises goal completion to ~95% vs ~65% for
mere commitment; stickK's 3× claim; Focusmate's 161% claim. These quantify *why* accountability
works and support the category, though each needs a primary-source check (all surfaced via
vendor content).

### Category D — Duolingo (the notification/personality benchmark)

- **1B+ notifications/year, personalized by each user's response history** — the gold-standard
  sensing-and-nudging loop we're emulating (doc 03 §8).
- Its **passive-aggressive / guilt-trip** notifications became a meme *and* drove retention —
  proof a character with attitude is a moat, and a cautionary note that guilt is a double-edge
  (our doc-04 §7 anti-gallery deliberately bans the guilt-monger register Duo leans on).

---

## 2. Positioning matrix — who does what

Legend: ✅ strong · 🟡 partial/shallow · ❌ absent

| Capability | Overlord | Habit Coach AI | Rocky AI | Actimate | Finch | stickK | Fabulous | Duolingo | **Us (planned)** |
|---|---|---|---|---|---|---|---|---|---|
| Proactive intervention on slip | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ | 🟡 | ✅ | ✅ |
| **Adjustable intensity (consented range)** | ❌ (fixed harsh) | ❌ (fixed soft) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **(open gap)** |
| **Shame-free but serious comeback** | ❌ | 🟡 | ❌ | 🟡 | 🟡 (too soft) | ❌ (punitive) | ❌ | ❌ | ✅ **(open gap)** |
| **Structured memory / receipts** | ❌ | 🟡 | 🟡 (forgets) | 🟡 | ❌ | ❌ | ❌ | 🟡 | ✅ **(open gap)** |
| Behavioral-design diagnosis (Four Laws) | ❌ | ❌ | 🟡 | 🟡 | ❌ | ❌ | 🟡 (scripted) | ❌ | ✅ |
| Graduation / does less over time | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (opposite) | ✅ |
| Voice/phone | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ (deferred) |

The three columns where the whole row is empty except us — adjustable consented intensity,
shame-free serious comeback, structured receipts — **are the product.** Everything else is
table stakes we must match, not where we win.

---

## 3. The gaps, validated

1. **Adjustable coaching intensity within a consented range — WIDE OPEN.** Overlord proves
   demand for the hard end; Habit Coach AI/Actimate/Finch own the soft end; Rocky's own users
   complain its single Socratic register "kept asking coaching questions" during an emotional
   day. *No one* lets the user tune the dial or reads state to auto-adjust. This is doc 03 §4,
   and it is our clearest opening.
2. **Shame-free comeback that still has stakes — OPEN.** The market is split into shamers
   (streak-loss, financial penalties — and penalties "can feel punitive and worsen shame,"
   which is literally what killed Pact) and the too-gentle (Finch, whose own reviews flag that
   never penalizing = no real accountability). **Nobody holds the middle: forgiving on the
   miss, serious about the comeback.** That's Never-Miss-Twice (doc 02 §7), and it's ours to
   take.
3. **Structured commitment memory quoted back — OPEN.** Rocky *markets* memory but forgot a
   user's gym schedule by day 4. The "receipts" mechanic (doc 03 §1) is differentiated
   precisely because the current crop can't hold commitments across sessions.
4. **Graduation — UNIVERSALLY ABSENT and counter-cultural.** Every engagement model
   (Duolingo especially) is built to maximize dependence. Doc 01-C10's "graduate loudly" is
   contrarian positioning no competitor can easily copy without breaking their own retention
   metrics.

---

## 4. Pricing & willingness-to-pay

**The band we're in is a no-man's-land — which is fine if we anchor correctly.**

- **Below us:** trackers, $5 one-time to ~$50/yr, with "free is enough" messaging. Do **not**
  compete or compare here — comparison drags us into their frame.
- **Our band ($12–15/mo):** Habit Coach AI $19/mo, Accountablo ~$7.20/mo, Rocky ~$30/mo.
  Mixed. **Warning sign:** Rocky's reviewer churned with "$14.99/mo feels steep when ChatGPT
  can do something similar" — the wrapper objection is real and priced-in by users. Our only
  defense is being visibly not-a-wrapper (sensing loop, memory, diagnosis).
- **Above us:** human coaching $100/mo (Coach.me), and stickK's $51M staked / Focusmate /
  GoalsWon all prove **people pay real money for accountability.** This is our anchor: *"a
  coach who actually knows how you fail, for a tenth of a human's price"* — not *"a habit
  tracker that costs more."*

Confirms doc 05 D4. Two adjustments to fold in: (a) budget the "ChatGPT can do this" objection
as a first-class onboarding/marketing counter, and (b) consider a **stakes option** later —
the $51M-staked evidence says loss aversion converts, and it slots into our engine as an
optional Law-4 mechanic (with Pact's grave as the warning: never charge a user who complied or
cancelled).

---

## 5. Naming landscape (feeds doc 06)

**The category's naming rules, learned the hard way by others:**

- **Generic "AI + habit/coach" is unownable.** "Habit Coach AI" alone collides across
  habitcoach.ai, habitcoachai.com, and multiple App Store "Habit Coach" / "AI Habit Coach"
  apps. Any name of the form [Habit|Goal|Coach|AI]×[Coach|AI|Buddy|Bot] is dead on arrival for
  trademark and ASO.
- **The "harsh" naming lane is taken:** **Overlord** owns the drill-sergeant end; **Carrot**
  (Carrot Fit) owns the insulting-AI novelty. Naming ourselves aggressively would put us in
  their shadow and undercut the "controllable, never cruel" position.
- **Occupied names to avoid colliding with:** Overlord, Rocky, Actimate, Accountablo, Forfeit,
  Beeminder, stickK, Focusmate, Finch, Fabulous, Habitica, Streaks, Habitify, Coach.me,
  GoalsWon, Cohorty, Flown, HabitGPT/Shelpful, Habit Doom, Boss as a Service.
- **Observed patterns:** invented-word (Habitica, Actimate), -o/-lo suffix (Accountablo),
  animal/character (Finch, Carrot), aspirational adjective (Fabulous). To stand out we want a
  name that signals *a steady, consented presence* — the opposite of "Overlord" — and reads as
  a coined, ownable word, not a descriptor.

**Implication for doc 06:** the earlier real-word shortlist (Rally, Tally, Pace, Corner…) is
even riskier than we flagged — all common words fighting for ASO in a crowded field. The next
round (doc 06 §6, added) goes coined/ownable and is collision-checked against the list above.

---

## 6. Cautionary tales

| App | What happened | Lesson baked into our design |
|---|---|---|
| **Pact** | FTC settlement (Sept 2017): charged users **even when they met goals or had cancelled**; **$940K+ returned**, ~$1.5M judgment; **died**. Penalty model became the harm | If we ever add stakes, charging must be flawless and never punish compliance/cancellation. Reinforces doc 03 §7 billing-trust posture |
| **Fabulous** | Trustpilot ~3.2; subscription traps, surprise $39.99 charges, ignored cancellations | Billing UX *is* trust. One-tap cancel, no dark patterns (doc 03 §7) — a differentiator, not just hygiene |
| **stickK** | Pioneer that "feels built in 2008," honor-code verification, no proactive nudges, "falling apart" | Being first isn't a moat; the sensing loop is. Validates our whole premise |
| **The AI-coach graveyard** | Zapier (Jul 2025) excluded all AI coaches, noted some **already shut down**, skeptical of the category | The market has seen thin GPT wrappers die. We must lead with the not-a-wrapper proof or inherit their skepticism |
| **Duolingo guilt notifications** | Effective for retention but became a mocked meme | Guilt works and corrodes trust. Our anti-gallery (doc 04 §7) bans the register on purpose |

---

## 7. Net strategic adjustments (what this changes upstream)

1. **Reframe the one-liner.** From "we intervene, they remind" → **"the only coach you can
   turn up or down — and that never kicks you when you're down."** (Feeds doc 01 positioning.)
2. **Lead every surface with the not-a-wrapper proof.** The "ChatGPT can do this" objection is
   already churning competitors' users. Memory + sensing loop + diagnosis must be *visible* in
   onboarding, not just architecture. (Doc 03 / doc 04.)
3. **Steal two mechanics:** Apple Health auto-verification for receipts (Habits app), and
   revisit AI-voice timing — the market says voice is a draw (Habit Coach AI, Rocky, Habits all
   lead with it), whereas doc 04 §8 defers it. Not overturning the decision; flagging that the
   competitive cost of deferring may be higher than assumed.
4. **Hold the anti-shame line as positioning, not just ethics.** Finch proves a large audience
   fled harsher apps out of shame; Pact proves punishment is legally and reputationally
   radioactive. Shame-free-but-serious is both the ethical and the commercial choice.
5. **Consider optional stakes, post-PMF.** $51M staked is loud WTP evidence — but only with
   Pact's failure mode designed out.

**Follow-up when the usage limit resets:** re-run the verified sweep to promote the Med/Low
rows to confirmed, pull Overlord + the App Store listings directly for pricing/traction, and
find first-hand Reddit/review quotes on how harsh-tone apps (Overlord, Carrot Fit) are actually
*received* — that reception data is the missing input to finalizing the Savage-mode design.
