# Settings Module — Entities

## 1. announcements (a)

Core content entity for events and notices.

### Fields
- announcement_id (PK)
- title_en / title_ru / title_kz
- place_en / place_ru / place_kz
- image
- start_date / end_date
- start_time / end_time
- description_en / description_ru / description_kz
- link
- created_by → lib_user_cards.user_cid
- edited_by → lib_user_cards.user_cid
- create_date / edit_date

### Behavior
- Multilingual by design (no runtime translation)
- Time-bounded visibility (not enforced in DB layer)
- Audit fields resolved via cross-schema joins

---

## 2. video_content (v)

Simple media catalog.

### Fields
- video_id (PK)
- title_en / title_ru / title_kz
- link
- embed_link
- create_date

### Behavior
- No audit trail
- No RBAC metadata
- Ordered by creation date

---

## 3. announcement_types

- Lookup table
- Structure not explicitly defined (SELECT *)

---

## 4. External Entities

### lib_user_cards
Maps auth identity:
- user_cid → emp_id

### dbmaster.employee
Stores human-readable names:
- emp_id → name + sname

Used for:
- created_by resolution
- edited_by resolution