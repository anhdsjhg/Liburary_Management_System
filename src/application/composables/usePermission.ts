import { useAuthStore } from "@/application/stores/auth.store";
import type { EPermissions } from "@/application/enums/permissions";

export type PermissionKey = EPermissions;

export function usePermission() {
  const authStore = useAuthStore();

  function hasModule(routeName: EPermissions): boolean {
    return authStore.moduleRouteNames.includes(routeName);
  }

  function hasAnyModule(routeNames: EPermissions[]): boolean {
    if (routeNames.length === 0) return true;
    return routeNames.some((r) => authStore.moduleRouteNames.includes(r));
  }

  function hasAllModules(routeNames: EPermissions[]): boolean {
    if (routeNames.length === 0) return true;
    return routeNames.every((r) => authStore.moduleRouteNames.includes(r));
  }

  function isAdmin(): boolean {
    return authStore.user?.is_admin === true;
  }

  function hasModuleOrAdmin(routeName: EPermissions): boolean {
    return isAdmin() || hasModule(routeName);
  }

  return {
    hasModule,
    hasAnyModule,
    hasAllModules,
    isAdmin,
    hasModuleOrAdmin,
  };
}