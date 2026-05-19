# Vuex Store Architectural Analysis — SDU Library Management System (Legacy Frontend)

---

## 0. Context

This document is a deep reverse-engineering analysis of the existing Vuex store in a legacy Vue 2 frontend.

It is part of a full frontend rewrite to:

- Vue 3
- TypeScript
- Pinia
- TanStack Query
- Axios
- Tailwind CSS
- PrimeVue

### Core Constraint
- Backend MUST NOT be changed
- Only frontend architecture is being redesigned
- API behavior remains identical

---

# 1. GLOBAL STORE ARCHITECTURE OVERVIEW

## 1.1 Structure

The Vuex store is implemented as a **single flat global store**.

There is:
- no module separation (`modules: {}` is not used)
- no namespacing (`namespaced: true` is absent)
- no domain isolation

All state is defined in one monolithic `state.ts`.

---

## 1.2 Architectural Classification

The store is a **hybrid anti-pattern structure**:

It mixes:
- domain state (e.g. `batches`, `cataloging`)
- UI state (e.g. `searching`, `fullPageLoading`)
- API state (e.g. request objects inside state)
- pagination + filtering + sorting logic

👉 There is no clear separation between:
- UI layer
- domain layer
- data layer

---

## 1.3 Key Structural Issue

The store acts as a **global reactive database**, not a structured state manager.

Any component can:
- read any state
- mutate any state via `setStore`
- overwrite any domain slice

This removes encapsulation completely.

---

# 2. MODULE / DOMAIN BREAKDOWN (LOGICAL GROUPING)

Even though no Vuex modules exist, the system can be logically divided into domains.

---

## 2.1 Authentication Domain

### State:
- `user`
- `access_token` (via getter + localStorage)
- `fullPageLoading`

### Responsibilities:
- authentication session
- global loading indicator

### Issues:
- dual source of truth (`state.user.access_token` + `localStorage`)
- UI state mixed with auth state

---

## 2.2 Acquisitions Domain

### Entities:
- batches
- acts
- items
- publishers
- suppliers
- print_barcode

### Responsibilities:
- CRUD table data
- pagination
- filtering
- sorting
- search state

### Critical Issue:
Every entity follows identical structure:

- `data`
- `search.add_options`
- `sorting_fields`
- `sort_by`
- `page`
- `per_page`
- `pagination`

👉 This pattern is duplicated 6+ times with no abstraction.

---

### Severe Anti-patterns:
- API request config stored in state (`request: {}`)
- server + UI state merged in same object
- full dataset + paginated dataset both stored (`all + data`)

---

## 2.3 Reports Domain

### Entities:
- most_read
- books_history
- ksu
- periodicals
- shelves
- dynamic_reports
- not_found_books

### Responsibilities:
- reporting views
- statistical data
- export-like datasets

### Critical Issues:

#### 1. Embedded HTTP Layer in State
Some slices contain:

```js
request: {
  link,
  mode,
  body
}

👉 This means Vuex is partially acting as an HTTP client config store.

2. Inconsistent Domain Maturity
ksu, periodicals → full-featured slices
form2 → nearly empty slice
dynamic_reports → single value state

👉 This shows inconsistent design evolution across features.

2.4 Service Desk Domain
State:
users
heads
Responsibilities:
user management
service desk operations
Issues:
multiple datasets in same slice
unclear relationship between users and heads
2.5 Cataloging Domain
State:
cataloging
Responsibilities:
search bibliographic records
store active record (id, type, image)
manage filters (genre, language, batch, etc.)
Critical Issue:

This slice mixes:

list state (search results)
detail state (selected record)

👉 These should be separated into:

list query state
entity detail state
2.6 Website CMS Domain
State:
website
announcements
Responsibilities:
public website content management
multilingual CMS
homepage configuration
Key Issues:
1. Deep nesting based on API shape
state mirrors backend response directly
2. Mixed concerns:
UI state (fetched)
content state
localization (en/ru/kz embedded everywhere)
2.7 Admin Domain
State:
admin
admin_module
Responsibilities:
role-based access control
user permission management
module/tabs configuration
Issues:
UI navigation logic stored with data records
permissions mixed with entity lists
3. DATA FLOW ARCHITECTURE
3.1 Intended Flow
API → Component → setStore → Vuex state → Getter → UI
3.2 Actual Flow (Reality)
Component directly calls API (axios)
        ↓
Component dispatches setStore
        ↓
setStore writes directly into state
        ↓
UI reacts via getters
3.3 Critical Architectural Problem
Vuex is NOT the data orchestrator

Instead:

components own API logic
store is only a reactive container

👉 This breaks:

centralized error handling
caching strategy
request deduplication
loading state consistency
4. API COUPLING ANALYSIS
4.1 Observation

There are NO API calls inside Vuex store.

This means:

store is NOT a data layer
store is NOT an orchestration layer
4.2 Consequence

API logic is:

scattered across all components
inconsistent between features
not reusable
4.3 Resulting Anti-pattern

Vuex store = global state dump

Not:

state manager
not API layer
not domain layer
5. CRITICAL ARCHITECTURAL PROBLEMS
5.1 System-level Issues
No module architecture
No domain boundaries
No separation of concerns
No typed mutations enforcement
5.2 State Design Issues
duplicated table state everywhere
inconsistent entity structures
mixed UI + server state
request objects stored in Vuex
5.3 Behavioral Issues
setStore allows arbitrary mutation of any state
bypasses Vuex mutation system entirely
breaks traceability of state changes
5.4 Data Consistency Issues
token exists in both localStorage and Vuex
all vs data duplication
partial feature slices (form2, dynamic_reports)
6. MIGRATION READINESS MAP
6.1 TanStack Query Candidates (Server State)

ALL of the following must move to TanStack Query:

batches
acts
items
publishers
suppliers
reports (all)
users
cataloging lists
announcements
admin_module

👉 Reason:
These are server-cacheable datasets.

6.2 Pinia Candidates (Client State)
user (auth)
theme
fullPageLoading
UI modals
sidebar state
permissions (static config)
active record state (cataloging detail)
6.3 Must Be Removed / Refactored
setStore global mutation system
request objects in Vuex state
dual token storage system
duplicated table state per module
6.4 Shared Abstractions Needed
1. useTableState composable

Replace:

pagination
sorting
filtering
search state duplication
2. API service layer (Axios)

Centralized:

interceptors
error handling
token injection
7. FINAL ARCHITECTURAL CONCLUSION

This Vuex store is not a state management system in modern terms.

It is:

a global reactive data container with mixed responsibilities and no domain boundaries.

8. REWRITE STRATEGY IMPLICATION

The rewrite MUST follow:

Remove Vuex completely
Replace server state with TanStack Query
Replace client state with Pinia
Extract table logic into composables
Introduce strict domain separation