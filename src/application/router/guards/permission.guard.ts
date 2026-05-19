import type { NavigationGuard } from "vue-router";
import { permissionService } from "@/application/services/permissionService";
import { RouteNames } from "@/application/router/routeNames";
import type { EPermissions } from "@/application/enums/permissions";

export const permissionGuard: NavigationGuard = (to) => {
  const permissions = to.meta?.permissions as EPermissions[] | undefined;

  if (!permissions?.length) return true;

  if (!permissionService.hasAnyModule(permissions)) {
    return { name: RouteNames.FORBIDDEN };
  }

  return true;
};