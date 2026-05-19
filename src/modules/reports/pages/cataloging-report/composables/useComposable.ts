import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";

interface CatalogingStats {
  books_total: number;
  books_completed: number;
  books_not_started: number;
  books_in_progress: number;
  books_uninventoried: number;
  books_without_lccn: number;
  discs_total: number;
  discs_completed: number;
  discs_not_started: number;
  discs_in_progress: number;
  discs_uninventoried: number;
  discs_without_lccn: number;
  journals_total: number;
  journals_completed: number;
  journals_not_started: number;
  journals_in_progress: number;
  journals_uninventoried: number;
  journals_without_lccn: number;
}

export function useCatalogingReportPage() {
  const { data, isLoading } = useQuery<{ res: CatalogingStats }>({
    queryKey: ["get:cataloging-reports"],
    queryFn: async () => {
      const res = await axiosInstance.get("cataloging/reports");
      return res.data;
    },
  });

  return { data, isLoading };
}