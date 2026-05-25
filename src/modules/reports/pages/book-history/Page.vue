<script setup lang="ts">
import { useBookHistoryPage } from "./composables/useComposable";
import BookHistoryTable from "./components/BookHistoryTable.vue";

const {
  filter,
  results,
  meta,
  isLoading,
  isExporting,
  currentPage,
  selectedIds,
  load,
  onPageChange,
  reset,
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
          outlined
          @click="doExport"
        />
      </div>
    </div>

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.barcode_label") }}</div>
        <InputText v-model="filter.barcode" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.inv_id") }}</div>
        <InputText v-model="filter.id" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.author") }}</div>
        <InputText v-model="filter.author" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">Title</div>
        <InputText v-model="filter.title" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-actions">
        <Button :label="$t('reports.apply')" icon="pi pi-search" @click="load(1)" />
        <Button :label="$t('reports.reset')" severity="secondary" outlined @click="reset" />
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
