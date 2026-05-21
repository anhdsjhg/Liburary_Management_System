import type { AdminModuleWithPermissions } from "@/api/admin/permissions/get/types";

export type UserAvailablePermissionsResponse = {
  res: AdminModuleWithPermissions[];
};
