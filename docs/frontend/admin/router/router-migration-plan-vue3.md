# Vue Router Migration Plan — Vue 3 Architecture

---

## 1. Immediate Fixes (Blocking)

### Replace router setup

```js
createRouter({
  history: createWebHistory('/admin/'),
  routes
})
```
Add auth guard

```js
router.beforeEach((to, from, next) => {
  if (!isAuthenticated()) next('/login')
  else next()
})
```

---

## 2. Fix Broken Systems

Remove:
$replaceRoutes
router.push patch

---

## 3. Convert Vuex → Route Params
Replace:
store.dynamic_reports.category_id
With:
/dynamic_report/:categoryId

4. Fix Website CMS Routing

Replace:

/n_a/edit?data=...

With:

/n_a/:id/edit

---

## 5. Add Lazy Loading

component: () => import('./views/.../Component.vue')

---

## 6. Modular Routes

routes/
  acquisitions.routes.ts
  report.routes.ts
  service.routes.ts
  catalog.routes.ts

---

## 7. Final Target Architecture

Route params for state
No Vuex navigation dependency
Full guard system
Lazy-loaded domains
Clean separation of UI vs state