import { useAuthStore } from "@/application/stores/auth.store";
import type { EPermissions } from "@/application/enums/permissions";

export type PermissionKey = EPermissions;

function getStore() {
  return useAuthStore();
}

function hasModule(routeName: EPermissions): boolean {
  return getStore().moduleRouteNames.includes(routeName);
}

function hasAnyModule(routeNames: EPermissions[]): boolean {
  if (routeNames.length === 0) return true;
  return routeNames.some((r) => getStore().moduleRouteNames.includes(r));
}

function hasAllModules(routeNames: EPermissions[]): boolean {
  if (routeNames.length === 0) return true;
  return routeNames.every((r) => getStore().moduleRouteNames.includes(r));
}

function isAdmin(): boolean {
  return getStore().user?.is_admin === true;
}

function hasModuleOrAdmin(routeName: EPermissions): boolean {
  return isAdmin() || hasModule(routeName);
}

export const permissionService = {
  hasModule,
  hasAnyModule,
  hasAllModules,
  isAdmin,
  hasModuleOrAdmin,
} as const;