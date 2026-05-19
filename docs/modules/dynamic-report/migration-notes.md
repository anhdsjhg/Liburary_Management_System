# Migration Strategy

## Step 1 — Freeze backend behavior

Do NOT change:
- query_string execution
- input_sql execution
- table schemas

---

## Step 2 — Build typed API layer

Wrap all endpoints in Axios services

---

## Step 3 — Introduce transformers

- normalize null values
- map parameters safely
- sanitize values for UI

---

## Step 4 — Replace dynamic UI binding

v_component → registry map (NOT dynamic strings)

---

## Step 5 — Separate UI state

Pinia only for:
- selected report
- form state
- navigation steps

---

## Step 6 — Introduce caching

- categories → long cache
- config → medium cache
- results → no cache