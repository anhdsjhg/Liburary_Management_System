import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AuthMeResponse } from "./types";
import { EAuthMeKeys } from "./enums";

export function useAuthMeApi() {
  return useQuery<AuthMeResponse>({
    queryKey: [EAuthMeKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("user");
      return res.data;
    },
  });
}