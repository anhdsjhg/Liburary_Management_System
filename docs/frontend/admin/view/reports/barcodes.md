# Reports / Barcodes

## Overview
Displays barcode system statistics for inventory items:
- Printed vs Not Printed
- Initialized vs Not Initialized
- Combined state distribution

---

## Architecture
- Type: Domain Controller (lightweight)
- State: Local only
- API-driven dashboard

---

## API
### GET `/barcode/reports`

Returns:
- printed / not printed
- initialized / not initialized
- metadata status

---

## UI Components
- PieChart (3 instances)
- Navigation button to `/acquisitions/print`

---

## Mixins
- chartMixins
- PieOptions
⚠️ `message_error` missing from mixins

---

## Known Issues
- Missing `message_error` mixin (runtime risk)
- Hardcoded route string `/acquisitions/print`
- Hardcoded English labels (no i18n)
- Shared-reference mutation in chart datasets
- Undefined fallback state for `data`

---

## Business Logic
- "Meta" category = items with metadata only
- Combines 3 independent barcode states into one view

---

## Risks
- Broken navigation if route changes
- Chart not reactive on deep mutation
- Missing error handler crashes on API failure

---

## Migration Notes
- Replace route string with named route
- Move labels to i18n system
- Use immutable chart data updates
- Add composable `useBarcodeReports()`