# Acquisitions Module — Entities

## 1. lib_inventory (CORE ENTITY)

The central entity of the entire system.

### Structure
- inv_id (PK)
- book_id (nullable)
- j_issue_id (nullable)
- disc_id (nullable)
- status
- TAG_INITIALIZED
- TAG_PRINTED

### Rule
Exactly ONE of:
- book_id
- j_issue_id
- disc_id
must be non-null

### Behavior
- Represents physical or digital copy
- Linked to Media module
- Controlled by Oracle procedure during creation

---

## 2. Acquisition Batch

Represents procurement grouping.

### Purpose
- Groups items purchased together
- Tracks financial totals
- Used for reporting and accounting

---

## 3. Act (Acquisition Act)

Represents official procurement document.

### Purpose
- Legal record of purchase
- Links batch → supplier → items

---

## 4. Supplier

External vendor entity.

- supplies materials
- linked to batches
- used in procurement cost tracking

---

## 5. Publisher

Bibliographic supplier entity.

- used for book metadata
- separate from supplier (important distinction)

---

## 6. lib_journal_issues (dependency)

Used for:
- periodical acquisitions
- batch-level issue tracking
- pricing calculations

---

## 7. External Dependency

### pkg_acquisition.manage_items (Oracle package)

Responsible for:
- inventory creation
- barcode generation
- RFID initialization
- enforcing inventory rules

This is a **black-box domain engine** inside Oracle.