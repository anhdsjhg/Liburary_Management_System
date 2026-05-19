# Reports/MostReadBooks/README.md

## Purpose

Tracks most borrowed books during a date range.

Supports:

* analytics
* drill-down modal
* borrower statistics

---

## Components

| Component      | Purpose               |
| -------------- | --------------------- |
| `Books.vue`    | Main report           |
| `BookInfo.vue` | Borrower detail modal |

---

## Known Issues

### Mixin Registration Bug

Incorrect:

```js
mixins: { message_error }
```

Correct:

```js
mixins: [message_error]
```

---

### Incorrect Unique User Counting

Current:

```js
unique_users = data.length
```

Correct:

```js
new Set(users).size
```

---

## Refactor Recommendations

* migrate modal API logic into composable
* normalize statistics aggregation
* remove dead imports

---
