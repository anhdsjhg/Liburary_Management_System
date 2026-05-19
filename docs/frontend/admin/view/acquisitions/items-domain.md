# Items Module Architecture (Acquisitions System)

## Overview

The **Items module** is the core inventory management domain of the acquisitions system. It handles bibliographic records, inventory tracking, barcode/RFID operations, speciality tagging, batch assignment, and loss/act management.

This module is highly interconnected, feature-dense, and currently exhibits several architectural anti-patterns (GOD components, Vuex coupling, duplicate API calls, and cross-domain dependencies).

---

## Module Structure

```
Items/
├── Items.vue              (Main list view)
├── Filter.vue            (Advanced search/filter panel)
├── CreateItems.vue       (Create/Edit/Recreate form - GOD component)
├── Print.vue             (Barcode + RFID operations)
├── Specialities.vue      (Read-only speciality modal)
```

---

## Domain Responsibilities

### 1. Items.vue (List View)

**Responsibility:** Core inventory listing and search execution

**Key Features:**

* Multi-field boolean search (AND/OR/NOT)
* Row actions (delete, edit, mark as received)
* Speciality modal preview
* Last created item refresh

**Key Risks:**

* Direct Vuex mutation via array `.push()` / `.splice()`
* Direct assignment to Vuex state (`search_fields`)
* HTML string rendering for speciality display

---

### 2. Filter.vue (Search Panel)

**Responsibility:** Advanced filtering system for item queries

**Key Features:**

* Multi-domain filtering (supplier, publisher, act, speciality, etc.)
* Date range filtering
* Loss status filtering

**Key Risks:**

* 13+ direct Vuex mutations via v-model
* 6 concurrent API calls on mount
* Duplicate API requests across module
* No shared caching layer

---

### 3. CreateItems.vue (GOD Component)

**Responsibility:** Create, edit, and recreate item records

**Modes:**

* Create
* Edit
* Recreate

**Key Features:**

* Full bibliographic form
* Batch/publisher/speciality assignment
* Loss/act linking
* Inventory ID management
* Periodical (CR) handling

**Key Risks (CRITICAL):**

* 8+ API endpoints used in single component
* 6 concurrent API calls on mount (loading race condition)
* Reactive object mutation via `delete`
* Cross-domain modal imports (Batch, Publisher)
* Dual-field logic (`item_key` vs `item_type`)
* Vuex store used as global state gate

---

### 4. Print.vue (Barcode & RFID)

**Responsibility:** Barcode printing and RFID initialization

**Key Features:**

* Barcode search & selection
* Batch printing
* RFID initialization
* Barcode regeneration

**Key Risks (CRITICAL):**

* Hardware integration via mixin (`readFromRfid`)
* REST violation (`GET /barcode/init` mutates state)
* Event bus dependency (`$eventHub`)
* Silent failure in RFID → DB sync chain
* Vuex mutation via v-model (8 fields)

---

### 5. Specialities.vue (Modal)

**Responsibility:** Display hierarchical speciality tree

**Key Features:**

* Pure read-only modal
* 3-level tree rendering

**Key Strengths:**

* No Vuex dependency
* No API calls
* Pure computed transformation

**Limitation:**

* Hardcoded 3-level depth tree rendering

---

## Cross-Cutting Architecture Issues

### 1. Vuex Over-Coupling

* Direct mutation via v-model in multiple components
* Array mutation (`push`, `splice`) on store state
* Store used as global reactive cache

---

### 2. API Duplication

Shared endpoints across multiple components without caching:

* `/supplier/names`
* `/publisher/names`
* `/item/create-data`
* `/item/item/specs/{id}`
* `/acts/*`

➡ No shared API layer or request deduplication

---

### 3. Loading State Race Conditions

* Multiple components independently commit `setFullPageLoading`
* 6+ concurrent API calls in CreateItems and Filter
* Loader state depends on last-resolved request

---

### 4. Component Design Violations

* GOD component: CreateItems.vue
* Event bus usage: Print.vue
* Hardware I/O in UI layer: RFID mixin
* REST violation: GET used for state mutation

---

### 5. Data Integrity Issues

* `delete` used on reactive objects (breaks reactivity)
* Dual field system (`item_key` vs `item_type`)
* Implicit business rules embedded in UI layer

---

## Critical Business Rules

* `status = 0` → Lost item state
* `item_key = 'CR'` → Periodical item type
* Custom inventory ID only valid when `count == 1`
* Periodicals cannot have `custom_inv_id`
* RFID initialization must precede DB update

---

## Recommended Target Architecture

### 1. API Layer

```
/api
├── items.ts
├── suppliers.ts
├── publishers.ts
├── acts.ts
├── batches.ts
├── barcodes.ts
```

---

### 2. Composables Layer

```
/composables
├── useItems()
├── useItemFilters()
├── useItemForm()
├── useSpecialities()
├── useBarcodes()
├── useRfidService()
```

---

### 3. State Management

* Replace Vuex mutations with composables or Pinia
* Remove v-model direct store binding
* Introduce query caching (TanStack Query recommended)

---

### 4. Component Refactor Plan

| Component        | Strategy                             |
| ---------------- | ------------------------------------ |
| CreateItems.vue  | Split into Create/Edit/Recreate      |
| Filter.vue       | Convert to local state + composable  |
| Items.vue        | Remove Vuex mutation patterns        |
| Print.vue        | Extract RFID + barcode service layer |
| Specialities.vue | Convert to recursive tree component  |

---

## Migration Priority

### P0 (Critical)

* CreateItems.vue split
* Vuex mutation removal (Items + Filter)
* API deduplication layer

### P1 (High)

* Print.vue RFID extraction
* Event bus removal
* Loading state centralization

### P2 (Medium)

* Specialities recursive refactor
* HTML string generation removal

---

## Summary

The Items module is the **highest complexity domain in the system**, containing:

* GOD-level form component
* Heavy Vuex coupling
* Duplicate API usage across components
* Hardware integration inside UI layer
* Multiple architectural violations (REST, state management, reactivity)

A full refactor should begin with **API consolidation and CreateItems decomposition**, as these block all downstream improvements.
