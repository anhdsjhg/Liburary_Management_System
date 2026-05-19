import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSuppliersGetApi } from "@/api/acquisitions/suppliers/get";
import { useSupplierDeleteApi } from "@/api/acquisitions/suppliers/[id]/delete";
import type { Supplier } from "@/api/acquisitions/suppliers/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useSuppliersSearch() {
  const router = useRouter();
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useSuppliersGetApi();
  const { mutate: deleteSupplier, isPending: deleteLoading } = useSupplierDeleteApi();

  const currentPage = ref(1);
  const searchQuery = ref("");

  const results = ref<{
    data: Supplier[];
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

  const columns: TableColumnDef<Supplier>[] = [
    { name: "acquisitions.supplier.id", link: "id" },
    { name: "acquisitions.supplier.name", link: "name" },
    { name: "acquisitions.supplier.com_name", link: "com_name" },
    { name: "acquisitions.supplier.bin", link: "bin" },
    { name: "acquisitions.supplier.address", link: "address" },
    { name: "acquisitions.supplier.email", link: "email" },
    { name: "acquisitions.supplier.phone", link: "phone" },
    { name: "acquisitions.supplier.fax", link: "fax" },
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

  function goToManage(row?: Supplier) {
    router.push({
      name: RouteNames.ACQUISITION_SUPPLIERS + "-manage",
      params: row ? { id: row.id } : {},
    });
  }

  function onDelete(row: Supplier) {
    deleteSupplier(row.id, {
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