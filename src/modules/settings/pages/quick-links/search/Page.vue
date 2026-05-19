<script setup lang="ts">
import { ref } from "vue";
import { useQuickLinksSearch } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import ManageDialog from "../manage/Page.vue";
import type { QuickLink } from "@/api/settings/quick-links/get/types";

const {
  items,
  columns,
  isLoading,
  deleteLoading,
  refetch,
  onDelete,
} = useQuickLinksSearch();

const manageVisible = ref(false);
const editingItem = ref<QuickLink | null>(null);

function openCreate() {
  editingItem.value = null;
  manageVisible.value = true;
}

function openEdit(row: QuickLink) {
  editingItem.value = row;
  manageVisible.value = true;
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <span class="settings-page__title">{{ $t("settings.quick_links") }}</span>
      <div class="settings-page__actions">
        <Button :label="$t('settings.add')" icon="pi pi-plus" @click="openCreate" />
      </div>
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <AppDataTable
      v-else
      :columns="columns"
      :rows="items"
      :delete-loading="deleteLoading"
      :edit-config="{ available: true }"
      :delete-config="{ available: true }"
      :pagination="false"
      @edit="(row) => openEdit(row as QuickLink)"
      @delete="(row) => onDelete(row as QuickLink)"
      @refresh="refetch"
    />

    <ManageDialog
      v-model:visible="manageVisible"
      :item="editingItem"
      @success="refetch"
    />
  </div>
</template>