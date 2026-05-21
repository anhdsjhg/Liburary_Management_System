import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useMediaSearchApi } from "@/api/media/search/get";
import { useMediaExportApi } from "@/api/media/export/post";
import type { MediaSearchRequest, MediaSearchItem } from "@/api/media/search/get/types";

export type DisplayMode = "card" | "list";

export interface FilterState {
  types: string[];
  languages: string[];
  genre: string;
  year: { from: number | null; to: number | null };
  available: boolean;
}

export function useSearchPage() {
  const route = useRoute();

  const displayMode = ref<DisplayMode>("card");
  const selectedIds = ref<number[]>([]);
  const currentPage = ref(1);

  const filterState = ref<FilterState>({
    types: [],
    languages: [],
    genre: "",
    year: { from: null, to: null },
    available: false,
  });

  const searchParams = computed<MediaSearchRequest>(() => {
    const key = (route.query.key as string) ?? "all";
    const value = (route.query.q as string) ?? "";

    const options = value.trim()
      ? [{ key: key as MediaSearchRequest["search_options"][0]["key"], value }]
      : [{ key: "all" as const, value: "" }];

    const filter: MediaSearchRequest["filter"] = [];

    if (filterState.value.types.length) {
      filter.push({ key: "type", value: filterState.value.types });
    }
    if (filterState.value.languages.length) {
      filter.push({ key: "language", value: filterState.value.languages });
    }
    if (filterState.value.genre) {
      filter.push({ key: "genre", value: filterState.value.genre });
    }
    if (filterState.value.available) {
      filter.push({ key: "available", value: "1" });
    }
    if (filterState.value.year.from != null || filterState.value.year.to != null) {
      filter.push({
        key: "year",
        value: {
          from: filterState.value.year.from != null ? String(filterState.value.year.from) : undefined,
          to: filterState.value.year.to != null ? String(filterState.value.year.to) : undefined,
        } as unknown as string,
      });
    }

    return {
      search_options: options,
      filter,
      page: currentPage.value,
      per_page: 12,
    };
  });

  const { data, isLoading, refetch } = useMediaSearchApi(searchParams);

  const results = computed(() => data.value?.res ?? {
    data: [],
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  });

  const filterData = computed(() => data.value?.filter ?? {});

  const queryLabel = computed(() => {
    const q = route.query.q as string;
    const key = route.query.key as string;
    return q ? `${key !== "all" ? key + ": " : ""}${q}` : "";
  });

  const isAllSelected = computed(
    () =>
      selectedIds.value.length > 0 &&
      selectedIds.value.length === results.value.data.length
  );

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedIds.value = [];
    } else {
      selectedIds.value = results.value.data.map((item) => item.id);
    }
  }

  function toggleSelect(id: number) {
    const idx = selectedIds.value.indexOf(id);
    if (idx >= 0) {
      selectedIds.value.splice(idx, 1);
    } else {
      selectedIds.value.push(id);
    }
  }

  function isSelected(id: number): boolean {
    return selectedIds.value.includes(id);
  }

  function toggleDisplayMode() {
    displayMode.value = displayMode.value === "card" ? "list" : "card";
  }

  function onPageChange(page: number) {
    currentPage.value = page;
  }

  function applyFilter(newFilter: FilterState) {
    filterState.value = newFilter;
    currentPage.value = 1;
  }

  function resetFilter() {
    filterState.value = {
      types: [],
      languages: [],
      genre: "",
      year: { from: null, to: null },
      available: false,
    };
    currentPage.value = 1;
  }

  watch(
    () => route.query,
    () => {
      currentPage.value = 1;
      selectedIds.value = [];
    }
  );

  return {
    displayMode,
    selectedIds,
    currentPage,
    filterState,
    results,
    filterData,
    isLoading,
    queryLabel,
    isAllSelected,
    toggleSelectAll,
    toggleSelect,
    isSelected,
    toggleDisplayMode,
    onPageChange,
    applyFilter,
    resetFilter,
  };
}
