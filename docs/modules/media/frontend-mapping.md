# Frontend Mapping (Extended)

## 1. Server State Layer

Use TanStack Query for ALL backend data:

- media list
- media detail
- loans
- most-read

---

## 2. API Services

Axios wrappers per domain:

- /media
- /media/{id}
- /loans/*
- /journal-issues/*

---

## 3. State Separation Rule

### Pinia (ONLY UI state)

- filters
- search input
- active media type

---

### Forbidden in Pinia

- availability
- loan data
- backend-calculated totals
- reserves

---

## 4. Multi-location handling

Frontend must:

- group by media id
- merge sigle_type rows
- aggregate availability manually

---

## 5. Caching Strategy

- list → 60s
- detail → 120s
- loans → 30s
- stats → 300s

---

## 6. Type System

Discriminated union:

BK / VM / MX / CF / MP / MU / CR

Mapped to UI components via registry.