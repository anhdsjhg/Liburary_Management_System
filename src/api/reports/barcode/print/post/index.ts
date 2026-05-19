import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BarcodePrintRequest } from "./types";
import { EBarcodeKeys } from "../../search/get/enums";

export function useBarcodePrintApi() {
  return useMutation<void, Error, BarcodePrintRequest>({
    mutationKey: [EBarcodeKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("barcode/print", data, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank");
    },
  });
}