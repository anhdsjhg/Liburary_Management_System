import { ref, reactive, computed } from "vue";
import { usePeriodicalsApi } from "@/api/reports/periodicals/get";
import type { PeriodicalItem } from "@/api/reports/periodicals/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { useExportComposable } from "../../../composables/useExportComposable";

export function usePeriodicalsPage() {
  const { exportXlsx } = useExportComposable();
  const { mutate: search, isPending: isLoading } = usePeriodicalsApi();

  const currentPage = ref(1);

  const filter = reactive({
    from: "",
    to: "",
    mode: "byBatch" as "oneLined" | "byBatch" | "total",
    supply_type: "",
    title: "",
  });

  const results = ref<{
    data: PeriodicalItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }>({
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const meta = computed<PaginationMeta>(() => ({
    total: results.value.total,
    from: (results.value.current_page - 1) * results.value.per_page + 1,
    to: Math.min(results.value.current_page * results.value.per_page, results.value.total),
    current_page: results.value.current_page,
    last_page: results.value.last_page,
    per_page: results.value.per_page,
  }));

  const modeOptions = [
    { label: "One lined", value: "oneLined" },
    { label: "By batch", value: "byBatch" },
    { label: "Total", value: "total" },
  ];

  function load(page = 1) {
    currentPage.value = page;
    search(
      {
        from: filter.from || undefined,
        to: filter.to || undefined,
        mode: filter.mode,
        supply_type: filter.supply_type || undefined,
        title: filter.title || undefined,
        page,
        per_page: 10,
      },
      {
        onSuccess(data) {
          results.value = data.res;
        },
      }
    );
  }

  function onPageChange(page: number) {
    load(page);
  }

  function doExport() {
    exportXlsx("periodicals_report/export", filter, "periodicals.xlsx");
  }

  return { filter, modeOptions, results, meta, isLoading, currentPage, load, onPageChange, doExport };
}