# Performance & Technical Risks

## 1. N+1 query problem

Caused by `$appends`:

- user_cid
- is_admin
- email
- edu_level_type

Result: up to 200+ queries per list request

---

## 2. wm_concat usage

- deprecated Oracle function
- returns comma-separated string
- must be replaced with LISTAGG

---

## 3. Cross-schema coupling

Direct dependency on dbmaster schema

Risk:
- ERP changes break library system silently

---

## 4. getaddress() function

- black-box stored procedure
- unknown performance cost
- no schema visibility

---

## 5. Locale-sensitive Oracle functions

- TO_CHAR(day/month)
- NEXT_DAY()

Risk:
- UI language breaks depending on DB locale

---

## 6. No caching

- isAdmin()
- permission checks

All executed per request