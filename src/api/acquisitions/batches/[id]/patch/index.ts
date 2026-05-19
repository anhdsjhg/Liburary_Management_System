import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BatchUpdateRequest, BatchUpdateResponse } from "./types";
import { EBatchKeys } from "./enums";

export function useBatchUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<BatchUpdateResponse, Error, BatchUpdateRequest>({
    mutationKey: [EBatchKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.put("batch/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EBatchKeys.queryKey] });
    },
  });
}