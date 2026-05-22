import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMostReadBooksApi } from "@/api/reports/most-read-books/search/get";
import type { MostReadBook } from "@/api/reports/most-read-books/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { useExportComposable } from "../../../composables/useExportComposable";

export function useMostReadBooksPage() {
  const { exportXlsx } = useExportComposable();
  const { mutate: search, isPending: isLoading } = useMostReadBooksApi();

  const searchQuery = ref("");
  const currentPage = ref(1);
  const selectedIds = ref<number[]>([]);
  const bookInfoDialogId = ref<number | null>(null);

  const results = ref<{
    data: MostReadBook[];
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
    exportXlsx("most-read/export", { media: selectedIds.value }, "most_read.xlsx");
  }

  function showBookInfo(id: number) {
    bookInfoDialogId.value = id;
  }

  return {
    searchQuery,
    results,
    meta,
    isLoading,
    currentPage,
    selectedIds,
    bookInfoDialogId,
    load,
    onPageChange,
    doExport,
    showBookInfo,
  };
}