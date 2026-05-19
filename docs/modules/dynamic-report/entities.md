# Core Entities

## report_categories

Hierarchical grouping of reports.

- category_id (PK)
- parent_id (tree structure)
- title_ru / title_kz / title_en

---

## report_queries

Main report definition entity.

- query_id (PK)
- query_title
- query_description
- query_string (RAW SQL)
- category_id (FK)
- is_active

---

## report_fields

Defines output columns.

- field → DB column key
- field_name → display label

⚠️ purely UI metadata

---

## report_parameters

Defines report filters.

- parameter → binding key
- param_type → input type
- param_title → label
- v_component → frontend component name
- input_sql → dropdown source query

---

## Runtime entity

### parameter.values

Generated dynamically from:

input_sql → DB::select() → values[]