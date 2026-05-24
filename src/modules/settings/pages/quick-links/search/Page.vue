<script setup lang="ts">
import { ref } from "vue";
import { useQuickLinksSearch } from "./composables/useComposable";
import QuickLinksTable from "./components/QuickLinksTable.vue";
import ManageDialog from "../manage/Page.vue";

const {
  items,
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

    <QuickLinksTable
      :rows="items"
      :loading="isLoading"
      :delete-loading="deleteLoading"
      @edit="openEdit"
      @delete="onDelete"
      @refresh="refetch"
    />

    <ManageDialog
      v-model:visible="manageVisible"
      :item="editingItem"
      @success="refetch"
    />
  </div>
</template>
