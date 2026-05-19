import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { VideoContentCreateRequest, VideoContentCreateResponse } from "./types";
import { EVideoContentKeys } from "./enums";

export function useVideoContentCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<VideoContentCreateResponse, Error, VideoContentCreateRequest>({
    mutationKey: [EVideoContentKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("video/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVideoContentKeys.queryKey] });
    },
  });
}