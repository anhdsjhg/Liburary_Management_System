import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { MediaAutocompleteRequest, MediaAutocompleteResponse } from "./types";

export function useMediaAutocompleteApi(
  params: Ref<MediaAutocompleteRequest> | ComputedRef<MediaAutocompleteRequest>
) {
  return useQuery<MediaAutocompleteResponse>({
    queryKey: ["get:media-autocomplete", params],
    queryFn: async () => {
      const res = await axiosInstance.get("item/autocomplete", {
        params: params.value,
      });
      return res.data;
    },
    enabled: () => params.value.value.length >= 2,
  });
}