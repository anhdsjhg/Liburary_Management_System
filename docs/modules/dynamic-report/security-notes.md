# Security Notes

## 1. SQL execution risk

input_sql is executed directly:

DB::select(input_sql)

No sanitization layer exists.

---

## 2. query_string execution

Stored SQL executed at runtime

Potential injection vector if misused

---

## 3. No sandboxing

Reports can access any DB table allowed by connection

---

## 4. No parameter binding validation

Frontend parameters are not validated against query_string