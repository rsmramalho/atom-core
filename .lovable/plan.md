

# MindMate v4.0.0-alpha.23 -- Plan

## Status

The alpha.22 refactor is complete. All 8 items from the previous plan were implemented. This plan addresses remaining technical debt and new improvements.

## Problems Identified

### 1. Auth Still Duplicated in Inbox.tsx (Priority: High)

`Inbox.tsx` still calls `supabase.auth.getUser()` independently (line 39) and stores its own `user` state. Since `AppLayout` already guarantees authentication, this is redundant -- same pattern that was fixed in `Index.tsx`.

The `user` object is only used to pass `user.id` when creating items. However, `useAtomItems.createItem` already calls `supabase.auth.getUser()` internally (line 104 of useAtomItems.ts). So the `user` state in Inbox is completely unnecessary.

**Fix:** Remove `user` state, the `useEffect` with `getUser()`, and the `!user` guard in `handleCapture`. The hook already handles auth.

### 2. Scattered `supabase.auth.getUser()` in Hooks (Priority: Medium)

Multiple hooks call `supabase.auth.getUser()` on every query/mutation:
- `useAtomItems.ts` (createItem mutation)
- `useCalendarItems.ts` (3 queries)
- `useMilestones.ts` (query + mutation)
- `useRitual.ts` (query)

Each call is an async network request. Since `AppLayout` guarantees auth, a shared auth context or utility could reduce these redundant calls. However, this is a larger refactor with risk -- these calls also serve as auth guards in the data layer.

**Fix:** Create a lightweight `useCurrentUser()` hook that caches the user from the session (already available synchronously after `AppLayout` sets it). Use it in hooks instead of repeated `getUser()` calls. This is optional and lower priority.

### 3. Unused Import in Inbox.tsx

`User` type imported (line 15) but after removing the auth code, it won't be needed.

### 4. Plan File Outdated

`.lovable/plan.md` still references the alpha.21 plan. Should be updated with the new plan.

---

## Implementation Plan

### Step 1 -- Remove redundant auth from Inbox.tsx
- Remove `user` state, `useEffect` with `getUser()`, and `User` import
- Remove `!user` guard from `handleCapture` (the `createItem` hook handles auth internally)
- Remove `supabase` import if no longer used

### Step 2 -- Create `useCurrentUser` hook (optional optimization)
- Lightweight hook that reads the cached session user
- Replace `supabase.auth.getUser()` calls in data hooks
- Reduces redundant async auth checks across 4 hooks (7 calls total)

### Step 3 -- Update `.lovable/plan.md`
- Replace with alpha.23 plan

### Step 4 -- Update version and CHANGELOG
- Bump to alpha.23 in AppNavigation
- Add CHANGELOG entry

```text
Auth Calls (Before):
  AppLayout → getSession + onAuthStateChange (central)
  Inbox.tsx → getUser (redundant)
  useAtomItems → getUser (per mutation)
  useCalendarItems → getUser x3 (per query)
  useMilestones → getUser x2
  useRitual → getUser x1

Auth Calls (After):
  AppLayout → getSession + onAuthStateChange (central)
  useCurrentUser → reads cached session (sync, no network)
  All hooks → useCurrentUser() instead of getUser()
```

