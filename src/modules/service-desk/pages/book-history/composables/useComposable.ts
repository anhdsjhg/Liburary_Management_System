import { ref, computed } from "vue";
import { useServiceLoansApi } from "@/api/service-desk/loans/get";
import type {
  ServiceLoansRequest,
  ServiceLoan,
} from "@/api/service-desk/loans/get/types";
import type { PaginationMeta } from "@/application/types/table";

const PER_PAGE = 25;

const STATUS_OPTIONS = [
  { label: "serviceDesk.all_statuses", value: null },
  { label: "serviceDesk.status_issued", value: "issued" },
  { label: "serviceDesk.status_returned", value: "returned" },
  { label: "serviceDesk.status_overdue", value: "overdue" },
];

function formatDate(value: Date | null): string | undefined {
  if (!value) return undefined;

  return value.toISOString().split("T")[0];
}

export function useBookHistorySearch() {
  const searchQuery = ref("");

  const selectedStatus = ref<string | null>(null);

  // FIX: DatePicker работает с Date
  const dateFrom = ref<Date | null>(null);
  const dateTo = ref<Date | null>(null);

  const currentPage = ref(1);

  const params = computed<ServiceLoansRequest>(() => ({
    query: searchQuery.value.trim() || undefined,

    status: selectedStatus.value ?? undefined,

    // FIX: backend обычно ждет yyyy-mm-dd string
    date_from: formatDate(dateFrom.value),

    date_to: formatDate(dateTo.value),

    page: currentPage.value,

    per_page: PER_PAGE,
  }));

  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useServiceLoansApi(params);

  const rows = computed<ServiceLoan[]>(
    () => data.value?.res?.data ?? []
  );

  const meta = computed<PaginationMeta>(() => {
    const res = data.value?.res;

    const page = res?.current_page ?? 1;

    const total = res?.total ?? 0;

    return {
      total,

      current_page: page,

      last_page: res?.last_page ?? 1,

      per_page: PER_PAGE,

      from: total === 0
        ? 0
        : (page - 1) * PER_PAGE + 1,

      to: Math.min(page * PER_PAGE, total),
    };
  });

  function load(page = 1) {
    currentPage.value = page;
    refetch();
  }

  function onPageChange(page: number) {
    load(page);
  }

  return {
    searchQuery,

    selectedStatus,

    dateFrom,

    dateTo,

    statusOptions: STATUS_OPTIONS,

    rows,

    meta,

    isLoading,

    currentPage,

    load,

    onPageChange,
  };
}
