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

function getStatusSeverity(status: string | null) {
  if (status === "returned") return "success";
  if (status === "issued") return "warn";
  return "secondary";
}
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="10" />

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

      <Column field="barcode" :header="t('reports.barcode_label')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="id" :header="t('reports.inv_id')" style="min-width: 7rem" />

      <Column field="type" header="Type" style="min-width: 6rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.type ?? "-" }}
        </template>
      </Column>

      <Column field="title" header="Title" style="min-width: 14rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" :header="t('reports.author')" style="min-width: 12rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="borrow_date" header="Borrow date" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ formatDate(data.borrow_date) ?? "-" }}
        </template>
      </Column>

      <Column field="due_date" header="Due date" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ formatDate(data.due_date) ?? "-" }}
        </template>
      </Column>

      <Column field="delivery_date" header="Delivery date" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ formatDate(data.delivery_date) ?? "-" }}
        </template>
      </Column>

      <Column field="status" header="Status" style="min-width: 7rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          <Tag
            v-if="data.status"
            :value="data.status"
            :severity="getStatusSeverity(data.status)"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <Column field="username" header="Last user" style="min-width: 11rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.username ?? "-" }}
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
