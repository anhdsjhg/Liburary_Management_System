<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Publisher } from "@/api/acquisitions/publishers/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: Publisher[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Publisher): void;
  (e: "delete", row: Publisher): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

const deleteTarget = ref<Publisher | null>(null);
const deleteConfirmVisible = ref(false);

function requestDelete(row: Publisher) {
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
}

function onDeleteConfirmed() {
  if (deleteTarget.value) emit("delete", deleteTarget.value);
  deleteTarget.value = null;
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

    <Column field="id" :header="t('acquisitions.publisher.id')" style="min-width: 5rem" />
    <Column field="name" :header="t('acquisitions.publisher.name')" style="min-width: 14rem" />
    <Column field="com_name" :header="t('acquisitions.publisher.com_name')" style="min-width: 14rem" />
    <Column field="address" :header="t('acquisitions.publisher.address')" style="min-width: 14rem" />
    <Column field="email" :header="t('acquisitions.publisher.email')" style="min-width: 12rem" />
    <Column field="phone" :header="t('acquisitions.publisher.phone')" style="min-width: 10rem" />
    <Column field="fax" :header="t('acquisitions.publisher.fax')" style="min-width: 8rem" />

    <Column :header="t('common.actions')" style="min-width: 8rem" frozen align-frozen="right">
      <template #body="{ data }: { data: Publisher }">
        <div class="flex gap-1">
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
