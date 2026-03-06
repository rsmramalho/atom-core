

## Phase 8: UX & Polish

Phase 7 is done -- all `any` casts eliminated, DELETE policy for shared items exists, `viewer` enum added, `.limit(2000)` in place. Moving to the next phase.

### Phase 8 consists of 4 items:

---

### 1. Global Search (Command Palette Enhancement)

The project already has a `CommandPalette.tsx`. Enhance it to search items by title and tags across all views.

**Changes:**
- `src/components/layout/CommandPalette.tsx` -- Add a "Search items" section that queries `useAtomItems` data, filtering by title/tags. Show results grouped by type (task, note, project, etc.). Clicking a result navigates to the relevant view or opens the item.

---

### 2. Drag-and-Drop in WorkArea

Reorder tasks within projects using the already-installed `@dnd-kit` library.

**Changes:**
- `src/components/project-sheet/WorkAreaPane.tsx` -- Wrap task list with `DndContext` + `SortableContext`. Each task card becomes a `useSortable` item. On drag end, update `order_index` for affected items via `updateItem`.
- Database migration -- Ensure `order_index` is respected in queries (already exists on `items` table).

---

### 3. Dark/Light Mode Toggle

`next-themes` is already installed and the `Toaster` component uses `useTheme()`. Add a visible toggle in the sidebar.

**Changes:**
- `src/components/layout/SidebarActions.tsx` -- Add a Sun/Moon icon button that calls `setTheme()` to cycle between light/dark/system.
- No other changes needed -- Tailwind's dark mode classes are already in use throughout the app.

---

### 4. ProjectDetail Skeleton Loading

Skeleton loaders exist for other pages but not for `ProjectDetail`.

**Changes:**
- `src/components/projects/ProjectDetailSkeleton.tsx` -- Already exists (listed in files). Verify it's used in `ProjectDetail.tsx` during loading states. If not, wire it up.

---

### Implementation Order

1. Dark/Light mode toggle (smallest change, immediate visual impact)
2. ProjectDetail skeleton (quick win)
3. Global search in Command Palette
4. Drag-and-drop in WorkArea (most complex)

### Estimated file changes: 4-5 files

