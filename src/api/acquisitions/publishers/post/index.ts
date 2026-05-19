import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { PublisherCreateRequest, PublisherCreateResponse } from "./types";
import { EPublisherKeys } from "./enums";

export function usePublisherCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<PublisherCreateResponse, Error, PublisherCreateRequest>({
    mutationKey: [EPublisherKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("publisher/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EPublisherKeys.queryKey] });
    },
  });
}