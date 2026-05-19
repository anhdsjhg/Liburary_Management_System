import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePublishersGetApi } from "@/api/acquisitions/publishers/get";
import { usePublisherDeleteApi } from "@/api/acquisitions/publishers/[id]/delete";
import type { Publisher } from "@/api/acquisitions/publishers/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function usePublishersSearch() {
  const router = useRouter();
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = usePublishersGetApi();
  const { mutate: deletePublisher, isPending: deleteLoading } = usePublisherDeleteApi();

  const currentPage = ref(1);
  const searchQuery = ref("");

  const results = ref<{
    data: Publisher[];
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
    to: Math.min(
      results.value.current_page * results.value.per_page,
      results.value.total
    ),
    current_page: results.value.current_page,
    last_page: results.value.last_page,
    per_page: results.value.per_page,
  }));

  const columns: TableColumnDef<Publisher>[] = [
    { name: "acquisitions.publisher.id", link: "id" },
    { name: "acquisitions.publisher.name", link: "name" },
    { name: "acquisitions.publisher.com_name", link: "com_name" },
    { name: "acquisitions.publisher.address", link: "address" },
    { name: "acquisitions.publisher.email", link: "email" },
    { name: "acquisitions.publisher.phone", link: "phone" },
    { name: "acquisitions.publisher.fax", link: "fax" },
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

  function goToManage(row?: Publisher) {
    router.push({
      name: RouteNames.ACQUISITION_PUBLISHERS + "-manage",
      params: row ? { id: row.id } : {},
    });
  }

  function onDelete(row: Publisher) {
    deletePublisher(row.id, {
      onSuccess() {
        showSuccessToast(t("acquisitions.delete"));
        load(currentPage.value);
      },
      onError() {
        showErrorToast(t("acquisitions.delete"));
      },
    });
  }

  return {
    columns,
    results,
    meta,
    isLoading,
    deleteLoading,
    currentPage,
    searchQuery,
    load,
    onPageChange,
    goToManage,
    onDelete,
  };
}