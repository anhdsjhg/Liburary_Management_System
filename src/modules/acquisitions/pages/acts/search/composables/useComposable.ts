import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useActsGetApi } from "@/api/acquisitions/acts/get";
import { useActDeleteApi } from "@/api/acquisitions/acts/[id]/delete";
import type { Act } from "@/api/acquisitions/acts/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useActsSearch() {
  const router = useRouter();
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useActsGetApi();
  const { mutate: deleteAct, isPending: deleteLoading } = useActDeleteApi();

  const currentPage = ref(1);
  const searchQuery = ref("");

  const results = ref<{
    data: Act[];
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

  const columns: TableColumnDef<Act>[] = [
    { name: "acquisitions.act.id", link: "id" },
    { name: "acquisitions.act.act_date", link: "act_date", is_date: true },
    { name: "acquisitions.act.status", link: "status" },
    { name: "acquisitions.act.protocol_id", link: "protocol_id" },
    { name: "acquisitions.act.protocol_date", link: "protocol_date", is_date: true },
    { name: "acquisitions.act.items_ma", link: "items_ma" },
    { name: "acquisitions.act.price", link: "price" },
    { name: "acquisitions.act.currency", link: "currency" },
    { name: "acquisitions.act.create_date", link: "create_date", is_date: true },
    { name: "acquisitions.act.notes", link: "notes" },
  ];

  function load(page = 1) {
    currentPage.value = page;
    const q = searchQuery.value.trim();
    search(
      {
        add_options: q
          ? [{ key: "id", value: q }]
          : [],
        order: { key: "id", mode: "desc" },
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

  function goToManage(row?: Act) {
    router.push({
      name: RouteNames.ACQUISITION_ACTS + "-manage",
      params: row ? { id: row.id } : {},
    });
  }

  function onDelete(row: Act) {
    deleteAct(row.id, {
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