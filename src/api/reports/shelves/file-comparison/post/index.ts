import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ShelvesFileComparisonResponse } from "./types";
import { EShelvesKeys } from "../../search/get/enums";

export function useShelvesFileComparisonApi() {
  return useMutation<ShelvesFileComparisonResponse, Error, FormData>({
    mutationKey: [EShelvesKeys.compareMutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("shelves/compare-files", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
  });
}