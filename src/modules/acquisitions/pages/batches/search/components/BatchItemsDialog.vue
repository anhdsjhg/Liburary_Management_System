<script setup lang="ts">
import { computed } from "vue";
import { useItemsByBatchApi } from "@/api/acquisitions/items/by-batch/[id]/get/index";
import { useBatchExportApi } from "@/api/acquisitions/batches/export/post/index";
import { useBatchPrintApi } from "@/api/acquisitions/batches/print/post/index";

const props = defineProps<{
  visible: boolean;
  batchId: number | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
}>();

const batchIdRef = computed(() => props.batchId ?? "");

const { data: itemsData, isLoading } = useItemsByBatchApi(batchIdRef);
const items = computed(() => itemsData.value?.res ?? []);

const { mutate: doExport, isPending: exportLoading } = useBatchExportApi();
const { mutate: doPrint, isPending: printLoading } = useBatchPrintApi();

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function onExport() {
  if (!props.batchId) return;
  doExport(
    { id: props.batchId },
    { onSuccess: (blob) => downloadBlob(blob, `batch_${props.batchId}.xlsx`) },
  );
}

function onPrint() {
  if (!props.batchId) return;
  doPrint(
    { id: props.batchId },
    { onSuccess: (blob) => downloadBlob(blob, `batch_${props.batchId}.pdf`) },
  );
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="$t('acquisitions.items_of_batch')"
    style="width: 90vw; max-width: 1200px"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="batch-items-dialog">
      <div class="batch-items-dialog__toolbar">
        <Button
          :label="$t('acquisitions.export')"
          icon="pi pi-file-excel"
          severity="success"
          :loading="exportLoading"
          @click="onExport"
        />
        <Button
          :label="$t('acquisitions.print')"
          icon="pi pi-print"
          :loading="printLoading"
          @click="onPrint"
        />
      </div>

      <Skeleton v-if="isLoading" height="20rem" />

      <DataTable
        v-else
        :value="items"
        scroll-height="60vh"
        scrollable
        striped-rows
        size="small"
      >
        <Column field="id" :header="$t('acquisitions.item.id')" style="min-width: 6rem" />
        <Column field="title" :header="$t('acquisitions.item.title')" style="min-width: 14rem" />
        <Column field="author" :header="$t('acquisitions.item.author')" style="min-width: 10rem" />
        <Column field="item_type" :header="$t('acquisitions.item.item_type')" style="min-width: 6rem" />
        <Column field="publisher" :header="$t('acquisitions.item.publisher')" style="min-width: 10rem" />
        <Column field="pub_year" :header="$t('acquisitions.item.pub_year')" style="min-width: 5rem" />
        <Column field="cost" :header="$t('acquisitions.item.cost')" style="min-width: 6rem" />
        <Column field="currency" :header="$t('acquisitions.item.currency')" style="min-width: 5rem" />
        <Column field="location_title" :header="$t('acquisitions.item.location_title')" style="min-width: 10rem" />
        <Column field="status" :header="$t('acquisitions.item.status')" style="min-width: 6rem" />
        <Column field="barcode" :header="$t('acquisitions.item.barcode')" style="min-width: 8rem" />
      </DataTable>
    </div>
  </Dialog>
</template>

<style scoped>
.batch-items-dialog__toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
