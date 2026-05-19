# Data Flow Architecture

## Authentication flow

1. User sends login request
2. System checks Student or Employee table
3. Passport token generated
4. Entry added to `web_log`
5. User returned with computed fields

---

## Identity resolution

Step chain:

user_cid
  ↓
lib_user_cards
  ↓
ERP tables (students / employee)
  ↓
computed profile

---

## Profile building flow

Each user response triggers:

- multiple DB joins
- computed attributes via `$appends`
- optional ERP lookups (email, degree, position)

---

## Status computation (critical logic)

Priority order:

1. Debt (active loans)
2. Penalty
3. Inactive
4. OK