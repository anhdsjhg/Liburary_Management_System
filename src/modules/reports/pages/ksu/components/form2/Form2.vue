<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useKsuForm2Api } from "@/api/reports/ksu/form2/get";
import { useExportComposable } from "../../../../composables/useExportComposable";
import type { KsuForm2Row } from "@/api/reports/ksu/form2/get/types";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AppPaginator from "@/application/components/AppPaginator.vue";
import type { PaginationMeta } from "@/application/types/table";

const { t } = useI18n();
const { exportXlsx } = useExportComposable();
const { mutate: search, isPending: isLoading } = useKsuForm2Api();

const filter = reactive({ from: "", to: "", supply_type: "", pps: false });
const allResults = ref<KsuForm2Row[]>([]);
const currentPage = ref(1);
const PER_PAGE = 25;

const supplyTypeOptions = [
  { label: t("reports.supply_type_donated"), value: "donated" },
  { label: t("reports.supply_type_bought"), value: "bought" },
  { label: t("reports.supply_type_replacement"), value: "replacement" },
];

const meta = computed<PaginationMeta>(() => {
  const total = allResults.value.length;
  const from = total === 0 ? 0 : (currentPage.value - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage.value * PER_PAGE, total);
  return {
    total,
    from,
    to,
    current_page: currentPage.value,
    last_page: Math.max(1, Math.ceil(total / PER_PAGE)),
    per_page: PER_PAGE,
  };
});

const pagedResults = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return allResults.value.slice(start, start + PER_PAGE);
});

function load() {
  currentPage.value = 1;
  search(
    {
      from: filter.from || undefined,
      to: filter.to || undefined,
      supply_type: filter.supply_type || undefined,
      pps: filter.pps || undefined,
    },
    { onSuccess(data) { allResults.value = data.res ?? []; } }
  );
}

function onPageChange(page: number) {
  currentPage.value = page;
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
        <Select
          v-model="filter.supply_type"
          :options="supplyTypeOptions"
          option-label="label"
          option-value="value"
          :placeholder="$t('reports.supply_type')"
          show-clear
          class="w-full"
        />
      </div>
    </div>

    <DataTable :value="pagedResults" scrollable scroll-height="auto" size="small" striped-rows :loading="isLoading">
      <Column field="prog_code" header="Prog" style="min-width: 6rem" />
      <Column field="prog_code_title" header="Program" style="min-width: 10rem" />
      <Column field="title" :header="$t('reports.title')" style="min-width: 14rem" />
      <Column field="main_author" :header="$t('reports.author')" style="min-width: 10rem" />
      <Column field="genre" header="Genre" style="min-width: 8rem" />
      <Column field="inv_count" header="Inv" style="min-width: 5rem" />
      <Column field="stud_count" header="Students" style="min-width: 6rem" />
    </DataTable>
    <AppPaginator :meta="meta" :page="currentPage" @update:page="onPageChange" />
  </div>
</template>
