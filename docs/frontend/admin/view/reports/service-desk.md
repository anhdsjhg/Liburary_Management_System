# Reports/ServiceDesk/README.md

## Purpose

Exports service desk activity reports.

Features:

* grouped export
* total export
* date range filtering

---

## Known Issues

### Race Condition

`this.link`

is mutable shared request state.

Double-click can cause endpoint mismatch.

---

## Recommended Fix

Use local immutable variable:

```js
const link = type === 1
  ? 'service/export/total'
  : 'service/export/grouped'
```

---

## Additional Notes

* endpoint typo `groupped` inherited from backend
* method name `exportPDF` misleading because export is XLSX

---