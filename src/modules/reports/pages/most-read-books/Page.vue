<script setup lang="ts">
import { ref } from "vue";
import { useMostReadBooksPage } from "./composables/useComposable";
import MostReadBooksTable from "./components/MostReadBooksTable.vue";
import BookInfoDialog from "./components/bookInfoDialog/BookInfoDialog.vue";

const {
  searchQuery,
  results,
  meta,
  isLoading,
  currentPage,
  selectedIds,
  bookInfoDialogId,
  load,
  onPageChange,
  doExport,
  showBookInfo,
} = useMostReadBooksPage();

const bookInfoVisible = ref(false);

function onShowInfo(id: number) {
  showBookInfo(id);
  bookInfoVisible.value = true;
}
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.most_read") }}</span>
      <div class="report-page__actions">
        <Button
          :label="$t('reports.export')"
          :disabled="!selectedIds.length"
          icon="pi pi-download"
          @click="doExport"
        />
      </div>
    </div>

    <div class="report-page__filter">
      <div class="report-page__filter-field">
        <div class="report-page__filter-label">{{ $t("reports.search") }}</div>
        <InputText v-model="searchQuery" class="w-full" @keydown.enter="load(1)" />
      </div>
      <div class="report-page__filter-actions">
        <Button :label="$t('reports.apply')" @click="load(1)" />
      </div>
    </div>

    <MostReadBooksTable
      :rows="results.data"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @update:selected-ids="(ids) => { selectedIds.length = 0; ids.forEach(id => selectedIds.push(id)); }"
      @show-info="onShowInfo"
      @refresh="load(currentPage)"
    />

    <BookInfoDialog
      v-model:visible="bookInfoVisible"
      :book-id="bookInfoDialogId"
    />
  </div>
</template>
