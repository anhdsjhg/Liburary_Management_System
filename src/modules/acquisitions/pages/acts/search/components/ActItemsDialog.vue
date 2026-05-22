<script setup lang="ts">
import { computed } from "vue";
import { useItemsByActApi } from "@/api/acquisitions/items/by-act/[id]/get/index";
import { useActExportApi } from "@/api/acquisitions/acts/export/post/index";
import { useActPrintApi } from "@/api/acquisitions/acts/print/post/index";

const props = defineProps<{
  visible: boolean;
  actId: number | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
}>();

const actIdRef = computed(() => props.actId ?? "");

const { data: itemsData, isLoading } = useItemsByActApi(actIdRef);
const items = computed(() => itemsData.value?.res ?? []);

const { mutate: doExport, isPending: exportLoading } = useActExportApi();
const { mutate: doPrint, isPending: printLoading } = useActPrintApi();

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function onExport() {
  if (!props.actId) return;
  doExport(
    { id: props.actId },
    { onSuccess: (blob) => downloadBlob(blob, `act_${props.actId}.xlsx`) },
  );
}

function onPrint() {
  if (!props.actId) return;
  doPrint(
    { id: props.actId },
    { onSuccess: (blob) => downloadBlob(blob, `act_${props.actId}.pdf`) },
  );
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="$t('acquisitions.items_of_act')"
    style="width: 90vw; max-width: 1200px"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="act-items-dialog">
      <div class="act-items-dialog__toolbar">
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
      </DataTable>
    </div>
  </Dialog>
</template>

<style scoped>
.act-items-dialog__toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
