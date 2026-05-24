<script setup lang="ts">
import { onMounted } from "vue";
import { useShelvesSearch } from "./composables/useComposable";
import ShelvesTable from "./components/shelvesTable/ShelvesTable.vue";

const {
  searchQuery,
  results,
  meta,
  isLoading,
  currentPage,
  load,
  onPageChange,
} = useShelvesSearch();

onMounted(() => load(1));
</script>

<template>
  <div class="service-desk-users-page">
    <div class="service-desk-users-page__header">
      <span class="service-desk-users-page__title">{{ $t("serviceDesk.shelves") }}</span>
    </div>

    <div class="service-desk-users-page__search-bar">
      <InputText
        v-model="searchQuery"
        :placeholder="$t('serviceDesk.callnumber')"
        class="service-desk-users-page__search-input"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('serviceDesk.search')" @click="load(1)" />
    </div>

    <ShelvesTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>

<style scoped>
.service-desk-users-page__search-bar {
  display: flex;
  gap: 0.5rem;
}

.service-desk-users-page__search-input {
  flex: 1;
}
</style>
