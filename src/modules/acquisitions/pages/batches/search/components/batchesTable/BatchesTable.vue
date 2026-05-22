<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Batch } from "@/api/acquisitions/batches/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: Batch[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Batch): void;
  (e: "delete", row: Batch): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
  (e: "show-items", row: Batch): void;
}>();

const { t } = useI18n();

const deleteTarget = ref<Batch | null>(null);
const deleteConfirmVisible = ref(false);

function requestDelete(row: Batch) {
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
}

function onDeleteConfirmed() {
  if (deleteTarget.value) emit("delete", deleteTarget.value);
  deleteTarget.value = null;
}

function getStatusSeverity(status: string | null): string {
  if (status === "Open") return "info";
  if (status === "Closed") return "success";
  if (status === "Checked") return "warn";
  return "secondary";
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
  >
    <template #empty>
      <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
        {{ $t("no_data") }}
      </div>
    </template>

    <Column field="id" :header="t('acquisitions.batch.id')" style="min-width: 5rem" />

    <Column field="status" :header="t('acquisitions.batch.status')" style="min-width: 8rem">
      <template #body="{ data }: { data: Batch }">
        <Tag
          v-if="data.status"
          :value="data.status"
          :severity="getStatusSeverity(data.status)"
        />
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="invoice_date" :header="t('acquisitions.batch.invoice_date')" style="min-width: 9rem">
      <template #body="{ data }: { data: Batch }">
        {{ formatDate(data.invoice_date) ?? "-" }}
      </template>
    </Column>

    <Column field="sup_type" :header="t('acquisitions.batch.sup_type')" style="min-width: 8rem" />

    <Column field="supplier" :header="t('acquisitions.batch.supplier')" style="min-width: 10rem" />

    <Column field="titles_no" :header="t('acquisitions.batch.titles_no')" style="min-width: 7rem" />

    <Column field="items_no" :header="t('acquisitions.batch.items_no')" style="min-width: 7rem" />

    <Column field="titles_ma" :header="t('acquisitions.batch.titles_ma')" style="min-width: 7rem" />

    <Column field="items_ma" :header="t('acquisitions.batch.items_ma')" style="min-width: 7rem" />

    <Column field="price" :header="t('acquisitions.batch.price')" style="min-width: 7rem" />

    <Column field="currency" :header="t('acquisitions.batch.currency')" style="min-width: 5rem" />

    <Column field="doc_no" :header="t('acquisitions.batch.doc_no')" style="min-width: 7rem" />

    <Column field="create_date" :header="t('acquisitions.batch.create_date')" style="min-width: 9rem">
      <template #body="{ data }: { data: Batch }">
        {{ formatDate(data.create_date) ?? "-" }}
      </template>
    </Column>

    <Column field="created_by" :header="t('acquisitions.batch.created_by')" style="min-width: 9rem" />

    <Column :header="t('common.actions')" style="min-width: 14rem" frozen align-frozen="right">
      <template #body="{ data }: { data: Batch }">
        <div class="flex gap-1">
          <Button
            size="small"
            severity="info"
            outlined
            :label="t('acquisitions.items')"
            @click="emit('show-items', data)"
          />
          <Button
            size="small"
            severity="secondary"
            outlined
            icon="pi pi-pencil"
            @click="emit('edit', data)"
          />
          <Button
            size="small"
            severity="danger"
            outlined
            icon="pi pi-trash"
            @click="requestDelete(data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>

  <AppPaginator
    :meta="meta"
    :page="page"
    @update:page="emit('update:page', $event)"
  />
  </template>

  <AppConfirmDialog
    v-model:visible="deleteConfirmVisible"
    :loading="deleteLoading"
    :on-confirm="onDeleteConfirmed"
  />
</template>
