import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { QuickLinkCreateRequest, QuickLinkCreateResponse } from "./types";
import { EQuickLinkKeys } from "./enums";

export function useQuickLinkCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<QuickLinkCreateResponse, Error, QuickLinkCreateRequest>({
    mutationKey: [EQuickLinkKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("quick-links/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQuickLinkKeys.queryKey] });
    },
  });
}