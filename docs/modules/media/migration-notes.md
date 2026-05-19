# Migration Notes (Extended)

## 1. Backend Freeze Requirement

Do NOT modify:

- Oracle SQL logic
- LISTAGG usage
- ROWNUM patterns
- NVL / DECODE usage
- MaterialTypeFactory mapping

---

## 2. Frontend Migration Priority

1. Media list
2. Media detail
3. Loan history
4. Most-read stats
5. Journal batch view

---

## 3. Critical Risks

### Multi-location duplication
Backend returns duplicate rows per sigle_type.

Must be handled in frontend.

---

### Journal inconsistency
- title_en hardcoded
- author grouping per issue (bug)

---

### Null factory crash risk
Unknown type_key → null → fatal error

---

## 4. Safe Refactor Scope

Frontend only:

- UI grouping
- display normalization
- caching strategy
- route mapping

---

## 5. Unsafe Scope (DO NOT TOUCH)

- inventory logic
- loan computation
- availability SQL
- Oracle-specific constructs