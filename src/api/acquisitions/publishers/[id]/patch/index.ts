import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { PublisherUpdateRequest, PublisherUpdateResponse } from "./types";
import { EPublisherKeys } from "./enums";

export function usePublisherUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<PublisherUpdateResponse, Error, PublisherUpdateRequest>({
    mutationKey: [EPublisherKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.put("publisher/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EPublisherKeys.queryKey] });
    },
  });
}
