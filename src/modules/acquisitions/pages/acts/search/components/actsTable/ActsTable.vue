<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Act } from "@/api/acquisitions/acts/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: Act[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Act): void;
  (e: "delete", row: Act): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
  (e: "show-items", row: Act): void;
}>();

const { t } = useI18n();

const deleteTarget = ref<Act | null>(null);
const deleteConfirmVisible = ref(false);

function requestDelete(row: Act) {
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

    <Column field="id" :header="t('acquisitions.act.id')" style="min-width: 5rem" />

    <Column field="act_date" :header="t('acquisitions.act.act_date')" style="min-width: 9rem">
      <template #body="{ data }: { data: Act }">
        {{ formatDate(data.act_date) ?? "-" }}
      </template>
    </Column>

    <Column field="status" :header="t('acquisitions.act.status')" style="min-width: 8rem">
      <template #body="{ data }: { data: Act }">
        <Tag
          v-if="data.status"
          :value="data.status"
          :severity="getStatusSeverity(data.status)"
        />
        <span v-else>-</span>
      </template>
    </Column>

    <Column field="protocol_id" :header="t('acquisitions.act.protocol_id')" style="min-width: 8rem" />

    <Column field="protocol_date" :header="t('acquisitions.act.protocol_date')" style="min-width: 9rem">
      <template #body="{ data }: { data: Act }">
        {{ formatDate(data.protocol_date) ?? "-" }}
      </template>
    </Column>

    <Column field="items_ma" :header="t('acquisitions.act.items_ma')" style="min-width: 6rem" />

    <Column field="price" :header="t('acquisitions.act.price')" style="min-width: 7rem" />

    <Column field="currency" :header="t('acquisitions.act.currency')" style="min-width: 5rem" />

    <Column field="create_date" :header="t('acquisitions.act.create_date')" style="min-width: 9rem">
      <template #body="{ data }: { data: Act }">
        {{ formatDate(data.create_date) ?? "-" }}
      </template>
    </Column>

    <Column field="notes" :header="t('acquisitions.act.notes')" style="min-width: 10rem" />

    <Column :header="t('common.actions')" style="min-width: 14rem" frozen align-frozen="right">
      <template #body="{ data }: { data: Act }">
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