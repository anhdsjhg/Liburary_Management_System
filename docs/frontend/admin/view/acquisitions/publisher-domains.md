---

# 📄 `docs/Publisher.CreatePublisher.md`

````md
# Publisher / CreatePublisher.vue

## Overview
Dual-purpose create/edit form for publisher entities. Handles bibliographic identity and contact information. This is one of the simplest and most stable form components in the Acquisitions system.

It follows a classic **form + mixin CRUD delegation pattern** with minimal Vuex coupling and no external dependencies beyond global utilities.

---

## Responsibilities
- Create new publisher
- Edit existing publisher
- Validate and submit publisher data
- Map UI fields to API-required schema
- Trigger post-save refresh callback

---

## Data Model

```js
publisher = {
  id?: number,
  name: string,
  pub_name: string,   // API-required alias
  address: string,
  email: string,
  phone: string,
  fax: string
}
````

### Field Mapping Rule

The API expects:

```
pub_name ← publisher.name
```

This mapping is resolved inside `save()` before submission.

---

## Modes

| Mode   | Behavior                             |
| ------ | ------------------------------------ |
| create | Initializes empty form               |
| edit   | Copies `props.data` into local state |

---

## Lifecycle Flow

### created()

* If `edit === true`:

  * `copy(this.data)` → local state initialization

No API calls are performed on mount.

---

## Save Flow

```text
save()
  ↓
inject pub_name = name
  ↓
validate submit guard (fullPageLoading)
  ↓
editIt() OR createIt() (via mixin)
  ↓
API request (/publisher)
  ↓
afterSave callback
  ↓
close modal
```

---

## Vuex Coupling

* `setFullPageLoading(true)` on submit
* `fullPageLoading` used as double-submit guard

**Coupling level: LOW**

No direct state reads or mutations outside loading flag.

---

## API Interaction

Handled fully via mixins:

* `create_it` → POST `/publisher`
* `edit_it` → PUT `/publisher/:id`

No direct `$http` usage.

---

## Mixins Used

* `create_it`
* `edit_it`
* `last`
* `last_created`

---

## Side Effects

* Vuex loading flag mutation
* API write operation (create/update)
* Optional `afterSave` callback execution
* `$emit('close')` on cancel

---

## Business Logic

### Field aliasing

```js
publisher.pub_name = publisher.name
```

This exists due to backend schema requiring `*_name` fields instead of `name`.

### ID injection

```js
publisher.pub_id = this.data.id
```

Injected only at save-time for edit mode.

---

## Risks

### 1. Silent API failure

No `message_error` mixin → failures may not surface in UI.

### 2. Field alias coupling

UI schema differs from API schema → hidden transformation layer.

### 3. Global dependency

`copy()` is a global function (not imported).

---

## Performance

Negligible. Pure local state until submit.

---

## Suggested Refactor (Future)

### Replace with composable:

```ts
usePublisherForm()
```

### Move transformations to API layer:

```ts
publisherApi.create({
  ...publisher,
  pub_name: publisher.name
})
```

### Replace global copy:

```ts
structuredClone(data)
```

---

## Migration Risk

**LOW**

This is the safest form component in the system and ideal for first-phase Vue 3 migration.

````
