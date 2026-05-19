# Application Bootstrap Architecture (main.js)

---

## 1. Overview

This file defines the **application bootstrap layer** of the legacy Vue 2 system.

It is responsible for:
- initializing global plugins
- configuring Axios
- injecting global services
- defining application-wide helpers
- mounting the Vue instance

---

## 2. Architecture Type

This is a **global imperative bootstrap architecture**.

Characteristics:
- global side effects at startup
- heavy use of Vue.prototype
- no separation of concerns
- services attached to global scope

---

## 3. Axios Architecture

### 3.1 Global Axios Instance

Axios is globally configured via interceptors:

#### Request interceptor responsibilities:
- baseURL injection from runtime config
- API prefix switching (`config.api`)
- language header injection
- authorization header injection from Vuex

```js
Authorization: Bearer store.getters.access_token
```
---
## 3.2 Problems

❌ Tight coupling with Vuex
Axios directly depends on store getters
breaks modularity
❌ No token abstraction layer
token logic is embedded in interceptor
❌ No centralized error handling
no response interceptor for failures

--- 

## 4. Global Event Bus

Vue.prototype.$eventHub = new Vue();
Purpose:
cross-component communication
Problem:
anti-pattern in Vue 3 context
should be replaced with:
Pinia store events OR
composables OR
event emitter service

--- 

## 5. Global Plugins

Used Plugins:
vue-js-modal
vue-simple-alert
Characteristics:
globally registered
dynamic modal system exists
alert system used as UI feedback layer

--- 

## 6. Global Utilities (window scope)

Functions:
copy()
capitalize()
objectWithoutKey()
Date.prototype.toDateInputValue

Problems:
❌ Pollutes global namespace
unsafe for large-scale refactor
not tree-shakable
not type-safe
❌ Extends native prototypes
Date.prototype modification
high risk in Vue 3 + TS migration

---

## 7. Configuration System

window.configs = Object.assign({}, base);
Behavior:
runtime config injection via global object
Issue:
no type safety
no environment separation (dev/prod abstraction missing)

---

## 8. Vue Instance Bootstrap

new Vue({
    render: h => h(App),
    i18n,
    router,
    store
})
Observations:
classic Vue 2 architecture
tightly coupled core systems
no plugin abstraction layer

---

## 9. Migration Risks

Must be refactored:
Axios interceptors → API service layer
window.utils → utility module
eventBus → composable/store system
global config → env-based config system
Date prototype patch → utility function