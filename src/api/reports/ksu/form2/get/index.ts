import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { KsuForm2Request, KsuForm2Response } from "./types";
import { EKsuForm2Keys } from "./enums";

export function useKsuForm2Api() {
  return useMutation<KsuForm2Response, Error, KsuForm2Request>({
    mutationKey: [EKsuForm2Keys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("form2_report/get", data);
      return res.data;
    },
  });
}