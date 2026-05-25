import { ref, reactive, computed, onMounted } from "vue";
import { useBookHistorySearchApi } from "@/api/reports/book-history/search/get";
import { useBookHistoryExportApi } from "@/api/reports/book-history/export/post";
import type { BookHistoryEntry } from "@/api/reports/book-history/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useI18n } from "vue-i18n";

export function useBookHistoryPage() {
  const { t } = useI18n();
  const { mutate: search, isPending: isLoading } = useBookHistorySearchApi();
  const { mutate: exportData, isPending: isExporting } = useBookHistoryExportApi();

  const currentPage = ref(1);
  const selectedIds = ref<string[]>([]);

  const filter = reactive({
    barcode: "",
    id: "",
    author: "",
    title: "",
  });

  const results = ref<{
    data: BookHistoryEntry[];
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

  function buildSearchOptions() {
    const opts: Array<{ key: string; operator: string; value: string }> = [];
    if (filter.barcode.trim()) opts.push({ key: "barcode", operator: "and", value: filter.barcode.trim() });
    if (filter.id.trim()) opts.push({ key: "id", operator: "and", value: filter.id.trim() });
    if (filter.author.trim()) opts.push({ key: "author", operator: "and", value: filter.author.trim() });
    if (filter.title.trim()) opts.push({ key: "title", operator: "and", value: filter.title.trim() });
    return opts;
  }

  function load(page = 1) {
    currentPage.value = page;
    search(
      {
        add_options: [
          { key: "borrow_date", value: {} },
          { key: "due_date", value: {} },
          { key: "delivery_date", value: {} },
        ],
        search_options: buildSearchOptions(),
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

  function reset() {
    filter.barcode = "";
    filter.id = "";
    filter.author = "";
    filter.title = "";
    load(1);
  }

  function doExport() {
    if (!selectedIds.value.length) return;
    exportData(
      { inventories: selectedIds.value },
      {
        onSuccess() { showSuccessToast(t("reports.export")); },
        onError() { showErrorToast(t("reports.export")); },
      }
    );
  }

  onMounted(() => load(1));

  return {
    filter,
    results,
    meta,
    isLoading,
    isExporting,
    currentPage,
    selectedIds,
    load,
    onPageChange,
    reset,
    doExport,
  };
}
