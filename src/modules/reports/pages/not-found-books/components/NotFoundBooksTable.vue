<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { NotFoundBook } from "@/api/reports/not-found-books/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: NotFoundBook[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

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
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="6" />

  <template v-else>
    <DataTable
      :value="rows"
      scrollable
      scroll-height="auto"
      size="small"
      striped-rows
    >
      <template #empty>
        <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
          {{ $t("no_data") }}
        </div>
      </template>

      <Column field="id" :header="t('reports.inv_id')" style="min-width: 7rem" />

      <Column field="barcode" :header="t('reports.barcode_label')" style="min-width: 9rem">
        <template #body="{ data }: { data: NotFoundBook }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="title" :header="t('reports.title')" style="min-width: 14rem">
        <template #body="{ data }: { data: NotFoundBook }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" :header="t('reports.author')" style="min-width: 12rem">
        <template #body="{ data }: { data: NotFoundBook }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="location" :header="t('reports.callnumber')" style="min-width: 9rem">
        <template #body="{ data }: { data: NotFoundBook }">
          {{ data.location ?? "-" }}
        </template>
      </Column>

      <Column field="item_type" :header="t('reports.item_type')" style="min-width: 7rem">
        <template #body="{ data }: { data: NotFoundBook }">
          {{ data.item_type ?? "-" }}
        </template>
      </Column>

      <Column field="batch_id" :header="t('reports.batch_id')" style="min-width: 7rem">
        <template #body="{ data }: { data: NotFoundBook }">
          {{ data.batch_id ?? "-" }}
        </template>
      </Column>

      <Column field="status" :header="t('reports.status')" style="min-width: 9rem">
        <template #body="{ data }: { data: NotFoundBook }">
          <Tag
            :value="getStatusLabel(data.status)"
            :severity="getStatusSeverity(data.status)"
          />
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
