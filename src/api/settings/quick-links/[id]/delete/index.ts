import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EQuickLinkKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`quick-links/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQuickLinkKeys.queryKey] });
    },
  });
}