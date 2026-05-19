<script setup lang="ts">
import { onMounted } from "vue";
import { useBatchesSearch } from "./composables/useComposable";
import BatchesTable from "./components/batchesTable/BatchesTable.vue";

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

    <Skeleton v-if="isLoading && !results.data.length" height="20rem" />

    <BatchesTable
      v-else
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :delete-loading="deleteLoading"
      @edit="goToManage"
      @delete="onDelete"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>