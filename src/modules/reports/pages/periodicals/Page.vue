<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePeriodicalsPage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";

const { t } = useI18n();
const { filter, modeOptions, results, meta, isLoading, currentPage, load, onPageChange, doExport } = usePeriodicalsPage();

const columns = computed(() => {
  if (filter.mode === "total") {
    return [
      { name: t("reports.title"), link: "title" },
      { name: "Batch", link: "batch_id" },
      { name: t("reports.author"), link: "author" },
      { name: "Publisher", link: "publisher" },
      { name: "Year", link: "pub_year" },
      { name: "Price", link: "cost" },
      { name: "Count", link: "count" },
      { name: "Issue", link: "issue_num" },
    ];
  }
  if (filter.mode === "oneLined") {
    return [
      { name: "Period", link: "doc_year" },
      { name: "Batch", link: "batch_id" },
      { name: "Titles", link: "total_titles" },
      { name: "Items", link: "total_items" },
      { name: "Price", link: "total_price" },
    ];
  }
  return [
    { name: "Batch", link: "batch_id" },
    { name: "Date", link: "doc_year" },
    { name: "Supplier", link: "supplier" },
    { name: "Titles", link: "total_titles" },
    { name: "Items", link: "total_items" },
    { name: "Price", link: "total_price" },
  ];
});
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.periodicals") }}</span>
      <div class="report-page__actions">
        <Button :label="$t('reports.export')" icon="pi pi-download" outlined @click="doExport" />
        <Button :label="$t('reports.apply')" @click="load(1)" />
      </div>
    </div>

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.from") }}</div>
        <InputText v-model="filter.from" type="date" class="w-full" />
      </div>
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.to") }}</div>
        <InputText v-model="filter.to" type="date" class="w-full" />
      </div>
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.mode") }}</div>
        <Select
          v-model="filter.mode"
          :options="modeOptions"
          option-label="label"
          option-value="value"
          class="w-full"
        />
      </div>
      <div v-if="filter.mode === 'total'" class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.title") }}</div>
        <InputText v-model="filter.title" class="w-full" />
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :rows="results.data as Record<string, unknown>[]"
      :meta="meta"
      :page="currentPage"
      :show-row-numbers="false"
      :show-actions="false"
      :sortable="false"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>