export type AdminModulePermission = {
  id: number;
  method_name: string;
  display_name: string;
  description: string;
  is_shown: boolean;
  route_name: string;
};

export type AdminModule = {
  id: number;
  route_name: string;
  display_name: string;
  description: string;
  parent_id: number | null;
  permissions?: AdminModulePermission[];
  visualization?: AdminModulePermission[];
};

export type AdminModulesResponse = {
  res: AdminModule[];
};