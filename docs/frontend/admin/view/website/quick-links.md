Here is a **ready-to-copy production documentation file** for your VS Code `docs` folder.

You can paste it directly as:

```
docs/website-quicklinks.md
```

---

```md
# Website Module — Quick Links (Production Documentation)

## Overview

The Quick Links module manages editable navigation shortcuts displayed on the public website.

It allows administrators to:
- Create quick links
- Edit existing links
- Delete links
- Persist configuration into global website settings

The system is part of the CMS Website configuration layer and is stored inside:
- `website.data.quick_links`

---

# Architecture Summary

| Layer | Responsibility |
|------|----------------|
| UI Layer | Table + Modal editing |
| State Layer | Vuex website module |
| Persistence Layer | Website save mixin |
| Modal Layer | showModal system |

---

# Components

## 1. QuickLinks.vue

### Role

This component is the **main controller for quick links administration**.

It:
- Loads quick links from Vuex
- Displays them in a table
- Opens modal for creation/editing
- Deletes entries
- Saves configuration to backend

Business meaning:
> Controls global navigation shortcuts for the website UI.

---

### Architecture Type

**State Orchestrator Component**

---

### Data Flow

1. Data source:
   - `website.data.quick_links` (Vuex)

2. Flow:
   - Vuex → local `quick_links`
   - User modifies via modal/table
   - Local array is mutated directly
   - On save → assigned back to Vuex object
   - Persisted via `save()` mixin

---

### Vuex Coupling

- Reads:
  - `website`
  - `configs`

- Writes:
  - Direct mutation of `website.data.quick_links`

Coupling level: **HIGH**

Issues:
- Direct Vuex mutation without actions
- No state immutability
- Weak traceability of changes

---

### API Usage

- Indirect API calls via `save` mixin
- No direct endpoints in component

Responsibility:
- Persistence fully delegated to mixin

---

### Mixins / Dependencies

- `save` → persistence layer
- `loadData` → initial sync
- `showModal` → modal system
- `$confirm` → global dialog

Hidden dependency:
- Vuex + mixin coupling forms implicit architecture

---

### Side Effects

- Vuex state mutation
- Modal open/close
- Delete confirmation dialog
- Backend persistence call
- Full website config overwrite

---

### Lifecycle Risks

- `created()` loads from Vuex snapshot
- Watcher overwrites local state when Vuex changes

Risk:
> Local edits can be overwritten by external state updates

---

### Performance Issues

- Full array replacement via watcher
- No diffing strategy
- Reactive deep object mutation

---

### Hidden Business Logic

- Array order defines UI order
- No validation for:
  - URL format
  - duplicates
  - empty links
- Quick links are global navigation shortcuts

---

### Architectural Problems

- Direct Vuex mutation (critical)
- No service abstraction layer
- Watcher-based state sync
- Modal-driven hidden state flow
- Shared mutable array pattern

---

### Migration Strategy

Target Vue 3 architecture:

1. Replace Vuex with Pinia
2. Extract API logic into service layer
3. Replace mixins with composables
4. Remove watcher-based sync
5. Introduce immutable updates

Migration Risk: **MEDIUM**

---

---

## 2. NewQuickLink.vue

### Role

This component handles:
- Creation of quick links
- Editing existing links

It is a pure form modal used inside QuickLinks management.

---

### Architecture Type

**Form Component**

---

### Data Flow

- Input:
  - `array` (parent quick_links)
  - `editIndex`

- Flow:
  1. Local form state (`quick_link`)
  2. User edits fields
  3. Save:
     - Edit mode → mutate array index
     - Create mode → push new object
  4. Success message emitted

No API interaction.

---

### Vuex Coupling

None

Coupling level: **NONE**

---

### API Usage

None

---

### Mixins / Dependencies

- `message_success`
- implicit global `copy()` utility

Risk:
- Hidden dependency on global function

---

### Side Effects

- Direct mutation of parent array
- Modal close event emission
- Success notification trigger

---

### Lifecycle Risks

- Form initialized only once in `created()`
- No reset logic on prop changes

Risk:
> stale form state if reused without remount

---

### Performance Issues

None (lightweight component)

---

### Hidden Business Logic

- Quick links require multilingual fields:
  - EN / RU / KZ
- Link is mandatory
- No validation for URL correctness

---

### Architectural Problems

- Direct mutation of parent state
- No validation layer
- No separation between model and view model
- Hidden global utility dependency

---

### Migration Strategy

1. Replace array mutation with events
2. Introduce composable `useQuickLinksForm`
3. Remove global utilities
4. Add validation layer

Migration Risk: **LOW**

---

# System-Level Summary

## Architecture Type

Monolithic Vue 2 CMS system with:
- Vuex global state
- Mixins-based logic reuse
- Modal-driven workflows
- Direct state mutation patterns

---

## Key Structural Issues

- Vuex state is mutated directly in multiple places
- Mixins used instead of composables
- No service/API abstraction layer
- Modal system used as hidden state machine
- Global utility dependency (`copy`, `$confirm`)
- Shared mutable arrays across components

---

## Dependency Flow

```
Vuex (website.data)
↓
QuickLinks.vue
↓
NewQuickLink.vue (modal)
↓
mutates shared array
↓
save mixin
↓
backend persistence
```

---

## Migration Priority

1. Remove direct Vuex mutations
2. Replace mixins with composables
3. Introduce service layer
4. Refactor modal system
5. Move to Pinia state management
6. Add validation layer
7. Remove global utility dependencies

---

## Target Architecture (Vue 3)

- Pinia (state management)
- TanStack Query (server state)
- Composables:
  - useQuickLinks()
  - useModal()
- Service Layer:
  - quickLinksService
  - websiteService

---

## Final Assessment

| Category | Status |
|----------|--------|
| Maintainability | Medium |
| Scalability | Low |
| Risk Level | Medium |
| Refactor Priority | High (UI + state coupling) |

---
```
