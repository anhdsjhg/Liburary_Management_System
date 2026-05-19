<script setup lang="ts">
import { useAnnouncementsSearch } from "./composables/useComposable";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";

const {
  searchQuery,
  columns,
  results,
  meta,
  isLoading,
  deleteLoading,
  currentPage,
  load,
  onPageChange,
  goToManage,
  onDelete,
} = useAnnouncementsSearch();
</script>

<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <span class="settings-page__title">{{ $t("settings.announcements") }}</span>
      <div class="settings-page__actions">
        <Button
          :label="$t('settings.add')"
          icon="pi pi-plus"
          @click="goToManage()"
        />
      </div>
    </div>

    <div class="settings-page__filter">
      <div class="settings-page__filter-field">
        <div class="settings-page__filter-label">{{ $t("settings.search") }}</div>
        <InputText
          v-model="searchQuery"
          class="w-full"
          @keydown.enter="load(1)"
        />
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: flex-end">
        <Button :label="$t('settings.apply')" @click="load(1)" />
        <Button
          :label="$t('settings.reset')"
          severity="secondary"
          outlined
          @click="() => { searchQuery = ''; }"
        />
      </div>
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <AppDataTable
      v-else
      :columns="columns"
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :delete-loading="deleteLoading"
      :edit-config="{ available: true }"
      :delete-config="{ available: true }"
      @update:page="onPageChange"
      @edit="(row) => goToManage(row as AnnouncementItem)"
      @delete="(row) => onDelete(row as AnnouncementItem)"
      @refresh="load(currentPage)"
    />
  </div>
</template>