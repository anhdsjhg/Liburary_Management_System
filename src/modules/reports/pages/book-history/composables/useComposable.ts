import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useBookHistorySearchApi } from "@/api/reports/book-history/search/get";
import { useBookHistoryExportApi } from "@/api/reports/book-history/export/post";
import type { BookHistoryEntry } from "@/api/reports/book-history/search/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useBookHistoryPage() {
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useBookHistorySearchApi();
  const { mutate: exportData, isPending: isExporting } = useBookHistoryExportApi();

  const searchQuery = ref("");
  const currentPage = ref(1);
  const selectedIds = ref<string[]>([]);

  const results = ref<{
    data: BookHistoryEntry[];
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

  const columns: TableColumnDef<BookHistoryEntry>[] = [
    { name: "reports.inv_id", link: "id" },
    { name: "reports.barcode_label", link: "barcode" },
    { name: "reports.title", link: "title" },
    { name: "reports.author", link: "author" },
    { name: "reports.location", link: "location_title" },
    { name: "reports.status", link: "location" },
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

  function doExport() {
    if (!selectedIds.value.length) return;
    exportData(
      { inventories: selectedIds.value },
      {
        onSuccess() {
          showSuccessToast(t("reports.export"));
        },
        onError() {
          showErrorToast(t("reports.export"));
        },
      }
    );
  }

  return {
    searchQuery,
    columns,
    results,
    meta,
    isLoading,
    isExporting,
    currentPage,
    selectedIds,
    load,
    onPageChange,
    doExport,
  };
}