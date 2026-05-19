import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useServiceUsersSearchApi } from "@/api/service-desk/users/get";
import type { ServiceUser } from "@/api/service-desk/users/get/types";
import type { PaginationMeta } from "@/application/types/table";

export function useServiceDeskUsers() {
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useServiceUsersSearchApi();

  const currentPage = ref(1);
  const searchQuery = ref("");
  const selectedType = ref<"student" | "employee">("student");

  const results = ref<{
    data: ServiceUser[];
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
    to: Math.min(
      results.value.current_page * results.value.per_page,
      results.value.total
    ),
    current_page: results.value.current_page,
    last_page: results.value.last_page,
    per_page: results.value.per_page,
  }));

  const typeOptions = computed(() => [
    { label: t("serviceDesk.student"), value: "student" },
    { label: t("serviceDesk.employee"), value: "employee" },
  ]);

  function load(page = 1) {
    if (!searchQuery.value.trim()) return;
    currentPage.value = page;
    search(
      {
        add_options: [
          { key: "all", value: searchQuery.value.trim() },
          { key: "type", value: selectedType.value },
        ],
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
    searchQuery.value = "";
    results.value = {
      data: [],
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
    };
  }

  return {
    searchQuery,
    selectedType,
    typeOptions,
    results,
    meta,
    isLoading,
    currentPage,
    load,
    onPageChange,
    reset,
  };
}