Ок, держи готовые **production docs файлы (Markdown)**, которые можно просто скопировать в папку `docs/` в VS Code.

Я сделал их в нормальном формате: структура, описание, API-логика, поля, поведение компонентов.

---

# 📁 `docs/website_announcements.md`

````md
# Announcements Module (Website)

## Overview
This module manages **News & Announcements** and **Events** on the website.

It supports:
- Multilingual content (EN / RU / KZ)
- Image upload
- Event mode (with link) and Announcement mode (with rich text)
- Date and time scheduling
- Admin metadata (created/edited info)

---

## Components

### 1. `Announcements.vue`
Main listing page for announcements.

#### Features:
- Displays list of announcements from Vuex store (`announcements`)
- Supports pagination and sorting
- Actions:
  - Add new announcement
  - Edit existing announcement
  - Delete announcement (via TableDiv component)
  - Reload all data

#### API:
- `GET /announcement` (via mixin `getResults / getAllData`)

---

### 2. `NewAnnouncement.vue`
Form for creating and editing announcements.

#### Fields:
- Title (EN / RU / KZ)
- Place (EN / RU / KZ)
- Type:
  - `announcement`
  - `event`
- Image upload (base64 compressed)
- Start / End date
- Start / End time
- Link (only for events)
- Description (rich text, Quill editor) for announcements

---

#### Behavior:

##### Type switch:
- `announcement` → shows rich text editor
- `event` → shows link field

##### Image handling:
- Converts file to base64
- Compresses image before upload
- Allows clearing image

---

#### API:
- Create: `POST /announcement`
- Update: `PUT /announcement/:id`

Handled via mixins:
- `create_it`
- `edit_it`

---

#### Notes:
- Supports multilingual editing via tabs
- Stores `editing_lan` state
- Uses Quill editor with HTML edit plugin

---

## Data Model

```json
{
  "title_en": "",
  "title_ru": "",
  "title_kz": "",
  "place_en": "",
  "place_ru": "",
  "place_kz": "",
  "description_en": "",
  "description_ru": "",
  "description_kz": "",
  "image": "",
  "type": "announcement | event",
  "link": "",
  "start_date": "",
  "end_date": "",
  "start_time": "",
  "end_time": ""
}
````

---

## Vuex Store

* Module: `announcements`

````

---

# 📁 `docs/website_new_arrivals.md`

```md
# New Arrivals Module (Website)

## Overview
This module manages **library new arrivals catalog items**.

It allows:
- Searching book by Inventory ID
- Displaying bibliographic data
- Uploading cover image
- Marking items as "New Arrival"
- Bulk delete operations

---

## Components

### 1. `NewArrivals.vue`
Main admin list for new arrivals.

#### Features:
- List all arrivals from API
- Checkbox selection system
- Bulk delete
- Edit / Delete single record
- Refresh list

#### API:
- `GET /arrivals/index`

---

### 2. `NewArrival.vue`
Modal form for adding/editing a new arrival.

---

## Workflow

### Step 1: Search Book
User enters:
````

inv_id

```

Then clicks:
```

set

```

API call:
```

POST /cataloging/material/search

```

---

### Step 2: Populate Data
System fills:
- title
- author
- isbn
- year
- type_key
- image (or fallback via getBookImage)

---

### Step 3: Upload Image
- Image compressed before upload
- Preview shown before saving

---

### Step 4: Save Arrival

API:
```

POST /arrivals/create

````

Payload:
- inv_id
- image (file or url)

---

## Data Model

```json
{
  "inv_id": "",
  "title": "",
  "author": "",
  "isbn": "",
  "year": "",
  "type_key": "",
  "image": "",
  "isnewarrival": "0 | 1"
}
````

---

## Business Rules

* If `isnewarrival == 1` → image editing disabled
* If book already exists → warning shown
* Bulk delete supported
* Checkbox selection syncs with full list

---

## UI Features

* Image preview
* Dynamic table rendering
* Delete image per item
* Modal-based editing

````

---

# 📁 `docs/website_quick_links.md`

```md
# Quick Links Module (Website)

## Overview
This module manages **Quick Links section** on the website.

It allows:
- Creating external/internal links
- Multilingual titles
- Descriptions per language
- Editing via modal
- Saving to global website config

---

## Components

### 1. `QuickLinks.vue`
Main admin page for quick links.

#### Features:
- Displays list of quick links
- Add / Edit / Delete links
- Saves to `website.data.quick_links`

#### Data Source:
```js
website.data.quick_links
````

---

### 2. `NewQuickLink.vue`

Modal form for creating/editing quick links.

---

## Data Structure

```json
{
  "link": "",
  "title_en": "",
  "title_ru": "",
  "title_kz": "",
  "description_en": "",
  "description_ru": "",
  "description_kz": ""
}
```

---

## Behavior

### Add new link:

* Opens modal
* Pushes object into array

### Edit link:

* Modifies array item directly

### Delete link:

* Removes from array

---

## Save Flow

```js
website.data.quick_links = quick_links
save()
```

Mixin used:

* `save` from `website`

---

## UI Notes

* Table-based layout
* Modal editing system
* Multilingual support required for all fields

````

---

# 📁 `docs/website_settings.md`

```md
# Website Settings Module

## Overview
This module manages **global website configuration** including:
- Navigation links
- Footer content
- Chat settings
- Warning banner
- Background images

---

## Components

### 1. `Settings.vue`

Main configuration panel.

---

## Sections

### 1. Warnings
- Toggle availability
- Rich text editor (Quill)

---

### 2. Chat Settings
- Enable/disable chat
- Language-based links and hashes:
  - RU
  - KZ
  - EN

---

### 3. Navigation Links
- Add / Edit / Delete links
- Stored in:
```js
website.data.lib_links
````

---

### 4. Background Images

* Upload 2 images
* Preview before upload
* Delete image by filename

API:

```
GET /background-image/index
POST /background-image/create
DELETE /background-image/delete/:file
```

---

### 5. Footer Configuration

Includes:

* Location name
* Address
* Phone
* Email
* Social media links

All fields are multilingual:

```json
en / ru / kz
```

---

## Data Model (partial)

```json
{
  "warning": {
    "available": true,
    "text": ""
  },
  "chat": {
    "available": true,
    "link_ru": "",
    "hash_ru": "",
    "link_kz": "",
    "hash_kz": "",
    "link_en": "",
    "hash_en": ""
  },
  "lib_links": [],
  "footer": {
    "icon": {},
    "contacts": {},
    "follow_us_links": {}
  }
}
```

---

## Notes

* Uses Quill editor
* Uses modal-based link editor (`AddLink.vue`)
* Fully reactive via Vuex `website` module

````

---

# 📁 `docs/website_video_content.md`

```md
# Video Content Module (Website)

## Overview
This module manages **video content library**.

It allows:
- Adding videos
- Editing video metadata
- Deleting videos
- Storing embed links

---

## Components

### 1. `VideoContent.vue`
Main list of videos.

#### Features:
- Fetch videos from API
- Display title and date
- Edit / Delete actions
- Add new video

#### API:
````

GET /video/index
DELETE /video/delete/:id

````

---

### 2. `EditVideo.vue`
Modal form for creating and editing videos.

---

## Data Model

```json
{
  "title_en": "",
  "title_ru": "",
  "title_kz": "",
  "link": "",
  "embed_link": ""
}
````

---

## Behavior

### Add video:

* Opens modal
* Sends POST request

### Edit video:

* Opens modal with copied data
* Sends PUT request

### Delete video:

* Confirmation required
* Full page loading indicator enabled

---

## API

### Create

```
POST /video/create
```

### Update

```
PUT /video/update
```

### Delete

```
DELETE /video/delete/:video_id
```

---

## UI Notes

* List layout (simple rows)
* Modal-based editing
* Supports multilingual titles

---