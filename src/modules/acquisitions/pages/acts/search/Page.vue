<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useActsSearch } from "./composables/useComposable";
import ActsTable from "./components/actsTable/ActsTable.vue";
import ActItemsDialog from "./components/ActItemsDialog.vue";
import type { Act } from "@/api/acquisitions/acts/get/types";

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
} = useActsSearch();

const dialogVisible = ref(false);
const selectedActId = ref<number | null>(null);

function onShowItems(row: Act) {
  selectedActId.value = row.id;
  dialogVisible.value = true;
}

onMounted(() => load(1));
</script>

<template>
  <div class="acquisition-page">
    <div class="acquisition-page__header">
      <span class="acquisition-page__title">{{ $t("acquisitions.acts") }}</span>
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

    <ActsTable
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

    <ActItemsDialog
      v-model:visible="dialogVisible"
      :act-id="selectedActId"
    />
  </div>
</template>
