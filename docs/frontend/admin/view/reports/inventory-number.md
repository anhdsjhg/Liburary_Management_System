# Reports/InventoryNumber/README.md

## Purpose

Sequential inventory lookup report.

Features:

* inventory range search
* print export
* Excel export

---

## Major Problems

### Direct Vuex Mutation

```vue
v-model="books_inv_number.search.add_options.inventory_no"
```

Critical coupling issue.

---

### Missing Mixin

`message_error` is used but not registered.

Runtime failure occurs during API errors.

---

### Hidden Global Dependency

```js
toDateInputValue()
```

Depends on prototype extension.

---

## Refactor Recommendations

* local refs instead of direct mutation
* replace prototype extension with utility
* create export composable
* remove dead imports

---
