# Permission Module — Overview

## Role in system
The Permission module is the central access control system. It determines:

- Which modules a user can access
- Which actions a user can perform inside modules
- How navigation and UI visibility are rendered
- How API endpoints are protected

## Key principle
This system does NOT use roles or inheritance.
Access is assigned directly:
- module_user → module access
- permission_user → action-level access

## Global impact
This module affects:
- Vue router guards
- sidebar rendering
- button visibility
- API middleware (Laravel)