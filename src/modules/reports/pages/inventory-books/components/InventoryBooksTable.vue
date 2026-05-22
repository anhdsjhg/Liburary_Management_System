<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { InventoryBook } from "@/api/reports/inventory-books/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: InventoryBook[];
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

function onSelectionChange(selection: InventoryBook[]) {
  emit("update:selectedIds", selection.map((r) => r.id));
}

function getStatusSeverity(status: number | null) {
  if (status === 1) return "success";
  if (status === 0) return "danger";
  return "secondary";
}

function getStatusLabel(status: number | null) {
  if (status === 1) return t("reports.in_balance");
  if (status === 0) return t("reports.not_in_balance");
  return "-";
}
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="8" />

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

      <Column field="id" :header="t('reports.inv_id')" style="min-width: 7rem" />

      <Column field="barcode" :header="t('reports.barcode_label')" style="min-width: 9rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="title" :header="t('reports.title')" style="min-width: 14rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" :header="t('reports.author')" style="min-width: 12rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="isbn" :header="t('reports.isbn')" style="min-width: 8rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.isbn ?? "-" }}
        </template>
      </Column>

      <Column field="pub_year" :header="t('reports.pub_year')" style="min-width: 6rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.pub_year ?? "-" }}
        </template>
      </Column>

      <Column field="item_type" :header="t('reports.item_type')" style="min-width: 7rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.item_type ?? "-" }}
        </template>
      </Column>

      <Column field="location_title" :header="t('reports.location')" style="min-width: 10rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.location_title ?? "-" }}
        </template>
      </Column>

      <Column field="location" :header="t('reports.callnumber')" style="min-width: 9rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.location ?? "-" }}
        </template>
      </Column>

      <Column field="status" :header="t('reports.status')" style="min-width: 9rem">
        <template #body="{ data }: { data: InventoryBook }">
          <Tag
            :value="getStatusLabel(data.status)"
            :severity="getStatusSeverity(data.status)"
          />
        </template>
      </Column>

      <Column field="cost" :header="t('reports.cost')" style="min-width: 7rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.cost ?? "-" }}
        </template>
      </Column>

      <Column field="currency" :header="t('reports.currency')" style="min-width: 6rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.currency ?? "-" }}
        </template>
      </Column>

      <Column field="create_date" :header="t('reports.create_date')" style="min-width: 9rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ formatDate(data.create_date) ?? "-" }}
        </template>
      </Column>

      <Column field="batch_id" :header="t('reports.batch_id')" style="min-width: 7rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.batch_id ?? "-" }}
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
