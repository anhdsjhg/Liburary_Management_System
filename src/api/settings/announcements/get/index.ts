import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AnnouncementsGetResponse } from "./types";
import { EAnnouncementKeys } from "./enums";

export function useAnnouncementGetApi() {
  return useQuery<AnnouncementsGetResponse>({
    queryKey: [EAnnouncementKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("announcement/show_actual");
      return res.data;
    },
  });
}