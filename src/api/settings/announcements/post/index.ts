import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AnnouncementCreateRequest, AnnouncementCreateResponse } from "./types";
import { EAnnouncementKeys } from "./enums";
import type {
  AnnouncementSearchRequest,
  AnnouncementSearchResponse,
} from "./types";


export function useAnnouncementCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<AnnouncementCreateResponse, Error, AnnouncementCreateRequest>({
    mutationKey: [EAnnouncementKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("announcement/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EAnnouncementKeys.queryKey] });
    },
  });
}

export function useAnnouncementSearchApi() {
  return useMutation 
  <
    AnnouncementSearchResponse,
    Error,
    AnnouncementSearchRequest
  >({
    mutationFn: async (data: AnnouncementSearchRequest) => {
      const res = await axiosInstance.post("announcement/search", data);
      return res.data;
    },
  });
}