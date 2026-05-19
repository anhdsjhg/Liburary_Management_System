# Technical Debt (Extended)

## 1. SQL Complexity

Heavy use of:

- correlated subqueries
- per-row execution patterns
- nested SELECT inside SELECT

---

## 2. Performance Bottlenecks

- availability computed per row
- publisher/language resolved per row
- author aggregation per row

---

## 3. OR Join Anti-pattern

```sql
av.book_id = i.book_id
OR av.disc_id = i.disc_id
OR av.j_issue_id = i.j_issue_id