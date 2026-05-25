import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useInventoryBooksSearchApi } from "@/api/reports/inventory-books/search/get";
import type { InventoryBook } from "@/api/reports/inventory-books/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { useExportComposable } from "../../../composables/useExportComposable";

export function useInventoryBooksPage() {
  const { t } = useI18n();
  const { exportXlsx, exportPdf } = useExportComposable();

  const { mutate: search, isPending: isLoading } = useInventoryBooksSearchApi();

  const inventoryNoFrom = ref("");
  const rownum = ref("");
  const currentPage = ref(1);
  const selectedIds = ref<string[]>([]);
  const hasSearched = ref(false);

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

  function load(page = 1) {
    currentPage.value = page;
    const addOptions: Array<{ key: string; value: string }> = [];
    if (inventoryNoFrom.value.trim()) {
      addOptions.push({ key: "inventory_no", value: inventoryNoFrom.value.trim() });
    }
    if (rownum.value.trim()) {
      addOptions.push({ key: "rownum", value: rownum.value.trim() });
    }
    search(
      {
        add_options: addOptions,
        search_options: [],
        order: { key: "inventory_no", mode: "asc" },
        page,
        per_page: 25,
      },
      {
        onSuccess(data) {
          results.value = data.res;
          hasSearched.value = true;
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
    inventoryNoFrom,
    rownum,
    results,
    meta,
    isLoading,
    currentPage,
    selectedIds,
    hasSearched,
    load,
    onPageChange,
    doExport,
    doPrint,
  };
}