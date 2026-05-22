import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDynamicReportCategoriesApi } from "@/api/reports/dynamic/categories/get";
import { useDynamicReportsApi } from "@/api/reports/dynamic/[categoryId]/reports/get";
import type { DynamicReportCategory } from "@/api/reports/dynamic/categories/get/types";
import { useRouter } from "vue-router";
import { RouteNames } from "@/application/router/routeNames";

export function useDynamicPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const { data: categoriesData, isLoading: categoriesLoading } = useDynamicReportCategoriesApi();

  function getCategoryTitle(cat: DynamicReportCategory): string {
    if (locale.value === "ru" && cat.title_ru) return cat.title_ru;
    if (locale.value === "kz" && cat.title_kz) return cat.title_kz;
    return cat.title_en ?? cat.category_id;
  }

  const categories = computed(() =>
    (categoriesData.value?.res ?? []).map((cat) => ({
      ...cat,
      label: getCategoryTitle(cat),
    }))
  );

  const selectedCategoryId = ref<string | null>(null);
  const categoryId = computed(() => selectedCategoryId.value ?? "");

  const { data: reportsData, isLoading: reportsLoading } = useDynamicReportsApi(categoryId);
  const reports = computed(() => reportsData.value?.res ?? []);

  function selectCategory(id: string) {
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
