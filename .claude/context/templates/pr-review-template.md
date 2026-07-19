# PR Review: [PR Title]

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **PR** | #[number] — [title] |
| **Branch** | `feature/...` → `develop` |
| **Reviewer** | [Name] |
| **Verdict** | APPROVE / REQUEST_CHANGES / COMMENT |

---

## Summary

_1-3 sentence summary of what this PR does._

---

## Blocking Issues

_Issues that must be fixed before merge._

| # | Severity | File:Line | Description | Why | Suggested Fix |
|---|----------|-----------|-------------|-----|---------------|
| 1 | CRITICAL | `file.ts:42` | _What's wrong_ | _Why it matters_ | _How to fix_ |

---

## Non-Blocking Issues

_Issues that should be addressed but don't block merge._

| # | Severity | File:Line | Description | Suggested Fix |
|---|----------|-----------|-------------|---------------|
| 1 | WARNING | `file.ts:42` | _What's wrong_ | _How to fix_ |
| 2 | SUGGESTION | `file.ts:42` | _Improvement idea_ | _How to improve_ |

---

## Tests

- [ ] New tests added for new behavior
- [ ] Existing tests still pass
- [ ] Edge cases covered
- [ ] _Notes on test coverage gaps (if any)_

---

## Risk Assessment

| Factor | Rating | Notes |
|--------|--------|-------|
| **Blast radius** | Low / Medium / High | _How many areas does this change affect?_ |
| **Reversibility** | Easy / Medium / Hard | _How easy to rollback?_ |
| **Data impact** | None / Read / Write | _Does it change data?_ |

---

## Recommendation

_Final recommendation with rationale. If requesting changes, be specific about what must change._
