<script setup lang="ts">
import { onMounted } from "vue";
import { useItemsSearch } from "./composables/useComposable";
import ItemsTable from "./components/ItemsTable/Itemsable.vue";

const {
  results,
  meta,
  isLoading,
  currentPage,
  searchQuery,
  load,
  onPageChange,
} = useItemsSearch();

onMounted(() => load(1));
</script>

<template>
  <div class="acquisition-page">
    <div class="acquisition-page__header">
      <span class="acquisition-page__title">{{ $t("acquisitions.items") }}</span>
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

    <ItemsTable
      v-else
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>