import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ActUpdateRequest, ActUpdateResponse } from "./types";
import { EActKeys } from "./enums";

export function useActUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<ActUpdateResponse, Error, ActUpdateRequest>({
    mutationKey: [EActKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.put("acts/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EActKeys.queryKey] });
    },
  });
}