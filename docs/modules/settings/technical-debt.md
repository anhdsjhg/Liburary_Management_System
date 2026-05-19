# Settings Module — Technical Debt

## 1. Critical Issues

### ❌ Correlated subqueries (Announcements)
- 2 nested queries per row
- creates N×2 execution cost
- major performance bottleneck

---

### ❌ Missing ORDER BY (Announcements)
- result order undefined
- breaks pagination consistency

---

### ❌ Cross-schema dependency
- dbmaster.employee required
- system fails if external schema unavailable

---

### ❌ No soft delete
- irreversible data removal
- no audit recovery

---

## 2. Medium Risk Issues

### SELECT *
- announcement_types structure unknown
- API may break silently

### Boolean-only error handling
- ManageBuilder returns bool
- no exceptions propagated

### Aliased primary key usage
- a.announcement_id may break raw SQL execution

---

## 3. Architecture Issues

- No service layer (logic inside models)
- No API Resource layer (raw DB → API)
- No domain separation

---

## 4. Performance Risks

- N+1 at SQL level (employee resolution)
- cross-db joins per row
- no caching of resolved names

---

## 5. Consistency Risks

- Video module lacks audit fields
- Announcements have audit fields
- inconsistent module design