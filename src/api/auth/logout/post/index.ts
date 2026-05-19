import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AuthLogoutResponse } from "./types";

export function useAuthLogoutApi() {
  return useMutation<AuthLogoutResponse, Error, void>({
    mutationFn: async () => {
      const res = await axiosInstance.post("logout");
      return res.data;
    },
  });
}