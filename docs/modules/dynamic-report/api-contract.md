# API Contract

## GET /reports/categories
Returns all report categories

---

## GET /reports/queries?category_id
Returns active reports in category

---

## GET /reports/fields?query_id
Returns output columns

---

## GET /reports/parameters?query_id
Returns filters + resolved values

---

## POST /reports/execute
Executes report SQL with parameters

---

## Response shape (parameters)

{
  parameter: string
  param_title: string
  param_type: string
  v_component: string
  values: array | null
}