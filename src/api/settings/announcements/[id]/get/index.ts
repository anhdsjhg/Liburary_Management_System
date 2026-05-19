import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { AnnouncementShowResponse } from "./types";

export function useAnnouncementShowApi(
  id: Ref<number | string> | ComputedRef<number | string>
) {
  return useQuery<AnnouncementShowResponse>({
    queryKey: ["get:announcement-show", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`announcement/get/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });
}