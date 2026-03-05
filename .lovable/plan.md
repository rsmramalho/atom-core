

# P1 Implementation: Zod Validation, Skeletons, Docs Sync

## What's Done (P0)
- Password reset flow
- Profiles auto-create trigger
- RLS audit + cascade deletes
- Session expiry handling

## What's Next (P1) - 3 Blocks

### Block 1: Zod Validation on Forms

Add Zod schemas to validate user input before submission in:

1. **QuickAddTaskModal** — title min 1 char, max 200; module enum; dueDate optional ISO string
2. **QuickAddMilestoneModal** — title min 1 char, max 200; weight 1-10; module enum
3. **Lists create modal** — title min 1 char, max 200
4. **JournalComposer** — content min 1 char
5. **Inbox capture** — title min 1 char after parsing

Create `src/lib/validation.ts` with shared Zod schemas. Show inline error messages on invalid input using toast or field-level errors.

### Block 2: Lists Page Skeleton

The Lists page currently shows a generic `Loader2` spinner. Replace with a proper card grid skeleton matching the existing card layout (3-column grid with card outlines, progress bars, and list item placeholders). Follows the pattern already used by `InboxItemCardSkeleton` and `ProjectCardSkeleton`.

### Block 3: Docs Sync

Update 3 documents to reflect current state (alpha.28 → beta prep):

1. **EXECUTIVE_SUMMARY.md** — Currently references alpha.22. Update to alpha.28+. Add: collaboration system (Owner/Editor/Viewer), AI weekly summary, push notifications, password reset, 9 engines. Update routes table (add `/invite/:code`, `/reset-password`). Update "Próximos Passos".

2. **DEPLOYMENT_CHECKLIST.md** — Currently references alpha.22. Add sections for: collaboration tables RLS verification, push notification VAPID keys check, AI edge function deployment, password reset flow verification.

3. **ARCHITECTURE.md** — Currently at alpha.25. Add: collaboration architecture (project_members, project_invites, project_activities tables + RLS functions), push notifications flow (VAPID + edge function), AI weekly summary edge function, password reset route.

4. **FULL_DOCUMENTATION.md** — Consolidate all changes from above into the single-file reference.

### Summary

| Item | Files Changed | Effort |
|------|--------------|--------|
| Zod validation | Create `validation.ts`, edit 4 modal/form components | Medium |
| Lists skeleton | Edit `Lists.tsx` | Small |
| Docs sync | Edit 4 docs files | Medium |

