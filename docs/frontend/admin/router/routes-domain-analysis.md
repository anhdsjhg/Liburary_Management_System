
---

# 📁 `routes-domain-analysis.md`

```md
# Vue Router Domains Analysis — SDU Library Management System

---

## 1. Acquisitions Domain (/acquisitions)

### Purpose
Library procurement workflow

### Routes

- /batches
- /items
- /suppliers
- /publishers
- /acts
- /print (no name → navigation-only)

### Characteristics

- Standard CRUD structure
- Heavy Vuex + mixin dependency
- Print route is programmatic-only

---

## 2. Reports Domain (/report)

### Purpose
Analytics + reporting engine

### Routes (13 total)

- attendance
- service_desk
- most_read_books
- inventory_books
- ksu
- form2
- periodicals
- report (→ /report/report issue)
- barcodes
- cataloging
- not_found_books
- shelves
- dynamic_report (nested)

---

### Critical Issues

#### 1. Missing route names
~40% of routes have no `name`

#### 2. Invalid semantic path

/report/report

#### 3. Dynamic Report nesting

/dynamic_report
├── /reports
└── /single_report

Uses Vuex instead of route params.

---

## 3. Service Domain (/service)

### Purpose
Library circulation system

### Routes

- users
- info
- service (hidden workflow route)
- history_books
- shelves (shared with report domain)

---

### Critical Issue

Shared component:

/report/shelves
/service/shelves

Same Vuex state → context contamination risk.

---

## 4. Cataloging Domain (/cataloging)

### Purpose
MARC bibliographic system

### Routes

- search
- edit (props: true)

### Behavior

- Heavy search state
- Route params passed via props
- Deep Vuex dependency

---

## 5. Website CMS (/website)

### Purpose
Public library website management

### Routes

- video_content
- n_a
- n_a/edit ⚠️
- web_settings
- new_arrivals
- quick_links

---

### Critical Pattern: Query-as-State

/n_a/edit?edit=true&data={...}&afterSave=...

### Issue:

- Business logic encoded in URL
- Non-bookmarkable behavior
- `afterSave` passed via query string

---

## 6. Administration Domain (/administration)

### Purpose
User permissions system

### Routes

- main
- control
- add

### Pattern

- `props: true`
- meta-based tab suppression

---

## 7. Settings Domain (/settings)

- Single route only
- Hidden from navigation
- No tab representation

---

## 8. Catch-All Route

→ /

Redirect fallback for unknown routes.