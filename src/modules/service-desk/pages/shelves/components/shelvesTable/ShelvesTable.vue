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

      <Column field="inv_id" :header="t('serviceDesk.inv_id')" style="min-width: 8rem" />
      <Column field="barcode" :header="t('serviceDesk.barcode')" style="min-width: 10rem" />
      <Column field="title" :header="t('serviceDesk.title')" style="min-width: 18rem" />
      <Column field="callnumber" :header="t('serviceDesk.callnumber')" style="min-width: 10rem" />
    </DataTable>

    <AppPaginator
      :meta="meta"
      :page="page"
      @update:page="emit('update:page', $event)"
    />
  </template>
</template>
