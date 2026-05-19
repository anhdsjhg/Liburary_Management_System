<script setup lang="ts">
import { onMounted } from "vue";
import { useBookHistoryPage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import type { BookHistoryEntry } from "@/api/reports/book-history/search/get/types";

const {
  searchQuery,
  columns,
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

    <Skeleton v-if="isLoading" height="20rem" />

    <AppDataTable
      v-else
      :columns="columns"
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :selectable="{ available: true, func: (rows) => { selectedIds.length = 0; rows.forEach(r => selectedIds.push((r as BookHistoryEntry).id)) } }"
      :show-actions="false"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>