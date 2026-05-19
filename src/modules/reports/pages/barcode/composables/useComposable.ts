import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useBarcodeSearchApi } from "@/api/reports/barcode/search/get";
import { useBarcodePrintApi } from "@/api/reports/barcode/print/post";
import { useBarcodeReportsApi } from "@/api/reports/barcode/show/get";
import type { BarcodeItem } from "@/api/reports/barcode/search/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useBarcodePage() {
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useBarcodeSearchApi();
  const { mutate: print, isPending: isPrinting } = useBarcodePrintApi();
  const { data: reportsData } = useBarcodeReportsApi();

  const searchQuery = ref("");
  const currentPage = ref(1);
  const selectedIds = ref<string[]>([]);

  const results = ref<{
    data: BarcodeItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }>({
    data: [],
    total: 0,
    per_page: 25,
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

  const stats = computed(() => reportsData.value?.res ?? null);

  const columns: TableColumnDef<BarcodeItem>[] = [
    { name: "reports.inv_id", link: "id" },
    { name: "reports.barcode_label", link: "barcode" },
    { name: "reports.title", link: "title" },
    { name: "reports.author", link: "author" },
    { name: "reports.location", link: "location_title" },
    { name: "reports.printed", link: "print_status" },
    { name: "reports.initialized", link: "init_status" },
  ];

  function load(page = 1) {
    currentPage.value = page;
    search(
      {
        add_options: searchQuery.value.trim()
          ? [{ key: "all", value: searchQuery.value.trim() }]
          : [],
        order: { key: "id", mode: "asc" },
        page,
        per_page: 25,
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

  function toggleSelect(id: string) {
    const idx = selectedIds.value.indexOf(id);
    if (idx >= 0) selectedIds.value.splice(idx, 1);
    else selectedIds.value.push(id);
  }

  function printSelected() {
    if (!selectedIds.value.length) return;
    print(
      { inventories: selectedIds.value },
      {
        onSuccess() {
          showSuccessToast(t("reports.print"));
        },
        onError() {
          showErrorToast(t("reports.print"));
        },
      }
    );
  }

  return {
    searchQuery,
    columns,
    results,
    meta,
    stats,
    isLoading,
    isPrinting,
    currentPage,
    selectedIds,
    load,
    onPageChange,
    toggleSelect,
    printSelected,
  };
}