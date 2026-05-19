import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EAnnouncementKeys } from "./enums";

export function useAnnouncementDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EAnnouncementKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`announcement/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EAnnouncementKeys.queryKey] });
    },
  });
}