# Reports/NotFoundBooks/README.md

## Purpose

Displays books marked as lost/not-found.

Filtering:

* act number
* act type
* lost status

---

## Critical Problems

### Multiple Direct Vuex Mutations

The component mutates Vuex state directly in:

* search
* searchAll
* v-model bindings

This creates hidden state transitions.

---

### Wrong Input Type

```vue
<input type="date">
```

used for act type.

Likely copy-paste bug.

---

### Dead API Call

`getStatuses()` loads values never rendered.

---

## Recommendations

* remove dead API logic
* replace magic number `status = 0`
* convert search state to local refs

---
