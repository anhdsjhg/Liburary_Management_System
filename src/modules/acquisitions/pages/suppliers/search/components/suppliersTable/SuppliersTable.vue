<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Supplier } from "@/api/acquisitions/suppliers/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: Supplier[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Supplier): void;
  (e: "delete", row: Supplier): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

const deleteTarget = ref<Supplier | null>(null);
const deleteConfirmVisible = ref(false);

function requestDelete(row: Supplier) {
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

    <Column field="id" :header="t('acquisitions.supplier.id')" style="min-width: 5rem" />
    <Column field="name" :header="t('acquisitions.supplier.name')" style="min-width: 14rem" />
    <Column field="com_name" :header="t('acquisitions.supplier.com_name')" style="min-width: 14rem" />
    <Column field="bin" :header="t('acquisitions.supplier.bin')" style="min-width: 10rem" />
    <Column field="address" :header="t('acquisitions.supplier.address')" style="min-width: 14rem" />
    <Column field="email" :header="t('acquisitions.supplier.email')" style="min-width: 12rem" />
    <Column field="phone" :header="t('acquisitions.supplier.phone')" style="min-width: 10rem" />
    <Column field="fax" :header="t('acquisitions.supplier.fax')" style="min-width: 8rem" />

    <Column :header="t('common.actions')" style="min-width: 8rem" frozen align-frozen="right">
      <template #body="{ data }: { data: Supplier }">
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
