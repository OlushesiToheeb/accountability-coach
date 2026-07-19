---
description: Update mindmaps and file index by scanning the codebase
argument-hint:
---

# Sync Context — Update Mindmaps + File Index

You are scanning the Seamless codebase and updating all context files to reflect the current state.

## Process

### Step 1: Scan Codebase (Parallel)

Spin up parallel agents to scan each area:

**Agent 1: Frontend Scan**
Scan `seamless-frontend/src/`:
- All page routes (app/ directory)
- All components by module
- All hooks
- All API service files
- All providers/contexts

**Agent 2: Backend Scan**
Scan `seamless-backend/src/`:
- All modules (directories under src/modules/)
- All controllers, services, entities per module
- All guards, interceptors, decorators
- All queue processors

**Agent 3: Database + Integrations Scan**
- Scan `seamless-database-migration/` for all migration files
- Check for any new integration files

### Step 2: Compare Against Mindmaps

For each mindmap in `.claude/context/mindmaps/`:
1. Read the current mindmap
2. Compare against scan results
3. Identify:
   - **New files/routes/endpoints** not in the mindmap
   - **Deleted files** still listed in the mindmap
   - **Moved/renamed files** with stale paths
   - **New modules/components** not documented

### Step 3: Update Mindmaps

For each mindmap with changes:
1. Add new entries
2. Remove deleted entries
3. Update moved/renamed entries
4. Preserve the existing structure and formatting

Update these mindmaps as needed:
- `overview.md` — Architecture, tech stack (rarely changes)
- `frontend.md` — Pages, components, hooks
- `backend.md` — Modules, controllers, services, entities
- `api.md` — API endpoints
- `data.md` — Entities, migrations, schemas
- `whatsapp.md` — WhatsApp service files
- `integrations.md` — Slack, Gmail, queues

### Step 4: Update File Index

Update `.claude/context/archive/file-index.md` with any new configuration or context files.

### Step 5: Report Changes

Present a summary of what was updated:

```markdown
## Sync Context Report — [Date]

### Mindmaps Updated
| Mindmap | Added | Removed | Modified |
|---------|-------|---------|----------|
| frontend.md | 3 entries | 0 entries | 1 entry |
| backend.md | 1 entry | 0 entries | 0 entries |

### Details
- **frontend.md:** Added `modules/whatsapp/components/chat-window.tsx`, ...
- **backend.md:** Added `modules/whatsapp/services/template.service.ts`

### No Changes Needed
- overview.md
- api.md
- data.md
```

If no changes are detected, report that all mindmaps are up to date.
