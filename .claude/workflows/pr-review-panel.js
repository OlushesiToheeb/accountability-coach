export const meta = {
  name: 'pr-review-panel',
  description: 'Multi-agent PR review: 8 review lenses per PR, consolidate, adversarially challenge high/critical findings, synthesize a constructive change-request per PR',
  whenToUse: 'When asked to review one or more GitHub PRs thoroughly with multiple review agents. Pass args:{prNumbers:[...], repo?, repoDir?, workDir?}. Numbers default repo/repoDir/workDir to AUTO (resolved by the prep agent). Returns per-PR confirmed findings + a ready-to-post constructive review body. The CALLER posts comments after user confirmation — this workflow does NOT post to GitHub.',
  phases: [
    { title: 'Prep', detail: 'fetch diff + metadata + read-only worktree per PR' },
    { title: 'Review', detail: '8 review lenses per PR in parallel' },
    { title: 'Consolidate', detail: 'dedup + re-calibrate severity per PR' },
    { title: 'Challenge', detail: 'adversarially refute each high/critical finding (3 lenses)' },
    { title: 'Synthesize', detail: 'build a constructive review body per PR' },
    { title: 'Finalize', detail: 'cross-PR synthesis of the stack' },
  ],
}

// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------
const SEV = { critical: 5, high: 4, medium: 3, low: 2, info: 1 }
// args may arrive as an object or as a JSON-encoded string (or a bare array of PR numbers) — normalize.
let A = args
if (typeof A === 'string') { try { A = JSON.parse(A) } catch { A = {} } }
if (Array.isArray(A)) A = { prNumbers: A }
A = A || {}
const repo = A.repo || 'AUTO'
const repoDir = A.repoDir || 'AUTO'
const workDir = A.workDir || 'AUTO'
const prNumbers = (A.prNumbers || A.prs || []).map(n => (typeof n === 'string' ? Number((n.match(/\d+/) || [n])[0]) : n)).filter(Boolean)

const PROJECT_CONTEXT =
  'Seamless monorepo (Fincra internal backoffice). Services: backend (NestJS + Sequelize + PostgreSQL + Bull), frontend (Next.js 16 App Router + React 19 + React Query + Zod + Tailwind), database-migration (Goose), whatsapp (Baileys), balances (NestJS microservice polling bank/fintech/crypto balances). ' +
  'Conventions: API responses {status,statusCode,data,message}; React Query QUERY_KEYS factories; forms = Zod + react-hook-form + zodResolver; Sequelize entities @Table({timestamps:true,paranoid:true,underscored:true}); auth via @RequireAuth() + @SessionUser(); permissions-based RBAC; kebab-case filenames. Money/balances use exact decimal handling. This is a STACKED PR chain — review ONLY what THIS PR changes vs its base.'

const SEVERITY_RUBRIC =
  'Severity rubric (be calibrated, do NOT inflate): ' +
  'critical = data loss/corruption, security hole (authz bypass, secret/credential leak, SQL/command injection, IDOR), money/balance miscalculation, or breaks production. ' +
  'high = a real bug that hits users, broken core logic, missing critical error handling, or a migration that can fail or lose data. ' +
  'medium = edge-case bug, missing validation, notable maintainability/perf problem. ' +
  'low = minor robustness/style-adjacent. info = nit/observation.'

const READONLY =
  'STRICT: This is a READ-ONLY review. Do NOT use Edit/Write/NotebookEdit, do NOT modify any file, do NOT run any git-mutating command. The code under review is NOT your working tree — read it from the diff path and the worktree path given below. Only read and analyze. Output ONLY via the StructuredOutput tool.'

const DIMENSIONS = [
  { key: 'correctness', title: 'Correctness & bugs',
    focus: 'Logic errors, off-by-one, null/undefined deref, async/await misuse, unhandled promise, race conditions, incorrect data transforms, React state/effect bugs, incorrect calculations (especially capital-position / balance math), boundary conditions, wrong comparisons, mutation of shared state.' },
  { key: 'security', title: 'Security & data integrity',
    focus: 'AuthZ/authN (RBAC permission guards, @RequireAuth, the right permission on each endpoint), secret/credential handling (env.schema, provider API keys staying server-side), injection (raw SQL, unsanitized input, command exec), IDOR / missing ownership checks, the soft-delete migration and partial-unique-index correctness, money/balance integrity, SSRF in outbound provider calls, error responses leaking internals.' },
  { key: 'errors', title: 'Error handling & silent failures',
    focus: 'Swallowed exceptions, empty/overbroad catch, fallbacks that hide failures, unhandled rejections, missing error propagation, default values that mask errors, provider/HTTP fetch failures not surfaced, 503/timeout handling, partial-failure semantics in pollers.' },
  { key: 'types', title: 'Types & contracts',
    focus: 'any/unknown abuse, unsafe type assertions (as), weak/missing types, DTO validation gaps, nullable mishandling, enums vs strings, and API contract drift between backend types/DTOs and the frontend types that consume them.' },
  { key: 'simplicity', title: 'Simplicity & maintainability',
    focus: 'Over-engineering, duplication, dead code, overly long/complex functions (e.g. compute.ts), unnecessary abstraction, repeated patterns that should be extracted, simpler equivalent implementations. Report simplifications as findings — do NOT edit code.' },
  { key: 'tests', title: 'Test coverage & quality',
    focus: 'Coverage of new logic and error paths, missing edge cases, assertions that do not actually verify behavior, untested critical calculations, missing tests for entities/migrations/DTOs, over-mocking that tests nothing, flaky patterns.' },
  { key: 'comments', title: 'Comments & docs accuracy',
    focus: 'Stale or inaccurate comments/JSDoc, misleading docstrings, plan/mindmap docs in the diff that contradict the actual code, TODO/FIXME left in, comment rot.' },
  { key: 'conventions', title: 'Conventions & standards',
    focus: 'Adherence to project conventions (API response shape, QUERY_KEYS, kebab-case filenames, entity @Table options, auth decorators, Goose migration naming/reversibility), consistency with existing patterns in the codebase, PR hygiene.' },
]

// ----------------------------------------------------------------------------
// Schemas
// ----------------------------------------------------------------------------
const FINDING_PROPS = {
  title: { type: 'string' },
  severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'info'] },
  category: { type: 'string' },
  file: { type: 'string' },
  line: { type: 'string', description: 'line number or range in the PR head version' },
  description: { type: 'string', description: 'what is wrong' },
  impact: { type: 'string', description: 'why it matters / what breaks' },
  evidence: { type: 'string', description: 'exact code or diff hunk proving it' },
  suggestion: { type: 'string', description: 'concrete fix' },
  confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
}
const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'object', properties: FINDING_PROPS, required: ['title', 'severity', 'file', 'description', 'suggestion'] } },
    summary: { type: 'string' },
  },
  required: ['findings'],
}
const CONSOLIDATED_SCHEMA = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, ...FINDING_PROPS }, required: ['id', 'title', 'severity', 'file', 'description', 'suggestion'] } },
    perPrSummary: { type: 'string' },
  },
  required: ['findings'],
}
const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    refuted: { type: 'boolean', description: 'true if you could NOT prove the finding is a real, reachable issue' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    adjustedSeverity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'info'] },
    reasoning: { type: 'string' },
    exactFileLine: { type: 'string' },
    inDiffHunk: { type: 'boolean', description: 'is the cited line part of THIS PR diff' },
    suggestedFix: { type: 'string' },
  },
  required: ['refuted', 'adjustedSeverity', 'reasoning'],
}
const PR_SYNTH_SCHEMA = {
  type: 'object',
  properties: {
    recommendation: { type: 'string', enum: ['request_changes', 'comment', 'approve'] },
    reviewBody: { type: 'string', description: 'full Markdown PR review comment to post on GitHub' },
    confirmed: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, title: { type: 'string' }, severity: { type: 'string' }, file: { type: 'string' }, line: { type: 'string' }, inDiffHunk: { type: 'boolean' }, commentText: { type: 'string' } },
        required: ['title', 'severity', 'file', 'commentText'],
      },
    },
    mediumLowCount: { type: 'number' },
    summary: { type: 'string' },
  },
  required: ['recommendation', 'reviewBody'],
}
const FINAL_SCHEMA = {
  type: 'object',
  properties: {
    overallSummary: { type: 'string' },
    crossCuttingThemes: { type: 'array', items: { type: 'string' } },
    duplicatedAcrossPrs: { type: 'array', items: { type: 'string' } },
    perPr: { type: 'array', items: { type: 'object', properties: { number: { type: 'number' }, recommendation: { type: 'string' }, confirmedHighCritical: { type: 'number' }, oneLine: { type: 'string' } } } },
    mergeFixOrder: { type: 'string' },
  },
  required: ['overallSummary', 'perPr'],
}
const PREP_SCHEMA = {
  type: 'object',
  properties: {
    prs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: { type: 'number' }, title: { type: 'string' }, repo: { type: 'string' }, base: { type: 'string' },
          headRef: { type: 'string' }, headSha: { type: 'string' }, diffPath: { type: 'string' }, diffLines: { type: 'number' },
          worktree: { type: 'string' }, bodyPath: { type: 'string' }, additions: { type: 'number' }, deletions: { type: 'number' }, changedFiles: { type: 'number' },
        },
        required: ['number', 'repo', 'diffPath', 'worktree', 'headSha'],
      },
    },
  },
  required: ['prs'],
}

// ----------------------------------------------------------------------------
// Prompt builders
// ----------------------------------------------------------------------------
function ctxHeader(ctx) {
  return 'PR #' + ctx.number + ': ' + (ctx.title || '') + '\n' +
    'Repo: ' + ctx.repo + '  | base: ' + (ctx.base || '?') + ' (stacked — review only THIS PR diff)\n' +
    'Unified diff for THIS PR: ' + ctx.diffPath + ' (' + (ctx.diffLines || '?') + ' lines — READ THE ENTIRE FILE; if Read truncates at 2000 lines, continue with offset to read all of it).\n' +
    'Full PR code checked out READ-ONLY at: ' + ctx.worktree + ' (head ' + ctx.headSha + '). Read any file there for surrounding context (callers, types, related modules).\n'
}

function dimPrompt(ctx, d) {
  return [
    'You are a senior reviewer applying ONE lens: ' + d.title + '.',
    '', PROJECT_CONTEXT, '', ctxHeader(ctx),
    'Your lens focus: ' + d.focus,
    '', SEVERITY_RUBRIC,
    'Only report issues INTRODUCED or worsened by this PR diff. Every finding needs file path, line/range, what is wrong, why it matters, exact evidence, and a concrete fix. No speculation — if you cannot point to specific code, do not report it.',
    '', READONLY,
  ].join('\n')
}

function consolidatePrompt(ctx, raw) {
  return [
    'You are the CONSOLIDATION reviewer for PR #' + ctx.number + '.',
    PROJECT_CONTEXT, '', ctxHeader(ctx),
    'Below are raw findings from 8 review lenses (JSON). Tasks:',
    '1. Merge duplicates (same root issue from multiple lenses) — keep the strongest evidence and union the suggestions.',
    '2. Drop clear false positives and non-actionable noise.',
    '3. Re-calibrate severity per the rubric (conservatively).',
    '4. Assign each surviving finding a stable id "PR' + ctx.number + '-<k>".',
    'Read the diff and worktree to adjudicate borderline cases.',
    '', SEVERITY_RUBRIC,
    '', 'RAW FINDINGS JSON:', JSON.stringify(raw),
    '', READONLY,
  ].join('\n')
}

function challengePrompt(ctx, f, lens) {
  const lensText = {
    A: 'LENS A — Reality: Does the described problem actually exist in the code AS WRITTEN? Read the cited file in the worktree and the diff. Did the reviewer misread, cite the wrong line, or describe behavior the code does not have? If the code does not actually do what the finding claims, refute it.',
    B: 'LENS B — Reachability & severity: Even if technically present, is it reachable in real execution, and is the severity justified? Are there guards, validation, types, framework behavior, or callers elsewhere that prevent it? Decide the correct adjustedSeverity (you may downgrade or upgrade).',
    C: 'LENS C — Strongest counter-argument: Make the best possible case that this is intended behavior or a non-issue. Check tests, conventions, and how the rest of the codebase does it. If that case is convincing, refute it.',
  }[lens]
  return [
    'You are an ADVERSARIAL skeptic. Your DEFAULT verdict is REFUTED — assume the finding is wrong until the ACTUAL code proves it real and reachable. Do not be agreeable; try hard to break it.',
    PROJECT_CONTEXT, '', ctxHeader(ctx),
    'FINDING UNDER CHALLENGE (JSON):', JSON.stringify(f),
    '', lensText,
    'Verify against the real code: read ' + ctx.worktree + '/<file> and the diff at ' + ctx.diffPath + '. Cite exact code. If you cannot prove with concrete evidence that this is a genuine, reachable issue, set refuted=true. Report exactFileLine and whether that line is inside THIS PR diff hunk (inDiffHunk).',
    '', READONLY,
  ].join('\n')
}

function synthPrompt(ctx, findings, confirmed) {
  return [
    'You are the LEAD reviewer finalizing PR #' + ctx.number + ' (' + (ctx.title || '') + '). The author is a teammate and your job is to help them ship it safely — write like a respected senior colleague who wants this PR to succeed.',
    PROJECT_CONTEXT, '', ctxHeader(ctx),
    'CHALLENGE-CONFIRMED high/critical findings (these survived adversarial verification — JSON):', JSON.stringify(confirmed),
    '', 'All consolidated findings for context (JSON):', JSON.stringify(findings),
    '', 'Produce:',
    '1. recommendation: "request_changes" if any confirmed critical/high remain; else "comment" if there are notable mediums; else "approve".',
    '2. reviewBody: the Markdown PR review comment to post on GitHub. It MUST be CONSTRUCTIVE, CONCISE, and DETAILED, and contain ONLY the challenge-confirmed CRITICAL and HIGH findings — no medium/low, no non-blocking section.',
    '   TONE (required): collaborative and solution-oriented, never blaming. Assume good intent — phrase as "this looks like a missed step", "consider", "would it be cleaner to…", NOT "you broke / this is wrong". The goal is to make the fix obvious and easy, not to be exhaustive about what is wrong.',
    '   STRUCTURE: one short framing sentence, then per confirmed finding — a severity tag + bold **file:line**, a one-line statement of the problem, its concrete impact (why it matters), and a precise ACTIONABLE fix the author can apply without a round-trip (the exact change or a short code block; offer a clear option set only when there is a genuine choice). Spend most of the words on the fix and the why — do not restate the diff. No filler, no praise padding.',
    '   Reference findings by file:line. Use ONLY provided findings — invent nothing. If there are ZERO confirmed critical/high findings, set reviewBody to an empty string.',
    '3. confirmed: array — for each confirmed CRITICAL/HIGH finding: id, title, severity, file, line, inDiffHunk, and commentText (a standalone, constructive, concise-but-detailed comment for that exact location — same solution-first tone, with a concrete fix the author can act on).',
    'Keep it focused; this is for a fast review turnaround.',
    '', READONLY,
  ].join('\n')
}

function prepPrompt() {
  return [
    'You are the PREP coordinator for a multi-PR code review. Do EXACTLY the steps below, sequentially (NOT in parallel — avoid git worktree lock races), then return structured JSON.',
    '',
    'Repo: ' + repo + '  (if "AUTO", resolve with: gh repo view --json nameWithOwner -q .nameWithOwner)',
    'Git repo dir: ' + repoDir + '  (if "AUTO", use the output of: git rev-parse --show-toplevel)',
    'Artifact work dir: ' + workDir + '  (if "AUTO", create one with: mktemp -d -t pr-review-XXXXXX)',
    'PR numbers: ' + JSON.stringify(prNumbers),
    '',
    'First: mkdir -p <workDir> <workDir>/wt',
    'For EACH PR number N (in order):',
    '1. gh pr view N --repo <repo> --json number,title,baseRefName,headRefName,headRefOid,additions,deletions,changedFiles,body',
    '2. Write the body to <workDir>/pr-N-body.md',
    '3. Diff: if <workDir>/pr-N.diff exists and is non-empty, reuse it; else run: gh pr diff N --repo <repo> > <workDir>/pr-N.diff . Then count lines with: wc -l < <workDir>/pr-N.diff',
    '4. Worktree at <workDir>/wt/pr-N: if that directory already exists, reuse it (do nothing). Else run: git -C <repoDir> fetch origin <headRefName>  then  git -C <repoDir> worktree add --detach <workDir>/wt/pr-N <headRefOid>',
    '5. Sanity-check: git -C <workDir>/wt/pr-N rev-parse HEAD should equal <headRefOid>.',
    '',
    'Return JSON {prs:[...]} with one entry per PR: {number, title, repo:<resolved repo>, base:<baseRefName>, headRef:<headRefName>, headSha:<headRefOid>, diffPath:"<workDir>/pr-N.diff", diffLines:<int>, worktree:"<workDir>/wt/pr-N", bodyPath:"<workDir>/pr-N-body.md", additions, deletions, changedFiles}. Do not skip any PR. The only writes allowed are the diff/body files and the worktree creation above.',
  ].join('\n')
}

function finalPrompt(perPr) {
  return [
    'You are doing the CROSS-PR synthesis for a stacked PR chain (each PR based on the one below it). Per-PR review results JSON below.',
    PROJECT_CONTEXT,
    '', 'PER-PR RESULTS:', JSON.stringify(perPr.map(p => ({ number: p.number, title: p.title, base: p.base, recommendation: p.recommendation, confirmed: (p.confirmed || []).map(c => ({ severity: c.severity, file: c.file, title: c.title })), summary: p.summary }))),
    '', 'Produce: overallSummary (3-5 sentences on the feature and its readiness); crossCuttingThemes (issues recurring across PRs); duplicatedAcrossPrs (the same root issue confirmed in more than one PR — so we do not double-comment); perPr (number, recommendation, confirmedHighCritical count, one-line verdict); mergeFixOrder (given the stack, what to fix/merge first).',
  ].join('\n')
}

// ----------------------------------------------------------------------------
// Severity tally for the challenge gate
// ----------------------------------------------------------------------------
function tally(verdicts) {
  const ok = verdicts.filter(Boolean)
  if (!ok.length) return { confirmed: false, finalSeverity: null, notRefuted: 0, total: 0, reasons: [] }
  const notRefuted = ok.filter(v => !v.refuted)
  const confirmed = notRefuted.length >= 2 && notRefuted.length >= Math.ceil(ok.length / 2)
  const ranks = notRefuted.map(v => SEV[v.adjustedSeverity] || 3).sort((a, b) => a - b)
  const midRank = ranks.length ? ranks[Math.floor((ranks.length - 1) / 2)] : 0
  const finalSeverity = Object.keys(SEV).find(k => SEV[k] === midRank) || null
  return { confirmed, finalSeverity, notRefuted: notRefuted.length, total: ok.length, reasons: ok.map(v => (v.refuted ? '[REFUTED] ' : '[UPHELD] ') + v.reasoning) }
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------
if (!prNumbers.length) return { error: 'No PR numbers provided. Pass args:{prNumbers:[...]}.' }

phase('Prep')
const prep = await agent(prepPrompt(), { schema: PREP_SCHEMA, label: 'prep-' + prNumbers.join('-'), phase: 'Prep' })
const prs = ((prep && prep.prs) || []).filter(Boolean)
if (!prs.length) return { error: 'Prep produced no PR contexts.', prep }
log('Prepared ' + prs.length + ' PR(s): ' + prs.map(p => '#' + p.number + ' (' + p.diffLines + ' diff lines)').join(', '))

const perPr = await pipeline(
  prs,
  // Stage 1 — Review: 8 lenses in parallel
  async (ctx) => {
    const raw = await parallel(DIMENSIONS.map(d => () =>
      agent(dimPrompt(ctx, d), { schema: FINDINGS_SCHEMA, label: 'review:#' + ctx.number + ':' + d.key, phase: 'Review' })
        .then(r => ((r && r.findings) || []).map(f => ({ ...f, lens: d.key })))
    ))
    return { ctx, raw: raw.filter(Boolean).flat() }
  },
  // Stage 2 — Consolidate
  async (prev) => {
    const c = await agent(consolidatePrompt(prev.ctx, prev.raw), { schema: CONSOLIDATED_SCHEMA, label: 'consolidate:#' + prev.ctx.number, phase: 'Consolidate' })
    return { ctx: prev.ctx, findings: (c && c.findings) || [], summary: (c && c.perPrSummary) || '' }
  },
  // Stage 3 — Challenge each high/critical (3 adversarial lenses)
  async (prev) => {
    const hc = prev.findings.filter(f => f.severity === 'high' || f.severity === 'critical')
    const challenged = await parallel(hc.map(f => async () => {
      const verdicts = await parallel(['A', 'B', 'C'].map(L => () =>
        agent(challengePrompt(prev.ctx, f, L), { schema: VERDICT_SCHEMA, label: 'challenge:' + (f.id || f.title.slice(0, 20)) + ':' + L, phase: 'Challenge' })
      ))
      return { f, t: tally(verdicts) }
    }))
    const confirmed = []
    challenged.filter(Boolean).forEach(({ f, t }) => {
      if (t.confirmed && (t.finalSeverity === 'high' || t.finalSeverity === 'critical')) {
        confirmed.push({ ...f, severity: t.finalSeverity, challengeReasons: t.reasons, challengeVote: t.notRefuted + '/' + t.total })
      }
    })
    log('PR #' + prev.ctx.number + ': ' + hc.length + ' high/critical raised, ' + confirmed.length + ' survived challenge')
    return { ctx: prev.ctx, findings: prev.findings, confirmed, summary: prev.summary }
  },
  // Stage 4 — Synthesize per-PR review
  async (prev) => {
    const s = await agent(synthPrompt(prev.ctx, prev.findings, prev.confirmed), { schema: PR_SYNTH_SCHEMA, label: 'synth:#' + prev.ctx.number, phase: 'Synthesize' })
    return {
      number: prev.ctx.number, title: prev.ctx.title, base: prev.ctx.base, headSha: prev.ctx.headSha, repo: prev.ctx.repo,
      recommendation: (s && s.recommendation) || (prev.confirmed.length ? 'request_changes' : 'comment'),
      reviewBody: (s && s.reviewBody) || '',
      confirmed: (s && s.confirmed) || prev.confirmed,
      challengeDetail: prev.confirmed,
      allFindings: prev.findings,
      mediumLowCount: (s && s.mediumLowCount) != null ? s.mediumLowCount : prev.findings.filter(f => !['high', 'critical'].includes(f.severity)).length,
      summary: (s && s.summary) || prev.summary,
    }
  },
)

const clean = perPr.filter(Boolean)
phase('Finalize')
const final = await agent(finalPrompt(clean), { schema: FINAL_SCHEMA, label: 'cross-pr-synthesis', phase: 'Finalize' })

return { perPr: clean, final }
