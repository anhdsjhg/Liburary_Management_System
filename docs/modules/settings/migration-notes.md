# Settings Module — Migration Notes

## 1. Backend Must NOT Change (initial phase)

- table schema
- column names
- ManageBuilder behavior
- multilingual field structure
- API routes

---

## 2. Required Backend Improvements (safe refactor)

### Replace correlated subqueries → JOINs
- employee resolution must be JOIN-based
- reduces DB load significantly

---

### Add API Resources layer
- decouple DB schema from API response
- stabilize frontend contract

---

### Restore deterministic ordering
- add explicit ORDER BY (created_date / start_date)

---

## 3. Frontend Migration Strategy

### Phase 1 — Parallel system
- build Vue 3 + TQ version alongside legacy

### Phase 2 — Strangler pattern
- route-by-feature toggle

### Phase 3 — Cutover
- remove legacy views

---

## 4. Risk Areas

- announcements ordering
- multilingual field consistency
- cross-db employee dependency
- raw SQL response coupling

---

## 5. Golden Rule

Backend must continue returning **identical JSON shape** until frontend migration is complete.