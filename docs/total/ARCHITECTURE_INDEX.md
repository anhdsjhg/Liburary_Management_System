
---

# ARCHITECTURE_INDEX.md

```md
# 📐 Architecture Index — Project Overview

## 🧭 Purpose

This document is the central entry point for the system architecture documentation.  
It connects backend modules, admin frontend (Vue 2 legacy), and modern user frontend (Vue 3 + FSD structure).

---

# 🏗️ 1. SYSTEM OVERVIEW

The project consists of 3 main layers:

## 1. Backend (Legacy + Modular Monolith)
Responsible for:
- Business logic
- Data storage
- API contracts
- ERP-like modules

Located in:
```

legacy-backend/docs/modules/

```

Main modules:
- acquisitions
- dynamic-report
- media
- permissions
- settings
- user

---

## 2. Admin Frontend (Vue 2 Legacy System)

Responsible for:
- CMS management
- Website content control
- Internal system configuration

Located in:
```

legacy-backend/docs/frontend/admin/

```

### Key domains:
- website management (news, videos, quick links, settings)
- cataloging
- acquisitions management
- reports system
- service desk
- system settings

### Architecture style:
- Vue 2 Options API
- heavy use of mixins
- modal-driven CRUD
- Vuex store dependency
- inline business logic in components

---

## 3. User Frontend (Vue 3 + FSD Architecture)

Responsible for:
- public website
- catalog browsing
- authentication
- search and reporting access

Located in:
```

liburary/src/

```

### Architecture style:
- Feature-Sliced Design (FSD)
- Composition API
- Pinia store
- modular features/entities/widgets separation

### Layers:
- app (router, providers, layouts)
- pages (route-level views)
- features (business logic modules)
- entities (data models)
- widgets (UI composition blocks)
- shared (utilities, API, UI kit)

---

# 🔗 2. CROSS-SYSTEM RELATIONSHIPS

## Backend → Admin
Admin frontend consumes backend modules via:
- REST APIs
- direct entity mapping
- CRUD operations (website, news, videos, settings)

## Backend → User
User frontend consumes:
- public APIs
- catalog data
- authentication services
- search endpoints

## Admin → User
Admin controls:
- website content (news, videos, quick links)
- UI content shown in user frontend

---

# 🧩 3. CORE BUSINESS DOMAINS

## Website Content Domain
Managed in admin:
- quick links
- news & announcements
- videos
- settings (chat, warnings, footer)

Stored in:
- website.data (Vuex)

---

## Media Domain
- images (backgrounds, uploads)
- video content
- file storage API

---

## News & Events Domain
- announcements
- events
- multilingual content (en/ru/kz)
- scheduling (date/time range)

---

## Cataloging Domain
- items/books
- search
- filtering
- reporting integration

---

# ⚙️ 4. ARCHITECTURE PATTERNS (ADMIN)

## 4.1 Modal-based CRUD
Used in:
- quick links
- videos
- announcements

Pattern:
- parent list page
- modal form component
- shared array mutation

---

## 4.2 Multilingual Data Model
Standard fields:
- title_en
- title_ru
- title_kz
- description_en/ru/kz

---

## 4.3 Website Data Binding
Central object:
```

website.data

```

Used for:
- news
- quick_links
- lib_links
- footer settings
- chat config

---

## 4.4 Inline Editing Pattern
- table row editing
- direct v-model binding
- immediate mutation before save

---

## 4.5 File Upload Pattern
- base64 conversion
- resize image client-side
- upload via HTTP endpoint
- preview before commit

---

# 🧱 5. FRONTEND ADMIN CORE MODULES

## Website Module
- Quick Links
- News & Announcements
- Video Content
- Settings (chat, warnings, footer)

## Settings Module
- navigation links
- library links
- background images
- footer configuration

## Media Module
- background image upload
- image deletion
- file lifecycle management

---

# 📦 6. USER FRONTEND (CURRENT STATE)

Status: PARTIALLY ANALYZED

### Structure exists:
- pages/
- features/
- entities/
- widgets/

### Known features:
- books search
- authentication
- catalog browsing
- settings (partial)

### Missing deep analysis:
- full feature mapping
- API flow documentation
- widget composition map

---

# 🔄 7. DATA FLOW MODEL

## Admin Flow:
UI → Vue Component → Vuex → API → Backend

## User Flow:
Page → Feature → API layer → Backend → Entity → UI

---

# ⚠️ 8. TECHNICAL DEBT SUMMARY

## Admin Frontend:
- heavy mixin usage
- duplicated form logic
- inline mutations without service layer
- tight coupling with Vuex store
- weak separation of concerns

## Backend:
- legacy monolith structure
- partially modularized domains
- inconsistent entity boundaries

## User Frontend:
- incomplete documentation
- unclear feature boundaries in some modules

---

# 🧭 9. CURRENT ARCHITECTURE STATE

### Completed:
✔ Backend modules analysis  
✔ Admin frontend full domain mapping  
✔ Website CMS logic reverse engineering  
✔ Component-level CRUD patterns  
✔ Media + content management flows  

### In Progress:
⏳ User frontend deep analysis  
⏳ API flow unification  

### Pending:
⛔ Full system refactor plan  
⛔ migration strategy (Vue 2 → Vue 3 admin)

---

# 🚀 10. NEXT ARCHITECTURAL STEPS

1. GAP_ANALYSIS.md
2. REFACTOR_BACKLOG.md
3. DATA_MODEL_SUMMARY.md
4. COMPONENT_PATTERNS.md
5. USER FRONTEND FULL MAPPING

---

# 📌 FINAL NOTE

This system is transitioning from:

> legacy ERP-style Vue 2 monolith  
to  
> modular FSD + modern Vue 3 architecture

This index is the control point for that transition.
```

---
