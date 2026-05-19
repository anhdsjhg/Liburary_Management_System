<script setup lang="ts">
import { useInventoryBooksPage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import type { InventoryBook } from "@/api/reports/inventory-books/search/get/types";

const {
  searchQuery,
  columns,
  results,
  meta,
  isLoading,
  currentPage,
  selectedIds,
  load,
  onPageChange,
  doExport,
  doPrint,
} = useInventoryBooksPage();
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.inventory_books") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.export')"
          :disabled="!selectedIds.length"
          icon="pi pi-download"
          outlined
          @click="doExport"
        />
        <Button
          :label="$t('reports.print')"
          :disabled="!selectedIds.length"
          icon="pi pi-print"
          @click="doPrint"
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
      :selectable="{ available: true, func: (rows) => { selectedIds.length = 0; rows.forEach(r => selectedIds.push((r as InventoryBook).id)) } }"
      :show-actions="false"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>