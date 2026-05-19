# Permission Module — Backend Logic

## Module access check
- module_user determines access
- binary logic (exists / not exists)

## Permission check
- permission_user determines action-level access

## No role system
No inheritance exists between modules or permissions.

## Critical constraint
route_name must exist in DB before middleware works:
- uses firstOrFail()
- missing module = 404 error

## Risk area
No cascade logic:
- removing module does NOT remove permissions automatically