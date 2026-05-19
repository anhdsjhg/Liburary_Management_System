# Reports/Shelves/README.md

## Purpose

Shelf-reading and inventory comparison tool.

Features:

* call number search
* TXT export
* Excel export
* file comparison
* discrepancy detection

---

## Architectural Complexity

This component combines:

* reporting
* exports
* file uploads
* multipart requests
* browser-side file generation
* async file downloads

inside a single component.

---

## Critical Problems

### TXT Header Mismatch

Header:

```txt
id;title;author
```

Body:

```txt
barcode;title;callnumber
```

Data contract inconsistency.

---

### Axios Bypass

Uses:

```js
fetch(url)
```

instead of centralized HTTP client.

Risks:

* auth inconsistency
* interceptor bypass
* duplicated download logic

---

### Possible Missing Mixin Method

`print_txt_file()` requires verification.

---

## Recommendations

* centralize file download logic
* split file comparison into composable
* remove orphan `$emit('close')`
* normalize TXT export schema

---

# Global Reporting System Architecture

## Shared System Problems

| Problem                  | Severity |
| ------------------------ | -------- |
| Direct Vuex mutation     | CRITICAL |
| Missing error handling   | HIGH     |
| Dead imports             | MEDIUM   |
| Global utility functions | HIGH     |
| Prototype extensions     | HIGH     |
| Mixed responsibilities   | HIGH     |
| Repeated constants       | MEDIUM   |

---

## Recommended Global Migration

### Step 1 — Stabilization

* fix runtime bugs
* add `.finally()` everywhere
* normalize error handling

### Step 2 — API Layer

Create:

```txt
/api/reports/
```

---

### Step 3 — Query Layer

Introduce:

* TanStack Query
* composables
* isolated mutations

---

### Step 4 — Store Migration

Move:

Vuex → Pinia

while eliminating direct mutations.

---

## Target Future Stack

| Layer      | Technology             |
| ---------- | ---------------------- |
| State      | Pinia                  |
| API        | Axios modules          |
| Query      | TanStack Query         |
| Tables     | Virtualized Vue tables |
| Exports    | Shared export service  |
| Validation | Zod                    |
| Typing     | TypeScript             |

---

## Final Production Readiness Assessment

| Area                 | Status |
| -------------------- | ------ |
| Feature completeness | HIGH   |
| Stability            | MEDIUM |
| Maintainability      | LOW    |
| Scalability          | LOW    |
| Vue 3 readiness      | MEDIUM |
| Refactor complexity  | HIGH   |

---