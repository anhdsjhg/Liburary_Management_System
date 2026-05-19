Below is a **production-ready documentation file** you can paste directly into VS Code docs (Markdown). It is cleaned, structured, and written as an internal engineering reference for the entire `Admin` domain.

---

# Admin Module — Architecture & Component Documentation

## Overview

The `Admin` module implements **user administration and permission management**. It consists of three core components:

* `Admin/Main.vue` — user listing + filtering entry point
* `Admin/AddPermissionPage.vue` — permission assignment (grant flow)
* `Admin/ControlPage.vue` — permission removal (revoke flow)

Together, they form a **two-way permission management system** built on a shared pattern of:

* local state-driven UI
* direct API calls
* Vuex used only for loading state
* heavy reliance on shared object mutation

---

# 1. Admin/Main.vue

## Role

Primary entry point for user administration.
Supports:

* User search (by type)
* Module-based filtering
* Navigation to permission management pages

## Architecture Type

**Domain Controller Component**

* Manages dual search modes (user vs module)
* Direct Vuex state mutation
* Contains display normalization logic for heterogeneous user types

---

## Data Flow

### User Search Flow

```
admin.search.add_options.all → getResults(service/user/{type}) → admin.data.res → TableDiv
```

### Module Search Flow

```
admin_module.search.add_options.module_id → getResults(manage/users/by_module) → admin_module.data.res → TableDiv
```

### Visualization Load

```
GET manage/visualization → response DISCARDED (side-effect only)
```

---

## Vuex Coupling

* `admin` getter (read + mutation via v-model)
* `admin_module` getter (direct property mutation)
* `$store.dispatch('setStore')`
* `$store.commit('setFullPageLoading')`

### Critical Issue

```js
this.$store.getters.admin_module.search.add_options.module_id = id
```

Direct mutation of Vuex getter → breaks Vuex contract.

---

## API Calls

* `GET manage/visualization` *(response ignored)*
* `GET service/user/{type}`
* `GET manage/users/by_module`

All routed through `getResults` mixin except visualization call.

---

## Lifecycle Issues

* `message_error` is called but **not registered in mixins**

  * ❌ causes runtime crash on API failure
* `search_module` flag never resets

  * UI can become permanently locked in module mode

---

## Business Logic Notes

* User objects are heterogeneous:

  * `student`
  * `employee`

* Display logic is handled in component methods:

  * `DisplayFullname()`
  * `DisplayUsername()`

* User types are hardcoded (not configurable)

---

## Architectural Problems

* ❌ Missing mixin registration (`message_error`)
* ❌ Discarded API response (`manage/visualization`)
* ❌ Vuex getter mutation via v-model
* ❌ Non-resettable UI state (`search_module`)
* ❌ Hardcoded domain constants (user types)

---

## Migration Strategy

### Target Architecture

* Replace Vuex mutation with Pinia store
* Replace mixins with TanStack Query
* Move display logic to composable

### Proposed Structure

```ts
useAdminStore()
useAdminUsersQuery()
useAdminModuleUsersQuery()
useUserDisplay()
```

### Critical Fixes

* Fix `message_error` import immediately
* Convert `search_module` → explicit store state (`searchMode`)
* Remove direct Vuex mutations

---

# 2. Admin/AddPermissionPage.vue

## Role

Permission assignment interface (GRANT FLOW)

Allows admin to:

* View available permissions per module
* Select individual or bulk permissions
* Assign permissions to user

---

## Architecture Type

**Domain Controller Component**

* Fully local state-driven
* Two-panel selector (available → chosen)
* Direct API mutation

---

## Data Flow

```
GET /visualization/permissions
→ modules[]
→ permissionsByModule()
→ permissions[]

add_permission()
→ chosen[]

POST /give_permissions
```

---

## Core State Model

* `modules[]` → full permission structure
* `permissions[]` → active module permissions (mutable reference)
* `chosen[]` → selected permissions for submission

---

## Critical Design Issue

### Shared Reference Mutation

```js
this.permissions = this.modules[index].visualization
```

This creates:

* shared memory reference
* implicit synchronization
* hidden coupling between UI panels

---

## API Calls

* `GET /manage/users/{user_cid}/visualization/permissions`
* `POST /manage/users/{user_cid}/give_permissions`

Payload:

```json
{
  "permissions_ids": [],
  "modules_ids": []
}
```

---

## Vuex Usage

* Only for loading state:

```js
setFullPageLoading(true/false)
```

No domain state stored in Vuex.

---

## Lifecycle Issues

* Navigation guard does NOT return early
* Component continues execution after redirect attempt
* Risk of partial initialization

---

## Business Logic

* Permission objects are mutated:

```js
permission.location = { module_id }
```

This modifies API response objects directly.

---

## Architectural Problems

* ❌ Shared array reference mutation
* ❌ Object mutation of API response
* ❌ Navigation guard without return
* ❌ O(n) module lookup (`find_module_index`)
* ❌ Parallel arrays required by backend API

---

## Migration Strategy

### Recommended Composable

```ts
usePermissionAssignment(userId)
```

### Required Fixes

* Replace shared references with clones:

```js
permissions = [...module.visualization]
```

* Replace mutation tracking with Map:

```ts
Map<permissionId, moduleId>
```

* Move navigation guard to router level

---

# 3. Admin/ControlPage.vue

## Role

Permission revocation interface (REVOKE FLOW)

Inverse of AddPermissionPage:

* shows assigned permissions
* moves to "remove basket"
* deletes via API

---

## Architecture Type

**Domain Controller Component**

Mirrors AddPermissionPage almost exactly with inverse logic.

---

## Data Flow

```
GET /visualization
→ tree[]

permissionsByModule()
→ permissions[]

remove_permission()
→ chosen[]

POST /delete_permissions
```

---

## Key Structural Difference

| AddPermissionPage         | ControlPage              |
| ------------------------- | ------------------------ |
| available → chosen        | assigned → remove        |
| give_permissions          | delete_permissions       |
| visualization/permissions | visualization            |
| permission.id             | permission.permission_id |

---

## Critical Inconsistency

### ID Mismatch

* AddPermissionPage:

```js
permission.id
```

* ControlPage:

```js
permission.permission_id
```

Same entity, different API shapes.

---

## Vue Router Issue

```js
goTo('administration_add_permission', { user })
```

### Problem:

* full object passed as route param
* breaks on refresh
* not serializable

---

## Shared Reference Mutation

```js
this.permissions = tree[index].permissions
```

Same anti-pattern as AddPermissionPage:

* shared memory reference
* implicit synchronization

---

## Lifecycle Issue

* navigation guard does not stop execution
* refresh() resets module selection (UX loss)

---

## Architectural Problems

* ❌ API inconsistency (`id` vs `permission_id`)
* ❌ Shared reference mutation
* ❌ Object-based routing
* ❌ Duplicate logic vs AddPermissionPage
* ❌ Module selection reset after save

---

## Migration Strategy

### Unified Composable

```ts
usePermissionManager(userId, mode)
```

Where:

* `mode = 'add' | 'remove'`

### Required Fixes

* Normalize API response:

```ts
permission.id = permission.permission_id
```

* Move user state to store:

```ts
useAdminStore().selectedUser
```

* Replace router object params

---

# SYSTEM-WIDE ADMIN ARCHITECTURE

## Core Pattern

The Admin module is built on a **dual-panel permission system**:

```
Available Permissions → Chosen → API Submit
Assigned Permissions → Remove Basket → API Delete
```

Both flows share:

* shared array references
* direct API calls
* Vuex used only for loading
* no composable abstraction
* duplicated logic (~70%)

---

## Critical System Issues

### 1. Runtime Bug

* `message_error` missing in `Main.vue`

### 2. Routing Anti-Pattern

* user objects passed via route params

### 3. Shared Reference Mutation

* permissions arrays reused across UI panels

### 4. API Inconsistency

* `id` vs `permission_id`

### 5. Discarded API Response

* `/manage/visualization`

### 6. Non-reset UI state

* `search_module` lock state

---

## Recommended Target Architecture

### Stores (Pinia)

```ts
useAdminStore()
```

### Composables

```ts
usePermissionManager()
useAdminUsersQuery()
useUserDisplay()
```

### API Layer

```ts
permissionsApi.ts
usersApi.ts
adminApi.ts
```

---

## Migration Priority

### CRITICAL (Fix Immediately)

* missing `message_error`
* route object params
* API ID inconsistency

### HIGH

* shared reference mutation
* permission duplication logic

### MEDIUM

* search_module UX bug
* discarded API response

### LOW

* display logic refactor
* composable extraction

---

## Final Architectural Summary

The Admin module is:

> A duplicated, reference-mutation-based permission system with inconsistent API shapes and implicit state coupling across components.

It is **functionally stable**, but:

* not safe under refactors
* not resilient to API changes
* not composable
* not route-safe

---

If you want, I can next generate:

* a **fully refactored Pinia + composables architecture**
* or a **migration plan step-by-step (safe refactor order)**
* or a **diagram of current vs target architecture**
