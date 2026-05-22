<script setup lang="ts">
import { useAnnouncementsSearch } from "./composables/useComposable";
import AnnouncementsTable from "./components/AnnouncementsTable.vue";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";

const {
  searchQuery,
  results,
  meta,
  isLoading,
  deleteLoading,
  currentPage,
  load,
  reset,
  onPageChange,
  goToManage,
  doDelete,
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
          @click="reset"
        />
      </div>
    </div>

    <AnnouncementsTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      :delete-loading="deleteLoading"
      @edit="(row) => goToManage(row as AnnouncementItem)"
      @delete="(row) => doDelete(row as AnnouncementItem)"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>
