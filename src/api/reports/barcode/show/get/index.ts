import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BarcodeReportsResponse } from "./types";
import { EBarcodeKeys } from "../../search/get/enums";

export function useBarcodeReportsApi() {
  return useQuery<BarcodeReportsResponse>({
    queryKey: [EBarcodeKeys.showQueryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("barcode/reports");
      return res.data;
    },
  });
}