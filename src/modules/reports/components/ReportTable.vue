<script setup lang="ts">
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: Record<string, unknown>[];
  columns: { name: string; link: string }[];
  meta?: PaginationMeta;
  page?: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="columns.length || 4" />

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

      <Column
        v-for="col in columns"
        :key="col.link"
        :field="col.link"
        :header="col.name"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          {{ data[col.link] ?? "-" }}
        </template>
      </Column>
    </DataTable>

    <AppPaginator
      v-if="meta && page !== undefined"
      :meta="meta"
      :page="page"
      @update:page="emit('update:page', $event)"
    />
  </template>
</template>
