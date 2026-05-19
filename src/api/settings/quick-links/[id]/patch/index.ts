import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { QuickLinkUpdateRequest, QuickLinkUpdateResponse } from "./types";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<QuickLinkUpdateResponse, Error, QuickLinkUpdateRequest>({
    mutationKey: [EQuickLinkKeys.mutationKey],
    mutationFn: async ({ id, ...data }) => {
      const res = await axiosInstance.post(`quick-links/update`, { id, ...data });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQuickLinkKeys.queryKey] });
    },
  });
}