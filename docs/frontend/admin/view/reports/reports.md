# Reports/README.md

## Overview

`Reports/` contains the application's operational, statistical, inventory, and regulatory reporting system.

The folder includes:

* statistical reports
* acquisition reports
* circulation reports
* inventory reports
* export-only reports
* file comparison tools
* chart-based analytics

---

## Folder Structure

```txt
Reports/
├── InventoryNumber/
├── KSU/
├── MostReadBooks/
├── NotFoundBooks/
├── Report/
├── ServiceDesk/
└── Shelves/
```

---

# Reports/Report/README.md

## Purpose

Circulation statistics chart report.

Provides:

* yearly analytics
* borrowing trends
* Excel export

---

## Positive Architecture Notes

This is one of the cleanest report components.

Strengths:

* local state
* isolated logic
* simple API contract
* chart abstraction

---

## Known Issues

### Shared Reference Dataset Mutation

Chart datasets are mutated in place.

Potential issue:

* stale references
* chart redraw inconsistencies

---

### Incorrect Searching Flag

`searching = true`

is triggered during download operation.

---

## Recommendations

* immutable chart updates
* query composable
* separate export state from render state

---