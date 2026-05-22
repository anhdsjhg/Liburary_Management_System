<script setup lang="ts">
import { ref, computed } from "vue";
import { useShelvesSearchApi } from "@/api/reports/shelves/search/get";
import type { ShelfItem } from "@/api/reports/shelves/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";

const callNumberQuery = ref("");
const currentPage = ref(1);

const results = ref<{
  data: ShelfItem[];
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

const { mutate: search, isPending: isLoading } = useShelvesSearchApi();

const meta = computed<PaginationMeta>(() => ({
  total: results.value.total,
  from: (results.value.current_page - 1) * results.value.per_page + 1,
  to: Math.min(results.value.current_page * results.value.per_page, results.value.total),
  current_page: results.value.current_page,
  last_page: results.value.last_page,
  per_page: results.value.per_page,
}));

function load(page = 1) {
  currentPage.value = page;
  search(
    {
      add_options: callNumberQuery.value.trim()
        ? [{ key: "callnumber", value: callNumberQuery.value.trim() }]
        : [],
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
</script>

<template>
  <div class="sd-shelves">
    <div class="sd-shelves__header">
      <span class="sd-shelves__title">{{ $t("serviceDesk.shelves") }}</span>
    </div>

    <div class="sd-shelves__filters">
      <InputText
        v-model="callNumberQuery"
        :placeholder="$t('serviceDesk.callnumber')"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('serviceDesk.search')" @click="load(1)" />
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <DataTable v-else :value="results.data" striped-rows>
      <Column field="inv_id" :header="$t('serviceDesk.inv_id')" />
      <Column field="barcode" :header="$t('serviceDesk.barcode')" />
      <Column field="title" :header="$t('serviceDesk.title')" />
      <Column field="callnumber" :header="$t('serviceDesk.callnumber')" />
    </DataTable>

    <AppPaginator
      v-if="results.total > results.per_page"
      :meta="meta"
      :page="currentPage"
      @update:page="onPageChange"
    />
  </div>
</template>

<style scoped>
.sd-shelves__header {
  margin-bottom: 1.5rem;
}
.sd-shelves__title {
  font-size: 1.25rem;
  font-weight: 600;
}
.sd-shelves__filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
}
</style>
