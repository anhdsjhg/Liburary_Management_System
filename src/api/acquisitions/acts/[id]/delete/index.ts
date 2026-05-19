import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EActKeys } from "./enums";

export function useActDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EActKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`acts/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EActKeys.queryKey] });
    },
  });
}