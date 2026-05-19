<script setup lang="ts">
import { ref } from "vue";
import { useMostReadBooksPage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import BookInfoDialog from "./components/bookInfoDialog/BookInfoDialog.vue";
import type { MostReadBook } from "@/api/reports/most-read-books/search/get/types";

const {
  searchQuery,
  columns,
  results,
  meta,
  isLoading,
  currentPage,
  selectedIds,
  bookInfoDialogId,
  load,
  onPageChange,
  doExport,
  showBookInfo,
} = useMostReadBooksPage();

const bookInfoVisible = ref(false);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.most_read") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.export')"
          :disabled="!selectedIds.length"
          icon="pi pi-download"
          @click="doExport"
        />
      </div>
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

    <Skeleton v-if="isLoading" height="20rem" />

    <AppDataTable
      v-else
      :columns="columns"
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :selectable="{ available: true, func: (rows) => { selectedIds.length = 0; rows.forEach(r => selectedIds.push((r as MostReadBook).id)) } }"
      :show-more-config="{ available: true, title: 'reports.title', func: (row) => { showBookInfo((row as MostReadBook).id); bookInfoVisible = true; } }"
      :show-actions="true"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />

    <BookInfoDialog
      v-model:visible="bookInfoVisible"
      :book-id="bookInfoDialogId"
    />
  </div>
</template>