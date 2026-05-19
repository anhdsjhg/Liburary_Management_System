
---

# 📄 `technical-debt.md`
```md
# Acquisitions Module — Technical Debt

## 1. Critical Issues

### ❌ Oracle stored procedure dependency
- pkg_acquisition.manage_items is a black box
- breaks application-level control
- cannot be replicated in frontend

---

### ❌ Polymorphic inventory explosion
lib_inventory references 3 entity types:
- books
- journals
- discs

Every query must handle:
- COALESCE logic
- OR joins
- null branches

---

### ❌ Journal split-source problem
Counts come from:
- lib_inventory
- lib_journal_issues

This breaks caching consistency.

---

## 2. Performance Risks

- OR-based joins on inventory
- multi-source aggregation per batch
- no indexing strategy visible for polymorphic keys

---

## 3. Architectural Risks

- business logic embedded in Oracle package
- no service-layer abstraction in backend
- frontend cannot simulate item creation logic

---

## 4. Data Consistency Risks

- inventory can become orphaned if procedure fails
- batch totals depend on multiple tables
- journal issue pricing not centralized

---

## 5. Migration Risk

Highest-risk module in system because:

- contains procedural DB logic
- multi-entity polymorphism
- financial aggregation logic inside SQL