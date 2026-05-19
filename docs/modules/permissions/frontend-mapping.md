# Permission Module — Frontend Mapping (Vue 3)

## Pinia store (runtime guard system)
Used for:
- route guards
- UI visibility

Structure:
- Set<module_route_name>
- Set<module::method>

## TanStack Query
Used only for:
- admin UI (permission management)

NOT used in route guards

## Critical rule
Never use async checks in router guards

## Example
hasModule("cataloging")
hasPermission("books", "create")