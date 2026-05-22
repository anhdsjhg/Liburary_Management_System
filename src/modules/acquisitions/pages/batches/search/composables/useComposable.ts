import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useBatchesGetApi } from "@/api/acquisitions/batches/get";
import { useBatchDeleteApi } from "@/api/acquisitions/batches/[id]/delete";
import type { Batch } from "@/api/acquisitions/batches/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useBatchesSearch() {
  const router = useRouter();
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useBatchesGetApi();
  const { mutate: deleteBatch, isPending: deleteLoading } = useBatchDeleteApi();

  const currentPage = ref(1);
  const searchQuery = ref("");

  const results = ref<{
    data: Batch[];
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

  const columns: TableColumnDef<Batch>[] = [
    { name: "acquisitions.batch.id", link: "id" },
    { name: "acquisitions.batch.status", link: "status" },
    { name: "acquisitions.batch.invoice_date", link: "invoice_date", is_date: true },
    { name: "acquisitions.batch.sup_type", link: "sup_type" },
    { name: "acquisitions.batch.supplier", link: "supplier" },
    { name: "acquisitions.batch.titles_no", link: "titles_no" },
    { name: "acquisitions.batch.items_no", link: "items_no" },
    { name: "acquisitions.batch.titles_ma", link: "titles_ma" },
    { name: "acquisitions.batch.items_ma", link: "items_ma" },
    { name: "acquisitions.batch.price", link: "price" },
    { name: "acquisitions.batch.currency", link: "currency" },
    { name: "acquisitions.batch.doc_no", link: "doc_no" },
    { name: "acquisitions.batch.create_date", link: "create_date", is_date: true },
    { name: "acquisitions.batch.created_by", link: "created_by" },
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

  function goToManage(row?: Batch) {
    router.push({
      name: RouteNames.ACQUISITION_BATCHES + "-manage",
      params: row ? { id: row.id } : {},
    });
  }

  function onDelete(row: Batch) {
    deleteBatch(row.id, {
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