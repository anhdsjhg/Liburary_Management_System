# Permission Module — Entities

## modules
Represents system sections (admin, cataloging, reports).

- route_name = PRIMARY KEY LOGIC (string-based FK)
- parent_id = UI grouping only (not enforced logic)

## permissions
Represents actions inside a module.

- route_name → links to modules.route_name
- method_name → action key (create, delete, export)
- is_shown → controls admin UI visibility only

## module_user
User ↔ Module access mapping.

- module_id
- user_cid (string-based user ID)

## permission_user
User ↔ Permission mapping.

- permission_id
- user_cid

## Key risk
route_name is a string FK → breaking change risk