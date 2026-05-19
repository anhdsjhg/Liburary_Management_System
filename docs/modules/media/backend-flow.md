# Backend Flow (Extended)

## 1. Query Construction Flow

Each media request follows:

1. defaultQuery() builds base SQL
2. Controller applies filters (search, type, language, year)
3. Oracle executes full query (including subqueries)
4. availability is computed per row (derived table join)

---

## 2. Detail Enrichment Flow

withAdditionalAttributes():

- main_author
- other_author
- page_number
- parallel_title

---

## 3. Type Resolution Layer

MaterialTypeFactory:

- BK / VM / MX → Book
- CF / MP / MU → Disc
- CR → Journal

⚠ No fallback branch → null risk at runtime

---

## 4. Journal Resolution Flow

Journal is NOT direct inventory:

journal → journal_issues → inventory

This adds extra join layer before availability calculation.

---

## 5. Update Flow

- JournalIssue::update()
  → ManageBuilder::updateBuilder()

❗ bypasses Eloquent lifecycle

---

## 6. UNION Compatibility Design

All media queries share:

- id
- barcode
- type_key
- nullable FK placeholders

This enables UNION across media types.