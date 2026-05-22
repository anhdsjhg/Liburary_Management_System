import { ref, computed } from "vue";
import { useItemsGetApi } from "@/api/acquisitions/items/get";
import type { AcquisitionItem } from "@/api/acquisitions/items/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";

export function useItemsSearch() {
  const { mutate: search, isPending: isLoading } = useItemsGetApi();

  const currentPage = ref(1);
  const searchQuery = ref("");

  const results = ref<{
    data: AcquisitionItem[];
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

  const columns: TableColumnDef<AcquisitionItem>[] = [
    { name: "acquisitions.item.id", link: "id" },
    { name: "acquisitions.item.barcode", link: "barcode" },
    { name: "acquisitions.item.title", link: "title" },
    { name: "acquisitions.item.author", link: "author" },
    { name: "acquisitions.item.isbn", link: "isbn" },
    { name: "acquisitions.item.pub_year", link: "pub_year" },
    { name: "acquisitions.item.item_type", link: "item_type" },
    { name: "acquisitions.item.publisher", link: "publisher" },
    { name: "acquisitions.item.supplier", link: "supplier" },
    { name: "acquisitions.item.cost", link: "cost" },
    { name: "acquisitions.item.currency", link: "currency" },
    { name: "acquisitions.item.location_title", link: "location_title" },
    { name: "acquisitions.item.create_date", link: "create_date", is_date: true },
    { name: "acquisitions.item.batch_id", link: "batch_id" },
    { name: "acquisitions.item.act_no", link: "act_no" },
  ];

  function load(page = 1) {
    currentPage.value = page;
    const q = searchQuery.value.trim();
    search(
      {
        ...(q && {
          add_options: [{ key: "id", value: q }],
        }),
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
    columns,
    results,
    meta,
    isLoading,
    currentPage,
    searchQuery,
    load,
    onPageChange,
  };
}