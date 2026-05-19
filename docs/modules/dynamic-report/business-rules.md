# Business Rules

## 1. Reports are database-driven

No hardcoded report logic exists in frontend.

---

## 2. SQL is stored as string

query_string is executed as-is.

No validation layer exists.

---

## 3. Parameters are dynamic

- input_sql defines dropdown values
- param_type defines input behavior
- v_component defines UI rendering

---

## 4. Active flag controls visibility

is_active = 1 → visible
is_active = 0 → hidden

---

## 5. Field order is NOT guaranteed

No sort_order column exists.

---

## 6. Category is hierarchical

parent_id builds tree structure in UI only.