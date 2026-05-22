import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EBatchKeys } from "./enums";

export function useBatchDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EBatchKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`batch/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EBatchKeys.queryKey] });
    },
  });
}
