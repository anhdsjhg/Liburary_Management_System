# Reports Module — Production Documentation Bundle

> Production-ready internal documentation for the `Reports/` and `DynamicReports/` folders.
> Intended for `/docs` usage inside VS Code.

---

# DynamicReports/README.md

## Overview

`DynamicReports/` is a configurable reporting subsystem that allows administrators and users to:

* Select report categories
* Browse report definitions
* Execute configurable SQL-backed reports
* Apply typed parameters dynamically
* Export result sets to Excel

The module acts as a dynamic query execution engine driven by backend metadata.

---

## Folder Structure

```txt
DynamicReports/
├── Categories.vue
├── Reports.vue
├── SingleReport.vue
└── Form2.vue
```

---

## Component Responsibilities

| Component          | Responsibility                            |
| ------------------ | ----------------------------------------- |
| `Categories.vue`   | Entry point and category selector         |
| `Reports.vue`      | Displays reports inside selected category |
| `SingleReport.vue` | Executes configurable dynamic reports     |
| `Form2.vue`        | Regulatory/statutory acquisition report   |

---

## Architectural Characteristics

### Current Architecture

The module currently mixes:

* UI rendering
* API orchestration
* direct Vuex state mutation
* DOM manipulation
* business logic
* export handling

inside single-file Vue components.

### Risk Level

| Area                  | Risk   |
| --------------------- | ------ |
| Dynamic DOM rendering | HIGH   |
| Recursive timers      | HIGH   |
| Vuex direct mutation  | HIGH   |
| Error handling gaps   | HIGH   |
| i18n inconsistencies  | MEDIUM |

---

## Critical Technical Debt

### 1. Direct Vuex Mutation

Pattern:

```vue
v-model="dynamic_reports.category_id"
```

Problems:

* bypasses Vuex mutation tracking
* impossible to audit state changes
* difficult to migrate to Pinia

Recommended migration:

```ts
const categoryId = ref(null)
store.setCategory(categoryId.value)
```

---

### 2. Imperative DOM Rendering (`SingleReport.vue`)

Current implementation:

* `document.createElement`
* `appendChild`
* `innerHTML`
* recursive `setTimeout`

Risks:

* memory leaks
* detached DOM writes
* Vue reactivity bypass
* XSS surface
* impossible SSR compatibility

Production recommendation:

* replace with Vue template rendering
* use `vue-virtual-scroller` for large datasets
* use `textContent` instead of `innerHTML`

---

### 3. Timer Memory Leak

Current bug:

```js
clearInterval(timeoutId)
```

Actual timer type:

```js
setTimeout()
```

Correct implementation:

```js
clearTimeout(timeoutId)
```

---

## API Endpoints

| Endpoint                        | Method | Purpose                   |
| ------------------------------- | ------ | ------------------------- |
| `dynamic_reports/categories`    | GET    | Load report categories    |
| `dynamic_reports/reports`       | GET    | Load reports for category |
| `dynamic_reports/single_report` | GET    | Load report schema        |
| `dynamic_reports/execute`       | POST   | Execute report            |
| `dynamic_reports/export`        | POST   | Export Excel              |
| `form2_report/get`              | POST   | Load Form2 report         |
| `form2_report/export`           | POST   | Export Form2              |

---

## Known Runtime Bugs

| Component          | Bug                                |
| ------------------ | ---------------------------------- |
| `SingleReport.vue` | `clearInterval()` used for timeout |
| `SingleReport.vue` | recursive timer memory leak        |
| `SingleReport.vue` | XSS via `innerHTML`                |
| `Categories.vue`   | loader never resets on API failure |
| `Reports.vue`      | loading race condition             |

---

## Recommended Refactor Plan

### Phase 1 — Stabilization

* add `.catch()` to all requests
* move loading reset into `.finally()`
* fix timeout cleanup
* remove dead imports

### Phase 2 — API Layer

Create:

```txt
/api/dynamicReports.ts
```

Responsibilities:

* all HTTP requests
* response typing
* centralized error handling

---

### Phase 3 — Query Layer

Introduce:

* TanStack Query
* composables
* mutation isolation

Suggested composables:

```txt
useDynamicReportsCategories()
useDynamicReportsList()
useDynamicReport()
useForm2Report()
```

---

### Phase 4 — Store Migration

Replace Vuex mutations with:

* Pinia actions
* local refs
* derived state

---

## Recommended Future Architecture

```txt
components/
composables/
api/
constants/
utils/
types/
```

---

## Security Concerns

### XSS Surface

Unsafe:

```js
td.innerHTML = value
```

Safe:

```js
td.textContent = value
```

---

## i18n Issues

Current issue:

```js
title_en
```

Recommended:

```js
title_${locale}
```

or backend-localized fields.

---

## Production Readiness Status

| Area                      | Status     |
| ------------------------- | ---------- |
| Functionality             | Stable     |
| Architecture              | Legacy     |
| Security                  | Needs work |
| Maintainability           | Low        |
| Vue 3 migration readiness | Medium     |

---