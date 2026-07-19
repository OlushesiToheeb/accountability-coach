---
description: Turn a fuzzy feature idea into a crisp, testable spec by asking the right questions.
---

# /interview — spec out a feature

You are speccing a feature for the AI accountability & habit coach. The product design is the
source of truth — read the relevant `docs/` files before asking anything (esp. `docs/02`
behavioral engine, `docs/03` AI architecture, `docs/04` UX flows, `docs/09` technical
architecture).

**Goal:** produce a short, testable spec — not code.

## Steps

1. **Ground yourself.** Skim the relevant docs. Note what's already decided so you don't
   re-ask it.
2. **Ask only what's genuinely undecided.** Batch 2–4 sharp questions (use the AskUserQuestion
   tool). Cover: user story, the exact behavior, edge cases, which engine states/laws it
   touches (doc 02), data model deltas (doc 09 §2), and how we'll know it works.
3. **Write the spec** to `docs/specs/<feature>.md`:
   - Problem & user story (one paragraph)
   - Behavior — the happy path + edge cases, as concrete acceptance criteria
   - Data model / API deltas (reference doc 09)
   - Out of scope
   - Open questions
4. **Stop.** Hand off to `/planner`. Do not implement.

Keep it tight. A good spec fits on one screen and every acceptance criterion is checkable.
