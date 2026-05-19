import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ActCreateRequest, ActCreateResponse } from "./types";
import { EActKeys } from "./enums";

export function useActCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<ActCreateResponse, Error, ActCreateRequest>({
    mutationKey: [EActKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("acts/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EActKeys.queryKey] });
    },
  });
}