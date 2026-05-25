<script setup lang="ts">
import { useInventoryBooksPage } from "./composables/useComposable";
import InventoryBooksTable from "./components/InventoryBooksTable.vue";

const {
  inventoryNoFrom,
  rownum,
  results,
  meta,
  isLoading,
  currentPage,
  selectedIds,
  hasSearched,
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

    <div class="report-page__search-bar">
      <InputText
        v-model="inventoryNoFrom"
        :placeholder="$t('reports.inv_id')"
        class="report-page__search-input"
        @keydown.enter="load(1)"
      />
      <InputText
        v-model="rownum"
        :placeholder="$t('reports.count')"
        class="report-page__search-input--small"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('reports.apply')" @click="load(1)" />
    </div>

    <InventoryBooksTable
      v-if="hasSearched"
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

<style scoped>
.report-page__search-bar {
  display: flex;
  gap: 0.5rem;
}

.report-page__search-input {
  flex: 1;
}

.report-page__search-input--small {
  width: 8rem;
}
</style>
