import type { ServiceUser } from "@/api/service-desk/users/get/types";

export type UsersByModuleRequest = {
  add_options: Array<{ key: string; value: string | number }>;
  page?: number;
  per_page?: number;
};

export type UsersByModuleResponse = {
  res: {
    data: ServiceUser[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};
