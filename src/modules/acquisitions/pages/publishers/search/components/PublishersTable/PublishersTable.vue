<script setup lang="ts">
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import { usePublishersTable } from "./composables/useComposable";
import type { Publisher } from "@/api/acquisitions/publishers/get/types";
import type { PaginationMeta } from "@/application/types/table";

defineProps<{
  rows: Publisher[];
  meta: PaginationMeta;
  page: number;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Publisher): void;
  (e: "delete", row: Publisher): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { columns } = usePublishersTable();
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
    @edit="(row) => $emit('edit', row as Publisher)"
    @delete="(row) => $emit('delete', row as Publisher)"
    @refresh="$emit('refresh')"
  />
</template>