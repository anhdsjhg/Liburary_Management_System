# Acquisitions Module — Migration Notes

## 1. DO NOT CHANGE (Backend Frozen Areas)

- pkg_acquisition.manage_items
- lib_inventory schema
- journal issue linkage logic
- batch financial SQL calculations

---

## 2. REQUIRED BACKEND HARDENING

### Step 1 — Document Oracle procedure
Must obtain:
- full package body
- barcode generation rules
- RFID initialization rules

---

### Step 2 — Normalize batch aggregation
Ensure consistent:
- inventory + journal issue counting
- single source of truth layer (optional future refactor)

---

### Step 3 — Add API resource layer
Prevent frontend dependency on raw SQL shape

---

## 3. FRONTEND STRATEGY

### Phase 1
- build batch UI
- read-only mode

### Phase 2
- add item creation via API only (no local logic)

### Phase 3
- integrate journal + inventory normalization layer

---

## 4. STRATEGIC WARNING

This module cannot be fully migrated without:

- Oracle DBA cooperation
- stored procedure documentation
- inventory generation rules understanding