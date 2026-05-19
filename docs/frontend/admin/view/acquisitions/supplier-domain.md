
# 📄 `docs/Supplier.CreateSupplier.md`

```md
# Supplier / CreateSupplier.vue

## Overview
Dual-purpose create/edit form for supplier entities. Structurally identical to `CreatePublisher.vue` with one additional domain-specific field: `BIN` (Business Identification Number).

Represents legal entity suppliers used in procurement workflows.

---

## Responsibilities
- Create supplier
- Edit supplier
- Maintain supplier identity and legal registration data
- Submit supplier data to backend API

---

## Data Model

```js
supplier = {
  id?: number,
  name: string,
  sup_name: string,   // API-required alias
  bin: string,        // Business Identification Number
  address: string,
  email: string,
  phone: string,
  fax: string
}
````

---

## Field Mapping Rule

```js
sup_name ← supplier.name
sup_id   ← supplier.id (edit mode only)
```

---

## Special Field: BIN

### Definition

* Business Identification Number (Kazakhstan)
* Represents legal entity registration ID

### Notes

* No validation rules enforced in UI
* Accepts any string (backend validation assumed)

---

## Modes

| Mode   | Behavior                             |
| ------ | ------------------------------------ |
| create | Empty form                           |
| edit   | Copies `props.data` into local state |

---

## Lifecycle Flow

### created()

* If `edit === true`:

  * `copy(this.data)` → local state

No API calls performed.

---

## Save Flow

```text
save()
  ↓
inject sup_name = name
inject sup_id = id (edit only)
  ↓
check fullPageLoading guard
  ↓
createIt() OR editIt() (mixin)
  ↓
POST/PUT /supplier
  ↓
afterSave callback
  ↓
close modal
```

---

## Vuex Coupling

* `setFullPageLoading(true)` on submit
* `fullPageLoading` used as submit lock

**Coupling level: LOW**

---

## API Interaction

Fully delegated to mixins:

* `create_it` → POST `/supplier`
* `edit_it` → PUT `/supplier/:id`

---

## Mixins Used

* `create_it`
* `edit_it`
* `last`
* `last_created`

---

## Side Effects

* Vuex loading flag mutation
* API write operation
* Optional `afterSave` callback
* `$emit('close')` on cancel

---

## Business Logic

### Field aliasing

```js
supplier.sup_name = supplier.name
```

Required due to backend schema.

---

### Late ID injection

```js
supplier.sup_id = this.data.id
```

Only applied in edit mode at submit time.

---

### BIN field behavior

* No validation
* No formatting enforcement
* Treated as free text input despite structured nature

---

## Risks

### 1. Missing validation for BIN

No format validation for legal identifier field.

### 2. Silent error handling

No `message_error` mixin → failed requests are not surfaced.

### 3. Shared anti-pattern with Publisher

* Same aliasing pattern
* Same lifecycle logic
* Same global dependencies

---

## Performance

Negligible. Fully local until submit.

---

## Suggested Refactor (Future)

### Shared composable for both Publisher + Supplier:

```ts
useContactEntityForm({
  link: '/supplier',
  idField: 'sup_id',
  nameField: 'sup_name',
})
```

### Replace global copy:

```ts
structuredClone()
```

### Add BIN validation:

```ts
/^\d{12}$/
```

---

## Migration Risk

**LOW**

Identical structure to Publisher. Ideal candidate for shared abstraction layer and first composable extraction.

```