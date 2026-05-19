# Navigation Flow Analysis — Vue Router

---

## 1. Application Entry Flow

/admin/
→ /acquisitions
→ /acquisitions/batches

Default landing page is hardcoded.

---

## 2. Navigation System Type

The system uses:

- Tab-based navigation
- Domain grouping via router meta
- Vuex-driven dynamic tabs

---

## 3. Cross-Domain Navigation Pattern

Navigation is handled via:

- `goTo` mixin
- route `name` based navigation

---

## 4. Dynamic Report Flow

Category selection
→ store.dynamic_reports.category_id
→ navigate to reports
→ navigate to single report

### Problem:

- State stored in Vuex instead of route params
- Breaks deep linking

---

## 5. Website Edit Flow

/n_a → list
→ /n_a/edit (query params carry state)

### Problem:

- URL behaves like state container
- Not RESTful navigation

---

## 6. Shelves Shared State Problem

/report/shelves
/service/shelves

Same component + same Vuex slice

→ context collision risk
