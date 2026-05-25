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

function getLostSeverity(lost_status: string | null) {
  if (lost_status === "0") return "success";
  if (lost_status === "1") return "danger";
  return "secondary";
}

function getLostLabel(lost_status: string | null) {
  if (lost_status === "0") return t("reports.in_balance");
  if (lost_status === "1") return t("reports.not_in_balance");
  return "-";
}

function getCallnumber(row: InventoryBook): string {
  const raw = row as Record<string, unknown>;
  return (raw["coalesce(b.callnumber,j.callnumber,d.callnumber)"] as string) ?? row.callnumber ?? "-";
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

      <Column field="inventory_no" :header="t('reports.inv_id')" style="min-width: 7rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.inventory_no ?? "-" }}
        </template>
      </Column>

      <Column field="author_title" :header="t('reports.title')" style="min-width: 18rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.author_title ?? "-" }}
        </template>
      </Column>

      <Column field="year_city" :header="t('reports.pub_year')" style="min-width: 10rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.year_city ?? "-" }}
        </template>
      </Column>

      <Column field="doc_no" :header="t('reports.batch_id')" style="min-width: 7rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.doc_no ?? "-" }}
        </template>
      </Column>

      <Column field="invoice_date" :header="t('reports.create_date')" style="min-width: 9rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ formatDate(data.invoice_date) ?? "-" }}
        </template>
      </Column>

      <Column field="location" :header="t('reports.location')" style="min-width: 8rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.location ?? "-" }}
        </template>
      </Column>

      <Column :header="t('reports.callnumber')" style="min-width: 10rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ getCallnumber(data) }}
        </template>
      </Column>

      <Column field="cost" :header="t('reports.cost')" style="min-width: 7rem">
        <template #body="{ data }: { data: InventoryBook }">
          {{ data.cost ?? "-" }}
        </template>
      </Column>

      <Column field="lost_status" :header="t('reports.status')" style="min-width: 9rem">
        <template #body="{ data }: { data: InventoryBook }">
          <Tag
            :value="getLostLabel(data.lost_status)"
            :severity="getLostSeverity(data.lost_status)"
          />
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
