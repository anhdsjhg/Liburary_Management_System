````md
# Service Desk Module — Production Documentation

## Overview

The Service Desk module is the operational core of the circulation system.

It manages:
- patron lookup
- book checkout
- book return
- loan renewal
- RFID workflows
- reservation handling
- overdue penalties
- circulation comments
- loan history

This module contains the highest concentration of operational business logic in the application.

---

# Module Structure

```text
Service/
├── Comments.vue
├── EditDuration.vue
├── Penalty.vue
├── Renew.vue
├── UserReserveList.vue
└── Service.vue
````

---

# Architecture Summary

| Area             | Description                               |
| ---------------- | ----------------------------------------- |
| UI Pattern       | Modal-driven operational workflows        |
| State Management | Vuex + local component state              |
| Communication    | Props, callbacks, event bus               |
| API Layer        | Direct `$http` calls inside components    |
| RFID Integration | Embedded directly into UI logic           |
| Modal System     | `showModal()` mixin                       |
| Notifications    | `message_success`, `message_error` mixins |

---

# Core Operational Flows

## Checkout Flow

```text
Barcode/RFID Scan
    ↓
Inventory Search
    ↓
Reservation Validation
    ↓
Book Selection
    ↓
RFID Activation
    ↓
Checkout API
    ↓
Refresh Patron State
```

---

## Return Flow

```text
RFID Scan
    ↓
Book Lookup
    ↓
Return API
    ↓
RFID Deactivation
    ↓
Refresh Patron State
```

---

## Renewal Flow

```text
Select Loan
    ↓
Enter Duration
    ↓
Renew API
    ↓
Refresh Patron State
```

---

# Component Documentation

---

# Service/Comments.vue

## Purpose

Modal form used to edit librarian comments attached to a loan transaction.

---

## Responsibilities

* Display existing comments
* Allow inline comment editing
* Persist comments through API
* Trigger parent refresh after save

---

## Props

| Prop      | Type       | Description             |
| --------- | ---------- | ----------------------- |
| `info`    | `Object`   | Loan object             |
| `getInfo` | `Function` | Parent refresh callback |

---

## API

### Update Comment

```http
POST service/comments/update
```

Payload:

```json
{
  "comments": "Updated note",
  "loan_id": 123
}
```

---

## Known Issues

### Missing Modal Close

Modal remains open after successful save.

Recommended fix:

```js
this.$emit('close')
```

---

### Null Initialization Risk

Current initialization:

```js
comment: this.info.comments
```

Recommended:

```js
comment: this.info.comments || ''
```

---

## Migration Notes

Recommended extraction:

```ts
useUpdateComment()
```

Replace callback prop with:

```js
this.$emit('saved')
```

---

# Service/EditDuration.vue

## Purpose

Allows librarians to modify checkout duration before final loan issuance.

Supports:

* duration in days
* fixed due date

---

## Responsibilities

* Edit loan duration
* Convert due date into duration
* Synchronize due date and duration values
* Close modal after update

---

## Props

| Prop   | Type     | Description       |
| ------ | -------- | ----------------- |
| `info` | `Object` | Loan being edited |

---

## Current Behavior

The component mutates the parent object directly:

```js
this.info.duration = duration
this.info.due_date = dueDate
```

---

## Known Issues

### Direct Prop Mutation

Violates Vue unidirectional data flow.

Recommended replacement:

```js
this.$emit('duration-changed', {
  duration,
  due_date
})
```

---

### Date Difference Risk

Current calculation may produce off-by-one errors.

Recommended replacement:

```ts
differenceInCalendarDays()
```

from `date-fns`.

---

## Hidden Business Logic

Supports two librarian workflows:

* relative duration (`14 days`)
* exact return date (`March 15`)

---

## Migration Notes

Suggested composable:

```ts
useLoanDuration()
```

---

# Service/Penalty.vue

## Purpose

Displays and manages overdue penalties for patrons.

---

## Responsibilities

* Display penalty information
* Display overdue loan details
* Activate penalties
* Cancel penalties
* Transform API CSV data

---

## Props

| Prop           | Type       | Description             |
| -------------- | ---------- | ----------------------- |
| `penalty`      | `Object`   | Penalty metadata        |
| `penalty_loan` | `Array`    | Related overdue loans   |
| `getInfo`      | `Function` | Parent refresh callback |

---

## API

### Activate Penalty

```http
POST service/set_penalty/
```

### Cancel Penalty

```http
POST service/cancel_penalty/
```

---

## Known Runtime Bugs

### Missing `closeModal()`

Close button references undefined method.

Required fix:

```js
closeModal() {
  this.$emit('close')
}
```

---

### Missing `X` Component

Close icon component is referenced but not imported.

---

### Prop Mutation Reopen Failure

The component mutates prop objects destructively.

Reopening the modal may cause:

```text
TypeError: split is not a function
```

---

## Recommended Refactor

Clone before transformation:

```js
structuredClone(props.penalty_loan)
```

---

## Migration Notes

Suggested utilities:

```ts
parsePenaltyLoans()
usePenaltyActions()
```

---

# Service/Renew.vue

## Purpose

Handles loan renewal operations.

---

## Responsibilities

* Accept renewal duration
* Validate renewal limit
* Submit renewal request
* Refresh parent state
* Close modal

---

## Props

| Prop       | Type       | Description             |
| ---------- | ---------- | ----------------------- |
| `item`     | `Object`   | Loan record             |
| `user_cid` | `String`   | Patron ID               |
| `getInfo`  | `Function` | Parent refresh callback |

---

## API

### Renew Loan

```http
POST service/media/renew
```

---

## Vuex Dependencies

```js
$store.getters.user.duration
```

Used as maximum allowed renewal duration.

---

## Known Issues

### Modal Closes on Failure

`$emit('close')` executes inside `finally()`.

Result:

* modal closes even if API fails

Recommended fix:

* emit close only after successful renewal

---

### Vestigial RFID Error Suppression

Current logic suppresses:

```js
if(e.message != 'rfid problem')
```

No RFID operations occur in this component.

---

## Migration Notes

Suggested composable:

```ts
useRenewLoan()
```

---

# Service/UserReserveList.vue

## Purpose

Displays reservation queue for a library item.

---

## Responsibilities

* Display reserved users
* Display reservation dates
* Render reservation table

---

## Props

| Prop   | Type    | Description      |
| ------ | ------- | ---------------- |
| `info` | `Array` | Reservation data |

---

## Known Issues

### Unsafe Array Access

Current template:

```js
info[0].users
```

May crash on empty arrays.

Recommended guard:

```vue
v-if="info && info.length"
```

---

### Data Shape Mismatch

The component accepts an array but renders only:

```js
info[0]
```

Recommended:

* convert prop to single object

---

## Migration Notes

Recommended improvements:

* defensive rendering
* typed props
* shared table component

---

# Service/Service.vue

## Purpose

Primary circulation workflow controller.

Handles:

* checkout
* return
* renewal
* RFID operations
* penalties
* reservations
* patron circulation history

---

## Responsibilities

### Checkout

* barcode scanning
* RFID scanning
* reservation checks
* checkout execution

### Return

* RFID return workflow
* manual returns

### Loan Management

* renewal
* comment editing
* due date editing
* penalties

### Patron State

* active loans
* loan history
* penalty state

---

## Architecture Classification

GOD Component

Contains:

* 15+ methods
* 9 API endpoints
* RFID integration
* event bus communication
* modal orchestration
* multiple operational workflows

---

## Major Dependencies

| Dependency     | Purpose                            |
| -------------- | ---------------------------------- |
| `readFromRfid` | RFID operations                    |
| `showModal`    | Modal handling                     |
| `$eventHub`    | Cross-component refresh            |
| Vuex           | Permissions and librarian identity |
| `$confirm()`   | Reservation warnings               |

---

## API Surface

| Endpoint                                | Purpose           |
| --------------------------------------- | ----------------- |
| `GET service/user/{type}/{id}`          | Patron data       |
| `GET service/media/search/by-inventory` | Inventory search  |
| `GET /service/media/reserve_list`       | Reservation queue |
| `POST service/media/give`               | Checkout          |
| `POST service/media/back`               | Return            |
| `POST service/media/renew`              | Renewal           |
| `POST service/comments/update`          | Comments          |
| `POST service/set_penalty/`             | Activate penalty  |
| `POST service/cancel_penalty/`          | Cancel penalty    |

---

## Critical Risks

### Sequential Checkout Loop

Books are checked out sequentially:

```js
for (...) {
  await POST()
}
```

Risks:

* slow batch checkout
* partial failure state
* inconsistent circulation data

Recommended:

* batch endpoint
* `Promise.allSettled()`

---

### RFID Race Condition

RFID reads may complete after search execution.

Result:

* empty search results
* inconsistent scan workflow

---

### Duplicate Reservation Requests

Reservation lookup executes multiple times during checkout flow.

---

### Blocking Confirmation Loop

Sequential modal confirmations interrupt workflow repeatedly.

---

### Event Bus Coupling

Current implementation:

```js
$eventHub.$emit('selectRefresh')
```

creates hidden runtime dependencies.

---

## Hidden Business Logic

### RFID Permission Bypass

Permission:

```text
service-checkout-no-rfid
```

allows bypassing RFID validation.

---

### Reservation Warnings Are Informational

Reservation dialogs do not block checkout.

---

### Duplicate Scan Deduplication

Books are deduplicated by:

```js
inv_id
```

before checkout.

---

## Recommended Future Architecture

### Suggested Decomposition

```text
ServiceDesk.vue
 ├── LoanIssuance.vue
 ├── LoanReturn.vue
 ├── LoanHistory.vue
 ├── RFIDWorkflow.vue
 ├── ReservationWarnings.vue
 └── PenaltyPanel.vue
```

---

## Suggested Composables

### Loan Operations

```ts
useLoanService()
```

### Checkout Workflow

```ts
useCheckout()
```

### RFID Integration

```ts
useRfidWorkflow()
```

### Permission Logic

```ts
usePermissions()
```

---

## Migration Priority

CRITICAL

This component contains the most operationally sensitive logic in the application.

Migration must be incremental and heavily tested.

---

# Service Desk Architecture Summary

## Current State

The module combines:

* circulation workflows
* RFID hardware
* reservation policy
* penalties
* patron history
* permission enforcement

inside a single operational boundary.

---

## Main Risks

| Risk                        | Severity |
| --------------------------- | -------- |
| Partial checkout failure    | Critical |
| RFID sequencing race        | Critical |
| Sequential API loops        | High     |
| Event bus dependencies      | High     |
| Prop mutation patterns      | Medium   |
| Modal close inconsistencies | Medium   |

---

## Strategic Recommendation

Recommended migration order:

1. Fix runtime bugs
2. Introduce service layer
3. Extract composables
4. Replace event bus
5. Split operational domains
6. Migrate to Vue 3 + Pinia

```
```
