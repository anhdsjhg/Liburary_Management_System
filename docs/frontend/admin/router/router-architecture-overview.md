# Vue Router Architecture Overview — SDU Library Management System

---

## 1. General Architecture

The application uses Vue Router 3 in **HTML5 history mode** with a base path:

/admin/

### Key Characteristics

- SPA is fully mounted under `/admin/`
- Backend must support fallback routing for `/admin/*`
- No hash mode (clean URLs)
- Root path redirects to `/acquisitions`

---

## 2. Application Entry Flow

/admin/
→ redirect → /acquisitions
→ redirect → /acquisitions/batches

### Default landing page:
- `Batches` (Acquisitions domain)

---

## 3. Route Design Strategy

### Structure Type

- Flat 2-level hierarchy:
  - Parent domain route
  - Child feature routes

### Exception:
- `dynamic_report` → 3-level nesting

---

## 4. Domain Groups

- `/acquisitions` → procurement workflow
- `/report` → analytics & reporting
- `/service` → circulation / service desk
- `/cataloging` → MARC cataloging
- `/settings` → system config
- `/website` → CMS
- `/administration` → permissions system

---

## 5. Router Shell Pattern

Each domain uses:

```vue
<router-view />
```
as a pure layout passthrough.
No logic inside shell components.

---

## 6. Meta System

Used as UI + navigation protocol:

meta.shown → tab visibility
meta.noTab → hide from navigation
meta.noChildren → override tab navigation behavior

---

## 7. Key Architectural Observation

Router is UI-driven, not security-driven:

No guards
No auth logic
No permission enforcement