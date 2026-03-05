

# Remaining Beta Tasks: a11y + Final Polish

## Status Check — What's Done

All P0, P1, and P2 items are complete:
- Password reset flow, profiles trigger, RLS audit, cascade deletes
- Zod validation, Lists skeleton, docs sync
- Route error boundaries, double-submit protection, ResetPassword timeout, placeholders cleanup

## What Remains

Two items from the original beta roadmap are still pending:

### 1. Accessibility (a11y) Audit & Fixes

Zero `aria-label` attributes found across the entire `src/` directory. Key gaps:

| Component | Issue |
|-----------|-------|
| `AppNavigation.tsx` | Hamburger menu button has no `aria-label` |
| `NavItemList.tsx` | Nav links missing `role="navigation"` wrapper |
| `AppNavigation.tsx` | Desktop sidebar `<nav>` is correct, mobile Sheet lacks landmark |
| All icon-only buttons | Command palette, notification bell, dropdown triggers — no labels |
| `InboxItemCard`, `ListCard`, `ProjectCard` | Interactive cards lack accessible names |
| `JournalComposer.tsx` | Textarea has placeholder but no `aria-label` |
| `ErrorBoundary.tsx` | Action buttons OK, but `role="alert"` missing on error container |
| `index.html` | `user-scalable=no` blocks pinch-to-zoom (WCAG violation) |

**Implementation:**
- Add `aria-label` to all icon-only `<Button>` components (hamburger, command palette, notifications, close buttons, dropdown triggers)
- Wrap mobile nav in `<nav aria-label="Menu principal">`
- Add `role="alert"` to ErrorBoundary error display
- Add `aria-label` to textarea in JournalComposer
- Remove `user-scalable=no` from viewport meta (or change to `user-scalable=yes`)
- Add `aria-live="polite"` to toast/sync status regions

Files to edit: `AppNavigation.tsx`, `NavItemList.tsx`, `JournalComposer.tsx`, `ErrorBoundary.tsx`, `index.html`, `NotificationSettings.tsx`, `SidebarActions.tsx`

### 2. Version Bump & Changelog

- Update `VERSION` in `AppNavigation.tsx` from `v4.0.0-alpha.28` to `v4.0.0-beta.1`
- Add changelog entry for beta.1 summarizing all P0/P1/P2 work
- Update `VERSION_NOTES` array with beta highlights

Files to edit: `AppNavigation.tsx`, `docs/CHANGELOG.md`

### Summary

| Task | Files | Effort |
|------|-------|--------|
| a11y fixes (aria-labels, landmarks, zoom) | 7 files | Medium |
| Version bump + changelog | 2 files | Small |

This completes the full beta roadmap. After implementation, the project will be at **v4.0.0-beta.1** with all stability, security, validation, documentation, and accessibility items resolved.

