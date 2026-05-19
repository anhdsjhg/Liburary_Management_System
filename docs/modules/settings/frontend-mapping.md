# Settings Module — Frontend Mapping

## 1. Server State (TanStack Query)

### Announcements

- Key: ['settings', 'announcements']
- staleTime: 5 minutes
- invalidation: after any mutation

### Video

- Key: ['settings', 'video']
- staleTime: 5 minutes

### Types

- Key: ['settings', 'announcements', 'types']
- staleTime: Infinity

---

## 2. Pinia State (UI ONLY)

Allowed:
- selectedAnnouncementId
- form open/close state
- active locale (en/ru/kz)
- form mode (create/edit)

❌ NOT allowed:
- announcements list
- video list
- computed server data

---

## 3. API Layer

Direct Axios mapping:

- GET /announcements
- POST /announcements
- PUT /announcements/:id
- DELETE /announcements/:id
- GET /video

---

## 4. TypeScript Model

- Announcement = full DB projection
- VideoContent = simple DTO
- Locale fields remain raw (no transformation in backend)

---

## 5. UI Behavior Rules

- Frontend handles:
  - locale switching
  - filtering active announcements
  - formatting time windows

- Backend provides:
  - raw data only