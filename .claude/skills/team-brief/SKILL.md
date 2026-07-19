---
description: Generate a teammate-facing context brief for a Seamless module, suitable for upload to a shared Claude chat project
argument-hint: [module-name]
---

# Team Brief — Module Context for Claude Chat Projects

You are writing a **teammate-facing** context document about one module of Seamless. The document will be uploaded to a shared Claude chat project so non-engineers (product, ops, treasury, support, RMs, managers) can ask Claude questions about that module with grounding.

## Audience

Mixed: PMs, ops, treasury, RMs, managers, support. **Not engineers.** No code. No file paths. No tech stack jargon (NestJS / Sequelize / React Query are invisible to the reader). Frame everything in product / workflow / role terms.

## Rules

- **DO NOT** copy mindmap content verbatim — mindmaps are AI/engineer-oriented and too dense. Translate them.
- **DO NOT** include code blocks, file paths, or implementation detail. The reader doesn't care that something lives in `modules/rates/entities/`.
- **DO NOT** invent features. If you're unsure what something does, say so or omit it.
- **DO** use plain English, short sentences, and tables where they help.
- **DO** define every term the reader might not know, up front.
- Target length: **roughly 1,000–1,500 words** per module brief. Shorter is fine if the module is small.
- Save the output to `.claude/context/team-briefs/<NN>-<module-slug>.md` where `NN` is the next free number (treasury is `01`).

## Process

### Step 1 — Identify the module's surface area

Map the module to its real-world footprint in the codebase. For each module, this usually means:

- A group of frontend pages (under `frontend/src/app/(...)/`)
- A set of backend modules (under `backend/src/modules/`)
- Possibly an external service (whatsapp, treasury-rates-service, intelligence agents)

If the user gave you a module name, use these mappings as a starting point but verify by looking:

| Module | Likely frontend areas | Likely backend modules |
|---|---|---|
| Treasury | `(market-intelligence)/*` | rates, trades, payment, share-rate, customer-market, merchants |
| Task Management & Issue Resolution | `(task-standalone)`, `(chat-standalone)`, `(hub)` | tasks, chats, chat-groups, notes, note-tags, feedback, slack, plus the `whatsapp/` service |
| Performance Management | `(performance)/*` | goals, goal-cycles, impact-log, user-profiles, tier-configuration |
| Intelligence | `(assistant)`, `(market-intelligence)/market-view`, `merchant-notes`, `merchant-segments`, intelligence-admin | intelligence, agents, audit-log |

### Step 2 — Research via an Explore subagent

Spawn an Explore agent and ask it for, **per page or sub-module**:

- A 2–4 sentence plain-English summary of what it is and what it does
- Who the primary user is (Treasury, Ops, RM, Finance, manager, employee, support, etc.)
- The 1–2 workflows it enables

Also ask the agent for:

- A list of recurring glossary terms with definitions inferred from the code
- The conceptual relationships between the pieces (what flows into what, what depends on what)
- Any external systems referenced
- A list of the **2–6 things most likely to confuse someone the first time**

Keep the agent's report under ~1,500 words. Don't ask it to dump entity fields or API shapes — those don't belong in the brief.

### Step 3 — Write the brief using this structure

The document MUST follow this template. The treasury brief at `.claude/context/team-briefs/01-treasury.md` is the canonical reference — match its tone, depth, and altitude.

```markdown
# Seamless — <Module Name> Module

<One-paragraph framing: who this is for and what they'll get out of the doc.>

---

## What <Module> is for

<One short paragraph defining the module's job in product terms.>

It answers <N> questions every working day:
1. ...
2. ...
3. ...

---

## Glossary — read this first

<Table of every recurring term with a one-line definition. Put this BEFORE the page walkthrough so the rest reads cleanly. Include synonyms / "X and Y are the same thing in this module" callouts.>

---

## The core lifecycle

<A simple arrow diagram showing the spine of the module — the dominant flow that everything else supports.>

```
A → B → C → D → E
```

<3–6 bullets explaining each step in plain English.>

---

## The pages, grouped by what they do

<Group the pages by purpose, not alphabetically. Typical groupings:>
<- Setting things up / inputs>
<- Daily working surfaces>
<- Tracking / reconciling>
<- Reporting / understanding>

### A. <Group name>

**<Page name>** — <2–4 sentence plain-English description. What is it, who uses it, what's the workflow.>

**<Page name>** — ...

### B. <Group name>

...

---

## Who uses what

<Role → primary pages → what they care about, as a table.>

| Role | Primary pages | What they care about |
|---|---|---|
| ... | ... | ... |

---

## How the concepts connect

<2–5 short paragraphs describing the relationships beyond the lifecycle: strategy levers, side flows, edge cases like cross-pairs or multi-leg flows. Each starts with a bold label.>

**<Relationship name>.** <Explanation.>

---

## External systems <Module> talks to

<Bullet list — name and one-line purpose. Examples: treasury-rates-service, Slack, Gmail, WhatsApp, BigQuery, Mono, OpenAI.>

---

## Things that confuse people the first time

<3–8 bullets capturing the gotchas a new teammate would otherwise learn from a Slack thread. These are gold — prioritize them.>

- **<Gotcha>.** <Why it confuses people.>

---

*Last reviewed: <YYYY-MM-DD>. If anything here is wrong or stale, ping the Seamless team and we'll update.*
```

### Step 4 — Cross-check before saving

Before writing the file, verify:

- [ ] No code blocks (other than the lifecycle arrow diagram)
- [ ] No file paths
- [ ] No framework / library names visible to the reader
- [ ] Every term used appears in the Glossary OR is defined inline on first use
- [ ] The "Who uses what" table covers every role mentioned in the page walkthrough
- [ ] At least 3 entries in "Things that confuse people the first time"
- [ ] Length is 1,000–1,500 words for a normal module; shorter is OK for narrow modules
- [ ] Last-reviewed date matches today

### Step 5 — Save and report

Save to `.claude/context/team-briefs/<NN>-<slug>.md`. Report back with:
- The path
- A 3–5 line summary of the document's shape
- 2–4 specific items the user should sanity-check (terms whose meanings you inferred, things you treated as synonymous, anything that looked stubbed or unused)

## Numbering convention

- `00-seamless-primer.md` — the shared overview document (modules, glossary, who-uses-what, channels)
- `01-treasury.md`
- `02-tasks-and-issue-resolution.md`
- `03-performance-management.md`
- `04-intelligence.md`

If a new module is added later, give it the next free number.

## Anti-patterns to avoid

- **Dumping the mindmap.** The mindmaps are for AI agents and engineers. They will overwhelm a non-technical reader. Translate.
- **Listing every page in alphabetical order.** Group by purpose; alpha-order hides the structure.
- **Skipping the glossary.** Without it, the rest of the doc forces the reader to context-switch constantly.
- **Pretending you know what something does.** If a page or module looks stubbed or you can't infer its purpose, omit it or flag it for the user.
- **Adding a "tech stack" section.** Teammates don't care which framework runs the page.
- **Long prose paragraphs.** Short paragraphs, tables, and bullets read better in a chat project context window.
