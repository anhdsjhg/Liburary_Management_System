# REFACTOR BACKLOG

## Overview

This document contains a structured refactoring backlog for the system based on:
- Legacy backend modules
- Admin frontend (Vue 2)
- New frontend (Vue 3 + Vite + Pinia)

The goal is to reduce technical debt, unify architecture, and prepare for full Vue 3 migration.

---

# 1. CRITICAL PRIORITY (BLOCKERS)

## 1.1 Vuex Deep Mutation Problem (Admin Frontend)

### Problem
- Direct mutation of deeply nested objects (webcontent)
- No controlled state updates
- No immutability rules

### Impact
- Hard to debug state changes
- UI inconsistencies
- High risk during migration

### Tasks
- [ ] Introduce state update wrappers
- [ ] Isolate `webcontent` mutations into service layer
- [ ] Remove direct nested mutation in components
- [ ] Introduce structured update API

---

## 1.2 Modal-Based CRUD Explosion

### Problem
Every feature uses:
- showModal(Component, props)

### Impact
- No lifecycle control
- Hard dependency tracking
- Tight coupling between UI and logic

### Tasks
- [ ] Introduce centralized modal registry
- [ ] Replace ad-hoc modals with composable useModal()
- [ ] Standardize modal lifecycle hooks
- [ ] Move business logic outside modal components

---

## 1.3 Mixed Business Logic in Vue Components

### Problem
Components contain:
- API calls
- state mutation
- UI logic
- validation

### Tasks
- [ ] Extract API calls into service layer
- [ ] Introduce domain services (videoService, newsService, etc.)
- [ ] Move logic to composables or mixins replacement layer
- [ ] Enforce “thin component rule”

---

# 2. HIGH PRIORITY (ARCHITECTURE CLEANUP)

## 2.1 Backend Module Duplication

### Problem
Each module repeats:
- api-contract.md
- backend-flow.md
- business-rules.md

### Tasks
- [ ] Create shared base module structure
- [ ] Extract common CRUD patterns
- [ ] Introduce base service layer
- [ ] Normalize DTO patterns

---

## 2.2 Lack of Domain Boundaries

### Problem
- Modules are isolated but not domain-driven
- Overlapping logic between:
  - settings
  - media
  - user
  - website

### Tasks
- [ ] Define strict domain boundaries
- [ ] Map backend → frontend feature domains
- [ ] Introduce domain ownership rules

---

## 2.3 Quill Editor Repetition

### Problem
- Quill config duplicated across:
  - settings
  - news
  - announcements

### Tasks
- [ ] Create shared RichTextEditor component
- [ ] Centralize toolbar configuration
- [ ] Extract htmlEditButton setup globally

---

# 3. MEDIUM PRIORITY (FRONTEND IMPROVEMENTS)

## 3.1 Reusable Form System Missing

### Problem
Forms are duplicated:
- inputs
- labels
- validation patterns

### Tasks
- [ ] Introduce BaseForm system
- [ ] Create schema-driven forms (optional future)
- [ ] Standardize input components

---

## 3.2 Image Upload Logic Duplicated

### Found in:
- N&A.vue
- settings.vue

### Tasks
- [ ] Create useImageUpload composable
- [ ] Centralize compression logic
- [ ] Add reusable upload service

---

## 3.3 Inline Editing Pattern Overuse

### Problem
- Tables contain direct editing logic
- No separation of view/edit state

### Tasks
- [ ] Move editing into controlled components
- [ ] Introduce edit state manager
- [ ] Replace inline mutation with staged updates

---

# 4. LOW PRIORITY (CLEANUP)

## 4.1 Naming inconsistencies

### Issues:
- titie_kz typo in addlink.vue
- inconsistent field naming across modules

### Tasks
- [ ] Fix naming typos
- [ ] Normalize multilingual keys (title_en, title_ru, title_kz)

---

## 4.2 Mixed Date Handling

### Problem
- new Date().toDateInputValue() used inconsistently

### Tasks
- [ ] Create shared date utility
- [ ] Remove prototype-based extensions

---

## 4.3 Icon Component Duplication

### Problem
- Edit/Delete icons repeated across modules

### Tasks
- [ ] Centralize icon registry
- [ ] Standardize icon usage via shared UI library

---

# 5. MIGRATION BACKLOG (VUE 3 FRONTEND)

## 5.1 Vuex → Pinia Migration

### Tasks
- [ ] Replace website store with Pinia modules
- [ ] Split auth, ui, and website state
- [ ] Remove mutation-based updates

---

## 5.2 Admin → Feature-based Architecture Alignment

### Tasks
- [ ] Align admin modules with:
  - features/video
  - features/website
  - features/news
- [ ] Remove legacy coupling

---

## 5.3 Shared API Layer Unification

### Tasks
- [ ] Standardize http.ts usage
- [ ] Remove direct $http calls from components
- [ ] Introduce typed API clients

---

# 6. FUTURE ARCHITECTURE GOALS

## Target State

- Fully feature-based frontend (Vue 3)
- Clean domain-driven backend modules
- No direct state mutation in UI
- Service-layer driven business logic
- Shared UI component system

---

## Final Goal

Transform system from:

> "component-driven CRUD application"

to:

> "domain-driven modular application with strict separation of concerns"

---

# END