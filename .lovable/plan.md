

# MindMate v4.0.0-alpha.23 -- Plan

## Status

✅ **IMPLEMENTED** — All items complete.

## Changes Made

### 1. Removed redundant auth from Inbox.tsx ✅
- Removed `user` state, `useEffect` with `getUser()`, `User` import, `supabase` import
- Removed `!user` guard from `handleCapture`

### 2. Created `useCurrentUser` hook ✅
- `src/hooks/useCurrentUser.ts` with:
  - `useCurrentUser()` — React hook returning cached `User | null`
  - `getCurrentUserId()` — async function for query/mutation functions
  - Global `onAuthStateChange` listener (initialized once, module-level singleton)
- Replaced `supabase.auth.getUser()` in:
  - `useAtomItems.ts` (1 call)
  - `useCalendarItems.ts` (3 calls)
  - `useMilestones.ts` (2 calls)
  - `useRitual.ts` (1 call)

### 3. Updated version and CHANGELOG ✅
- Bumped to `v4.0.0-alpha.23` in `AppNavigation.tsx`
- Added CHANGELOG entry

```text
Auth Calls (Before → After):
  AppLayout → getSession + onAuthStateChange (unchanged)
  Inbox.tsx → getUser ❌ REMOVED
  useAtomItems → getUser → getCurrentUserId() ✅
  useCalendarItems → getUser x3 → getCurrentUserId() x3 ✅
  useMilestones → getUser x2 → getCurrentUserId() x2 ✅
  useRitual → getUser x1 → getCurrentUserId() x1 ✅

Total: 7 async network calls → 7 sync cache reads (with async fallback)
```
