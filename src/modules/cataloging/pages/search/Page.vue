<script setup lang="ts">
import { computed } from "vue";
import { useCatalogingSearch } from "./composables/useComposable";
import { useCatalogingAuthorityDataApi } from "@/api/cataloging/authority-data/get";
import ResultsTable from "./components/resultsTable/ResultsTable.vue";

const {
  form,
  results,
  meta,
  isLoading,
  deleteLoading,
  currentPage,
  stateOptions,
  applyFilter,
  resetFilter,
  onPageChange,
  goToEdit,
  goToIdList,
  onDelete,
  load,
} = useCatalogingSearch();

const { data: authorityData } = useCatalogingAuthorityDataApi();
const typeOptions = computed(() => [
  { type: "", title: "All" },
  ...(authorityData.value?.res?.type ?? []),
]);
</script>

<template>
  <div class="cataloging-search-page">
    <div class="cataloging-search-page__header">
      <span class="cataloging-search-page__title">{{ $t("cataloging.title") }}</span>
    </div>

    <div class="cataloging-search-page__search-bar">
      <Select
        v-model="form.type"
        :options="typeOptions"
        option-label="title"
        option-value="type"
        style="min-width: 9rem"
      />
      <InputText
        v-model="form.query"
        :placeholder="$t('cataloging.query')"
        class="cataloging-search-page__search-input"
        @keydown.enter="applyFilter"
      />
      <Select
        v-model="form.state"
        :options="stateOptions"
        option-label="label"
        option-value="value"
        :placeholder="$t('cataloging.state.label')"
        show-clear
        style="min-width: 10rem"
      />
      <InputText
        v-model="form.inv_id"
        :placeholder="$t('cataloging.inv_id')"
        style="min-width: 10rem"
        @keydown.enter="applyFilter"
      />
      <Button :label="$t('cataloging.apply')" icon="pi pi-search" @click="applyFilter" />
    </div>

    <div class="cataloging-search-page__meta">
      {{ results?.total ?? 0 }} {{ $t("cataloging.results") }},
      {{ results?.last_page ?? 0 }} {{ $t("cataloging.pages") }}
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <div
      v-else-if="!results?.data?.length"
      class="cataloging-search-page__no-results"
    >
      {{ $t("cataloging.no_results") }}
    </div>

    <ResultsTable
      v-else
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :delete-loading="deleteLoading"
      @edit="goToEdit"
      @show-ids="goToIdList"
      @delete="onDelete"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>

<style scoped>
.cataloging-search-page__search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.cataloging-search-page__search-input {
  flex: 1;
  min-width: 14rem;
}

.cataloging-search-page__meta {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.cataloging-search-page__no-results {
  color: var(--p-text-muted-color);
  padding: 1rem 0;
}
</style>
