<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStatReportPage } from "./composables/useComposable";
import ReportTable from "../../components/ReportTable.vue";

const { t } = useI18n();
const { year, rows, isLoading, refetch, doExport } = useStatReportPage();

function onSearch() { refetch(); }

const columns = computed(() => [
  { name: t("reports.year"), link: "year" },
  { name: "Month", link: "month" },
  { name: "Total borrow", link: "total_borrow" },
  { name: "On hands", link: "on_hands" },
]);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.stat") }}</span>
      <div class="report-page__actions">
        <Button :label="$t('reports.export')" icon="pi pi-download" outlined @click="doExport" />
        <Button :label="$t('reports.apply')" @click="onSearch" />
      </div>
    </div>

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.year") }}</div>
        <InputText v-model="year" class="w-full" @keydown.enter="onSearch" />
      </div>
    </div>

    <ReportTable
      :columns="columns"
      :rows="rows as Record<string, unknown>[]"
      :loading="isLoading"
    />
  </div>
</template>