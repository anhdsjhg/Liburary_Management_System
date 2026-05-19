# Data Flow

## Step 1 — Load categories

report_categories → flat list → tree built in UI

---

## Step 2 — Load reports

filter:
- category_id
- is_active = 1

---

## Step 3 — Load report structure

Parallel fetch:
- report_fields
- report_parameters

---

## Step 4 — Resolve parameters

IF input_sql exists:
    execute SQL
    attach result as values[]

---

## Step 5 — Execute report

query_string + user params → DB execution → rows returned