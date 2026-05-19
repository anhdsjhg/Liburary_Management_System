# Service Desk — Users Module Architecture Documentation

## Overview

The `ServiceDesk/Users` module is the patron search and RFID-driven circulation entry point of the library system.
It combines:

* Patron search
* User detail management
* RFID-driven return flows
* RFID-driven renewal flows
* Administrative account toggles
* Dynamic service desk table rendering

The module contains four components:

| Component         | Responsibility                                    | Complexity |
| ----------------- | ------------------------------------------------- | ---------- |
| `Users.vue`       | Main service desk patron search & RFID dispatcher | HIGH       |
| `Info.vue`        | Patron detail & admin management modal            | MEDIUM     |
| `RenewBooks.vue`  | Bulk RFID renewal flow                            | MEDIUM     |
| `ReturnBooks.vue` | Bulk RFID return flow                             | MEDIUM     |

---

# 1. `Users.vue`

## Role

Primary entry point for patron-facing service desk operations.

Provides:

* Patron search
* Type switching (student/employee)
* RFID scanning
* Dispatching bulk return modal
* Dispatching bulk renewal modal
* Dynamic table head switching

---

## Architecture Classification

**Domain Controller Component**

The component combines:

* Search orchestration
* Vuex mutations
* RFID hardware integration
* Dynamic table configuration
* Modal dispatching
* API coordination

This is not a presentational component.

---

## Core Responsibilities

### User Search

Supports:

* Student search
* Employee search
* Dynamic table head configuration

### RFID Workflows

RFID scan can trigger:

* Bulk return
* Bulk renewal

depending on button action.

### Dynamic Table Heads

Changes visible columns based on user type.

---

## Current Data Flow

```text
users.search.add_options.all (Vuex getter)
    ↓ v-model mutation
loadResults()
    ↓
changeHeads()
    ↓
getResults() mixin
    ↓
service/user/{type}
```

RFID flow:

```text
RFID Scan
    ↓
readFromRfid()
    ↓
GET /service/media/search/by-barcode
    ↓
showModal(ReturnBooks | RenewBooks)
```

---

## Vuex Coupling

### Current Problems

#### Direct Vuex Mutation via v-model

```vue
v-model="users.search.add_options.all"
```

This mutates Vuex state directly.

---

#### Direct State Assignment

```js
this.$store.state.users.heads = heads
```

Bypasses:

* mutations
* actions
* traceability

---

## Confirmed Architectural Problems

### 1. `message_error()` called before requests

```js
this.message_error('loading', true)
```

Runs BEFORE API request.

Result:

* false error notifications
* notification spam
* noisy UX

---

### 2. Vestigial API Calls

These requests discard responses entirely:

```text
/service/sort-fields
/service/search-fields
/service/filter-fields
```

All have empty `.then()` handlers.

Pure dead network traffic.

---

### 3. Direct Vuex State Mutation

```js
this.$store.state.users.heads = heads
```

Critical anti-pattern.

---

### 4. Dead Imports

Unused:

* `PulseLoader`
* `Dropdown`

---

### 5. Component References Stored in `data()`

```js
data() {
  return {
    ReturnBooks,
    RenewBooks
  }
}
```

Not needed.

---

### 6. Developer Artifacts in Production

Examples:

```js
// this.barcodes=[10897768]
```

CSS:

```css
/*I hate it !!!!!!!*/
/* fu... luchshe sjuda ne smotret' */
```

Production cleanliness issue.

---

## Hidden Business Logic

### Type-Based Head Configuration

Students:

* faculty
* degree

Employees:

* department
* degree_position

This logic currently lives in `changeHeads()`.

---

### Shared RFID Dispatcher

```js
searchByBarcode(renew = false)
```

One method controls:

* return flow
* renewal flow

through boolean branching.

---

## Runtime Bugs

| Bug                                   | Trigger         |
| ------------------------------------- | --------------- |
| `message_error` called before request | Every page load |
| Dead API calls                        | Every page load |
| Direct Vuex assignment                | Every search    |

---

## Production Migration Plan

### Immediate Fixes

#### Remove `getTypes()`

The method serves no production purpose.

Delete entirely.

---

#### Remove Pre-request `message_error()`

Delete all:

```js
this.message_error('loading', true)
```

---

#### Remove Dead Imports

* `PulseLoader`
* `Dropdown`

---

#### Remove Test Data & Developer Comments

Delete all development artifacts.

---

## Recommended Vue 3 Architecture

### Replace Vuex Mutations

Use Pinia:

```ts
const usersStore = useUsersStore()
```

---

### Replace `changeHeads()`

Use computed state:

```ts
const visibleHeads = computed(() => ...)
```

---

### RFID Composable

```ts
useRfidBookSearch()
```

Shared with:

* `Service.vue`
* `ReturnBooks.vue`
* `RenewBooks.vue`

---

### Query Layer

```ts
useUsersSearch(type)
```

with TanStack Query.

---

## Migration Risk

| Area                  | Risk   |
| --------------------- | ------ |
| Removing `getTypes()` | LOW    |
| Vuex decoupling       | MEDIUM |
| RFID flow extraction  | HIGH   |

---

# 2. `Info.vue`

## Role

Patron detail modal for service desk staff.

Displays:

* photo
* borrowing totals
* personal information
* account state
* unlimited borrowing toggle

---

## Architecture Classification

**Domain Controller Component**

Contains:

* API lifecycle
* administrative mutations
* confirmation dialogs
* data normalization

---

## Current Data Flow

```text
props.id + props.type
    ↓
GET service/user/{type}/{id}
    ↓
this.user
    ↓
toggle actions
    ↓
POST mutations
    ↓
refresh getInfo()
```

---

## Confirmed Runtime Bugs

### `.catch().then()` Ordering

Exists in BOTH:

* `changeActivity()`
* `changeUnlimited()`

Current pattern:

```js
.catch(...)
.then(...)
```

Incorrect promise chain ordering.

---

## Architectural Problems

### 1. State Updated Before Confirmation

```js
this.inactive = event ? 1 : 0
```

Runs BEFORE confirmation dialog.

If canceled:

* UI state diverges from backend state

---

### 2. Hardcoded English Strings

Not internationalized:

```text
Are you sure you want to change unlimited status for this user?
```

---

### 3. Global Functions in Template

```vue
objectWithoutKey(user.info, 'user_cid')
```

Called every render.

Creates new object references repeatedly.

---

### 4. Navigation from Modal on Error

```js
this.goTo('users')
```

Can redirect while modal is open.

---

## Hidden Business Logic

### Inverted Active State

```js
inactive = user.info.is_active == 1 ? 0 : 1
```

Meaning:

| API Value        | Local State    |
| ---------------- | -------------- |
| `is_active == 1` | `inactive = 0` |

Naming mismatch creates confusion.

---

## Recommended Migration

### Replace with Composable

```ts
useUserActivity(id, type)
```

Owns:

* getInfo
* activity toggle
* unlimited toggle

---

### Replace Global Utilities

```ts
import { capitalize } from '@/utils/string'
```

---

### Replace Template Function Calls

Use computed:

```ts
const filteredInfo = computed(...)
```

---

## Migration Risk

LOW

Small isolated component.

---

# 3. `RenewBooks.vue`

## Role

Bulk renewal modal for RFID-scanned books.

Allows:

* selecting scanned books
* renewing multiple loans

---

## Architecture Classification

**Domain Controller Component**

Contains:

* sequential API loop
* modal orchestration
* RFID integration

---

## Critical Business Logic Divergence

### Hardcoded Renewal Duration

```js
duration: 21
```

This bypasses:

```js
$store.getters.user.duration
```

used elsewhere.

Two renewal systems currently behave differently.

This is a production policy inconsistency.

---

## Confirmed Runtime Bugs

### Undefined `this.info`

```js
this.showModal(this.info)
```

`this.info` does not exist.

Broken functionality.

---

### Undefined Props

Used but undeclared:

* `this.commit`
* `this.link`

---

## Dead Code

Unused:

* `Book` import
* `service` config object

---

## Sequential Loop Problem

```js
for (...) {
  await renew()
}
```

Risks:

* partial completion
* no rollback
* slow batch operations

---

## Recommended Migration

### Shared Renewal Composable

```ts
useRenewBooks()
```

---

### Unified Policy Source

Always use:

```ts
authStore.user.duration
```

---

### Replace Sequential Loop

Use:

```ts
Promise.allSettled()
```

or backend batch endpoint.

---

## Migration Risk

MEDIUM

Contains active runtime bugs and business rule inconsistency.

---

# 4. `ReturnBooks.vue`

## Role

Bulk RFID return modal.

Structurally mirrors `RenewBooks.vue`.

---

## Architecture Classification

**Domain Controller Component**

---

## Critical Architectural Issue

### RFID Sequencing Inconsistency

Current flow:

```text
DB Return
    ↓
RFID Deactivation
```

But `Service.vue` does:

```text
RFID
    ↓
DB Return
```

The system contains TWO contradictory return flows.

---

## Risks

If DB partially fails:

* RFID may still deactivate all items
* database and RFID state diverge

This is operationally dangerous.

---

## Confirmed Runtime Bugs

Same as `RenewBooks.vue`:

| Bug                     | Status |
| ----------------------- | ------ |
| `this.info` undefined   | ACTIVE |
| `this.commit` undefined | ACTIVE |
| `this.link` undefined   | ACTIVE |

---

## Missing Refresh Mechanism

After return:

* no parent refresh
* no event emit
* no store invalidation

UI becomes stale.

---

## Recommended Migration

### Shared Return Composable

```ts
useReturnBooks()
```

Shared with:

* `Service.vue`

---

### Standardize RFID Order

The entire system must choose ONE:

| Strategy   | Meaning                |
| ---------- | ---------------------- |
| RFID first | Hardware authoritative |
| DB first   | Database authoritative |

Currently both exist simultaneously.

---

### Add Refresh Contract

Use:

```ts
emit('returned')
```

or query invalidation.

---

## Migration Risk

MEDIUM–HIGH

Because RFID consistency impacts physical circulation operations.

---

# Final Module Assessment

## Overall Quality

| Area              | Assessment    |
| ----------------- | ------------- |
| Business Logic    | Strong        |
| RFID Integration  | Sophisticated |
| Architecture      | Fragmented    |
| State Management  | Unsafe        |
| API Layer         | Missing       |
| Reusability       | Low           |
| Runtime Stability | Recoverable   |

---

# Highest Priority Fixes

## Immediate (No Architecture Changes Needed)

1. Remove `getTypes()`
2. Remove pre-request `message_error()`
3. Fix `.catch().then()` ordering
4. Fix undefined `this.info`
5. Fix undefined `commit/link`
6. Remove hardcoded `duration: 21`
7. Remove direct Vuex mutations
8. Remove developer comments
9. Remove dead imports
10. Standardize RFID sequencing

---

# Recommended Target Architecture

## Stack

| Concern   | Target                |
| --------- | --------------------- |
| State     | Pinia                 |
| API       | Service Layer         |
| Async     | TanStack Query        |
| RFID      | Dedicated composables |
| UI State  | Local refs/computed   |
| Events    | Emits/store actions   |
| Utilities | Explicit imports      |

---

# Recommended Composables

| Composable            | Responsibility     |
| --------------------- | ------------------ |
| `useUsersSearch()`    | Patron search      |
| `useRfidBookSearch()` | RFID scanning      |
| `useRenewBooks()`     | Bulk renewal       |
| `useReturnBooks()`    | Bulk return        |
| `useUserActivity()`   | User admin actions |

---

# Final Migration Priority

| Phase   | Goal                         |
| ------- | ---------------------------- |
| Phase 1 | Fix runtime bugs             |
| Phase 2 | Remove Vuex direct mutations |
| Phase 3 | Extract RFID composables     |
| Phase 4 | Add service layer            |
| Phase 5 | Introduce TanStack Query     |
| Phase 6 | Full Vue 3 modularization    |
