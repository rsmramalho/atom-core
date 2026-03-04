

# MindMate v4.0.0-alpha.24 -- Audit Plan

## Issues Found

### 1. `useMemo` Misused as Side Effect (Priority: High -- React Anti-Pattern)

**File:** `src/components/journal/JournalFeed.tsx` (lines 176-178, 232-234)

Two `useMemo` calls are being used to trigger side effects (calling parent callbacks). `useMemo` is for memoizing computed values, not for side effects. React may skip `useMemo` calls or execute them during render, causing unexpected behavior.

**Fix:** Replace with `useEffect`.

```typescript
// Before (wrong)
useMemo(() => {
  onReflectionsChange?.(allReflections);
}, [allReflections, onReflectionsChange]);

// After (correct)
useEffect(() => {
  onReflectionsChange?.(allReflections);
}, [allReflections, onReflectionsChange]);
```

### 2. Remaining `supabase.auth.getUser()` in OnboardingContext (Priority: Medium)

**File:** `src/components/onboarding/OnboardingContext.tsx` (line 87)

The alpha.23 refactor missed this call. `OnboardingProvider` wraps inside `AppLayout`, so auth is guaranteed. Should use `getCurrentUserId()` or `useCurrentUser()`.

However, `OnboardingProvider` is actually rendered OUTSIDE `AppLayout` (in `App.tsx` line 199), wrapping everything including unauthenticated routes. So this `getUser()` call is intentionally there as a guard for unauthenticated state. **No change needed** -- this is correct.

### 3. Duplicate `onAuthStateChange` Listener (Priority: Low)

**File:** `src/components/onboarding/OnboardingContext.tsx` (line 145)

This is the 3rd `onAuthStateChange` listener (AppLayout has one, useCurrentUser has one, OnboardingContext has one). While functionally harmless, it adds overhead. Could be consolidated but would require architectural changes beyond scope.

**Decision:** Document as known debt, no change for now.

### 4. AuthForm Uses English Text (Priority: Low -- Consistency)

**File:** `src/components/AuthForm.tsx`

The entire app UI is in Portuguese, but the auth form uses English: "Login", "Sign Up", "Welcome back!", "Need an account?", etc.

**Fix:** Translate to Portuguese for consistency.

### 5. Version & Changelog Update

Bump to alpha.24 in `AppNavigation.tsx`, add CHANGELOG entry, update plan file.

---

## Implementation Plan

### Step 1 -- Fix useMemo anti-pattern in JournalFeed
- Replace two `useMemo` side-effect calls with `useEffect` in `JournalFeed.tsx`
- Add `useEffect` to imports

### Step 2 -- Translate AuthForm to Portuguese
- Replace all English strings in `AuthForm.tsx` with Portuguese equivalents

### Step 3 -- Update version and docs
- Bump to alpha.24 in `AppNavigation.tsx`
- Add CHANGELOG entry
- Update `.lovable/plan.md`

