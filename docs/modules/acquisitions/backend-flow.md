# Acquisitions Module — Backend Flow

## 1. Batch Creation Flow

1. User creates batch
2. Items assigned to batch
3. Act document generated
4. Supplier linked
5. Financial summary computed

---

## 2. Item Creation Flow (CRITICAL)

Frontend → API → Oracle Package

Flow:
1. POST /items/create
2. Backend calls:
   pkg_acquisition.manage_items
3. Oracle executes:
   - inventory row creation
   - barcode generation
   - RFID initialization
   - media binding
4. Inventory stored in lib_inventory

---

## 3. Inventory Resolution Flow

Every item resolves to:

- book_id OR
- j_issue_id OR
- disc_id

Used by:
- Media module
- Loans module
- Reservations module

---

## 4. Batch Aggregation Flow

1. Query lib_inventory
2. Join journal issues if needed
3. Aggregate counts
4. Compute financial totals
5. Return batch summary

---

## 5. Act Flow

Acts are:
- legal procurement documents
- linked to batches
- immutable after creation (conceptually)