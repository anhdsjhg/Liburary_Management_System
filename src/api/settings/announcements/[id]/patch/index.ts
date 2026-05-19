import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AnnouncementUpdateRequest, AnnouncementUpdateResponse } from "./types";
import { EAnnouncementKeys } from "./enums";

export function useAnnouncementUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<AnnouncementUpdateResponse, Error, AnnouncementUpdateRequest>({
    mutationKey: [EAnnouncementKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("announcement/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EAnnouncementKeys.queryKey] });
    },
  });
}