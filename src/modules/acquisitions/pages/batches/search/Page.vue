<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBatchesSearch } from "./composables/useComposable";
import BatchesTable from "./components/batchesTable/BatchesTable.vue";
import BatchItemsDialog from "./components/BatchItemsDialog.vue";
import type { Batch } from "@/api/acquisitions/batches/get/types";

const {
  results,
  meta,
  isLoading,
  deleteLoading,
  currentPage,
  searchQuery,
  load,
  onPageChange,
  goToManage,
  onDelete,
} = useBatchesSearch();

const dialogVisible = ref(false);
const selectedBatchId = ref<number | null>(null);

function onShowItems(row: Batch) {
  selectedBatchId.value = row.id;
  dialogVisible.value = true;
}

onMounted(() => load(1));
</script>

<template>
  <div class="acquisition-page">
    <div class="acquisition-page__header">
      <span class="acquisition-page__title">
        {{ $t("acquisitions.batches") }}
      </span>
      <div class="acquisition-page__actions">
        <Button
          :label="$t('acquisitions.add')"
          icon="pi pi-plus"
          @click="goToManage()"
        />
      </div>
    </div>

    <div class="acquisition-page__search-bar">
      <InputText
        v-model="searchQuery"
        :placeholder="$t('acquisitions.search')"
        class="acquisition-page__search-input"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('acquisitions.search')" @click="load(1)" />
    </div>

    <BatchesTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      :delete-loading="deleteLoading"
      @edit="goToManage"
      @delete="onDelete"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
      @show-items="onShowItems"
    />

    <BatchItemsDialog
      v-model:visible="dialogVisible"
      :batch-id="selectedBatchId"
    />
  </div>
</template>
