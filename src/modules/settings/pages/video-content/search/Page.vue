<script setup lang="ts">
import { ref } from "vue";
import { useVideoContentSearch } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import ManageDialog from "../manage/Page.vue";
import type { VideoContentItem } from "@/api/settings/video-content/get/types";

const {
  items,
  columns,
  isLoading,
  deleteLoading,
  refetch,
  onDelete,
} = useVideoContentSearch();

const manageVisible = ref(false);
const editingItem = ref<VideoContentItem | null>(null);

function openCreate() {
  editingItem.value = null;
  manageVisible.value = true;
}

function openEdit(row: VideoContentItem) {
  editingItem.value = row;
  manageVisible.value = true;
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <span class="settings-page__title">{{ $t("settings.videos") }}</span>
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
      @edit="(row) => openEdit(row as VideoContentItem)"
      @delete="(row) => onDelete(row as VideoContentItem)"
      @refresh="refetch"
    />

    <ManageDialog
      v-model:visible="manageVisible"
      :item="editingItem"
      @success="refetch"
    />
  </div>
</template>