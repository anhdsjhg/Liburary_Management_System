<script setup lang="ts">
import { onMounted } from "vue";
import { useAnnouncementsSearch } from "./composables/useComposable";
import AnnouncementsTable from "./components/AnnouncementsTable.vue";

const {
  searchQuery,
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

onMounted(() => load(1));
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

    <div class="settings-page__search-bar">
      <InputText
        v-model="searchQuery"
        :placeholder="$t('settings.search')"
        class="settings-page__search-input"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('settings.search')" @click="load(1)" />
    </div>

    <AnnouncementsTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      :delete-loading="deleteLoading"
      @edit="goToManage"
      @delete="onDelete"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>

<style scoped>
.settings-page__search-bar {
  display: flex;
  gap: 0.5rem;
}

.settings-page__search-input {
  flex: 1;
}
</style>
