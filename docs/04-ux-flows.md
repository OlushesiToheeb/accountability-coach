# 04 — UX & Core Flows

> **Role:** UX strategist. The flows that carry the product, with real copy — because for a
> coaching product, copy *is* the interface. Conventions: quoted lines are proposed v1 copy;
> [brackets] are dynamic. All flows assume the engine (doc 02) and governor (doc 03 §8)
> behind them.

---

## 1. Onboarding: 60 seconds to a plan, 5 minutes to a first rep

Design targets: time-to-plan < 60s · time-to-first-rep < 5 min (activation event) ·
notification opt-in > 70% (asked post-value, critique C7).

**Step 1 — the goal (one input).**
"What are you trying to become consistent about?"
Free text, mic available (OS dictation). No categories, no dropdowns — classification is the
engine's job (doc 02 §1).

**Step 2 — the why (one input, the load-bearing one).**
"Why this? One honest sentence. (I'll hold onto it — future-you will want it.)"
Verbatim into the commitment ledger, dated (critique C6). Voice note allowed and quietly
preferred — people say truer things than they type.

**Step 3 — the plan (AI output, one screen).**
Habit + implementation intention + two-minute floor + reminder window, editable inline:
- "**The habit:** 30-minute run — Mon / Wed / Fri, after you drop the kids at school."
- "**The floor:** shoes on, out the door, 2 minutes. Floor reps count. This is the rule that
  makes you unquittable."
- "**I'll check in:** around 8:40am on run days. Adjust anytime."
One button: "That's my plan." (Edits are one tap per line; no settings maze.)

**Step 4 — the first rep, now.**
"Plans don't build identity — reps do. Your first one starts now: the 2-minute floor
version. I'll be here when you're back."
[I did it] → the app's biggest celebration fires: **"Rep #1. That's a vote. Everything from
here is arithmetic."**
[Can't right now] → schedule it: "When today?" (still today; tomorrow only as fallback —
copy: "Fine. But tomorrow it's real.")

**Step 5 — the permission ask (only now).**
"One thing: I can only have your back if I can reach you. I send at most [2] a day —
you set the ceiling, and quiet hours are on by default."
System permission dialog fires after this framing screen, post-first-value.

**Step 6 — the style contract (one screen, skippable → defaults to Coach).**
"How do you want me to be when you start slipping? (You can say 'ease up' or 'go harder'
anytime, in any conversation — I adjust immediately.)"
Coach · Firm · Minimal shown with one sample line each. Savage appears greyed with a lock:
"Savage unlocks after two weeks. I don't get in your face until I've earned it — and until
I've got receipts." (The lock itself markets the feature and enforces critique C5.)

What onboarding deliberately does **not** contain: identity statements (earned later,
critique C6), questionnaires, account creation beyond the minimum, feature tours.

## 2. The daily loop

- **Morning brief (one notification, or in-app if already open):** today's rep + when +
  one contextual line. Never a list. "Run day. After school drop-off. That's the whole job
  today."
- **The rep window:** nothing. The app shuts up. (Silence during execution hours is a
  feature; the governor blocks pings inside a declared focus window.)
- **Check-in:** initiated by the user's tap, or by the window-close nudge (actionable
  notification: **Done / Floor rep / Not today** — three lock-screen buttons; app-open never
  required, critique C4).
- **Evening close:** only if the day is unresolved, one L2 max: "2 minutes before bed still
  counts. Floor rep?" — otherwise the day ends silently.

## 3. Check-in interaction spec (the most-repeated 10 seconds in the product)

- **Done** → instant T0 confirmation: ledger count ticks up with a physical, satisfying
  animation (this is a Law-4 requirement, doc 02 §5, not decoration). A T1 one-liner appears
  only when there's something to say (milestone proximity, NMT save, comeback). *Most days
  the coach says nothing.* Sparse praise stays valuable; wall-to-wall cheerleading is noise.
- **Floor rep** → counts fully: "Floor reps count. That's the deal." Ledger ticks identically.
- **Not today** → one neutral tap, then the five-reason row (doc 02 §4): forgot · no time ·
  didn't feel like it · too hard · life happened. One optional free-text/voice line:
  "anything I should know?" Then it's over — no lecture at logging time. Diagnosis waits for
  accumulation, and the NMT setup happens on tomorrow-morning's schedule (doc 02 §7).
- **Backfill:** yesterday's cell is one tap away, no guilt copy: "logged it — the record
  matters more than the ritual."

## 4. The miss → comeback arc (the flows that decide the company, critique C1)

**Next morning after miss #1 (NMT conversation, deep-linked):**
"About yesterday — one miss is a data point, not a verdict. The stat that matters now:
people who show up the day after a miss are basically unstoppable; people who miss twice
start negotiating. I've already set today to the floor version. 2 minutes. That's the whole
war."
→ [I'm in] → done, no further talk. → [Can't today] → one probe, reason row, honest
downshift or pause offer.

**On completion after a lapse (Comeback moment):**
Full-screen moment, bigger than any streak celebration:
"**That's a save.** Missing once is human. Missing twice is a pattern. You just broke the
pattern before it started — that's the skill. Saves on record: [3]."

**Re-entry after Dormant (user opens app after 10 days):**
The screen shows **no backlog, no red calendar, no debts.** Today only:
"Good to see you. Nothing to catch up on — that's not how this works. One question: same
plan, smaller plan, or different goal?"
(Three chips. The rebuild starts from Calibration state, at floor size.)

## 5. Chat rules (how the heart of the product stays healthy)

1. **Every conversation ends in exactly one next action**, rendered as a tappable chip
   (do the floor rep · move the window · try the new cue · pause the goal). If the model
   can't name one, the conversation isn't over.
2. **Brevity governor:** coach replies default ≤3 sentences; diagnosis conversations aim for
   resolution in ≤6 exchanges, then converge ("we could talk about it more, or you could be
   done in 2 minutes — I know which one builds the habit"). Respecting the user's time is
   positioning: this is a corner between rounds, not a therapy couch.
3. **The coach may open conversations** (via governor-budgeted notifications) but never
   traps: every coach-initiated thread is answerable with one tap.
4. **Runtime controls are conversational:** "ease up" / "go harder" / "pause everything" work
   as plain chat, take effect instantly, and are confirmed in one line ("Done — dialing it
   back. Say the word when you want it firmer.").
5. **Memory is visible on request:** "what do you know about me" returns the actual profile +
   ledger, editable (doc 03 §7).

## 6. The weekly review (the retention anchor)

Sunday evening (user-adjustable), one notification, opens a 5-card story — 60 seconds to
swipe, built nightly-batch (doc 03 §3):

1. **The week in reps:** consistency % vs. scheduled + the chain of consistent weeks.
2. **The pattern card (the "it knows me" moment, critique C9):** one true, non-obvious,
   data-backed observation — "You're 5-for-5 before 9am and 1-for-4 after. Morning-you is a
   different person. Want me to plan around that?" *Rule: if there's no honest insight this
   week, say something true and plain instead — never fake depth. Fake insight is how trust
   dies.*
3. **Saves & comebacks:** NMT saves this week, framed as skill acquisition.
4. **The ledger:** total votes cast, per identity — "[41] runs since day one."
5. **Next week, one adjustment:** the engine's single prescribed experiment (doc 02 §5),
   pre-agreed with one tap.
Optional share card generation from cards 2/4 (clean, brag-worthy, no shame framing) — the
organic-growth hook, strictly opt-in.

## 7. Notification gallery & anti-gallery

Budget and governor rules in doc 02 §6 / doc 03 §8. Every payload ships with its deep-link
opener (doc 03 §2). Examples by type:

| Type (state) | Example |
|---|---|
| Morning brief (Building) | "Run day. After drop-off. That's the whole job today." |
| Window nudge (Building) | "20 minutes till your window. Shoes by the door already — you did that part last night." |
| NMT morning (post-miss) | "Yesterday's gone. Today's rep decides which way this goes — floor version's ready. 2 min." |
| Wobbling probe | "Three skips with the same excuse is a design problem, not a you problem. 60 seconds to fix the design?" |
| Milestone proximity | "2 reps from your best month since we started." |
| Weekly review | "Your week's ready. One number in here will surprise you." |
| Dormant day-7 (final) | "Last ping from me. The plan's here when you want it. One tap brings it back." |
| Fresh-start revival | "New month. Old goal, smaller version, zero catch-up owed. In?" |

**Anti-gallery — banned by policy (enforced in eval suite, doc 03 §6):** guilt-mongering
("Everyone else finished today 😢"), parasocial manipulation ("I miss you…"), streak-loss
terror ("Your 47-day streak DIES at midnight!"), vague spam ("Don't forget your habits!"),
fake urgency, more than one ping about the same rep, anything a screenshot of which would
embarrass us.

## 8. Voice: cut the custom build from MVP

The brief wants a mic on every field. Reality check: mobile OS keyboards already ship
excellent dictation on every text field for free. A custom voice pipeline (recording UI,
STT, error states) buys almost nothing over that at MVP stage — **except in one place:** the
onboarding *why* (§1 step 2) and the optional miss-note (§3), where spoken answers are
measurably more honest and the verbatim audio-transcript is ledger material. Ship those two
as voice-note-friendly; rely on OS dictation everywhere else; revisit full voice
(including AI voice replies) post-MVP. This deletes an entire subsystem from v1 with ~zero
user-visible loss.

## 9. Screens inventory (MVP = 6 surfaces, not 20)

1. **Today** (home): the rep, the check-in, the chain — one glance.
2. **Chat** (the coach): threads opened by notifications or the user.
3. **Progress**: ledger, consistency, saves, weekly reviews archive.
4. **Goal/habit editor**: plan, floor, windows, milestones (projects).
5. **Style & contract**: styles, intensity history, quiet hours, budgets.
6. **Onboarding** (§1).

No feed. No explore tab. No social. The product is a relationship plus a ledger, and the
information architecture should say exactly that.
