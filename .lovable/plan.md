

# Audit Report + P2 Beta Continuation Plan

## Audit Results

### CRITICAL FINDINGS (must fix)

1. **Trigger `on_auth_user_created` exists in DB functions but NOT in `db-triggers` section** -- the triggers section says "There are no triggers in the database." This means the trigger from migration `20260305120951` likely failed or was dropped. The `handle_new_user` function exists but is not attached. New signups will NOT auto-create profiles.

2. **Duplicate trigger creation** -- Migration `20260304194403` already creates the trigger AND `20260305120951` re-creates it. This could cause conflicts. Need to verify trigger actually exists via a SQL query.

3. **`assetlinks.json` still has placeholder** -- `COLE_AQUI_O_SHA256_DO_SEU_KEYSTORE` in production. This breaks Android TWA verification.

4. **Privacy page has placeholder email** -- `privacy@mindmate.app` is non-functional.

### HIGH FINDINGS

5. **No route-level error boundaries** -- Only one global ErrorBoundary wraps the entire app. A crash in any page (e.g., Calendar) takes down everything including navigation.

6. **No double-click protection on most forms** -- Only `MacroPickerModal` has `isSubmitting` guard. `AuthForm`, `JournalComposer`, `QuickAddTaskModal`, `QuickAddMilestoneModal`, and Lists create all lack it (Inbox's `handleCapture` has `isCreating` which is good).

7. **ResetPassword infinite loading if no recovery hash** -- If user navigates to `/reset-password` directly without a valid hash, they see a spinner forever with no timeout or escape.

### MEDIUM FINDINGS

8. **Journal page has no loading skeleton** -- Goes straight to content, no skeleton state while data loads.

9. **Copyright says 2025** in Privacy page (line 140), should say 2025-2026.

10. **`console.error` in ErrorBoundary** -- While intentional for debugging, the zero-console-log policy should exempt only this one explicitly.

---

## P2 Implementation Plan

### Task 1: Verify & fix `handle_new_user` trigger
- Run a SQL query to check if trigger exists on `auth.users`
- If missing, create a new migration to re-attach it
- This is P0-critical -- without it, new users get no profile

### Task 2: Add route-level error boundaries
- Wrap each `LayoutRoute` and `ImmersiveRoute` child in an `ErrorBoundary` with a route-specific fallback
- The fallback shows a simpler error card with "Go Home" button instead of crashing the whole app
- Edit `App.tsx` to wrap each route's inner content

### Task 3: Add double-submit protection
- Add `disabled={isLoading || isCreating}` guards to:
  - `AuthForm` submit button (already has `isLoading`, verify button uses it)
  - `QuickAddTaskModal` create button
  - `QuickAddMilestoneModal` create button  
  - Lists create in `Lists.tsx`
  - `JournalComposer` save button

### Task 4: Fix ResetPassword timeout
- Add a 10-second timeout on the recovery detection
- After timeout, show "Invalid or expired link" with a "Back to login" button

### Task 5: Add Journal loading skeleton
- Add a skeleton state in `JournalFeed` that shows while data is loading, matching the reflection card layout

### Task 6: Clean up placeholders
- Update `assetlinks.json` with a comment explaining it needs real SHA256 (or remove the file if no Android TWA is planned)
- Update copyright year in Privacy page

### Summary

| Task | Priority | Effort |
|------|----------|--------|
| Verify/fix handle_new_user trigger | P0 | Small |
| Route-level error boundaries | P2 | Small |
| Double-submit protection | P2 | Small |
| ResetPassword timeout fix | P2 | Small |
| Journal loading skeleton | P2 | Small |
| Clean up placeholders | P2 | Tiny |

