# Frontend Mapping (Vue 3)

## Architecture rule

Backend defines structure
Frontend only renders it

---

## State separation

### TanStack Query (server state)
- categories
- queries
- fields
- parameters
- results

### Pinia (UI state)
- selectedCategory
- selectedQuery
- formValues
- step navigation

---

## Component mapping

v_component → Vue component registry

NEVER use raw dynamic component binding