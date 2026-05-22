<script setup lang="ts">
import { useNotFoundBooksPage } from "./composables/useComposable";
import NotFoundBooksTable from "./components/NotFoundBooksTable.vue";

const { searchQuery, results, meta, isLoading, currentPage, load, onPageChange } =
  useNotFoundBooksPage();
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.not_found_books") }}</span>
    </div>

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.search") }}</div>
        <InputText v-model="searchQuery" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-actions">
        <Button :label="$t('reports.apply')" @click="load(1)" />
      </div>
    </div>

    <NotFoundBooksTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>
