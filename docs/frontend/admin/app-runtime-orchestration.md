
---

# 📄 `03-app-runtime-orchestration.md`

```markdown
# App Runtime Orchestration Architecture (App.vue)

---

## 1. Overview

This component is NOT a UI component.

It is a **runtime orchestration controller** responsible for:

- authentication bootstrapping
- permission fetching
- dynamic route generation
- UI tab filtering
- theme + locale initialization

---

## 2. Runtime Flow

### Application startup flow:

1. setLocale()
2. getAuth()
3. fetch user data
4. filter routes
5. fetch modules (permissions)
6. dynamically inject routes
7. navigate to first allowed route
8. load UI

---

## 3. Authentication Flow

```js
GET /user → setUser()

After auth:
triggers route filtering
triggers permission loading
Problem:
auth logic embedded in UI layer
no dedicated auth service
4. Permission System
API call:
manage/users/{user_id}/visualization
Behavior:
returns modules (permissions)
used to:
filter routes
filter tabs
control navigation
5. Dynamic Routing System
Mechanism:
routes imported statically
filtered based on backend modules
then injected via $replaceRoutes
Key Issue:

👉 Routing is NOT static
👉 Routing depends on backend response at runtime

This makes the system:

non-deterministic
hard to debug
hard to test
6. Tab Filtering Logic
tabs = routes.filter(...)
Behavior:
filters routes based on:
route name
module permissions
child route permissions
Issue:
business logic mixed with routing logic
duplication of permission logic
7. Store Coupling
Direct mutations:
setUser
setFullPageLoading
setStore(admin modules)
Problem:
store used as global event bus
no separation between:
UI state
domain state
permission state
8. API Coupling
Observed pattern:
API called directly in component
results immediately pushed to store
Issue:
no service layer
no caching layer
no error handling strategy
9. UI State Orchestration
Responsibilities:
fullPageLoading control
route replacement
navigation redirect
theme initialization
locale initialization
Problem:

This component acts as:

router guard
auth service
state manager
UI controller
10. Critical Architectural Problems
❌ God Component Problem

App.vue controls too many responsibilities.

❌ No separation of concerns
auth
routing
permissions
UI initialization

all in one file

❌ Backend-driven UI architecture

UI structure depends on backend response

11. Migration Strategy
MUST be split into:
1. Auth service
getUser()
setUser()
token handling
2. Permission service
fetchModules()
filterRoutes()
3. Route builder
static route registry
dynamic enhancer layer
4. App bootstrap composable
initApp()
12. Final Conclusion

This file represents a runtime orchestration monolith.

It must be decomposed before Vue 3 migration or it will:

break maintainability
block composable architecture
prevent clean Pinia structure