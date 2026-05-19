# Core Entities

## 1. lib_user_cards (MAIN ENTITY)

Bridge between ERP and library system.

### Fields:
- user_cid → canonical ID (library identity)
- stud_id → student reference (nullable)
- emp_id → employee reference (nullable)
- is_active → library access state
- attempt_count → brute force protection
- attempt_date → lock timestamp
- psw → library password (NOT ERP password)

---

## 2. Student (dbmaster.students)

Read-only ERP entity.

Used for:
- authentication
- profile display
- reporting

---

## 3. Employee (dbmaster.employee)

Same structure as Student but for staff.

---

## 4. WebLog

Login audit table:

- login status
- IP address
- device
- timestamp

---

## 5. Image (dbmaster.view_userphoto)

Read-only view:

- stores user photo
- exposed as `image` field
- no write operations allowed

---

## 6. External tables

Used for enrichment:

- departments
- programs
- contacts
- edu_levels
- penalties
- loans