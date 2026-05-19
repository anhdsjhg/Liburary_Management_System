# Acquisitions Module — API Contract

## 1. Batch API

### GET /api/acquisitions/batches

Returns list of acquisition batches.

Includes:
- batch metadata
- item counts
- total financial value

⚠️ Item counts are derived from TWO sources:
- lib_inventory (books/discs)
- lib_journal_issues (journals)

---

### GET /api/acquisitions/batches/{id}

Returns:
- batch details
- acts
- aggregated items
- financial summary

---

## 2. Act API

### GET /acts
### POST /acts
### PUT /acts/{id}
### DELETE /acts/{id}

Standard CRUD.

---

## 3. Item API (CRITICAL)

### POST /items/create

⚠️ NOT a normal insert

Calls: pkg_acquisition.manage_items


Backend behavior:
- generates inventory record
- assigns barcode
- initializes RFID tags
- binds media type (book/journal/disc)

---

## 4. Supplier API

### GET /suppliers
### CRUD operations

Simple relational entity — no stored procedures.

---

## 5. Publisher API

Same structure as Supplier.

---

## 6. Financial API

### GET /batches/{id}/summary

Returns:
- total_sum = inv_count * price (SQL-level computation)
- aggregated by batch