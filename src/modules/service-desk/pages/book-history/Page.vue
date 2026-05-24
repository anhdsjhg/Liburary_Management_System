<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBookHistorySearch } from "./composables/useComposable";
import BookHistoryTable from "./components/bookHistoryTable/BookHistoryTable.vue";

const { t } = useI18n();

const {
  searchQuery,
  selectedStatus,
  dateFrom,
  dateTo,
  statusOptions,
  rows,
  meta,
  isLoading,
  currentPage,
  load,
  onPageChange,
} = useBookHistorySearch();

onMounted(() => load(1));
</script>

<template>
  <div class="service-desk-users-page">
    <div class="service-desk-users-page__header">
      <span class="service-desk-users-page__title">{{ $t("serviceDesk.book_history") }}</span>
    </div>

    <div class="service-desk-users-page__filter-bar">
      <InputText
        v-model="searchQuery"
        :placeholder="$t('serviceDesk.user_placeholder')"
        class="service-desk-users-page__filter-input"
        @keydown.enter="load(1)"
      />
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        :option-label="(o) => t(o.label)"
        option-value="value"
        :placeholder="$t('serviceDesk.all_statuses')"
        style="min-width: 11rem"
      />
      <DatePicker
        v-model="dateFrom"
        :placeholder="$t('serviceDesk.date_from')"
        date-format="yy-mm-dd"
        show-button-bar
        style="min-width: 10rem"
      />
      <DatePicker
        v-model="dateTo"
        :placeholder="$t('serviceDesk.date_to')"
        date-format="yy-mm-dd"
        show-button-bar
        style="min-width: 10rem"
      />
      <Button :label="$t('serviceDesk.search')" @click="load(1)" />
    </div>

    <BookHistoryTable
      :rows="rows"
      :meta="meta"
      :page="currentPage"
      :loading="isLoading"
      @update:page="onPageChange"
      @refresh="load(currentPage)"
    />
  </div>
</template>

<style scoped>
.service-desk-users-page__filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.service-desk-users-page__filter-input {
  flex: 1;
  min-width: 12rem;
}
</style>
