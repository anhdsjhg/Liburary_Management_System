import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { UsersByModuleRequest, UsersByModuleResponse } from "./types";

export function useUsersByModuleApi() {
  return useMutation<UsersByModuleResponse, Error, UsersByModuleRequest>({
    mutationKey: ["post:users-by-module"],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("manage/users/by_module/search", data);
      return res.data;
    },
  });
}
