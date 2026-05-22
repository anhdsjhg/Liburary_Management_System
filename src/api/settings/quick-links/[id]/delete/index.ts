import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { QuickLink } from "../../get/types";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [EQuickLinkKeys.mutationKey],
    mutationFn: async (id) => {
      const { data } = await axiosInstance.get("admin/configuration");
      const content = data?.res?.content ?? {};
      const quickLinks: QuickLink[] = (content.quick_links ?? []).filter(
        (item: QuickLink) => item.id !== id
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
