<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { BookHistoryEntry } from "@/api/reports/book-history/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: BookHistoryEntry[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
  (e: "update:selectedIds", ids: string[]): void;
}>();

const { t } = useI18n();

function onSelectionChange(selection: BookHistoryEntry[]) {
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

      <Column field="inv_id" :header="t('reports.inv_id')" style="min-width: 7rem" />

      <Column field="barcode" :header="t('reports.barcode_label')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="title" :header="t('reports.title')" style="min-width: 14rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" :header="t('reports.author')" style="min-width: 12rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="isbn" :header="t('reports.isbn')" style="min-width: 8rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.isbn ?? "-" }}
        </template>
      </Column>

      <Column field="item_type" :header="t('reports.item_type')" style="min-width: 7rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.item_type ?? "-" }}
        </template>
      </Column>

      <Column field="location_title" :header="t('reports.location')" style="min-width: 10rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.location_title ?? "-" }}
        </template>
      </Column>

      <Column field="location" :header="t('reports.callnumber')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.location ?? "-" }}
        </template>
      </Column>

      <Column field="supplier" :header="t('reports.supplier')" style="min-width: 10rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.supplier ?? "-" }}
        </template>
      </Column>

      <Column field="cost" :header="t('reports.cost')" style="min-width: 7rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.cost ?? "-" }}
        </template>
      </Column>

      <Column field="currency" :header="t('reports.currency')" style="min-width: 6rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.currency ?? "-" }}
        </template>
      </Column>

      <Column field="create_date" :header="t('reports.create_date')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ formatDate(data.create_date) ?? "-" }}
        </template>
      </Column>

      <Column field="batch_id" :header="t('reports.batch_id')" style="min-width: 7rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
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
