# Reports / Book History

## Overview
Library circulation tracking system:
- Book search
- Borrow history
- Per-book transaction drill-down
- User-level borrowing details

---

## Architecture
- Type: Domain Controller (heavy Vuex coupling)
- State: Vuex-driven search + local modals
- Complexity: High

---

## API
- GET `/book-history/types` ⚠️ (unused result)
- GET `/book-history/statuses`
- GET `/book-history/users/{id}`

---

## Key Features
- Advanced search (multi-field)
- Expandable filters
- Row-level drill-down
- Nested modal system:
  - BooksHistory → Accounts → Account

---

## Vuex Coupling
High (11 mutations via v-model):
- barcode
- id
- author
- title
- borrow_date
- due_date
- delivery_date
- status

---

## Mixins
- getResults
- reset
- showModal
⚠️ `message_error` not reliably declared

---

## Known Issues
- `.catch().then()` incorrect order (runtime bug)
- Dead API call: `/types`
- Dead state: `types[]`
- 11 direct Vuex mutations
- Advanced search always active in DOM
- Prop mutation via sort()
- Missing error mixin declaration

---

## Business Logic
- Status mapping:
  - issued → orange
  - returned → green
  - other → red
- Hidden advanced search always included in query

---

## Risks
- Runtime crash from incorrect promise chain
- State pollution via Vuex direct mutation
- Modal dependency chain complexity
- Dead API traffic on every mount

---

## Migration Notes
- Replace Vuex v-model with local reactive state
- Remove unused `/types` API call
- Introduce composables:
  - `useBooksHistory()`
  - `useBookTransactions()`
- Fix promise chaining