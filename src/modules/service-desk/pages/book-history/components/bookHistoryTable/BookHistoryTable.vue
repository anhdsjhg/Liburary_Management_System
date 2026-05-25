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
}>();

const { t } = useI18n();

function statusSeverity(status: string | null) {
  if (status === "returned") return "success";
  if (status === "issued") return "warn";
  if (status === "overdue") return "danger";
  return "secondary";
}
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="9" />

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

      <Column field="barcode" :header="t('serviceDesk.barcode')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="id" :header="t('serviceDesk.inventory_number')" style="min-width: 9rem" />

      <Column field="type" header="Type" style="min-width: 7rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.type ?? "-" }}
        </template>
      </Column>

      <Column field="title" :header="t('serviceDesk.media_title')" style="min-width: 16rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" header="Author" style="min-width: 12rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="borrow_date" :header="t('serviceDesk.given_at')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ formatDate(data.borrow_date) ?? "-" }}
        </template>
      </Column>

      <Column field="due_date" :header="t('serviceDesk.due_at')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ formatDate(data.due_date) ?? "-" }}
        </template>
      </Column>

      <Column field="delivery_date" :header="t('serviceDesk.returned_at')" style="min-width: 9rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.delivery_date ? formatDate(data.delivery_date) : "—" }}
        </template>
      </Column>

      <Column field="username" :header="t('serviceDesk.user_name')" style="min-width: 12rem">
        <template #body="{ data }: { data: BookHistoryEntry }">
          {{ data.username ?? "-" }}
        </template>
      </Column>

      <Column :header="t('serviceDesk.status')" style="min-width: 8rem" frozen align-frozen="right">
        <template #body="{ data }: { data: BookHistoryEntry }">
          <Tag
            v-if="data.status"
            :value="data.status"
            :severity="statusSeverity(data.status)"
          />
          <span v-else>-</span>
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
