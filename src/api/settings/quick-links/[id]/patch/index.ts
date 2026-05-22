import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { QuickLinkUpdateRequest } from "./types";
import type { QuickLink } from "../../get/types";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, QuickLinkUpdateRequest>({
    mutationKey: [EQuickLinkKeys.mutationKey],
    mutationFn: async ({ id, ...data }) => {
      const { data: res } = await axiosInstance.get("admin/configuration");
      const content = res?.res?.content ?? {};
      const quickLinks: QuickLink[] = (content.quick_links ?? []).map((item: QuickLink) =>
        item.id === id ? { ...item, ...data } : item
      );
      await axiosInstance.post("admin/configuration", {
        content: { ...content, quick_links: quickLinks },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQuickLinkKeys.queryKey] });
    },
  });
}
