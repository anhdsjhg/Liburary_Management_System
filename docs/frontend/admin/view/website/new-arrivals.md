Below is a **clean production-ready documentation file** you can copy directly into your VS Code `docs/` folder.

---

# 📦 Website Module — New Arrivals Architecture Documentation

## Module Path

`resources/js/admin/view/website/newarrivals`

## Components Covered

* `newarrival.vue`
* `newarrivals.vue`

---

# 1. Component: `newarrival.vue`

---

## 1. ROLE

This component is a **modal-based domain editor for a single New Arrival item**.

It is responsible for:

* Linking a library catalog item via `inv_id`
* Fetching bibliographic metadata from catalog system
* Attaching or updating cover image
* Compressing and processing images client-side
* Submitting arrival record to backend
* Deleting existing arrival image

It acts as a **data enrichment layer between catalog system and website “New Arrivals” display system**.

---

## 2. ARCHITECTURE TYPE

**Domain Controller Component**

Reason:

* Handles API calls (catalog search, create, delete image)
* Contains business logic (book enrichment + image processing)
* Manages modal lifecycle
* Mutates internal domain state (`arrival` object)

---

## 3. DATA FLOW

### Input Sources

* `editIndex` (edit mode indicator)
* `array` (parent arrivals list)
* `callback` (refresh trigger)

### Flow

#### Creation Flow

1. User enters `inv_id`
2. API call to catalog service:

   * `/cataloging/material/search`
3. Response mapped into `arrival` object
4. Optional image upload
5. Image compressed client-side
6. Form submitted via `FormData`
7. Backend stores arrival record
8. Parent refresh triggered via callback

#### Edit Flow

1. Existing arrival injected via props
2. Local state initialized
3. Optional image update or deletion
4. Submission updates backend record

---

## 4. VUEX COUPLING

### Direct Usage

* None

### Coupling Level

**LOW**

Reason:

* Fully local state management
* No Vuex dependency
* Communication via props + callbacks only

---

## 5. API USAGE

### Endpoints

* `POST /cataloging/material/search`

  * Fetch book metadata by `inv_id`

* `POST /arrivals/create`

  * Create or update arrival record

* `DELETE /arrivals/delete-image/:type_key/:id`

  * Remove associated image

### Responsibility Location

* API logic is fully embedded in component
* No service abstraction layer

---

## 6. GLOBAL DEPENDENCIES

### Mixins / Utilities

* `message_success`
* `getBookImage`
* `imageUtils` (image compression)

### Global APIs

* `$http`
* `$confirm`

---

## 7. SIDE EFFECTS

* HTTP requests (catalog + arrivals API)
* Client-side image compression (CPU intensive)
* FileReader usage for base64 conversion
* Modal close emission
* Parent callback execution
* DOM file input interaction

---

## 8. LIFECYCLE RISKS

### Created Hook

* Initializes state for edit mode
* Mutates local `arrival` object from props-derived data

### Risks

* Shared reference mutation risk
* Async image loading may overwrite state
* No deep cloning of incoming data

---

## 9. PERFORMANCE ISSUES

* Base64 image handling increases memory usage
* Client-side compression adds CPU overhead
* Repeated object key iteration in computed property
* No caching for catalog API requests

---

## 10. HIDDEN BUSINESS LOGIC

* `isnewarrival == '1'` locks record from modification
* Image resolution priority:

  1. `imagePreview`
  2. `image`
  3. default placeholder
* `inv_id` is immutable in edit mode
* Catalog system is authoritative for book metadata
* Image payload is dual-mode:

  * File upload OR URL string

---

## 11. ARCHITECTURAL PROBLEMS

### Key Issues

* Mixed responsibilities:

  * UI form
  * API orchestration
  * image processing
* No service layer abstraction
* Direct mutation of domain object (`arrival`)
* Embedded compression logic inside component
* Tight coupling with catalog API schema
* Dual-state image handling complexity

---

## 12. MIGRATION STRATEGY

### Target Architecture (Vue 3)

#### Replace With:

* `useNewArrivalForm()`
* `useCatalogSearch()`
* `useArrivalService()`
* `imageUtils` composable

---

### Refactor Plan

1. Extract API logic into service layer (`arrivalService`)
2. Move image compression to utility module
3. Replace mutable state with reactive form schema
4. Separate UI state from domain state
5. Introduce caching for catalog lookup
6. Normalize image handling pipeline

---

### Migration Risk

**HIGH**

---

---

# 2. Component: `newarrivals.vue`

---

## 1. ROLE

This component is the **administrative dashboard for managing New Arrivals collection**.

It is responsible for:

* Listing all arrival entries
* Creating and editing arrivals via modal
* Bulk selection and deletion
* Refreshing dataset from backend
* Mapping catalog type codes into human-readable labels

It acts as the **central orchestration layer for New Arrivals publishing workflow**.

---

## 2. ARCHITECTURE TYPE

**State Orchestrator Component**

Reason:

* Manages collection state (`arrivals`)
* Handles batch operations
* Controls modal lifecycle
* Coordinates API interactions
* Acts as parent controller for child modal

---

## 3. DATA FLOW

### Data Source

* `GET /arrivals/index`

### Flow

1. Component mounted
2. Fetch arrivals list from backend
3. Store response in local state
4. Render table
5. User interactions:

   * create → open modal
   * edit → open modal with index
   * delete → API call
   * batch delete → multiple API calls
   * refresh → reload dataset

---

## 4. VUEX COUPLING

### Reads

* `website`
* `configs`

### Writes

* None

### Coupling Level

**LOW**

Reason:

* Vuex only used for static configuration
* No state mutation dependency
* Core dataset is locally managed

---

## 5. API USAGE

### Endpoints

* `GET /arrivals/index`
* `DELETE /arrivals/delete/:type_key/:id`
* Multiple DELETE calls for batch removal

### Responsibility Location

* API calls directly inside component
* No abstraction layer or service layer

---

## 6. GLOBAL DEPENDENCIES

### Mixins

* `loadData`
* `save`
* `showModal`

### Global APIs

* `$http`
* `$confirm`
* `$t` (i18n)

---

## 7. SIDE EFFECTS

* API fetch on mount
* Modal creation for CRUD operations
* Batch delete requests (parallel HTTP calls)
* State reset after operations
* Checkbox state synchronization

---

## 8. LIFECYCLE RISKS

### Created Hook

* Automatically loads dataset

### Risks

* No request cancellation on rapid refresh
* Multiple concurrent delete operations possible
* Modal state not centrally tracked

---

## 9. PERFORMANCE ISSUES

* Full dataset reload on every refresh
* No pagination or lazy loading
* Batch deletion triggers multiple HTTP requests
* Checkbox logic relies on object reference comparison

---

## 10. HIDDEN BUSINESS LOGIC

* Type codes represent catalog classification:

  * `BK`, `VM`, `MX`, etc.
* Checkbox selection uses object reference equality (not ID-based)
* Modal reused for both create and edit
* "New Arrival" status is backend-controlled, not computed

---

## 11. ARCHITECTURAL PROBLEMS

### Key Issues

* No service layer abstraction
* Client-side batch delete inefficiency
* Object reference-based selection logic
* Tight coupling between modal and parent
* Mixins hide implementation details
* No separation of concerns between UI and orchestration

---

## 12. MIGRATION STRATEGY

### Target Architecture (Vue 3)

#### Replace With:

* `useArrivalsQuery()`
* `useArrivalActions()`
* `arrivalService`

---

### Refactor Plan

1. Extract API calls into service layer
2. Replace mixins with composables
3. Replace object-based selection with ID-based tracking
4. Replace batch delete with backend endpoint
5. Introduce query caching (TanStack Query)
6. Separate modal orchestration layer

---

### Migration Risk

**MEDIUM**

---

---

# 📊 FINAL MODULE SUMMARY

---

## Overall Architecture Type

**Hybrid CRUD Orchestration Module**

Combination of:

* Local state management
* Modal-driven domain editing
* Direct API coupling
* Mixin-based hidden logic layer

---

## Key Structural Issues

1. No service layer abstraction
2. Mixins conceal business logic
3. Batch operations handled inefficiently on frontend
4. Object reference-based selection logic
5. Embedded image processing in UI layer
6. No caching strategy for API calls
7. Tight modal-parent coupling

---

## Dependency Flow

```text
Component
  ↓
Mixins
  ↓
HTTP Layer
  ↓
Backend API
```

---

## Migration Priority

1. Extract service layer
2. Replace mixins with composables
3. Normalize state (IDs instead of objects)
4. Replace batch delete with backend endpoint
5. Introduce TanStack Query caching
6. Separate modal orchestration logic

---

## Suggested Target Architecture

* Vue 3 Composition API
* Pinia (optional state layer)
* TanStack Query (server state)
* Service layer (`arrivalService`)
* Composables (`useModal`, `useArrivals`)
* Utility layer for image processing
* ID-based state management

---

If you want next step, I can generate:

* a **full /docs index.md navigation system**
* or a **complete architecture for entire admin panel**
* or a **migration plan to Vue 3 + Pinia + TanStack Query step-by-step**
