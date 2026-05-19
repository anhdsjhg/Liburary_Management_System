<script setup lang="ts">
import { computed } from "vue";
import { useCatalogingReportPage } from "./composables/useComposable";

const { data, isLoading } = useCatalogingReportPage();
const stats = computed(() => data.value?.res ?? null);
</script>

<template>
  <div class="report-page">
    <div class="report-page__header">
      <span class="report-page__title">{{ $t("reports.cataloging") }}</span>
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <div v-else-if="stats" class="report-page__stats-grid">
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.books_total }}</div>
        <div class="report-page__stat-label">Books total</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.books_completed }}</div>
        <div class="report-page__stat-label">Books completed</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.books_in_progress }}</div>
        <div class="report-page__stat-label">Books in progress</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.books_uninventoried }}</div>
        <div class="report-page__stat-label">Books uninventoried</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.journals_total }}</div>
        <div class="report-page__stat-label">Journals total</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.journals_completed }}</div>
        <div class="report-page__stat-label">Journals completed</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.discs_total }}</div>
        <div class="report-page__stat-label">Discs total</div>
      </div>
      <div class="report-page__stat-card">
        <div class="report-page__stat-value">{{ stats.discs_completed }}</div>
        <div class="report-page__stat-label">Discs completed</div>
      </div>
    </div>
  </div>
</template>