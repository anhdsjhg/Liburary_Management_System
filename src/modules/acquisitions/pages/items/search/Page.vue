<script setup lang="ts">
import { useItemsSearch, searchFieldOptions } from "./composables/useComposable";
import ItemsTable from "./components/ItemsTable/Itemsable.vue";

const {
  results,
  meta,
  isLoading,
  currentPage,
  searchQuery,
  searchField,
  hasSearched,
  load,
  onPageChange,
  goToManage,
} = useItemsSearch();
</script>

<template>
  <div class="acquisition-page">
    <div class="acquisition-page__header">
      <span class="acquisition-page__title">{{ $t("acquisitions.items") }}</span>
      <div class="acquisition-page__actions">
        <Button
          :label="$t('acquisitions.add')"
          icon="pi pi-plus"
          @click="goToManage()"
        />
      </div>
    </div>

    <div class="acquisition-page__search-bar">
      <Select
        v-model="searchField"
        :options="searchFieldOptions"
        option-label="label"
        option-value="value"
        style="width: 10rem"
      />
      <InputText
        v-model="searchQuery"
        :placeholder="$t('acquisitions.search')"
        class="acquisition-page__search-input"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('acquisitions.search')" @click="load(1)" />
    </div>

    <ItemsTable
      v-if="hasSearched"
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
      @edit="goToManage"
    />
  </div>
</template>
