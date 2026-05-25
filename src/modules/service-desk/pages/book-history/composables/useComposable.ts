import { ref, computed } from "vue";
import { useBookHistorySearchApi } from "@/api/reports/book-history/search/get";
import type { BookHistoryEntry } from "@/api/reports/book-history/search/get/types";
import type { PaginationMeta } from "@/application/types/table";

const STATUS_OPTIONS = [
  { label: "serviceDesk.all_statuses", value: null },
  { label: "home.status_issued", value: "issued" },
  { label: "home.status_returned", value: "returned" },
  { label: "home.status_overdue", value: "overdue" },
];

export function useBookHistorySearch() {
  const { mutate: search, isPending: isLoading } = useBookHistorySearchApi();

  const searchQuery = ref("");
  const selectedStatus = ref<string | null>(null);
  const currentPage = ref(1);

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
    from: results.value.total === 0 ? 0 : (results.value.current_page - 1) * results.value.per_page + 1,
    to: Math.min(results.value.current_page * results.value.per_page, results.value.total),
    current_page: results.value.current_page,
    last_page: results.value.last_page,
    per_page: results.value.per_page,
  }));

  function buildSearchOptions() {
    const opts: Array<{ key: string; operator: string; value: string }> = [];
    const q = searchQuery.value.trim();
    if (q) opts.push({ key: "username", operator: "and", value: q });
    if (selectedStatus.value) opts.push({ key: "status", operator: "and", value: selectedStatus.value });
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

  return {
    searchQuery,
    selectedStatus,
    statusOptions: STATUS_OPTIONS,
    rows: computed(() => results.value.data),
    meta,
    isLoading,
    currentPage,
    load,
    onPageChange,
  };
}
