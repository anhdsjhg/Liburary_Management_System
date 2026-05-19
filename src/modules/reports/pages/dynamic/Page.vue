<script setup lang="ts">
import { useDynamicPage } from "./composables/useComposable";

const {
  categories,
  reports,
  selectedCategoryId,
  categoriesLoading,
  reportsLoading,
  selectCategory,
  goToReport,
} = useDynamicPage();
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.dynamic") }}</span>
    </div>

    <div class="dynamic-report-page__body">
      <div class="dynamic-report-page__categories">
        <Skeleton v-if="categoriesLoading" height="10rem" />
        <div
          v-for="cat in categories"
          :key="cat.category_id"
          class="dynamic-report-page__category-item"
          :class="{ 'dynamic-report-page__category-item--active': selectedCategoryId === cat.category_id }"
          @click="selectCategory(cat.category_id)"
        >
          {{ cat.category_title }}
        </div>
      </div>

      <div class="dynamic-report-page__content">
        <Skeleton v-if="reportsLoading" height="10rem" />
        <div v-else class="dynamic-report-page__reports-list">
          <div
            v-for="report in reports"
            :key="report.query_id"
            class="dynamic-report-page__report-item"
            @click="goToReport(report.query_id)"
          >
            <div style="font-weight: 600">{{ report.query_title }}</div>
            <div v-if="report.query_description" style="font-size: 0.8rem; color: var(--text-color-secondary); margin-top: 0.25rem">
              {{ report.query_description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>