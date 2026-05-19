import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { PublishersGetRequest, PublishersGetResponse } from "./types";
import { EPublisherKeys } from "./enums";

export function usePublishersGetApi() {
  return useMutation<PublishersGetResponse, Error, PublishersGetRequest>({
    mutationKey: [EPublisherKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("publisher/search", data);
      return res.data;
    },
  });
}