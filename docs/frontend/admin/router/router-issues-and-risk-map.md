
---

# 📁 `router-issues-and-risk-map.md`

```md
# Router Risk & Architectural Issues — SDU Library System

---

## 🔴 Critical Issues

- No navigation guards
- No auth routing layer
- Broken $replaceRoutes system
- No lazy loading
- Shared Vuex state across domains

---

## 🟠 High Risk Issues

- Shelves component duplication
- dynamic_reports store dependency
- Query params used as state
- 40% routes missing names

---

## 🟡 Medium Issues

- router.push monkey patch
- meta used as UI config system
- inconsistent navigation (name vs path)

---

## 🟢 Low Issues

- print route missing name
- single-file routes config
- redundant /report/report path

---

## Key Structural Problem

Router is:

> UI-driven, not architecture-driven, not security-driven