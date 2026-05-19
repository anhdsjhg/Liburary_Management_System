<script setup lang="ts">
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import { useSuppliersTable } from "./composables/useComposable";
import type { Supplier } from "@/api/acquisitions/suppliers/get/types";
import type { PaginationMeta } from "@/application/types/table";

defineProps<{
  rows: Supplier[];
  meta: PaginationMeta;
  page: number;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Supplier): void;
  (e: "delete", row: Supplier): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { columns } = useSuppliersTable();
</script>

<template>
  <AppDataTable
    :columns="columns"
    :rows="rows"
    :meta="meta"
    :page="page"
    :delete-loading="deleteLoading"
    :edit-config="{ available: true }"
    :delete-config="{ available: true }"
    @update:page="$emit('update:page', $event)"
    @edit="(row) => $emit('edit', row as Supplier)"
    @delete="(row) => $emit('delete', row as Supplier)"
    @refresh="$emit('refresh')"
  />
</template>