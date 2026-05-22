import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCatalogingSearchApi } from "@/api/cataloging/search/get";
import { useCatalogingDeleteApi } from "@/api/cataloging/[id]/delete";
import type { CatalogingMaterial } from "@/api/cataloging/search/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useCatalogingFilterForm } from "./useFormComposable";

export function useCatalogingSearch() {
  const router = useRouter();
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useCatalogingSearchApi();
  const { mutate: deleteMaterial, isPending: deleteLoading } = useCatalogingDeleteApi();
  const { form, buildAddOptions, reset } = useCatalogingFilterForm();

  const currentPage = ref(1);

  const results = ref<{
    data: CatalogingMaterial[];
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

  const columns: TableColumnDef<CatalogingMaterial>[] = [
    { name: "cataloging.call_number", link: "call_number" },
    { name: "cataloging.type", link: "type" },
    { name: "cataloging.title", link: "title" },
    { name: "cataloging.author", link: "author" },
    { name: "cataloging.isbn", link: "isbn" },
    { name: "cataloging.language", link: "language" },
    { name: "cataloging.genre", link: "genre" },
    {
      name: "cataloging.state.label",
      link: "state",
      display_func: (row) => {
        const stateMap: Record<string, string> = {
          not_started: t("cataloging.state.not_started"),
          in_progress: t("cataloging.state.in_progress"),
          completed: t("cataloging.state.completed"),
        };
        return stateMap[row.state ?? ""] ?? (row.state ?? "");
      },
    },
  ];

  function load(page = 1) {
    const options = buildAddOptions();
    if (!options.length) return;

    currentPage.value = page;
    search(
      { add_options: options, page, per_page: 10 },
      {
        onSuccess(data) {
          results.value = data?.res ?? (data as unknown as typeof results.value);
        },
      }
    );
  }

  function applyFilter() {
    load(1);
  }

  function resetFilter() {
    reset();
    results.value = {
      data: [],
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
    };
  }

  function onPageChange(page: number) {
    load(page);
  }

  function goToEdit(row: CatalogingMaterial) {
    router.push({
      name: RouteNames.CATALOGING_EDIT,
      params: { id: row.id },
      query: { type: row.type_key },
    });
  }

  function onDelete(row: CatalogingMaterial) {
    deleteMaterial(
      { type: row.type_key, id: row.id },
      {
        onSuccess() {
          showSuccessToast(t("cataloging.delete"));
          load(currentPage.value);
        },
        onError() {
          showErrorToast(t("cataloging.delete"));
        },
      }
    );
  }

  const stateOptions = [
    { label: t("cataloging.state.all"), value: "" },
    { label: t("cataloging.state.not_started"), value: "not_started" },
    { label: t("cataloging.state.in_progress"), value: "in_progress" },
    { label: t("cataloging.state.completed"), value: "completed" },
    { label: t("cataloging.state.uninventoried"), value: "uninventoried" },
    { label: t("cataloging.state.no_lccn"), value: "no_lccn" },
    { label: t("cataloging.state.no_genre"), value: "no_genre" },
    { label: t("cataloging.state.no_language"), value: "no_language" },
    { label: t("cataloging.state.wrong_language"), value: "wrong_language" },
  ];

  return {
    form,
    columns,
    results,
    meta,
    isLoading,
    deleteLoading,
    currentPage,
    stateOptions,
    load,
    applyFilter,
    resetFilter,
    onPageChange,
    goToEdit,
    onDelete,
  };
}