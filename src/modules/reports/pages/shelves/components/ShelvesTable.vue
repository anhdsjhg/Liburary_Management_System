<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { ShelfItem } from "@/api/reports/shelves/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: ShelfItem[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="4" />

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

      <Column field="inv_id" :header="t('reports.inv_id')" style="min-width: 7rem" />

      <Column field="barcode" :header="t('reports.barcode_label')" style="min-width: 9rem">
        <template #body="{ data }: { data: ShelfItem }">
          {{ data.barcode ?? "-" }}
        </template>
      </Column>

      <Column field="title" :header="t('reports.title')" style="min-width: 16rem">
        <template #body="{ data }: { data: ShelfItem }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="callnumber" :header="t('reports.callnumber')" style="min-width: 10rem">
        <template #body="{ data }: { data: ShelfItem }">
          {{ data.callnumber ?? "-" }}
        </template>
      </Column>
    </DataTable>

    <AppPaginator
      :meta="meta"
      :page="page"
      @update:page="emit('update:page', $event)"
    />
  </template>
</template>
