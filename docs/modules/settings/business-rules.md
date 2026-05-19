# Settings Module — Business Rules

## 1. Announcements Rules

### Multilingual model
- Every text field exists in EN / RU / KZ
- No runtime translation system
- Frontend decides locale display

---

### Visibility logic (NOT enforced in DB)
- Active if:
  start_date ≤ today ≤ end_date

⚠️ This rule is not enforced in SQL layer

---

### Time scheduling
- start_time / end_time define daily window
- No backend enforcement exists

---

### Audit rules
- created_by → required on insert
- edited_by → updated on every modification
- Names resolved from employee table dynamically

---

### Image handling
- Stored as string path/URL
- No validation in model layer

---

### Deletion rules
- Hard delete only
- No recovery mechanism

---

## 2. Video Rules

- Supports dual link system:
  - link (direct)
  - embed_link (iframe)
- Ordered by creation date ASC
- No audit tracking

---

## 3. Data Consistency Rules

- Cross-schema dependency required (dbmaster)
- Missing employee → null author fields
- Missing user_card → broken audit chain

---

## 4. Critical Behavioral Constraints

- Ordering is inconsistent in announcements (missing ORDER BY)
- SQL-level computation defines API shape
- No domain service layer exists