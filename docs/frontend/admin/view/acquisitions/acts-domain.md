# Acquisitions Module — Acts Domain (Frontend Documentation)

This document describes the architecture, responsibilities, data flow, and technical risks of the **Acquisitions → Acts** frontend module.

It covers the following components:

- `Acts/acts.vue`
- `Acts/ActsItems.vue`
- `Acts/CreateActs.vue`
- `Acts/FilterActs.vue`
- `Acts/ShowActsStatus.vue`

---

# 1. Domain Overview

The **Acts module** represents acquisition records (acts) and their line-item inventory.

It consists of:

- **List view** (acts.vue)
- **Filter panel** (FilterActs.vue)
- **Detail modal view** (ActsItems.vue)
- **Create/Edit form** (CreateActs.vue)
- **Status renderer** (ShowActsStatus.vue)

---

# 2. Architecture Type

This module follows a mixed architecture:

- Vue 2 Options API
- Vuex-centered state management
- Mixin-driven API abstraction layer
- Modal-based UI orchestration
- Heavy implicit coupling between components and store state

### Classification

- List Layer → State Orchestrator
- Detail Layer → Domain Controller
- Forms → Domain Controller (fat forms)
- Filters → Store-bound UI controller
- Status → Pure UI renderer

---

# 3. Global Data Flow

Vuex Store (acts module)
↓
acts.vue (list shell)
↓
TableDiv (generic renderer)
↓
FilterActs.vue → mutates Vuex search state
↓
ActsItems.vue → detail API + export + print
↓
CreateActs.vue → create/edit API via mixins

---

# 4. Vuex Coupling Model

### Observed Patterns

- Direct `mapGetters(['acts'])`
- Direct `v-model` mutation on Vuex getters (critical anti-pattern)
- Direct `dispatch('setStore')` for pagination reset
- Store used as:
  - Data source
  - Filter state container
  - UI state container (`searching`, pagination)

### Risk Level

**HIGH**

### Issues

- Vuex state mutated without mutations (via v-model)
- No strict separation between UI state and domain state
- Store used as form state container
- Hidden coupling between filter panel and list view

---

# 5. API Layer Architecture

### Pattern

All API calls are handled via **mixins**, not service modules.

### Mixins involved:

- `getResults`
- `getAllData`
- `create_it`
- `edit_it`
- `last`
- `last_created`
- `download_file`
- `print_file`

### Problems

- No centralized API layer
- No request visibility from components
- Hard debugging (API hidden across mixins)
- No consistent error handling strategy

---

# 6. Component Documentation

---

# 6.1 `Acts/acts.vue` — List View

## Role
Main entry point for Acts domain. Renders table, filter panel, and modals.

## Responsibilities

- Displays acts list via `TableDiv`
- Controls modal lifecycle
- Triggers API via mixins
- Manages pagination reset

## Key Issues

- Direct mutation of Vuex state via `v-model`
- Search state lives inside store
- Component refs stored in reactive data (anti-pattern)
- Multiple sources of truth for table configuration

## Data Flow

acts.search (Vuex)
↓
TableDiv
↓
FilterActs.vue (mutates same store state)
↓
getResults / getAllData (mixins)
↓
Vuex acts update

## Risk Level: HIGH

---

# 6.2 `Acts/ActsItems.vue` — Detail & Line Items

## Role
Displays act items (inventory lines) with sorting, totals, export, and print.

## Responsibilities

- Fetch act items
- Client-side sorting
- Compute totals
- Open item detail modal
- Export Excel
- Print PDF

## API Endpoints

- `GET item/by/act/{id}`
- `POST item/search`
- `POST acts/export`
- `POST acts/print`

## Key Issues

### 1. God Component Behavior
- Sorting + fetching + export + modal logic combined

### 2. Global Dependencies
- `copy()` global function
- Implicit modal system

### 3. Performance Risks
- Deep cloning during sorting
- Full array recomputation for totals

### 4. Business Logic Leakage
- Price parsing (`parseInt`)
- Hardcoded totals layout
- Sentinel values in sorting logic

## Risk Level: HIGH

---

# 6.3 `Acts/CreateActs.vue` — Create/Edit Form

## Role
Creates and edits acquisition acts.

## Responsibilities

- Form state handling
- Lost ID range fetching
- Create / update API calls
- Date normalization

## API

- `GET /acts/lost-ids`
- `POST /acts`
- `PUT /acts/:id`

## Key Issues

### 1. Global Prototype Pollution
- `Date.prototype.toDateInputValue()`

### 2. Global Function Dependency
- `copy()` used for deep cloning

### 3. Business Logic Inside UI
- ID gap expansion logic
- Custom ID assignment rules

### 4. State Coupling
- Uses global loading flag as submit lock

## Risk Level: MEDIUM → HIGH

---

# 6.4 `Acts/FilterActs.vue` — Filter Panel

## Role
Provides date filtering for acts list.

## Responsibilities

- Mutates Vuex search state directly
- Provides filter UI

## Key Issues

### 1. Direct Vuex Mutation
- `v-model` on store getters (critical issue)

### 2. Hidden Form Dependency
- Relies on parent `<form>` submission

### 3. Dead Code
- Commented-out status filtering system

## Risk Level: CRITICAL

---

# 6.5 `Acts/ShowActsStatus.vue` — Status Renderer

## Role
Displays status badge for each act row.

## Type
Pure UI component

## Notes

- Injected dynamically into TableDiv
- No API or state coupling
- Depends on external config contract

## Risk Level: LOW

---

# 7. Cross-Cutting Problems

## 7.1 Vuex Anti-Patterns

- Direct mutation via v-model
- Store used as form state
- No separation between UI and domain state

---

## 7.2 Mixin Architecture

### Issues

- Hidden API layer
- No service abstraction
- Debugging requires full dependency tracing

---

## 7.3 Global Dependencies

- `copy()` global function
- Date prototype extension
- Implicit modal system

---

## 7.4 UI/UX Contracts

- Filter component depends on parent form structure
- Table configuration duplicated in multiple places
- Hardcoded totals structure

---

# 8. Performance Risks

- Deep cloning during sorting
- Full array recomputation for totals
- Vuex-driven re-renders on every input change
- Large computed dependencies without memo control

---

# 9. Architectural Risks Summary

| Category | Severity |
|----------|----------|
| Vuex mutation via v-model | CRITICAL |
| Mixin API abstraction | HIGH |
| Global function usage | HIGH |
| Prototype pollution | HIGH |
| God components (ActsItems) | HIGH |
| Dead UI code | MEDIUM |
| UI structural coupling | MEDIUM |

---

# 10. Migration Strategy (Vue 3 / Pinia)

## Phase 1 — State Layer

- Replace Vuex with Pinia
- Move acts state to `useActsStore`
- Remove v-model direct store binding

---

## Phase 2 — API Layer

Replace mixins with:

- `useQuery` (TanStack Query)
- `useMutation` for writes

---

## Phase 3 — Utilities

- Replace `copy()` → `structuredClone`
- Replace Date prototype → `date-fns` or `dayjs`
- Remove all globals

---

## Phase 4 — Component Refactor

- Split ActsItems into composables:
  - sorting
  - totals
  - export/print
- Convert FilterActs to local state + emit pattern
- Convert CreateActs to `useFormState`

---

## Phase 5 — UI Decoupling

- Remove parent-form dependency from FilterActs
- Normalize TableDiv configuration contracts
- Remove duplicated heads definitions

---

# 11. Target Architecture (Post-Migration)

Pinia Store (useActsStore)
↓
TanStack Query (API layer)
↓
Composable Layer (business logic)
↓
UI Components (pure)

---

# 12. Final Notes

The Acts module is functionally complete but architecturally tightly coupled.

The primary risks are not UI-related, but:

- hidden global dependencies
- store mutation patterns
- mixin-based API abstraction
- implicit cross-component contracts

These must be resolved before any Vue 3 migration to prevent architectural debt propagation.