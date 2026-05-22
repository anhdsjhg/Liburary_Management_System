<script setup lang="ts">
import { useInventoryBooksPage } from "./composables/useComposable";
import InventoryBooksTable from "./components/InventoryBooksTable.vue";

const {
  searchQuery,
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

    <InventoryBooksTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      :selected-ids="selectedIds"
      @update:page="onPageChange"
      @update:selected-ids="(ids) => { selectedIds.length = 0; ids.forEach(id => selectedIds.push(id)); }"
      @refresh="load(currentPage)"
    />
  </div>
</template>
