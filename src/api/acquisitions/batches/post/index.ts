import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BatchCreateRequest, BatchCreateResponse } from "./types";
import { EBatchKeys } from "./enums";

export function useBatchCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<BatchCreateResponse, Error, BatchCreateRequest>({
    mutationKey: [EBatchKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("batch/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EBatchKeys.queryKey] });
    },
  });
}