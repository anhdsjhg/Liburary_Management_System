<script setup lang="ts">
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import { useBatchesTable } from "./composables/useComposable";
import type { Batch } from "@/api/acquisitions/batches/get/types";
import type { PaginationMeta } from "@/application/types/table";

defineProps<{
  rows: Batch[];
  meta: PaginationMeta;
  page: number;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Batch): void;
  (e: "delete", row: Batch): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { columns } = useBatchesTable();
</script>

<template>
  <AppDataTable
    :columns="columns"
    :rows="rows"
    :meta="meta"
    :page="page"
    :delete-loading="deleteLoading"
    show-status
    :edit-config="{ available: true }"
    :delete-config="{ available: true }"
    @update:page="$emit('update:page', $event)"
    @edit="(row) => $emit('edit', row as unknown as Batch)"
    @delete="(row) => $emit('delete', row as unknown as Batch)"
    @refresh="$emit('refresh')"
  />
</template>