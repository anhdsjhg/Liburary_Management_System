
---

# WEBSITE ADMIN PANEL — ARCHITECTURE DOCUMENTATION

## MODULE: Announcements

---

# Component: announcements.vue

## Role

This component acts as a **domain entry controller for News & Announcements management**.
It is responsible for:

* Loading full announcements dataset from Vuex
* Triggering reload of server state
* Providing entry point into create/edit flows
* Binding table view to centralized store state

It does NOT manage business logic itself — it orchestrates state retrieval and delegates rendering and editing to child components.

---

## Architecture Type

**State Orchestrator**

---

## Data Flow

* Data source: Vuex module `announcements`
* Flow:

  * Vuex → computed getter → UI table
  * UI actions → Vuex dispatch (`setStore`)
  * Vuex → API via mixins (`getResults`, `getAllData`)

Data never lives locally except configuration metadata (table headers, routes).

---

## Vuex Coupling

* Direct reads: `announcements` getter
* Direct mutations: via `setStore` dispatch
* Indirect coupling: mixins (`getResults`, `getAllData`)
* Coupling level: **HIGH**

---

## API Usage

* `/announcement` via mixins
* API logic is fully abstracted into mixins
* Component itself does NOT directly call API

---

## Mixins / Dependencies

* `getResults`
* `getAllData`
* `Table.vue` (UI abstraction layer)

---

## Side Effects

* Vuex store resets pagination/sorting
* API reload triggers on mount and manual refresh
* Router navigation to edit page

---

## Lifecycle Risks

* Mounted auto-fetch may cause redundant API calls in nested navigation
* No debounce or caching layer for reload actions

---

## Performance Issues

* Full dataset reload on every "load all"
* No pagination control inside component
* Table re-renders entire dataset

---

## Hidden Business Logic

* Default sorting always forced to `start_date`
* Implicit assumption: announcements always have date fields
* Navigation assumes fixed route structure (`n_a/edit`)

---

## Architectural Problems

* Tight Vuex coupling (store is primary state source)
* Mixins hide API logic (reduces traceability)
* Table abstraction hides rendering complexity
* No separation between domain and presentation logic

---

## Migration Strategy

* Replace Vuex with **Pinia store module (announcementsStore)**
* Replace mixins with **TanStack Query (useAnnouncementsQuery)**
* Extract table into composable-driven component
* Introduce pagination server-side instead of full reload

Migration risk: **HIGH**

---

---

# Component: newAnnouncement.vue

## Role

This component is the **Announcement Domain Editor Form**.
It handles creation and editing of announcements/events including multilingual content, scheduling, media, and type switching.

It represents a **full CRUD form for a complex domain entity**.

---

## Architecture Type

**Domain Controller Component**

---

## Data Flow

* Props:

  * `edit`
  * `data`
* Local state:

  * `announcement` object (full domain model)
* Flow:

  * Props → local state hydration (created hook)
  * User input → local reactive state
  * Submit → mixin (`create_it` / `edit_it`)
  * API → Vuex update via commit

---

## Vuex Coupling

* Indirect coupling via mixins
* No direct store usage
* Coupling level: **MEDIUM**

---

## API Usage

* `/announcement` (create/update via mixins)
* File upload implicit via mixin logic (not visible in component)

---

## Mixins / Dependencies

* `last`
* `last_created`
* `create_it`
* `edit_it`
* `vue-quill-editor`
* `htmlEditButton`

---

## Side Effects

* File upload processing (image compression)
* Route navigation after save (via parent callback)
* Quill editor DOM manipulation
* Language switching modifies shared object reference

---

## Lifecycle Risks

* Heavy initialization in `created()`
* Multiple conditional mutations of `announcement`
* Potential double hydration from `data` prop

---

## Performance Issues

* Quill editor is heavy (loaded always)
* Image base64 conversion in-browser (expensive)
* No lazy loading for editor modules

---

## Hidden Business Logic

* Type switching controls field visibility:

  * `announcement` → description required
  * `event` → link required
* Date conversion uses custom extension (`toDateInputValue`)
* Image is force-fetched and converted to text (unusual pattern)

---

## Architectural Problems

* GOD form component (too many responsibilities)
* Domain logic embedded in UI layer
* Image handling tightly coupled to form
* Language system embedded into model structure

---

## Migration Strategy

* Move domain logic into **announcementStore (Pinia)**
* Replace mixins with composables:

  * `useAnnouncementCRUD`
* Extract image processing → `useImageUpload`
* Replace Quill with lazy-loaded editor component
* Split into:

  * Form shell
  * Content section
  * Media section

Migration risk: **CRITICAL**

---

---

# MODULE: New Arrivals

---

# Component: newArrival.vue

## Role

This component is a **modal-based item editor for library inventory arrivals**.
It allows linking an inventory ID (`inv_id`) to catalog metadata and attaching a cover image.

---

## Architecture Type

**Form Component (Modal Domain Editor)**

---

## Data Flow

* Props:

  * `editIndex`
  * `array`
* Flow:

  * Inventory ID input → API lookup (`/cataloging/material/search`)
  * Response → hydration of local `arrival`
  * Image upload → compressed → stored in local state
  * Save → FormData POST to `/arrivals/create`

---

## Vuex Coupling

* None
* Local state only
* Coupling level: **NONE**

---

## API Usage

* `POST /cataloging/material/search`
* `POST /arrivals/create`
* `DELETE /arrivals/delete-image/:type/:id`

---

## Mixins / Dependencies

* `message_success`
* `getBookImage`
* `imageUtils`

---

## Side Effects

* FileReader → image compression pipeline
* DOM object URL creation
* Direct array mutation from parent (`array[editIndex]`)

---

## Lifecycle Risks

* Created hook immediately mutates state if editing
* No validation of API response existence (`res.data.res.data[0]`)

---

## Performance Issues

* Client-side image compression (CPU heavy)
* Object URL leaks if not revoked
* Repeated API calls per inv_id lookup

---

## Hidden Business Logic

* `isnewarrival === '1'` locks editing and deletion
* Image fallback chain:

  * imagePreview → image → default cover
* Inventory ID is immutable after creation

---

## Architectural Problems

* Direct mutation of parent array (anti-pattern)
* Weak API response validation
* Hidden business constraints inside UI

---

## Migration Strategy

* Replace modal logic with composable modal system
* Introduce `useArrivalsStore`
* Move API calls to service layer
* Replace FormData logic with request abstraction

Migration risk: **HIGH**

---

---

# Component: newArrivals.vue

## Role

This is the **administration dashboard for managing arrival records in bulk**.
It handles:

* listing arrivals
* bulk selection
* bulk deletion
* modal creation/editing orchestration

---

## Architecture Type

**State Orchestrator**

---

## Data Flow

* Local state holds:

  * arrivals list
  * selection state
* Flow:

  * API → loadArrivals()
  * UI → selection array
  * UI → modal editor (newArrival.vue)
  * Actions → DELETE /arrivals/delete

---

## Vuex Coupling

* None
* Fully local state
* Coupling level: **LOW**

---

## API Usage

* `GET /arrivals/index`
* `DELETE /arrivals/delete/:type/:id`

---

## Mixins / Dependencies

* `save`
* `loadData`
* `showModal`

---

## Side Effects

* Bulk delete triggers parallel API calls (`Promise.all`)
* Modal orchestration for child form
* Full list reload after each mutation

---

## Lifecycle Risks

* Created hook auto-fetch
* No cancellation of pending requests on navigation

---

## Performance Issues

* No pagination → full dataset always loaded
* Bulk delete spawns N concurrent requests
* Re-render of full table on every change

---

## Hidden Business Logic

* Type mapping:

  * BK, VM, MX, etc. → human labels
* Checkbox logic assumes object identity (`includes(arrival)`)

---

## Architectural Problems

* UI + orchestration mixed
* No centralized state management
* Modal-driven CRUD increases coupling

---

## Migration Strategy

* Introduce `useArrivalsQuery`
* Replace modal system with controlled dialog manager
* Move selection logic to store
* Replace bulk delete with batch API endpoint

Migration risk: **HIGH**

---

---

# Component: newQuickLink.vue

## Role

This component manages **individual Quick Link entities** used in website navigation shortcuts.
It supports creation and inline editing of multilingual link metadata.

---

## Architecture Type

**Form Component**

---

## Data Flow

* Props:

  * `editIndex`
  * `array`
* Flow:

  * Local form state → array mutation
  * Save → direct push or update
  * No API interaction

---

## Vuex Coupling

* None
* Fully local mutation
* Coupling level: **NONE**

---

## API Usage

* None

---

## Mixins / Dependencies

* `message_success`

---

## Side Effects

* Direct mutation of parent array
* Reset of local form after save

---

## Lifecycle Risks

* Initialization depends on index presence
* No defensive cloning

---

## Performance Issues

* Minimal (light component)

---

## Hidden Business Logic

* Assumes all fields required for consistency
* No validation layer beyond HTML required fields

---

## Architectural Problems

* No persistence layer awareness
* Direct array mutation coupling

---

## Migration Strategy

* Move to `useQuickLinksStore`
* Replace array mutation with store actions
* Add validation schema layer

Migration risk: **LOW**

---

---

# Component: quicklinks.vue

## Role

This component is the **administration panel for managing Quick Links collection for website configuration**.

It acts as a configuration editor for navigation shortcuts.

---

## Architecture Type

**State Orchestrator**

---

## Data Flow

* Vuex → website.data.quick_links
* Local copy → quick_links array
* UI edits → local mutation
* Save → commit back to Vuex store

---

## Vuex Coupling

* Direct read: website getter
* Direct write: `website.data.quick_links`
* Coupling level: **HIGH**

---

## API Usage

* Save mixin likely persists entire website object

---

## Mixins / Dependencies

* `save`
* `loadData`
* `showModal`
* `Edit/Delete icons`

---

## Side Effects

* Modal-based editing
* Direct mutation of global website object
* Full website save triggered on submit

---

## Lifecycle Risks

* Watcher syncs Vuex → local state
* Risk of overwrite during async updates

---

## Performance Issues

* Whole website payload saved even for small changes
* No diff-based updates

---

## Hidden Business Logic

* Quick links are embedded in global website configuration
* Assumes small dataset (no pagination)

---

## Architectural Problems

* Global state mutation anti-pattern
* Tight coupling to website object structure
* No separation between config and UI state

---

## Migration Strategy

* Split website config into domain stores:

  * `useWebsiteConfigStore`
  * `useQuickLinksStore`
* Replace full-save with partial patch API
* Introduce config versioning

Migration risk: **MEDIUM**

---

---

# Component: addlink.vue

## Role

This component manages **navigation link structures with optional dropdown hierarchy**.
It allows creation of nested link structures for website navigation menus.

---

## Architecture Type

**Form Component (Nested Data Editor)**

---

## Data Flow

* Props:

  * `editIndex`
  * `links`
* Flow:

  * Local link model
  * Nested dropdown mutation
  * Save → push or update array

---

## Vuex Coupling

* None
* Fully local mutation
* Coupling level: **NONE**

---

## API Usage

* None

---

## Mixins / Dependencies

* `message_success`

---

## Side Effects

* Nested array mutation (dropdown links)
* Direct parent array mutation

---

## Lifecycle Risks

* Copy-based initialization may break reactivity consistency
* Deep object mutation risk

---

## Performance Issues

* None significant (lightweight)

---

## Hidden Business Logic

* Dropdown links are recursive structure
* Each link can contain nested navigation layer

---

## Architectural Problems

* Deeply nested mutation without schema validation
* No separation between model and UI representation

---

## Migration Strategy

* Normalize navigation tree into schema-based store
* Replace manual nesting with recursive composable
* Introduce validation layer for tree structure

Migration risk: **MEDIUM**

---

---

# COMPONENT: settings.vue

## Role

This is the **central system configuration panel for the entire website platform**.

It manages:

* warnings system
* chat integration settings
* navigation links
* background images
* footer configuration
* social links

This is the **highest-level configuration aggregator in the system**.

---

## Architecture Type

**GOD Component (System Configuration Orchestrator)**

---

## Data Flow

* Vuex → website.data (single global object)
* UI → direct binding into nested object
* Save → full website object persistence

---

## Vuex Coupling

* Direct read/write of entire website object
* Coupling level: **CRITICAL**

---

## API Usage

* `/background-image/index`
* `/background-image/create`
* `/background-image/delete/:id`
* website save endpoint (via mixin)

---

## Mixins / Dependencies

* `save`
* `loadData`
* `showModal`
* `vue-quill-editor`
* `AddLink modal`

---

## Side Effects

* Full global state mutation
* File uploads
* Image deletion
* Modal link editing
* DOM-based file handling

---

## Lifecycle Risks

* Mounted auto-load background images
* Multiple async sources updating same object

---

## Performance Issues

* Large reactive object (`website.data`)
* Full object re-save on every change
* Image previews stored in memory

---

## Hidden Business Logic

* Footer structure deeply nested and multilingual
* Chat availability toggles UI globally
* Warning system controls site-wide banner logic

---

## Architectural Problems

* GOD object anti-pattern (website.data)
* No domain separation
* Everything stored in one reactive tree
* No partial updates possible

---

## Migration Strategy

* CRITICAL refactor required:

  * Split into domain stores:

    * `useWarningsStore`
    * `useChatStore`
    * `useFooterStore`
    * `useNavLinksStore`
    * `useBackgroundImagesStore`
* Replace full-save architecture with patch-based API
* Introduce schema-driven configuration system

Migration risk: **CRITICAL**

---

---

# SYSTEM-WIDE ARCHITECTURE SUMMARY

## Overall Architecture Type

This system is a:

> **Vue 2 MONOLITHIC ADMIN PANEL with Vuex-centered GLOBAL STATE GOD OBJECT architecture**

---

## Biggest Structural Problems

* Massive **God Object (`website.data`)**
* Heavy reliance on **mixins for business logic**
* Direct mutation of arrays and global objects
* No domain boundaries
* No service layer abstraction
* No caching or query layer
* Full reload patterns instead of incremental updates

---

## Dependency Graph Description

* Vue components → Vuex store
* Vuex store → API via mixins
* Mixins → hidden business logic layer
* Components → direct API in some cases (inconsistent architecture)
* Modals → deeply coupled child components

---

## Migration Priority Order

1. settings.vue (CRITICAL)
2. newAnnouncement.vue (CRITICAL)
3. announcements.vue (HIGH)
4. newArrival.vue + newArrivals.vue (HIGH)
5. quicklinks.vue (MEDIUM)
6. addlink.vue (MEDIUM)
7. newquicklink.vue (LOW)

---

## Suggested Target Architecture (Vue 3)

### State Layer

* Pinia stores:

  * announcementsStore
  * arrivalsStore
  * websiteConfigStore (split)
  * quickLinksStore

### Data Fetching

* TanStack Query:

  * caching
  * deduplication
  * background refresh

### UI Layer

* Pure components only
* No API logic inside components

### Service Layer

* announcementService
* arrivalsService
* websiteService

### Composables

* useImageUpload
* useModalManager
* useLanguageFields
* useEditor

---