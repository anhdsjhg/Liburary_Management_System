import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { VideoContentUpdateRequest, VideoContentUpdateResponse } from "./types";
import { EVideoContentKeys } from "./enums";

export function useVideoContentUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<VideoContentUpdateResponse, Error, VideoContentUpdateRequest>({
    mutationKey: [EVideoContentKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("video/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVideoContentKeys.queryKey] });
    },
  });
}