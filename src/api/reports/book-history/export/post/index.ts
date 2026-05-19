import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BookHistoryExportRequest } from "./types";
import { EBookHistoryKeys } from "../../search/get/enums";

export function useBookHistoryExportApi() {
  return useMutation<void, Error, BookHistoryExportRequest>({
    mutationKey: [EBookHistoryKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("book-history/export", data, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "book_history.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    },
  });
}