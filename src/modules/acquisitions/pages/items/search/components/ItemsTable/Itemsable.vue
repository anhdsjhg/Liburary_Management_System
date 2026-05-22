<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { AcquisitionItem } from "@/api/acquisitions/items/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: AcquisitionItem[];
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
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="8" />

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

    <Column field="id" :header="t('acquisitions.item.id')" style="min-width: 7rem" />

    <Column field="barcode" :header="t('acquisitions.item.barcode')" style="min-width: 8rem" />

    <Column field="title" :header="t('acquisitions.item.title')" style="min-width: 14rem" />

    <Column field="author" :header="t('acquisitions.item.author')" style="min-width: 10rem" />

    <Column field="isbn" :header="t('acquisitions.item.isbn')" style="min-width: 8rem" />

    <Column field="pub_year" :header="t('acquisitions.item.pub_year')" style="min-width: 5rem" />

    <Column field="item_type" :header="t('acquisitions.item.item_type')" style="min-width: 6rem" />

    <Column field="publisher" :header="t('acquisitions.item.publisher')" style="min-width: 10rem" />

    <Column field="supplier" :header="t('acquisitions.item.supplier')" style="min-width: 10rem" />

    <Column field="cost" :header="t('acquisitions.item.cost')" style="min-width: 6rem" />

    <Column field="currency" :header="t('acquisitions.item.currency')" style="min-width: 5rem" />

    <Column field="location_title" :header="t('acquisitions.item.location_title')" style="min-width: 10rem" />

    <Column field="create_date" :header="t('acquisitions.item.create_date')" style="min-width: 9rem">
      <template #body="{ data }: { data: AcquisitionItem }">
        {{ formatDate(data.create_date) ?? "-" }}
      </template>
    </Column>

    <Column field="batch_id" :header="t('acquisitions.item.batch_id')" style="min-width: 6rem" />

    <Column field="act_no" :header="t('acquisitions.item.act_no')" style="min-width: 6rem" />
  </DataTable>

  <AppPaginator
    :meta="meta"
    :page="page"
    @update:page="emit('update:page', $event)"
  />
  </template>
</template>
