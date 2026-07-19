# `.claude/` — AI development workflow

Mirrors the `seamless` AI-workflow pattern: spec-driven development driven by custom slash
commands plus reusable skills.

> **Starter — reconcile with `seamless`.** These commands are sensible defaults tailored to
> this project. When the exact `seamless` `.claude/` files are available (push it to GitHub and
> I'll pull it in), replace/merge these with the originals so the workflow matches what you
> already use.

## Commands (`.claude/commands/`)

The core loop is **interview → planner → implement**:

| Command | Purpose |
|---|---|
| `/interview` | Turn a fuzzy feature idea into a crisp, testable spec by asking the right questions. Output: a spec doc |
| `/planner` | Turn a spec into a phased, doc-grounded implementation plan (files to touch, order, risks) |
| `/implement` | Execute one plan step following project conventions, then verify it end-to-end |

## Skills (`.claude/skills/`)

Reusable, packaged instructions for recurring tasks (e.g. "add an API endpoint", "add a screen",
"write a behavioral-engine rule"). Add one folder per skill with a `SKILL.md`. Empty for now —
populate from `seamless` or as patterns emerge.

## Settings (`.claude/settings.json`)

Project-level Claude Code config (permissions, env). Starter is permissive for common dev
commands; tighten before sharing.
