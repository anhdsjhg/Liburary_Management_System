<script setup lang="ts">
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import { useItemsTable } from "./composables/useComposable";
import type { AcquisitionItem } from "@/api/acquisitions/items/get/types";
import type { PaginationMeta } from "@/application/types/table";

defineProps<{
  rows: AcquisitionItem[];
  meta: PaginationMeta;
  page: number;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { columns } = useItemsTable();
</script>

<template>
  <AppDataTable
    :columns="columns"
    :rows="rows"
    :meta="meta"
    :page="page"
    :show-actions="false"
    @update:page="$emit('update:page', $event)"
    @refresh="$emit('refresh')"
  />
</template>