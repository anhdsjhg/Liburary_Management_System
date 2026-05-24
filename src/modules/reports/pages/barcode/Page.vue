<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBarcodePage } from "./composables/useComposable";
import BarcodeTable from "./components/BarcodeTable.vue";
import PrintDialog from "./components/printDialog/PrintDialog.vue";

const {
  searchQuery,
  results,
  meta,
  stats,
  isLoading,
  currentPage,
  selectedIds,
  load,
  onPageChange,
} = useBarcodePage();

const printDialogVisible = ref(false);

onMounted(() => load(1));
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.barcode") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.print')"
          :disabled="!selectedIds.length"
          icon="pi pi-print"
          @click="printDialogVisible = true"
        />
      </div>
    </div>

    <div v-if="stats" class="report-page__stats-grid barcode-page__stats">
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.total }}</div>
        <div class="report-page__stat-label">{{ $t("reports.total_items") }}</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.printed }}</div>
        <div class="report-page__stat-label">{{ $t("reports.printed") }}</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.not_printed }}</div>
        <div class="report-page__stat-label">{{ $t("reports.not_printed") }}</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.initialized }}</div>
        <div class="report-page__stat-label">{{ $t("reports.initialized") }}</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.not_initialized }}</div>
        <div class="report-page__stat-label">{{ $t("reports.not_initialized") }}</div>
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

    <div class="report-page__meta">
      {{ results.total }} {{ $t("reports.results") }} ·
      {{ selectedIds.length }} {{ $t("reports.results") }} selected
    </div>

    <BarcodeTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      :selected-ids="selectedIds"
      @update:page="onPageChange"
      @update:selected-ids="(ids) => { selectedIds.length = 0; ids.forEach(id => selectedIds.push(id)); }"
      @refresh="load(currentPage)"
    />

    <PrintDialog
      v-model:visible="printDialogVisible"
      :inventories="selectedIds"
      @success="printDialogVisible = false"
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
