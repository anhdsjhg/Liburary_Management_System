<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { BarcodeItem } from "@/api/reports/barcode/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: BarcodeItem[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
  selectedIds: string[];
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
  (e: "update:selectedIds", ids: string[]): void;
}>();

const { t } = useI18n();

function onSelectionChange(selection: BarcodeItem[]) {
  emit("update:selectedIds", selection.map((r) => r.id));
}
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="7" />

  <template v-else>
    <DataTable
      :value="rows"
      scrollable
      scroll-height="auto"
      size="small"
      striped-rows
      selection-mode="multiple"
      :meta-key-selection="false"
      @selection-change="onSelectionChange"
    >
      <template #empty>
        <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
          {{ $t("no_data") }}
        </div>
      </template>

      <Column selection-mode="multiple" style="min-width: 3rem" />

      <Column field="id" :header="t('reports.inv_id')" style="min-width: 8rem" />

      <Column field="barcode" :header="t('reports.barcode_label')" style="min-width: 10rem">
        <template #body="{ data }: { data: BarcodeItem }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="title" :header="t('reports.title')" style="min-width: 16rem">
        <template #body="{ data }: { data: BarcodeItem }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" :header="t('reports.author')" style="min-width: 12rem">
        <template #body="{ data }: { data: BarcodeItem }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="location_title" :header="t('reports.location')" style="min-width: 10rem">
        <template #body="{ data }: { data: BarcodeItem }">
          {{ data.location_title ?? "-" }}
        </template>
      </Column>

      <Column field="print_status" :header="t('reports.printed')" style="min-width: 8rem">
        <template #body="{ data }: { data: BarcodeItem }">
          {{ data.print_status ?? "-" }}
        </template>
      </Column>

      <Column field="init_status" :header="t('reports.initialized')" style="min-width: 9rem">
        <template #body="{ data }: { data: BarcodeItem }">
          {{ data.init_status ?? "-" }}
        </template>
      </Column>
    </DataTable>

    <AppPaginator
      :meta="meta"
      :page="page"
      @update:page="emit('update:page', $event)"
    />
  </template>
</template>
