import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EArrivalKeys } from "./enums";

export function useArrivalDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { type: string; id: number | string }>({
    mutationKey: [EArrivalKeys.mutationKey],
    mutationFn: async ({ type, id }) => {
      await axiosInstance.delete(`arrivals/delete/${type}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EArrivalKeys.queryKey] });
    },
  });
}