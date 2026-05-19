# Settings Module — API Contract

## 1. Announcements API

### GET /api/settings/announcements

Returns full announcement list.

Includes:
- multilingual fields
- resolved created_by / edited_by
- date + time scheduling fields

⚠️ Ordering is NOT guaranteed (ORDER BY commented out)

---

### POST /api/settings/announcements

Creates new announcement.

Required:
- title_* fields
- date range
- created_by (set in controller)

---

### PUT /api/settings/announcements/{id}

Update via ManageBuilder abstraction.

⚠️ Risk: uses aliased PK (`a.announcement_id`)

---

### DELETE /api/settings/announcements/{id}

Hard delete (no soft delete).

---

### GET /api/settings/announcements/types

Returns announcement_types table (schema unknown).

---

## 2. Video API

### GET /api/settings/video

Returns:
- title (all locales)
- link + embed_link
- create_date

Ordered ASC by create_date (oldest first)

---

### POST / PUT / DELETE

Standard CRUD via ManageBuilder pattern.

---

## 3. Response Characteristics

- No API Resource layer (raw SQL projection)
- No DTO validation at response level
- Cross-db fields included inline (employee names)