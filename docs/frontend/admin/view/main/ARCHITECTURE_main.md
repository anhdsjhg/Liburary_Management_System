# Admin View Layer Architecture (Production Documentation)

## Overview

This document describes the core layout components of the admin panel located in `resources/js/admin/view/__main__`.

These components form the **application shell layer**:
- global layout (`index.vue`)
- navigation (`navbar/index.vue`)
- sidebar (`sidebar/index.vue`)
- account/session control (`navbar/account.vue`)

They are responsible for:
- routing orchestration
- authentication session control
- global UI state (loader, theme, locale)
- navigation structure rendering

---

# 1. `__main__/index.vue`

## Role

Root layout shell of the admin panel. It composes:
- Sidebar
- Navbar
- Router view
- Global full-page loader overlay

---

## Architecture Type

**Layout Orchestrator (Shell Component)**

Minimal logic, high structural responsibility.

---

## Data Flow

Vuex: fullPageLoading → overlay visibility
```$route.fullPath → router-view key (forced remount)```

---

## Key Design Behavior

### ⚠️ Full Route Remount Strategy

```vue
<router-view :key="$route.fullPath" />```

This forces:

full destroy of child components
full re-initialization on every route change
Impact:
resets form state
resets scroll position
prevents state persistence between routes
Dependencies
Sidebar component
Navbar component
Vuex getter: fullPageLoading
Risks
1. State Loss on Navigation

Every route change destroys child components.

2. No Error Boundary

Any child crash propagates to full layout.

3. Global Loader Lock Risk

If fullPageLoading is never reset → UI becomes permanently blocked.

Migration Notes (Vue 3)

Replace:

: key="$route.fullPath"

With:

<RouterView v-slot="{ Component }">
selective <KeepAlive> strategy per route
2. navbar/index.vue
Role

Top navigation bar responsible for:

route navigation display
breadcrumb grouping
language switching
account dropdown embedding
Architecture Type

Domain Controller Component

Mixes:

routing logic
i18n logic
API calls
Vuex reads
Data Flow
Vuex admin.tabs → route groups
$route → active navigation state
i18n → language switching
API Behavior
Locale update request
GET /locale/{locale}

⚠️ No error handling
⚠️ No abstraction layer
⚠️ Called directly from UI component

Business Logic (Hidden Rules)
Routes without name are hidden
meta.noTab excludes routes from navigation
$tc(route.name, 10) forces pluralization behavior
Language list is hardcoded:
['EN', 'RU', 'KZ']
UI State Management Issues
dropdowns controlled via focusout
brittle DOM-based behavior
inconsistent collapse behavior across browsers
Risks
1. Mixed Responsibilities
routing
localization
navigation UI
2. Focus-based dropdown logic

Unreliable UX behavior due to DOM focus rules.

3. Hardcoded localization config

Requires code change for new languages.

Migration Notes (Vue 3)
Replace mixins with composables:
useNavigation()
useLocale()
Replace focus logic with headless UI or click-outside directive
Move languages to config or store
3. navbar/account.vue
Role

User session control component:

displays user identity
handles logout
redirects to auth state reset
Architecture Type

Authentication Controller (UI-bound, anti-pattern)

Contains critical business logic inside UI layer.

Logout Flow
POST logout
→ Vuex clear user
→ localStorage clear token
→ axios baseURL mutation
→ window redirect (/)
Critical Anti-Pattern
⚠️ Axios global mutation
$http.defaults.baseURL = '...'

This affects:

all concurrent requests
all components using axios instance
Side Effects
hard page reload (window.location.replace)
bypasses Vue Router guards
bypasses SPA lifecycle
resets full application state
Risks
1. Race condition on HTTP layer

Shared axios instance is mutated at runtime.

2. Authentication logic embedded in UI

Should be moved to service/store layer.

3. Hard navigation reset

Breaks SPA consistency.

Migration Notes (Vue 3)

Move logic to:

useAuthStore() (Pinia)

Replace:

direct axios mutation → separate client instances
window redirect → router-based navigation after cleanup
4. sidebar/index.vue
Role

Primary navigation sidebar:

renders route tree
manages collapsible groups
tracks active route state
Architecture Type

State-driven Navigation Renderer (but incorrectly implemented)

Vuex Dependencies
$store.state.admin.tabs
$store.state.theme
Critical Issue
⚠️ Direct Vuex state mutation
tab.shown = !tab.shown

This violates Vuex rules:

no mutation tracking
breaks strict mode
bypasses predictable state flow
Reactivity Workaround
this.$forceUpdate()

This indicates:

reactivity system failure
manual UI forcing instead of state-driven updates
Business Logic Embedded in UI
meta.noChildren controls:
arrow visibility
navigation logic
meta.noChildren actually stores route objects → dual-purpose field
Risks
1. Broken Vuex contract

Direct mutation bypasses store system.

2. Forced re-rendering

Performance degradation on every toggle.

3. Dynamic property injection

tab.shown not predefined → reactivity inconsistency.

Migration Notes (Vue 3)
remove $forceUpdate

move toggle logic to store action:

toggleTab(tabId)
ensure reactive initialization of all properties
SYSTEM ARCHITECTURE SUMMARY
Type

Legacy Vue 2 Admin Shell with:

mixin-based logic injection
direct Vuex coupling
global axios mutation
DOM-driven UI state
Core Problems
1. No Service Layer

Business logic lives inside UI components.

2. Shared HTTP Client Mutation

Runtime modification of axios instance.

3. Broken Vuex Discipline

Direct state mutation without commits.

4. Forced Remount Navigation Strategy

$route.fullPath destroys SPA continuity.

5. Mixin Overuse

Logic hidden across multiple implicit layers.

Recommended Target Architecture
State Layer
Pinia stores:
useAuthStore
useAdminStore
useLocaleStore
HTTP Layer
split clients:
apiClient
authClient
UI Layer
remove mixins
replace with composables
pure presentational components
Router Strategy
remove full remount keying
use KeepAlive selectively
Migration Risk Assessment
Component	Risk
account.vue	HIGH
sidebar.vue	HIGH
navbar.vue	MEDIUM
index.vue	MEDIUM
Final Note

This architecture is functional but fragile.

It works through:

implicit contracts
runtime mutations
forced reactivity hacks

Migration to Vue 3 + Pinia should prioritize:
state integrity before UI refactoring