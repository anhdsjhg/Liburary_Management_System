<script setup lang="ts">
import { onMounted } from "vue";
import { useSuppliersSearch } from "./composables/useComposable";
import SuppliersTable from "./components/suppliersTable/SuppliersTable.vue";

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
} = useSuppliersSearch();

onMounted(() => load(1));
</script>

<template>
  <div class="acquisition-page">
    <div class="acquisition-page__header">
      <span class="acquisition-page__title">
        {{ $t("acquisitions.suppliers") }}
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

    <SuppliersTable
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