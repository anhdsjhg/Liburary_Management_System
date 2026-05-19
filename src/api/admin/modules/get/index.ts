import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AdminModulesResponse } from "./types";

export function useAdminModulesApi() {
  return useQuery<AdminModulesResponse>({
    queryKey: ["get:admin-modules"],
    queryFn: async () => {
      const res = await axiosInstance.get("manage/modules");
      return res.data;
    },
  });
}