Below is a **production-ready architecture documentation file** for your module, formatted so you can directly copy it into your `docs/` folder in VS Code.

---

# 📦 Website Module — Announcements Architecture Documentation

## Module Path

`resources/js/admin/view/website/Announcements`

## Components Covered

* `announcements.vue`
* `NewAnnouncement.vue`

---

# 1. Component: `announcements.vue`

---

## 1. ROLE

This component is the **administrative listing interface for News & Announcements**.

It is responsible for:

* Displaying paginated announcements
* Triggering full dataset reload
* Navigating to create/edit announcement workflow
* Acting as a data orchestration layer between Vuex and table rendering

It represents the **entry point of the announcement management subsystem**.

---

## 2. ARCHITECTURE TYPE

**State Orchestrator Component**

Reason:

* Controls data loading lifecycle
* Coordinates Vuex state
* Manages table configuration
* Delegates rendering to child table component

Not purely UI due to store coupling and data orchestration logic.

---

## 3. DATA FLOW

### Data Origin

* Vuex module: `announcements`

### Flow

1. Component mounts
2. Calls `loadAllData()`
3. Dispatches Vuex state reset (`page`, `sort_by`)
4. Triggers API fetch via mixin (`getAllData`)
5. Vuex store updates `announcements.data`
6. Data passed into `TableDiv`

### Output

* Table receives:

  * `heads` (column config)
  * `announcements.data.res` (dataset)
  * `pagination` state

---

## 4. VUEX COUPLING

### Direct Reads

* `announcements` getter

### Direct Writes

* Uses `setStore` dispatch (tight coupling with module structure)

### Coupling Level

**HIGH**

Reason:

* Component depends entirely on Vuex module shape
* State reset logic embedded in UI layer
* Pagination and sorting controlled externally via UI actions

---

## 5. API USAGE

### Indirect API usage via mixins:

* `getResults`
* `getAllData`

### Responsibility Location

* API logic is **abstracted into mixins**, not component
* Component acts as orchestration layer only

### Risk

* Hidden API logic reduces traceability
* Difficult debugging due to indirect flow

---

## 6. MIXINS / GLOBAL DEPENDENCIES

### Mixins Used

* `getResults`
* `getAllData`

### Global Dependencies

* `$store`
* `$router`
* `TableDiv` component

### Hidden Dependencies

* Vuex module structure (`announcements`)
* Backend pagination contract

---

## 7. SIDE EFFECTS

* Vuex state reset (`setStore`)
* API calls via mixins
* Route navigation to edit page
* Full dataset reload trigger
* Table re-render via reactive store updates

---

## 8. LIFECYCLE RISKS

### Mounted Hook

* Automatically triggers `loadAllData()`

### Risks

* Immediate API call on mount (no caching layer)
* Re-fetching triggered manually via button
* No debounce or request cancellation

---

## 9. PERFORMANCE ISSUES

* Full dataset reload (`loadAllData`) bypasses incremental pagination optimization
* No memoization of table configuration (`heads`)
* Reactive store updates may cause full table re-render
* No lazy loading or virtualization for table

---

## 10. HIDDEN BUSINESS LOGIC

* Default sorting is enforced as:

  * `start_date` descending logic (via `sort_by`)
* Two modes of loading:

  * Full reload (`loadAllData`)
  * Paginated fetch (`loadResults`)
* "Announcements" and "Events" are unified under same module

---

## 11. ARCHITECTURAL PROBLEMS

### Identified Issues

* Vuex tightly coupled to UI layer
* Mixins hide core API behavior
* Table configuration embedded in component
* Dual loading mechanisms (conflicting data strategies)
* No service abstraction layer for announcements

### Structural Classification

This component acts as a **mini-controller layer inside UI**, violating separation of concerns.

---

## 12. MIGRATION STRATEGY

### Target Architecture (Vue 3)

* Replace Vuex with **Pinia store**
* Replace mixins with:

  * `useAnnouncementsQuery()` (TanStack Query)
* Move API logic into service layer:

  * `announcementService`

### Refactor Priorities

1. Remove mixins dependency
2. Extract API calls into service layer
3. Move sorting logic into store/composable
4. Replace direct Vuex dispatch with store actions
5. Introduce caching for announcements list

### Migration Risk

**HIGH**

Reason:

* Strong Vuex dependency
* Hidden API logic inside mixins
* Dual data loading pathways

---

---

# 2. Component: `NewAnnouncement.vue`

---

## 1. ROLE

This component handles **creation and editing of announcements/events**.

It is responsible for:

* Multilingual content management
* File/image upload and compression
* Event vs announcement branching logic
* Date/time scheduling
* Rich text content editing

It functions as the **core editorial form for website content management**.

---

## 2. ARCHITECTURE TYPE

**Domain Controller Component**

Reason:

* Contains full CRUD logic (create + edit)
* Handles API submission lifecycle
* Encapsulates business rules (event vs announcement)
* Manages file processing + transformation logic

---

## 3. DATA FLOW

### Input Sources

* Props:

  * `data` (existing announcement)
  * `edit` (mode flag)

### Internal State

* `announcement` object (local form state)
* Image base64 data (processed client-side)

### Flow

1. If edit mode → hydrate local state from props
2. User edits multilingual fields
3. Image uploaded → compressed → converted to base64
4. Form submitted
5. Mixins handle API request:

   * create or update
6. Callback emitted (`afterSave`)
7. Parent refresh triggered

---

## 4. VUEX COUPLING

### Direct Reads

* `$store.state.fullPageLoading`

### Direct Writes

* `$store.commit('setFullPageLoading')`

### Coupling Level

**MEDIUM**

Reason:

* Only used for loading state control
* No direct dependency on module state
* Still relies on global store for UI blocking

---

## 5. API USAGE

### Abstracted via Mixins

* `create_it`
* `edit_it`
* `last`
* `last_created`

### Responsibility Location

* API logic is fully hidden inside mixins

### Risk

* No visibility into request structure at component level
* Hard to trace failure points

---

## 6. MIXINS / GLOBAL DEPENDENCIES

### Mixins

* `last`
* `last_created`
* `create_it`
* `edit_it`

### Global Utilities

* `$store`
* `$t` (i18n)
* `message_success`
* `Tabs` component
* `Back` component
* `quillEditor`

### External Libraries

* `vue-quill-editor`
* `quill-html-edit-button`

---

## 7. SIDE EFFECTS

* API calls (create/edit)
* Image compression (CPU-heavy client operation)
* Base64 conversion of files
* Vuex mutation (loading state)
* Route navigation via cancel/back
* File input DOM interaction

---

## 8. LIFECYCLE RISKS

### Created Hook

* Hydrates form state from props
* Fetches and rewrites image via network request

### Risks

* `fetch(image)` overwrites already set image state
* Potential race condition between hydration and user edits
* No cancellation of async image processing

---

## 9. PERFORMANCE ISSUES

* Client-side image compression (heavy CPU usage)
* Base64 image storage (memory intensive)
* Quill editor loaded with full toolbar config
* Redundant reactivity in multilingual fields

---

## 10. HIDDEN BUSINESS LOGIC

* Two content types:

  * `announcement`
  * `event` (requires external link)
* Multilingual structure enforced via dynamic key binding
* Image is always stored as base64 string
* Event type disables description and requires link
* Date + time split structure implies backend expects separate fields

---

## 11. ARCHITECTURAL PROBLEMS

### Key Issues

* Heavy mixin dependency (hidden logic layer)
* Client-side image processing embedded in component
* Mixed responsibilities (UI + business + file processing)
* Direct store mutation for loading state
* No service abstraction layer
* Event vs announcement branching embedded in UI logic

### Structural Classification

This is a **self-contained mini-application inside a single component**

---

## 12. MIGRATION STRATEGY

### Target Architecture (Vue 3)

#### Replace with:

* `useAnnouncementForm()`
* `useAnnouncementMutation()`
* `announcementService`

### Refactor Plan

1. Extract API logic from mixins → service layer
2. Replace loading state with composable state
3. Move image processing to utility module
4. Replace Quill with modular editor wrapper
5. Normalize multilingual handling into schema-based structure
6. Replace props hydration logic with reactive form model

### Migration Risk

**CRITICAL**

Reason:

* Mixins contain core business logic
* Image processing tightly coupled to form
* Dual-mode (create/edit) logic intertwined

---

# FINAL SYSTEM-WIDE SUMMARY

## Overall Architecture Type

**Hybrid Monolith Frontend Module**

Combination of:

* Vuex-driven state orchestration
* Mixin-based hidden API layer
* Component-level business logic
* Embedded service responsibilities

---

## Biggest Structural Problems

1. Mixins as hidden service layer
2. Vuex used inconsistently (state + UI control)
3. Business logic embedded in UI components
4. No service layer abstraction
5. No composable architecture
6. Client-side heavy processing (images, editors)
7. Dual responsibility components (UI + domain logic)

---

## Dependency Graph (Conceptual)

```
Component
  ↓
Mixins (hidden logic layer)
  ↓
Vuex Store
  ↓
API Layer (implicit)
```

---

## Migration Priority Order

1. Extract API layer from mixins
2. Introduce service layer
3. Replace Vuex with Pinia
4. Replace mixins with composables
5. Decouple image processing
6. Normalize form schema handling
7. Introduce TanStack Query caching

---

## Suggested Target Architecture (Vue 3)

* Pinia (state management)
* TanStack Query (server state)
* Composables (business logic)
* Service layer (API abstraction)
* Modular editor components
* Schema-driven forms

---
