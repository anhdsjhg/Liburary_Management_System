import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useInventoryBooksSearchApi } from "@/api/reports/inventory-books/search/get";
import type { InventoryBook } from "@/api/reports/inventory-books/search/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { useExportComposable } from "../../../composables/useExportComposable";

export function useInventoryBooksPage() {
  const { t } = useI18n();
  const { exportXlsx, exportPdf } = useExportComposable();

  const { mutate: search, isPending: isLoading } = useInventoryBooksSearchApi();

  const searchQuery = ref("");
  const currentPage = ref(1);
  const selectedIds = ref<string[]>([]);

  const results = ref<{
    data: InventoryBook[];
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

  const columns: TableColumnDef<InventoryBook>[] = [
    { name: "reports.inv_id", link: "id" },
    { name: "reports.barcode_label", link: "barcode" },
    { name: "reports.title", link: "title" },
    { name: "reports.author", link: "author" },
    { name: "reports.location", link: "location_title" },
    { name: "reports.status", link: "status" },
  ];

  function load(page = 1) {
    currentPage.value = page;
    search(
      {
        add_options: searchQuery.value.trim()
          ? [{ key: "all", value: searchQuery.value.trim() }]
          : [],
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
    exportXlsx(
      "inventory-books/export",
      { inventories: selectedIds.value },
      "inventory_books.xlsx"
    );
  }

  function doPrint() {
    exportPdf("inventory-books/print", { inventories: selectedIds.value });
  }

  return {
    searchQuery,
    columns,
    results,
    meta,
    isLoading,
    currentPage,
    selectedIds,
    load,
    onPageChange,
    doExport,
    doPrint,
  };
}