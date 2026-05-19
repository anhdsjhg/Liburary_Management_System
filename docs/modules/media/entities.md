# Core Entities (Extended)

## lib_books
- Bibliographic entity (NOT physical)
- Holds metadata only
- Type: BK / VM / MX

---

## lib_discs
- Digital / AV media
- Uses `name` instead of title field
- Types: CF / MP / MU

---

## lib_journals
- Parent serial entity (ISSN-level)
- Does not directly link to inventory

---

## lib_journal_issues
- Actual operational unit for journals
- Contains:
  - inv_count
  - price
  - hesab_id (batch)
  - sigle_type (location)
- Acts as bridge between journal and inventory

---

## lib_inventory
- Physical barcode-level entity
- Exactly ONE FK is active:
  - book_id OR disc_id OR j_issue_id
- Controls availability via:
  - status
  - TAG_INITIALIZED
  - TAG_PRINTED

---

## lib_book_authors
- Shared polymorphic author table
- Links to all media types
- `is_main` defines primary author

---

## lib_loans
- State tracking for inventory items
- locked = 0 → active loan
- locked = 1 → returned

---

## lib_reserve_list
- Reservation tracking per media
- Latest record selected via ROWNUM=1