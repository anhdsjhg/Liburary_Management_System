import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BookHistorySearchRequest, BookHistorySearchResponse } from "./types";
import { EBookHistoryKeys } from "./enums";

export function useBookHistorySearchApi() {
  return useMutation<BookHistorySearchResponse, Error, BookHistorySearchRequest>({
    mutationKey: [EBookHistoryKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("book-history/search", data);
      return res.data;
    },
  });
}