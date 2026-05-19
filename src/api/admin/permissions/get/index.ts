import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AdminPermissionsResponse } from "./types";
import { EPermissionKeys } from "./enums";

export function useAdminPermissionsApi() {
  return useQuery<AdminPermissionsResponse>({
    queryKey: [EPermissionKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("manage/permissions");
      return res.data;
    },
  });
}