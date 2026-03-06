

## UX Review: Admin Error Logs Dashboard

After reviewing the full `AdminErrorLogs.tsx` (573 lines) and its integration, here are the issues found and proposed improvements:

---

### Issues Identified

1. **Mobile responsiveness broken**: Stats grid uses `grid-cols-3` without responsive breakpoints -- cards get crushed on small screens. Header actions also overflow on mobile.

2. **No visual expand/collapse indicator**: Log cards are clickable but lack a chevron or any affordance indicating they expand. Users won't discover the detail view.

3. **Filter bar overflows on mobile**: Four inline selects + search input don't wrap gracefully on narrow viewports.

4. **No error state for fetch failures**: `fetchLogs` catches errors silently (`console.error` only). Users see skeletons forever or stale data with no feedback.

5. **Loading state blocks interaction**: `setLoading(true)` on every fetch (including auto-refresh) replaces the entire list with skeletons, causing layout shift every 30 seconds.

6. **Delete RLS policy too permissive**: Current `DELETE` policy allows any authenticated user to purge error logs, not just admins.

7. **No keyboard accessibility on log cards**: `CollapsibleTrigger` wraps a `CardContent` div, which isn't focusable or keyboard-navigable by default.

8. **Missing "back to top" affordance**: With up to 500 logs, scrolling back up is tedious.

9. **Timestamp not relative-friendly**: Shows absolute `dd MMM HH:mm:ss` which requires mental math for recency. A relative format ("2m ago") would scan faster.

---

### Proposed Changes

#### 1. Responsive stats grid
Change `grid-cols-3` to `grid-cols-1 sm:grid-cols-3` so cards stack on mobile.

#### 2. Responsive header actions
Wrap header actions to a second row on small screens using `flex-wrap`. Hide text labels on mobile, keep icons only.

#### 3. Responsive filter bar
Stack filters vertically on mobile: search full-width, selects in a `grid-cols-2` on small screens.

#### 4. Add expand chevron to log cards
Add a `ChevronDown` icon that rotates when expanded, giving clear affordance.

#### 5. Soft-loading on refresh
Only show skeletons on initial load. Subsequent fetches use a subtle top progress indicator instead of replacing the list.

#### 6. Add fetch error toast
Show `toast.error` when `fetchLogs` fails so users know data is stale.

#### 7. Restrict DELETE policy to admins
Update the RLS policy to use `public.has_role(auth.uid(), 'admin')`.

#### 8. Add relative timestamps
Show relative time (e.g., "5min atrás") as primary, with absolute time in a tooltip on hover.

#### 9. Sticky scroll-to-top button
Show a floating button after scrolling 400px+ to jump back to the top.

---

### Files to Change

- **`src/pages/AdminErrorLogs.tsx`** -- All UI/UX improvements (responsive layout, chevron, soft-loading, error toast, relative timestamps, scroll-to-top)
- **Database migration** -- Fix DELETE policy to restrict to admin role only

