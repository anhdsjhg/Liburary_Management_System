import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useKsuReportApi } from "@/api/reports/ksu/get";
import type { KsuReportRow } from "@/api/reports/ksu/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { useExportComposable } from "../../../composables/useExportComposable";

export function useKsuPage() {
  const { exportXlsx } = useExportComposable();
  const { mutate: search, isPending: isLoading } = useKsuReportApi();

  const currentPage = ref(1);

  const filter = reactive({
    from: "",
    to: "",
    oneLined: false,
    supply_type: "",
    pps: false,
  });

  const results = ref<{
    data: KsuReportRow[];
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

  function load(page = 1) {
    currentPage.value = page;
    search(
      {
        from: filter.from || undefined,
        to: filter.to || undefined,
        oneLined: filter.oneLined,
        supply_type: filter.supply_type || undefined,
        pps: filter.pps || undefined,
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
    exportXlsx(
      "ksu_report/export",
      {
        from: filter.from,
        to: filter.to,
        oneLined: filter.oneLined,
        supply_type: filter.supply_type,
        pps: filter.pps,
      },
      "ksu_report.xlsx"
    );
  }

  return { filter, results, meta, isLoading, currentPage, load, onPageChange, doExport };
}