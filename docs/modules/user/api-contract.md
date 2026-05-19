# API Contract (Inferred)

## User list

GET /api/users?type=student
GET /api/users?type=employee

Returns:
- defaultQuery() result
- paginated list

---

## User profile

GET /api/users/{id}

Returns:
- fullInfo()
- includes contacts, address, status

---

## Photo

GET /api/users/{id}/photo

Returns:
- image blob/base64

---

## Login stats

GET /api/stats/logins/week
GET /api/stats/logins/month
GET /api/stats/logins/total

---

## Authentication

POST /api/auth/login

Returns:
- token
- user object with computed fields