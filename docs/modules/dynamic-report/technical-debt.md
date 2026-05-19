# Performance Risks

## 1. input_sql N+1 queries

Each parameter can trigger DB call

---

## 2. query_string is unvalidated SQL

Risk: slow or unsafe queries

---

## 3. No pagination in categories/queries

Can grow indefinitely

---

## 4. Builder return inconsistency

getQueriesByCategory() returns Builder, not Collection

---

## 5. Alias usage in Eloquent

report_categories as rc breaks ORM conventions

---

## 6. Field ordering not guaranteed

No ORDER BY or sort index