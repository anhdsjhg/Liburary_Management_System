import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BarcodeSearchRequest, BarcodeSearchResponse } from "./types";
import { EBarcodeKeys } from "./enums";

export function useBarcodeSearchApi() {
  return useMutation<BarcodeSearchResponse, Error, BarcodeSearchRequest>({
    mutationKey: [EBarcodeKeys.searchQueryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("barcode/search", data);
      return res.data;
    },
  });
}