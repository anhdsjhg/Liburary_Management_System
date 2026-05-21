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

const hasResults = computed(
  () => !isLoading.value && results.value.data.length > 0
);

const isEmpty = computed(
  () => !isLoading.value && results.value.data.length === 0
);
</script>

<template>
  <div class="book-search-page">
    <div class="book-search-page__container">
      <!-- Header -->
      <header class="book-search-page__header">
        <div class="book-search-page__heading">
          <h1 class="book-search-page__title">
            {{ $t("home.results_for") }}
            <span class="book-search-page__query-value">{{ queryLabel || $t("home.all") }}</span>
          </h1>
          <p v-if="!isLoading" class="book-search-page__subtitle">
            {{ results.total }} {{ $t("home.results") }}
            <span class="book-search-page__dot">•</span>
            {{ results.last_page }} {{ $t("home.pages") }}
          </p>
        </div>
      </header>

      <!-- Toolbar -->
      <div class="book-search-page__toolbar">
        <label class="book-search-page__select-all">
          <AppCheckbox
            :model-value="isAllSelected"
            @update:model-value="toggleSelectAll"
          />
          <span>
            {{ $t("home.select_all") }}
            <span
              v-if="selectedIds.length"
              class="book-search-page__count-badge"
            >{{ selectedIds.length }}</span>
          </span>
        </label>

        <div class="book-search-page__view-toggle">
          <Button
            :icon="'pi pi-th-large'"
            :severity="displayMode === 'card' ? undefined : 'secondary'"
            :outlined="displayMode !== 'card'"
            size="small"
            :aria-label="$t('home.card_view')"
            @click="displayMode !== 'card' && toggleDisplayMode()"
          />
          <Button
            :icon="'pi pi-list'"
            :severity="displayMode === 'list' ? undefined : 'secondary'"
            :outlined="displayMode !== 'list'"
            size="small"
            :aria-label="$t('home.list_view')"
            @click="displayMode !== 'list' && toggleDisplayMode()"
          />
        </div>
      </div>

      <!-- Body -->
      <div class="book-search-page__body">
        <aside class="book-search-page__sidebar">
          <FilterPanel
            :filter-data="filterData"
            :model-value="filterState"
            @apply="applyFilter"
            @reset="resetFilter"
          />
        </aside>

        <section class="book-search-page__results">
          <!-- Loading skeletons -->
          <div v-if="isLoading" class="book-search-page__grid">
            <div v-for="n in 8" :key="n" class="book-search-page__skeleton">
              <Skeleton height="280px" border-radius="12px" />
              <Skeleton height="1rem" width="80%" class="mt-3" />
              <Skeleton height="0.75rem" width="60%" class="mt-2" />
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="isEmpty" class="book-search-page__empty">
            <i class="pi pi-search book-search-page__empty-icon" />
            <h3 class="book-search-page__empty-title">{{ $t("home.no_results") }}</h3>
            <p class="book-search-page__empty-text">
              {{ $t("home.try_different_filters") }}
            </p>
            <Button
              :label="$t('home.reset')"
              severity="secondary"
              outlined
              size="small"
              @click="resetFilter"
            />
          </div>

          <!-- Results -->
          <template v-else-if="hasResults">
            <div
              v-if="displayMode === 'card'"
              class="book-search-page__grid"
            >
              <BookCard
                v-for="item in results.data"
                :key="item.id"
                :item="item"
                :selected="isSelected(item.id)"
                @toggle-select="toggleSelect(item.id)"
              />
            </div>

            <div v-else class="book-search-page__list">
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
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/application/assets/scss/modules/home/_book-search-page.scss";
</style>
