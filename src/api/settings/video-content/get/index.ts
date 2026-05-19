import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { VideoContentGetResponse } from "./types";
import { EVideoContentKeys } from "./enums";

export function useVideoContentGetApi() {
  return useQuery<VideoContentGetResponse>({
    queryKey: [EVideoContentKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("video/index");
      return res.data;
    },
  });
}