<script setup lang="ts">
import { useBookHistoryPage } from "./composables/useComposable";
import BookHistoryTable from "./components/BookHistoryTable.vue";

const {
  searchQuery,
  results,
  meta,
  isLoading,
  isExporting,
  currentPage,
  selectedIds,
  load,
  onPageChange,
  doExport,
} = useBookHistoryPage();
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.book_history") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.export')"
          :loading="isExporting"
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
        <Button :label="$t('reports.reset')" severity="secondary" outlined @click="searchQuery = ''" />
      </div>
    </div>

    <BookHistoryTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @update:selected-ids="(ids) => { selectedIds.length = 0; ids.forEach(id => selectedIds.push(id)); }"
      @refresh="load(currentPage)"
    />
  </div>
</template>
