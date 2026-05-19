import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EVideoContentKeys } from "./enums";

export function useVideoContentDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EVideoContentKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`video/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVideoContentKeys.queryKey] });
    },
  });
}