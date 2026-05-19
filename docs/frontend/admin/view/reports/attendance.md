# Reports / Attendance

## Overview
Attendance dashboard showing virtual library visits for students and employees. Provides weekly and monthly trends with line and pie charts.

---

## Architecture
- Type: Domain Controller Component
- State: Local reactive + Vuex loading flag
- Data Source: Single API endpoint

---

## API
### GET `/attendance/virtual`
Returns:
- `byWeek`
- `byMonth`
- `total.students`
- `total.employees`

---

## Data Flow
1. Component mounts
2. `changeData()` called
3. API request executed
4. Weekly/monthly dataset selected
5. Chart datasets mutated in place

---

## UI Features
- Weekly / Monthly toggle (dropdown)
- Line chart (trend)
- Pie chart (distribution)

---

## Mixins
- chartMixins
- lineOptions
- PieOptions

⚠️ `message_error` used but NOT declared in mixins (runtime risk)

---

## Known Issues
- Missing mixin: `message_error`
- Shared reference mutation in chart datasets
- Hardcoded label typo: "Stuff" instead of "Staff"
- Dead import: `Tabs`
- Data mutation instead of immutable update

---

## Business Logic
- Weekly view is default
- Monthly data preloaded but unused until toggle
- Pie chart uses API totals, not timeline aggregation

---

## Risks
- Chart reactivity inconsistency due to shallow copies
- Silent failure if mixin error handler is missing
- UI label typo visible to end users

---

## Migration Notes
Recommended refactor:
- Replace API call with `useAttendanceData()`
- Make chart data immutable
- Remove direct dataset mutation
- Fix "Stuff" → "Staff"