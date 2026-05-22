import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AnnouncementUpdateRequest, AnnouncementUpdateResponse } from "./types";
import { EAnnouncementKeys } from "./enums";

export function useAnnouncementUpdateApi() {
  const queryClient = useQueryClient();

  return useMutation<
    AnnouncementUpdateResponse,
    Error,
    AnnouncementUpdateRequest
  >({
    mutationFn: async (data) => {
      const { announcement_id, ...body } = data;

      const res = await axiosInstance.patch(
        `announcement/${announcement_id}`,
        body
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EAnnouncementKeys.queryKey],
      });
    },
  });
}