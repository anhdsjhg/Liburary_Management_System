# Settings Module — Overview

## 1. Purpose

The Settings module manages **dynamic public content** in the library system:

- Announcements (events, notices, schedules)
- Video content (embedded media)

It allows non-developers (admins/content managers) to publish content without code changes.

---

## 2. Position in System

- Admin panel → full CRUD
- Public portal → read-only consumption
- Cross-module dependency: uses `lib_user_cards` + `dbmaster.employee` for audit display

---

## 3. Responsibilities

- Store multilingual content (EN/RU/KZ)
- Manage time-bounded announcements
- Provide embedded video catalog
- Track authorship (created_by / edited_by)
- Serve frontend via REST API

---

## 4. Key Design Idea

This module is a **content layer**, not a business-logic layer:

- No validation of visibility rules in DB layer
- No RBAC inside models
- No formatting logic except SQL projections

Everything is prepared at query level and rendered by frontend.