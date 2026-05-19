import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BatchesGetRequest, BatchesGetResponse } from "./types";
import { EBatchKeys } from "./enums";

export function useBatchesGetApi() {
  return useMutation<BatchesGetResponse, Error, BatchesGetRequest>({
    mutationKey: [EBatchKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("batch/search", data);
      return res.data;
    },
  });
}