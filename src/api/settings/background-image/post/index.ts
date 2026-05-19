import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BackgroundImageUploadRequest, BackgroundImageUploadResponse } from "./types";
import { EBackgroundImageKeys } from "./enums";

export function useBackgroundImageUploadApi() {
  const queryClient = useQueryClient();
  return useMutation<BackgroundImageUploadResponse, Error, BackgroundImageUploadRequest>({
    mutationKey: [EBackgroundImageKeys.mutationKey],
    mutationFn: async (data) => {
      const formData = new FormData();
      if (data.image) formData.append("image", data.image);
      if (data.image_url) formData.append("image_url", data.image_url);
      const res = await axiosInstance.post("background-image/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EBackgroundImageKeys.queryKey] });
    },
  });
}