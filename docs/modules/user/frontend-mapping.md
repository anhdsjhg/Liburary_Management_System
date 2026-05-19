# Frontend Migration Mapping

## Architecture rule

Backend = source of truth
Frontend = renderer only

---

## API layer (Axios)

All requests go through:

src/api/user.api.ts

NEVER call axios in components.

---

## State separation

### TanStack Query (server state)
- users list
- profile
- stats
- photo

### Pinia (client state)
- filters
- auth token
- UI state

---

## Critical types

User is DISCRIMINATED UNION:

Student | Employee

---

## Data transformation rules

- wm_concat → split(',') → string[]
- status → enum mapping
- null-safe fields required

---

## Cache strategy

- list: 5 min
- profile: 10 min
- photo: 30 min
- stats: 15 min