# Settings Module — Backend Flow

## 1. Read Flow (Announcements)

1. Controller receives request
2. Calls `Announcements::defaultQuery()`
3. Oracle executes:
   - main announcements table
   - + 2 correlated subqueries per row (created_by, edited_by)
4. Results returned as collection
5. JSON response sent to frontend

⚠️ Performance issue: N+1 SQL pattern at DB level

---

## 2. Create Flow

1. POST request hits controller
2. Data validated externally
3. Model `create()` executed
4. Transaction begins
5. Record inserted
6. Commit

⚠️ created_by must be injected manually in controller

---

## 3. Update Flow

Uses:
- ManageBuilder::updateBuilder()

Key concern:
- PK is passed as `a.announcement_id`
- Must be compatible with standalone UPDATE query

---

## 4. Delete Flow

Uses:
- ManageBuilder::deleteBuilder()

Hard delete:
- No soft delete mechanism
- No audit retention

---

## 5. Video Flow

Simpler pipeline:
- No correlated subqueries
- Direct CRUD via Eloquent + ManageBuilder
- Ordered by create_date ASC

---

## 6. Cross-DB Resolution

created_by / edited_by:

announcements → lib_user_cards → dbmaster.employee

Executed at query time (not cached, not denormalized)