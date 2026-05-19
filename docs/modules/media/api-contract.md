# API Contract (Extended)

## GET /media

Returns unified catalog:

- books
- discs
- journals

Fields include:

- available (computed)
- total (inventory count)
- location (sigle_type)
- type_key

---

## GET /media/{id}

Returns enriched media object:

- authors
- page_number
- parallel_title
- main_author
- other_author

---

## GET /loans/user/{cid}/history

Returns:

- loan records
- computed status field
- availability snapshot

---

## GET /loans/most-read

Returns aggregated usage statistics across all media types.

---

## GET /journal-issues/batch/{id}

Returns financial aggregation:

- inv_count * price
- total_sum computed in SQL

---

## Key Contract Behavior

- locale affects SQL output
- Journal uses hardcoded title_en (bug)
- availability may be NULL if no inventory exists