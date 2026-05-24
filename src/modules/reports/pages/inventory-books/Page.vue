<script setup lang="ts">
import { onMounted } from "vue";
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

onMounted(() => load(1));
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
        v-model="searchQuery"
        :placeholder="$t('reports.search')"
        class="report-page__search-input"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('reports.apply')" @click="load(1)" />
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

<style scoped>
.report-page__search-bar {
  display: flex;
  gap: 0.5rem;
}

.report-page__search-input {
  flex: 1;
}
</style>
