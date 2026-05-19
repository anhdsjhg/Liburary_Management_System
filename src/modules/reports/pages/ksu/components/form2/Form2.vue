<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useKsuForm2Api } from "@/api/reports/ksu/form2/get";
import { useExportComposable } from "../../../../composables/useExportComposable";
import type { KsuForm2Row } from "@/api/reports/ksu/form2/get/types";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";

const { t } = useI18n();
const { exportXlsx } = useExportComposable();
const { mutate: search, isPending: isLoading } = useKsuForm2Api();

const filter = reactive({ from: "", to: "", supply_type: "", pps: false });
const results = ref<KsuForm2Row[]>([]);

const columns = computed(() => [
  { name: "Prog", link: "prog_code" },
  { name: "Program", link: "prog_code_title" },
  { name: t("reports.title"), link: "title" },
  { name: t("reports.author"), link: "main_author" },
  { name: "Genre", link: "genre" },
  { name: "Inv", link: "inv_count" },
  { name: "Students", link: "stud_count" },
]);

function load() {
  search(
    {
      from: filter.from || undefined,
      to: filter.to || undefined,
      supply_type: filter.supply_type || undefined,
      pps: filter.pps || undefined,
    },
    { onSuccess(data) { results.value = data.res ?? []; } }
  );
}

function doExport() {
  exportXlsx("form2_report/export", filter, "form2_report.xlsx");
}
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.form2") }}</span>
      <div class="report-page__actions">
        <Button :label="$t('reports.export')" icon="pi pi-download" outlined @click="doExport" />
        <Button :label="$t('reports.apply')" icon="pi pi-search" @click="load" />
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
        <div class="report-page__filter-label">{{ $t("reports.supply_type") }}</div>
        <InputText v-model="filter.supply_type" class="w-full" />
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :rows="results as unknown as Record<string, unknown>[]"
      :show-row-numbers="false"
      :show-actions="false"
      :pagination="false"
      :sortable="false"
    />
  </div>
</template>