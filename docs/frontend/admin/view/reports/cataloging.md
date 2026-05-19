# Reports / Cataloging

## Overview
Cataloging analytics dashboard showing progress across:
- Books
- Journals
- Discs

Each category includes:
- Completed
- In progress
- Not started

---

## Architecture
- Type: Domain Controller (chart-heavy)
- Pattern: API → transform → pie charts
- State: Local only

---

## API
### GET `/cataloging/reports`

Returns aggregated statistics per material type

---

## UI
- 3 Pie Charts
- Per-category status breakdown

---

## Mixins
- chartMixins
- PieOptions
- lineOptions
- message_error ⚠️ (correctly declared here only)

---

## Known Issues
- Label mutation bug (`+=`) causes accumulation
- Dead imports: TableVue
- Dead data fields: link, commit
- Shared-reference dataset mutation
- Repeated API refresh corrupts labels

---

## Business Logic
- Labels are permanently mutated after first render
- Component assumes single-load lifecycle

---

## Risks
- Data corruption on refresh
- Chart label duplication
- Silent UI inconsistency after re-fetch

---

## Migration Notes
- Replace mutation with derived labels
- Remove dead imports/fields
- Introduce `useCatalogingReports()`
- Ensure immutable dataset transformation