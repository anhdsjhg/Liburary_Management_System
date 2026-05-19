import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EPublisherKeys } from "./enums";

export function usePublisherDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EPublisherKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`publisher/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EPublisherKeys.queryKey] });
    },
  });
}