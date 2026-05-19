export type AdminPermissionItem = {
  id: number;
  method_name: string;
  display_name: string;
  description: string;
  is_shown: boolean;
  route_name: string;
};

export type AdminModuleWithPermissions = {
  id: number;
  route_name: string;
  display_name: string;
  description: string;
  parent_id: number | null;
  permissions?: AdminPermissionItem[];
  visualization?: AdminPermissionItem[];
};

export type AdminPermissionsResponse = {
  res: AdminModuleWithPermissions[];
};

export type AdminPermissionsRequest = {
  user_id?: number;
  module?: string;
};