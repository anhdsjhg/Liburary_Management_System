<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useKsuPage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";

const { t } = useI18n();
const { filter, results, meta, isLoading, currentPage, load, onPageChange, doExport } = useKsuPage();

const columns = computed(() =>
  filter.oneLined
    ? [
        { name: "Period", link: "doc_year" },
        { name: "Batch", link: "batch_id" },
        { name: "Total titles", link: "total_titles" },
        { name: "Total items", link: "total_items" },
        { name: "Total price", link: "total_price" },
      ]
    : [
        { name: "Batch", link: "batch_id" },
        { name: "Date", link: "doc_year" },
        { name: "Supplier", link: "supplier" },
        { name: "Titles", link: "total_titles" },
        { name: "Items", link: "total_items" },
        { name: "Price", link: "total_price" },
      ]
);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.ksu") }}</span>
      <div class="report-page__actions">
        <Button :label="$t('reports.export')" icon="pi pi-download" outlined @click="doExport" />
        <Button :label="$t('reports.apply')" icon="pi pi-search" @click="load(1)" />
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
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem">
          <input type="checkbox" id="oneLined" v-model="filter.oneLined" />
          <label for="oneLined">{{ $t("reports.one_lined") }}</label>
        </div>
      </div>
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.supply_type") }}</div>
        <InputText v-model="filter.supply_type" class="w-full" />
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