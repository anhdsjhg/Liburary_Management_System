import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useItemsGetApi } from "@/api/acquisitions/items/get";
import type { AcquisitionItem } from "@/api/acquisitions/items/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";

export const searchFieldOptions = [
  { label: "Title", value: "title" },
  { label: "Inv №", value: "id" },
  { label: "Barcode", value: "barcode" },
  { label: "Author", value: "author" },
  { label: "ISBN", value: "isbn" },
  { label: "Batch ID", value: "batch_id" },
];

export function useItemsSearch() {
  const router = useRouter();
  const { mutate: search, isPending: isLoading } = useItemsGetApi();

  const currentPage = ref(1);
  const searchQuery = ref("");
  const searchField = ref("title");
  const hasSearched = ref(false);

  const results = ref<{
    data: AcquisitionItem[];
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

  function load(page = 1) {
    currentPage.value = page;
    const q = searchQuery.value.trim();
    search(
      {
        add_options: [
          { key: "create_date", value: {} },
          { key: "cost", value: {} },
        ],
        search_options: q
          ? [{ key: searchField.value, operator: "and", value: q }]
          : [],
        order: { key: "id", mode: "desc" },
        page,
        per_page: 10,
      },
      {
        onSuccess(data) {
          results.value = data.res;
          hasSearched.value = true;
        },
      }
    );
  }

  function onPageChange(page: number) {
    load(page);
  }

  function goToManage(row?: AcquisitionItem) {
    router.push({
      name: RouteNames.ACQUISITION_ITEMS + "-manage",
      params: row ? { id: row.id } : {},
    });
  }

  return {
    results,
    meta,
    isLoading,
    currentPage,
    searchQuery,
    searchField,
    hasSearched,
    load,
    onPageChange,
    goToManage,
  };
}
