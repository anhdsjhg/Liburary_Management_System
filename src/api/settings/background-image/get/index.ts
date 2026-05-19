import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BackgroundImageGetResponse } from "./types";
import { EBackgroundImageKeys } from "./enums";

export function useBackgroundImageGetApi() {
  return useQuery<BackgroundImageGetResponse>({
    queryKey: [EBackgroundImageKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("background-image/index");
      return res.data;
    },
  });
}