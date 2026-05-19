import type { NavigationGuard } from "vue-router";
import { permissionService } from "@/application/services/permissionService";
import { RouteNames } from "@/application/router/routeNames";

export const adminGuard: NavigationGuard = (to) => {
  const meta = to.meta;

  if (!meta?.adminOnly) return true;

  if (!permissionService.isAdmin()) {
    return { name: RouteNames.FORBIDDEN };
  }

  return true;
};