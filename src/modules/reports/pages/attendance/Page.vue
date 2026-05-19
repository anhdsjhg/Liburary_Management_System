<script setup lang="ts">
import { computed } from "vue";
import { useAttendancePage } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import type { TableColumnDef } from "@/application/types/table";

const { weekDays, monthNames, byWeek, byMonth, isLoading } = useAttendancePage();

const weekColumns = computed<TableColumnDef<Record<string, unknown>>[]>(() => [
  { name: "", link: "label" },
  ...weekDays.value.map((d, i) => ({ name: d, link: `d${i}` })),
]);

const weekRows = computed<Record<string, unknown>[]>(() => [
  { label: "Students", ...Object.fromEntries((byWeek.value?.students ?? []).map((v, i) => [`d${i}`, v])) },
  { label: "Employees", ...Object.fromEntries((byWeek.value?.employees ?? []).map((v, i) => [`d${i}`, v])) },
]);

const monthColumns = computed<TableColumnDef<Record<string, unknown>>[]>(() => [
  { name: "", link: "label" },
  ...monthNames.value.map((m, i) => ({ name: m, link: `m${i}` })),
]);

const monthRows = computed<Record<string, unknown>[]>(() => [
  { label: "Students", ...Object.fromEntries((byMonth.value?.students ?? []).map((v, i) => [`m${i}`, v])) },
  { label: "Employees", ...Object.fromEntries((byMonth.value?.employees ?? []).map((v, i) => [`m${i}`, v])) },
]);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.attendance") }}</span>
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <template v-else>
      <div class="report-page__chart">
        <div class="report-page__chart-title">{{ $t("reports.by_week") }}</div>
        <AppDataTable
          :columns="weekColumns"
          :rows="weekRows"
          :show-row-numbers="false"
          :show-actions="false"
          :pagination="false"
          :sortable="false"
        />
      </div>

      <div class="report-page__chart">
        <div class="report-page__chart-title">{{ $t("reports.by_month") }}</div>
        <AppDataTable
          :columns="monthColumns"
          :rows="monthRows"
          :show-row-numbers="false"
          :show-actions="false"
          :pagination="false"
          :sortable="false"
        />
      </div>
    </template>
  </div>
</template>