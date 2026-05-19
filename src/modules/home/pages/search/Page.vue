<script setup lang="ts">
import { computed } from "vue";
import { useSearchPage } from "./composables/useComposable";
import FilterPanel from "./components/filterPanel/FilterPanel.vue";
import BookCard from "./components/bookCard/BookCard.vue";
import BookList from "./components/bookList/BookList.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppCheckbox from "@/application/components/AppCheckbox.vue";
import type { PaginationMeta } from "@/application/types/table";

const {
  displayMode,
  results,
  filterData,
  isLoading,
  queryLabel,
  isAllSelected,
  selectedIds,
  currentPage,
  toggleSelectAll,
  toggleSelect,
  isSelected,
  toggleDisplayMode,
  onPageChange,
  applyFilter,
  resetFilter,
  filterState,
} = useSearchPage();

const paginationMeta = computed<PaginationMeta>(() => ({
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

const hasPagination = computed(
  () => results.value.total > results.value.per_page
);
</script>

<template>
  <div>
    <div class="book-search-page__header">
      <span class="book-search-page__query-label">
        {{ $t("home.results_for") }}:
      </span>
      <span class="book-search-page__query-value">{{ queryLabel }}</span>
    </div>

    <div class="book-search-page__meta">
      <span class="book-search-page__count">
        {{ results.total }} {{ $t("home.results") }},
        {{ results.last_page }} {{ $t("home.pages") }}
      </span>

      <div class="book-search-page__actions">
        <AppCheckbox
          :model-value="isAllSelected"
          @update:model-value="toggleSelectAll"
        />
        <span>
          {{ $t("home.select_all") }} ({{ selectedIds.length }})
        </span>

        <Button
          :label="displayMode === 'card' ? $t('home.list_view') : $t('home.card_view')"
          severity="secondary"
          outlined
          size="small"
          @click="toggleDisplayMode"
        />
      </div>
    </div>

    <div class="book-search-page__body">
      <FilterPanel
        :filter-data="filterData"
        :model-value="filterState"
        @apply="applyFilter"
        @reset="resetFilter"
      />

      <div class="book-search-page__results">
        <Skeleton v-if="isLoading" height="30rem" />

        <template v-else>
          <div v-if="displayMode === 'card'" class="book-search-page__grid">
            <BookCard
              v-for="item in results.data"
              :key="item.id"
              :item="item"
              :selected="isSelected(item.id)"
              @toggle-select="toggleSelect(item.id)"
            />
          </div>

          <div v-else>
            <BookList
              v-for="item in results.data"
              :key="item.id"
              :item="item"
              :selected="isSelected(item.id)"
              @toggle-select="toggleSelect(item.id)"
            />
          </div>

          <AppPaginator
            v-if="hasPagination"
            class="book-search-page__pagination"
            :meta="paginationMeta"
            :page="currentPage"
            @update:page="onPageChange"
          />
        </template>
      </div>
    </div>
  </div>
</template>