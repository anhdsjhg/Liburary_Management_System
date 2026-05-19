<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBarcodePage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import PrintDialog from "./components/printDialog/PrintDialog.vue";
import type { BarcodeItem } from "@/api/reports/barcode/search/get/types";

const {
  searchQuery,
  columns,
  results,
  meta,
  stats,
  isLoading,
  isPrinting,
  currentPage,
  selectedIds,
  load,
  onPageChange,
  toggleSelect,
  printSelected,
} = useBarcodePage();

const printDialogVisible = ref(false);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.barcode") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.print')"
          :loading="isPrinting"
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

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.search") }}</div>
        <InputText
          v-model="searchQuery"
          class="w-full"
          @keydown.enter="load(1)"
        />
      </div>
      <div class="report-page__filter-actions">
        <Button :label="$t('reports.apply')" @click="load(1)" />
        <Button :label="$t('reports.reset')" severity="secondary" outlined @click="searchQuery = ''" />
      </div>
    </div>

    <div class="report-page__meta">
      {{ results.total }} {{ $t("reports.results") }} ·
      {{ selectedIds.length }} {{ $t("reports.results") }} selected
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <AppDataTable
      v-else
      :columns="columns"
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :selectable="{ available: true, func: (rows) => { selectedIds.length = 0; rows.forEach(r => selectedIds.push((r as BarcodeItem).id)) } }"
      :show-actions="false"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />

    <PrintDialog
      v-model:visible="printDialogVisible"
      :inventories="selectedIds"
      @success="printDialogVisible = false"
    />
  </div>
</template>