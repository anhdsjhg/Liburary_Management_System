Вот готовый **production-ready docs файл** для этого модуля. Можешь сразу копировать в `docs/website_news_announcements.md` или аналогичную папку.

---

# 📁 `docs/website_news_announcements.md`

````md
# News & Announcements Module (Website)

## Overview
This module manages **News & Announcements (N&A)** content for the website.

It supports:
- Multilingual content (EN / RU / KZ)
- Two content types:
  - Announcement (rich text)
  - Event (external link)
- Image upload
- Date/time scheduling
- Inline editing + modal creation
- Ordering and live updates

---

# Components

## 1. `N&A.vue` (Main Admin List)

### Purpose
Main interface for managing all news and announcements.

---

## Features

### List display
Each item includes:
- Index
- Title (based on selected language)
- Date + start time
- Edit toggle
- Delete action

---

## Inline editing (`extend` mode)

Each announcement can be expanded:

### Editable fields:
- Title (EN / RU / KZ)
- Place (EN / RU / KZ)
- Type:
  - `announcement`
  - `event`
- Image upload
- Date / Time fields
- Optional end date/time
- Event link OR rich description

---

## Data behavior

### Multilingual structure:
```json
na[na.editing_lan].title
na[na.editing_lan].place
na[na.editing_lan].description
````

---

## Image handling

* Base64 conversion
* Client-side resizing before save
* Stored in `na.img.data`

---

## Content modes

### Announcement

* Uses Quill rich text editor
* Requires description field

### Event

* Requires external link (`libguide_link`)
* No description field

---

## Metadata fields

Displayed in expanded view:

* create_date
* edit_date
* created_by
* edited_by

---

## Actions

* Add announcement → opens modal (`newAnnouncement.vue`)
* Delete → uses confirmation modal
* Save → triggers `website.save`

---

## API

This module uses global website save system:

```
save() from mixin: website
```

---

# 2. `newAnnouncement.vue` (Modal Form)

## Purpose

Creates or edits a new announcement.

---

## Fields

### Required:

* Title (EN / RU / KZ)
* Place (EN / RU / KZ)
* Type
* Date
* Time from

### Optional:

* Time until
* Date until
* Image
* Description OR link

---

## Type logic

### announcement

* Shows Quill editor
* Stores rich text

### event

* Shows external link field
* Hides editor

---

## Image processing

* Base64 encoded
* Compressed before storage
* Stored in `na.img.data`

---

## Language system

Uses:

```js
na.editing_lan = 'en | ru | kz'
```

---

## Save flow

* Emits `save(na)`
* Updates parent array
* Closes modal after save

---

## Data model

```json
{
  "type": "announcement | event",
  "date": "",
  "time_from": "",
  "time_until": "",
  "date_until": "",
  "libguide_link": "",
  "img": {},
  "en": {
    "title": "",
    "place": "",
    "description": ""
  },
  "ru": {
    "title": "",
    "place": "",
    "description": ""
  },
  "kz": {
    "title": "",
    "place": "",
    "description": ""
  }
}
```

---

# Business Rules

## 1. Extend mode

* Only one item editable at a time
* Controlled by:

```js
na.extending = true/false
```

---

## 2. Change tracking

Any field change sets:

```js
editing = true
```

---

## 3. Ordering

Items can be reordered via:

```js
moveIt(from, to)
```

---

## 4. Deletion

Uses confirmation modal:

* `DeleteModal.vue`

---

# UI Structure

* Table-style list
* Expandable inline editor
* Modal creation form
* Quill editor for rich text
* Tabs for language switching

---

# Dependencies

* Vuex store: `website.data.news`
* Quill editor + HTML plugin
* Tabs component
* Custom DeleteModal
* showModal mixin

---

# Notes

* Fully reactive system (direct store mutation)
* No separate API endpoints (uses global save)
* Strong multilingual dependency
* Image stored inline (base64 format)

---