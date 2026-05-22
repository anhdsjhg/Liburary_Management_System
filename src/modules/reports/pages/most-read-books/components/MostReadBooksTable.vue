<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { MostReadBook } from "@/api/reports/most-read-books/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: MostReadBook[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
  (e: "update:selectedIds", ids: number[]): void;
  (e: "show-info", id: number): void;
}>();

const { t } = useI18n();

function onSelectionChange(selection: MostReadBook[]) {
  emit("update:selectedIds", selection.map((r) => r.id));
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
      selection-mode="multiple"
      :meta-key-selection="false"
      @selection-change="onSelectionChange"
    >
      <template #empty>
        <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
          {{ $t("no_data") }}
        </div>
      </template>

      <Column selection-mode="multiple" style="min-width: 3rem" />

      <Column field="title" :header="t('reports.title')" style="min-width: 14rem">
        <template #body="{ data }: { data: MostReadBook }">
          {{ data.title ?? "-" }}
        </template>
      </Column>

      <Column field="author" :header="t('reports.author')" style="min-width: 12rem">
        <template #body="{ data }: { data: MostReadBook }">
          {{ data.author ?? "-" }}
        </template>
      </Column>

      <Column field="isbn" :header="t('reports.isbn')" style="min-width: 8rem">
        <template #body="{ data }: { data: MostReadBook }">
          {{ data.isbn ?? "-" }}
        </template>
      </Column>

      <Column field="type" :header="t('reports.item_type')" style="min-width: 7rem">
        <template #body="{ data }: { data: MostReadBook }">
          {{ data.type ?? "-" }}
        </template>
      </Column>

      <Column field="borrow_count" :header="t('reports.borrow_count')" style="min-width: 7rem" />

      <Column field="available" :header="t('reports.available')" style="min-width: 7rem">
        <template #body="{ data }: { data: MostReadBook }">
          {{ data.available ?? "-" }}
        </template>
      </Column>

      <Column field="total" :header="t('reports.total_copies')" style="min-width: 7rem">
        <template #body="{ data }: { data: MostReadBook }">
          {{ data.total ?? "-" }}
        </template>
      </Column>

      <Column :header="t('common.actions')" style="min-width: 8rem" frozen align-frozen="right">
        <template #body="{ data }: { data: MostReadBook }">
          <Button
            size="small"
            severity="info"
            outlined
            icon="pi pi-info-circle"
            @click="emit('show-info', data.id)"
          />
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
