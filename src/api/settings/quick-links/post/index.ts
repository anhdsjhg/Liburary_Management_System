import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { QuickLinkCreateRequest } from "./types";
import type { QuickLink } from "../get/types";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, QuickLinkCreateRequest>({
    mutationKey: [EQuickLinkKeys.mutationKey],
    mutationFn: async (newItem) => {
      const { data } = await axiosInstance.get("admin/configuration");
      const content = data?.res?.content ?? {};
      const quickLinks: QuickLink[] = content.quick_links ?? [];
      const newId = Date.now();
      await axiosInstance.post("admin/configuration", {
        content: { ...content, quick_links: [...quickLinks, { id: newId, ...newItem }] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQuickLinkKeys.queryKey] });
    },
  });
}
