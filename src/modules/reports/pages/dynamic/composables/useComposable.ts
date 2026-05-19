import { ref, computed } from "vue";
import { useDynamicReportCategoriesApi } from "@/api/reports/dynamic/categories/get";
import { useDynamicReportsApi } from "@/api/reports/dynamic/[categoryId]/reports/get";
import type { DynamicReportCategory } from "@/api/reports/dynamic/categories/get/types";
import { useRouter } from "vue-router";
import { RouteNames } from "@/application/router/routeNames";

export function useDynamicPage() {
  const router = useRouter();
  const { data: categoriesData, isLoading: categoriesLoading } = useDynamicReportCategoriesApi();

  const categories = computed<DynamicReportCategory[]>(() => categoriesData.value?.res ?? []);

  const selectedCategoryId = ref<number | null>(null);
  const categoryId = computed(() => selectedCategoryId.value ?? "");

  const { data: reportsData, isLoading: reportsLoading } = useDynamicReportsApi(categoryId);
  const reports = computed(() => reportsData.value?.res ?? []);

  function selectCategory(id: number) {
    selectedCategoryId.value = id;
  }

  function goToReport(queryId: number) {
    router.push({
      name: RouteNames.REPORTS_DYNAMIC_DETAIL,
      params: { reportId: queryId },
    });
  }

  return {
    categories,
    reports,
    selectedCategoryId,
    categoriesLoading,
    reportsLoading,
    selectCategory,
    goToReport,
  };
}