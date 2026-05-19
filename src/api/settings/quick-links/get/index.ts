import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { QuickLinksGetResponse } from "./types";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkGetApi() {
  return useQuery<QuickLinksGetResponse>({
    queryKey: [EQuickLinkKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("admin/configuration");
      return {
        res: res.data?.res?.content?.quick_links ?? [],
      };
    },
  });
}