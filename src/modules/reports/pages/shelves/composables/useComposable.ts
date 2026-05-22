import { ref, computed } from "vue";
import { useShelvesSearchApi } from "@/api/reports/shelves/search/get";
import type { ShelfItem } from "@/api/reports/shelves/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { useExportComposable } from "../../../composables/useExportComposable";

export function useShelvesPage() {
  const { exportXlsx } = useExportComposable();
  const { mutate: search, isPending: isLoading } = useShelvesSearchApi();

  const callNumberQuery = ref("");
  const currentPage = ref(1);

  const results = ref<{
    data: ShelfItem[];
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
    search(
      {
        add_options: callNumberQuery.value.trim()
          ? [{ key: "callnumber", value: callNumberQuery.value.trim() }]
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
      "shelves/export_excel",
      {
        books: results.value.data.map((item) => ({
          barcode: item.barcode,
          title: item.title,
          callnumber: item.callnumber,
        })),
      },
      "shelves.xlsx"
    );
  }

  return { callNumberQuery, results, meta, isLoading, currentPage, load, onPageChange, doExport };
}