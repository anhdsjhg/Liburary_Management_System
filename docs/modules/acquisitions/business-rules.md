# Acquisitions Module — Business Rules

## 1. Inventory Rule (CRITICAL)

Each inventory record MUST reference exactly one:

- book_id
- j_issue_id
- disc_id

Never multiple, never zero.

---

## 2. Creation Rule

Inventory creation is NOT allowed via ORM.

Must use: pkg_acquisition.manage_items

This ensures:
- barcode uniqueness
- RFID initialization
- system consistency

---

## 3. Batch Rule

- One batch = multiple items
- Items can belong to only one batch
- Batch defines financial grouping

---

## 4. Financial Rule

Item cost: inv_count × price

Computed at SQL level (no backend recalculation layer)

---

## 5. Supplier Rule

- Suppliers provide physical/digital assets
- Linked to batch, not individual item

---

## 6. Publisher Rule

- Used only for bibliographic metadata
- Not equal to supplier

---

## 7. Journal Rule

- Journals use lib_journal_issues
- Items attach to issues, not parent journal

---

## 8. System Constraint

Any new material type added requires:
- DB schema update
- Oracle procedure update
- ALL inventory queries updated