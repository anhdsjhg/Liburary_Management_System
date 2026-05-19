import { ref, computed } from "vue";
import { useNotFoundBooksApi } from "@/api/reports/not-found-books/search/get";
import type { NotFoundBook } from "@/api/reports/not-found-books/search/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";

export function useNotFoundBooksPage() {
  const { mutate: search, isPending: isLoading } = useNotFoundBooksApi();

  const searchQuery = ref("");
  const currentPage = ref(1);

  const results = ref<{
    data: NotFoundBook[];
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

  const columns: TableColumnDef<NotFoundBook>[] = [
    { name: "reports.inv_id", link: "id" },
    { name: "reports.barcode_label", link: "barcode" },
    { name: "reports.title", link: "title" },
    { name: "reports.author", link: "author" },
    { name: "reports.location", link: "location" },
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

  return { searchQuery, columns, results, meta, isLoading, currentPage, load, onPageChange };
}