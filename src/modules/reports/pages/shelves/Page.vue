<script setup lang="ts">
import { ref } from "vue";
import { useShelvesPage } from "./composables/useComposable";
import ShelvesTable from "./components/ShelvesTable.vue";
import FileComparisonDialog from "./components/fileComparisonDialog/FileComparisonDialog.vue";

const {
  callNumberQuery,
  results,
  meta,
  isLoading,
  currentPage,
  load,
  onPageChange,
  doExport,
} = useShelvesPage();

const comparisonVisible = ref(false);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.shelves") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.compare_files')"
          severity="secondary"
          outlined
          @click="comparisonVisible = true"
        />
        <Button
          :label="$t('reports.export_excel')"
          icon="pi pi-download"
          outlined
          @click="doExport"
        />
      </div>
    </div>

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.callnumber") }}</div>
        <InputText v-model="callNumberQuery" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-actions">
        <Button :label="$t('reports.apply')" @click="load(1)" />
      </div>
    </div>

    <ShelvesTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />

    <FileComparisonDialog v-model:visible="comparisonVisible" />
  </div>
</template>
