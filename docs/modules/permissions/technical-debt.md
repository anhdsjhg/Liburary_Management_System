# Permission Module — Risks

## 1. String FK coupling
route_name is used across:
- DB
- backend
- frontend

Any rename breaks system

## 2. No audit trail
module_user / permission_user have no timestamps

## 3. No cascade deletion
Removing module does NOT clean permissions

## 4. firstOrFail dependency
Missing module = runtime 404 error

## 5. No roles
Admin must assign permissions manually per user

## 6. Performance risk
hasManyThrough on string keys may degrade at scale