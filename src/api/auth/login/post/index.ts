import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AuthLoginRequest, AuthLoginResponse } from "./types";
import { EAuthLoginKeys } from "./enums";

export function useAuthLoginApi() {
  return useMutation<AuthLoginResponse, Error, AuthLoginRequest>({
    mutationKey: [EAuthLoginKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("login", data);
      return res.data;
    },
  });
}