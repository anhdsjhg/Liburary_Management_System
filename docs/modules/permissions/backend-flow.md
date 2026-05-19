# Permission Module — Data Flow

## 1. User login flow
1. Backend returns:
   - modules list
   - permissions list

2. Frontend hydrates Pinia store:
   - moduleSet
   - permissionSet

3. Guards use synchronous checks:
   - hasModule(route)
   - hasPermission(route, method)

## 2. Navigation rendering
Sidebar:
- filters modules by moduleSet
- hides unauthorized routes

## 3. API access control
Middleware:
- checks module_user
- optionally checks permission_user