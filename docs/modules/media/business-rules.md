# Business Rules (Extended)

## 1. Availability Rules

A copy is AVAILABLE only if:

- status != 0
- TAG_INITIALIZED = 1
- TAG_PRINTED = 1
- no active loan exists (locked = 0)

---

## 2. Inventory Behavior

Each inventory row represents:

→ one physical item
→ linked to exactly one media type

---

## 3. Multi-location Rule

One book can exist in multiple:

- sigle_type (locations)

Result:

→ duplicated rows per location in query output

---

## 4. Loan State Machine

Derived status:

- issued
- overdue
- returned
- returned/overdue

Ordering prioritizes overdue loans.

---

## 5. Reservation Rule

Only latest reservation is considered:

ORDER BY lib_reserve_id DESC + ROWNUM = 1

---

## 6. Author Formatting Rule

Authors are concatenated as:

name || surname

⚠ No separator → legacy formatting issue