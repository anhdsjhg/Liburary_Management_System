# Migration Strategy

## Step 1 — Freeze backend

Do NOT modify:
- SQL queries
- lib_user_cards
- ERP joins

---

## Step 2 — Build API layer

Typed Axios wrappers

---

## Step 3 — Add transformers

Fix:
- wm_concat → arrays
- null handling
- status normalization

---

## Step 4 — Auth first

Because:
- permissions depend on auth
- UI depends on auth

---

## Step 5 — User list migration

Validate:
- pagination
- status badges
- filters

---

## Step 6 — Profile page

Validate:
- fullInfo()
- address
- contacts
- image

---

## Step 7 — Stats

Validate Oracle date grouping outputs