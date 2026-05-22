<script setup lang="ts">
import { computed } from "vue";
import { useCatalogingSearch } from "./composables/useComposable";
import { useCatalogingAuthorityDataApi } from "@/api/cataloging/authority-data/get";
import FilterPanel from "./components/filterPanel/FilterPanel.vue";
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
  onDelete,
  load,
} = useCatalogingSearch();

const { data: authorityData } = useCatalogingAuthorityDataApi();
const typeOptions = computed(() => authorityData.value?.res?.type ?? []);
</script>

<template>
  <div class="cataloging-search-page">
    <div class="cataloging-search-page__header">
      <span class="cataloging-search-page__title">
        {{ $t("cataloging.title") }}
      </span>
    </div>

    <div class="cataloging-search-page__filter-panel">
      <FilterPanel
        :form="form"
        :state-options="stateOptions"
        :type-options="typeOptions"
        @apply="applyFilter"
        @reset="resetFilter"
      />

      <div class="cataloging-search-page__results">
        <div class="cataloging-search-page__meta">
          {{ results?.total ?? 0 }} {{ $t("cataloging.results") }},
          {{ results?.last_page ?? 0 }} {{ $t("cataloging.pages") }}
        </div>

        <Skeleton v-if="isLoading" height="20rem" />

        <div
          v-else-if="!results?.data?.length"
          class="cataloging-search-page__meta"
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
          @delete="onDelete"
          @update:page="onPageChange"
          @refresh="load(currentPage)"
        />
      </div>
    </div>
  </div>
</template>