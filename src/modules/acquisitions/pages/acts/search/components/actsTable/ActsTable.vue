<script setup lang="ts">
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import { useActsTable } from "./composables/useComposable";
import type { Act } from "@/api/acquisitions/acts/get/types";
import type { PaginationMeta } from "@/application/types/table";

defineProps<{
  rows: Act[];
  meta: PaginationMeta;
  page: number;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: Act): void;
  (e: "delete", row: Act): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { columns } = useActsTable();
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
    @edit="(row) => $emit('edit', row as unknown as Act)"
    @delete="(row) => $emit('delete', row as unknown as Act)"
    @refresh="$emit('refresh')"
  />
</template>