<script setup lang="ts">
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import { useCatalogingResultsTable } from "./composables/useComposable";
import type { CatalogingMaterial } from "@/api/cataloging/search/get/types";
import type { PaginationMeta } from "@/application/types/table";

defineProps<{
  rows: CatalogingMaterial[];
  meta: PaginationMeta;
  page: number;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: CatalogingMaterial): void;
  (e: "delete", row: CatalogingMaterial): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { columns } = useCatalogingResultsTable();
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
    @edit="(row) => $emit('edit', row as CatalogingMaterial)"
    @delete="(row) => $emit('delete', row as CatalogingMaterial)"
    @refresh="$emit('refresh')"
  />
</template>