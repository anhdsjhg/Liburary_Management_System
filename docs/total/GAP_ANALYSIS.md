# 🧭 GAP Analysis — System Coverage & Missing Parts

## 🎯 Purpose

This document identifies missing, incomplete, or inconsistent parts of the system architecture after analysis of:

- Backend modules
- Admin frontend (Vue 2 legacy)
- Partial user frontend (Vue 3 FSD)

It serves as a **diagnostic map for refactoring and future development planning**.

---

# 🏗️ 1. BACKEND GAPS

## 1.1 Architecture Gaps
- Partial modularization (some domains still monolithic)
- Inconsistent domain boundaries between modules
- Weak separation between business logic and transport layer (API)

---

## 1.2 Data Consistency Issues
- Similar structures duplicated across modules (e.g. settings-like configs)
- No unified schema enforcement across:
  - website content
  - media
  - announcements

---

## 1.3 API Layer Gaps
- No centralized API contract documentation layer
- Inconsistent endpoint naming patterns across modules
- Missing standardized response format enforcement

---

## 1.4 Missing Observability Layer
- No structured logging map per module
- No tracing of domain-level business flows
- No audit layer documentation consistency

---

# 🖥️ 2. ADMIN FRONTEND GAPS (VUE 2 LEGACY)

## 2.1 Architecture Issues
- Heavy reliance on mixins instead of composables/services
- Business logic embedded directly in Vue components
- Lack of separation between UI and domain logic

---

## 2.2 State Management Issues
- Tight coupling with Vuex `website.data`
- Direct mutation of shared state in components
- No clear service layer between API and UI

---

## 2.3 UI Pattern Duplication
Repeated patterns across modules:
- Modal-based CRUD (duplicated logic everywhere)
- Table + inline edit patterns
- Multilingual input blocks (en/ru/kz)
- File upload logic (image resize + upload)

---

## 2.4 Content Management Weakness
- No schema-driven CMS structure
- Content structures hardcoded in frontend forms
- No reusable form engine abstraction

---

## 2.5 Technical Debt Hotspots
- `copy()` utility used without strict typing
- Direct array mutation (`splice`, `push`) in UI layer
- Lack of reusable composable services

---

# 🌐 3. USER FRONTEND GAPS (VUE 3 + FSD)

## 3.1 Documentation Gaps
- Feature-level documentation incomplete
- Entity relationships not fully mapped
- Widget composition not documented

---

## 3.2 Architecture Maturity
- FSD structure exists but not fully standardized
- Some features still mix UI + API logic
- Inconsistent usage of composables vs direct API calls

---

## 3.3 Missing System Maps
- No full API → feature → UI flow mapping
- No cross-feature dependency map
- No shared entity relationship diagram

---

## 3.4 Potential Inconsistencies
- Mixed patterns between:
  - Pinia stores
  - direct composables
  - feature-level API calls

---

# 🔄 4. CROSS-SYSTEM GAPS

## 4.1 Admin ↔ User Sync Issues
- No formal contract between admin-managed content and user display layer
- Website CMS structures not schema-validated
- Risk of runtime mismatch in:
  - news structure
  - quick links
  - media content

---

## 4.2 Backend ↔ Frontend Alignment
- Backend does not enforce strict DTO contracts
- Frontend assumes flexible structures
- Leads to implicit coupling instead of explicit contracts

---

## 4.3 Domain Duplication
Same conceptual domains exist in multiple places:

| Domain | Backend | Admin | User |
|--------|--------|------|------|
| News / Announcements | ✔ | ✔ | partial |
| Media | ✔ | ✔ | ✔ |
| Settings | ✔ | ✔ | partial |
| Users | ✔ | partial | ✔ |

---

# ⚠️ 5. CRITICAL ARCHITECTURAL RISKS

## 5.1 Tight Coupling Risk
- Admin UI directly depends on backend shape (`website.data`)
- Any backend change can break frontend silently

---

## 5.2 Scalability Risk
- CMS structure not schema-driven
- Hard to extend without modifying multiple layers

---

## 5.3 Maintainability Risk
- Repeated logic across Vue components
- Lack of shared service abstraction layer

---

## 5.4 Migration Risk (Vue 2 → Vue 3 Admin)
- Admin is not yet modernized
- Logic migration will require:
  - separation of services
  - extraction of composables
  - removal of mixins

---

# 📊 6. SYSTEM HEALTH SUMMARY

| Layer | Status |
|------|--------|
| Backend | ⚠️ Semi-modular |
| Admin Frontend | ❌ Legacy-heavy |
| User Frontend | ⚠️ Partially modern |
| Documentation | ⚠️ Growing but fragmented |

---

# 🧭 7. RECOMMENDED PRIORITIES

## Priority 1 — Stability
- Standardize backend API contracts
- Freeze unstable CMS structures

## Priority 2 — Admin Refactor
- Replace mixins with service layer
- Extract reusable form logic
- Introduce consistent domain services

## Priority 3 — User Frontend Completion
- Finish full feature mapping
- Document all pages + widgets
- Normalize API consumption layer

## Priority 4 — System Unification
- Align backend DTOs with frontend expectations
- Introduce schema-driven CMS model

---

# 🚀 8. NEXT STEP

After this document, the next logical artifact is:

👉 `REFACTOR_BACKLOG.md`

This will convert all identified gaps into:
- actionable tasks
- priorities
- migration steps