<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { ServiceLoan } from "@/api/service-desk/loans/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: ServiceLoan[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

function statusSeverity(status: string, isOverdue: boolean) {
  if (isOverdue) return "danger";
  if (status === "returned") return "success";
  if (status === "issued") return "warn";
  return "secondary";
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
    >
      <template #empty>
        <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
          {{ $t("no_data") }}
        </div>
      </template>

      <Column field="id" header="ID" style="min-width: 5rem" />
      <Column field="user_name" :header="t('serviceDesk.user_name')" style="min-width: 12rem" />
      <Column field="user_cid" :header="t('serviceDesk.user_cid')" style="min-width: 10rem" />
      <Column field="media_title" :header="t('serviceDesk.media_title')" style="min-width: 16rem" />
      <Column field="inventory_number" :header="t('serviceDesk.inventory_number')" style="min-width: 10rem" />

      <Column :header="t('serviceDesk.given_at')" style="min-width: 9rem">
        <template #body="{ data }: { data: ServiceLoan }">
          {{ formatDate(data.given_at) ?? "-" }}
        </template>
      </Column>

      <Column :header="t('serviceDesk.due_at')" style="min-width: 9rem">
        <template #body="{ data }: { data: ServiceLoan }">
          {{ formatDate(data.due_at) ?? "-" }}
        </template>
      </Column>

      <Column :header="t('serviceDesk.returned_at')" style="min-width: 9rem">
        <template #body="{ data }: { data: ServiceLoan }">
          {{ data.returned_at ? formatDate(data.returned_at) : "—" }}
        </template>
      </Column>

      <Column :header="t('serviceDesk.status')" style="min-width: 8rem" frozen align-frozen="right">
        <template #body="{ data }: { data: ServiceLoan }">
          <Tag
            :value="data.status"
            :severity="statusSeverity(data.status, data.is_overdue)"
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
