# Cataloging/Search/Filter.vue — Production Documentation

## Overview

Inline collapsible filter panel used in the Cataloging search view. Provides filtering by batch ID, supply type, genres, specialities, and PPS status.

Unlike standard sidebar filters, this component is embedded inside the search form and directly mutates Vuex state.

---

## Responsibilities

* Filter cataloging search results
* Load genre and supply type metadata
* Manage speciality tree selection
* Toggle PPS status filter

---

## Data Sources

* Vuex: `cataloging.search.add_options`
* API:

  * `GET cataloging/material/genres`
  * `GET /supplier/types`
* Specialities mixin (hidden API call + transformation logic)

---

## State Binding (CRITICAL COUPLING)

All fields are directly bound via `v-model` to Vuex:

* `batch_id`
* `sup_key`
* `genres`
* `pps` (0/1 integer flag)
* `prog_code` (dynamically injected)

⚠️ This component mutates Vuex state directly (anti-pattern).

---

## Runtime Mutations

* Direct Vuex mutations via `v-model`
* `$set(search.add_options, 'prog_code')` → runtime property injection into Vuex state
* `$store.commit('setFullPageLoading')` ×4

---

## Lifecycle Behavior

* `created()`:

  * fetch genres
  * fetch supply types
* speciality tree change:

  * rebuild `prog_code`
  * inject into Vuex via `$set`

---

## Key Risks

### 1. Vuex state mutation violation

State is mutated directly from UI bindings.

### 2. Dynamic Vuex property injection

`prog_code` is not defined in store initial state.

### 3. Undeclared mixin dependency

* `message_error` used but not declared in `mixins[]`

### 4. Duplicate API usage

* `GET genres` also used in Edit.vue (no shared cache)
* `GET /supplier/types` duplicated across 4+ components

---

## Performance Issues

* speciality selection rebuilds full array on each change
* redundant `$set` operation per update

---

## Business Logic Notes

* PPS stored as integer flag (0/1) but rendered as boolean UI
* speciality codes derived via mixin transformation

---

## Migration Plan

### Phase 1 (Critical Fixes)

* Initialize `prog_code` in Vuex store (remove `$set`)
* Fix `message_error` mixin declaration

### Phase 2 (Architecture)

* Replace Vuex v-model bindings with local reactive state
* Introduce `useCatalogingFilters()` composable

### Phase 3 (Shared Data Layer)

* `useGenres()` (TanStack Query cache)
* `useSupplyTypes()` shared across all components
* `useSpecialities()` composable replaces mixin

---

## Target Architecture

* Local reactive filter state
* Explicit Vuex action dispatch only
* Shared cached API hooks

---

## Migration Risk

**MEDIUM** — Vuex coupling + dynamic state injection
