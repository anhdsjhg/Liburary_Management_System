---

# 📦 Batches Domain — Technical Documentation

## Overview

The **Batches domain** manages acquisition batches (shipments/deliveries of inventory items). It is built using a Vue 2 + Vuex + mixin-based architecture and follows a **list → filter → form → detail modal** pattern consistent with the Acts domain.

This domain is heavily coupled to Vuex, uses mixin-driven API abstraction, and contains multiple cross-domain dependencies (Supplier, Items).

---

## 🧭 Domain Structure

```
Batches/
├── Batches.vue              # List view (state orchestrator)
├── Filter.vue               # Filter sidebar (Vuex-bound form)
├── CreateBatches.vue        # Create/Edit form (modal)
├── BatchItems.vue          # Line-item detail view (GOD component)
├── ShowStatus.vue          # Status renderer (UI component)
```

---

## 🏗️ Architecture Type

**Pattern:** Legacy Vue 2 Domain Module
**Style:** Vuex-centered + mixin-driven CRUD orchestration
**Classification:**

* List View → State Orchestrator
* Filter → Vuex-bound Form Controller
* Create/Edit → Domain Controller Form
* Items Detail → GOD Component (anti-pattern)

---

## 🔄 Data Flow

### List Flow

```
Vuex (batches)
   ↓
Batches.vue (computed getter)
   ↓
TableDiv (generic table)
```

### Search Flow

```
Filter.vue (v-model → Vuex mutation)
   ↓
Batches.vue submit
   ↓
getResults / getAllData (mixins)
   ↓
API (/batch)
   ↓
Vuex update (batches state)
```

### Detail Flow

```
BatchItems.vue mounted
   ↓
GET item/by/batch/{id}
   ↓
Row action → POST item/search
   ↓
GET item/item/specs/{id}
   ↓
Modal render (MoreVue)
```

---

## 🧠 Vuex Coupling Model

### Characteristics

* Direct getter binding for entire domain state
* Heavy reliance on `search.add_options`
* Frequent direct mutations via `v-model`

### Critical Anti-patterns

* `v-model` directly mutating Vuex state
* No mutation/commit isolation layer
* Store used as both UI state + API state container

### Risk Level: 🔴 CRITICAL

---

## 🌐 API Layer

All API interactions are hidden inside mixins:

### Mixins Used

* `getResults` → list search
* `getAllData` → full dataset fetch
* `create_it` → POST
* `edit_it` → PUT
* `download_file` → Excel export
* `print_file` → PDF print

### Endpoints

| Endpoint                | Purpose           |
| ----------------------- | ----------------- |
| `/batch`                | List data         |
| `/batch/lost-ids`       | ID gap generation |
| `/batch/export`         | Excel export      |
| `/batch/print`          | Print output      |
| `/item/by/batch/{id}`   | Batch items       |
| `/item/search`          | Item lookup       |
| `/item/item/specs/{id}` | Item speciality   |
| `/supplier/names`       | Supplier list     |
| `/supplier/types`       | Supply types      |
| `/batch/statuses`       | Status list       |

---

## ⚠️ Architectural Issues

### 1. Vuex Direct Mutation via v-model

* Present in `Batches.vue` and `Filter.vue`
* Bypasses mutation layer entirely
* Breaks strict Vuex mode compatibility

---

### 2. Component-as-Mixin Anti-pattern

```js
mixins: [customTreeSelect]
```

* A component is used as a mixin
* Causes lifecycle + method injection ambiguity

---

### 3. Loading State Race Condition

Multiple parallel requests independently toggle global loader:

```
Filter.vue:
  GET suppliers → setFullPageLoading(false)
  GET statuses  → setFullPageLoading(false)
  GET types     → setFullPageLoading(false)
```

**Result:** loader hides before all requests complete.

---

### 4. Cross-Domain Coupling

| Source            | Dependency                       |
| ----------------- | -------------------------------- |
| CreateBatches.vue | CreateSupplier (Supplier domain) |
| BatchItems.vue    | Specialities (Items domain)      |

No abstraction layer exists between domains.

---

### 5. HTML Injection Risk

```js
display_speciality() → returns raw HTML string
```

Rendered via `v-html` → potential XSS surface.

---

### 6. Copy-Paste Architecture

* BatchItems.vue explicitly duplicated due to broken Table import
* Sorting + rendering logic copied from ActsItems
* No shared abstraction layer

---

### 7. Hidden Business Rules

* `inv_list.split(',')[0]` → only first item used for detail fetch
* `'CR'` → conditional UI rendering (Continuing Resource type)
* `sup_key → sup_type` mapping (silent API mismatch fix)
* Status key toggling via array mutation (`addStatus`)

---

## 📊 Component Breakdown

### Batches.vue

* List orchestrator
* Vuex-driven
* Mixin API layer
* Direct v-model mutations

**Risk:** High coupling, moderate complexity

---

### Filter.vue

* 10+ Vuex v-model bindings
* 3 concurrent API calls
* Component used as mixin

**Risk:** CRITICAL

---

### CreateBatches.vue

* Multi-API initialization
* Supplier integration
* ID gap generation logic

**Risk:** Medium-High (race conditions)

---

### BatchItems.vue

* GOD component (8 responsibilities)
* Multi-step async chain
* HTML injection
* Cross-domain import

**Risk:** CRITICAL

---

### ShowStatus.vue

* Pure UI component
* Injected into TableDiv

**Risk:** Low

---

## ⚙️ Performance Concerns

* Deep Vuex reactivity on large filter object
* Multiple redundant supplier API calls
* Synchronous ID range expansion
* Client-side sorting with repeated cloning
* Computed totals using repeated parsing

---

## 🧩 Shared Patterns (Across Domain)

* `heads` config array drives TableDiv rendering
* Mixins handle all API communication
* Modal system via `showModal`
* Global helpers:

  * `copy()`
  * `Date.toDateInputValue()`

---

## 🚨 Migration Strategy (Vue 3 Target)

### Phase 1 — State Layer

* Replace Vuex with Pinia
* Remove v-model direct store binding
* Introduce local reactive filter state

---

### Phase 2 — API Layer

Replace mixins with TanStack Query:

```
useQuery(['batches'], fetchBatches)
useMutation(createBatch)
```

---

### Phase 3 — Shared Composables

* `useBatches()`
* `useBatchItems()`
* `useSuppliers()`
* `useLostIds()`

---

### Phase 4 — UI Cleanup

* Remove HTML string rendering → replace with components
* Replace TableDiv injection with typed slots
* Remove duplicate modal systems

---

### Phase 5 — Domain Decoupling

* Extract Supplier integration into service layer
* Remove Items-domain dependency from Batches

---

## 🔥 Migration Risk Summary

| Area                     | Risk        |
| ------------------------ | ----------- |
| Filter.vue Vuex coupling | 🔴 Critical |
| BatchItems GOD component | 🔴 Critical |
| Loading race conditions  | 🔴 High     |
| Copy-paste architecture  | 🔴 High     |
| Cross-domain coupling    | 🔴 High     |
| Global helpers           | 🟠 Medium   |

---

## 🧾 Final Assessment

The Batches domain is a **structural clone of the Acts domain with increased complexity and deeper coupling**.

Primary issues are not UI-related but architectural:

* State management leakage (Vuex misuse)
* Hidden API layer (mixins)
* Cross-domain dependencies
* Inconsistent abstraction boundaries
* Duplicate logic across domains

---

## ✅ Recommended Target State

A modernized architecture should converge to:

* Pinia store per domain
* TanStack Query API layer
* Fully local component state for forms
* Strict separation of UI / domain / API layers
* No mixin-based logic
* No global helper dependencies

---
