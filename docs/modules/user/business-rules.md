# Business Rules

## 1. Single identity rule

Each user_cid belongs to only:
- Student OR Employee (never both)

---

## 2. ERP is source of truth

Library system NEVER modifies:
- name
- email
- department
- program

---

## 3. Status priority system

Debt > Penalty > Inactive > OK

---

## 4. Admin logic

No admin column exists.

Admin = existence of module_user record.

---

## 5. Login security

- attempt_count tracks failed logins
- lock logic is backend-only (not shown here)

---

## 6. Email rule

Email is NOT stored in user table.

It is fetched dynamically from:

dbmaster.university_mail