<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAllEventsSearch } from "./composables/useComposable";
import AppPaginator from "@/application/components/AppPaginator.vue";
import EventListCard from "./components/EventListCard.vue";
import { RouteNames } from "@/application/router/routeNames";

const {
  filter,
  results,
  isLoading,
  paginationMeta,
  hasPagination,
  currentPage,
  search,
  applyFilter,
  resetFilter,
  onPageChange,
} = useAllEventsSearch();

const filterOpen = ref(false);

const activeFilters = computed(() => {
  let n = 0;
  if (filter.start_date?.from) n++;
  if (filter.start_date?.to) n++;
  if (filter.end_date?.to) n++;
  return n;
});

onMounted(() => search(1));
</script>

<template>
  <div class="all-events-page">
    <!-- ───── Hero ───── -->
    <header class="all-events-page__hero">
      <div class="all-events-page__container">
        <nav class="all-events-page__breadcrumb">
          <router-link
            :to="{ name: RouteNames.WEBSITE_HOME }"
            class="all-events-page__breadcrumb-link"
          >
            <i class="pi pi-home" />
            <span>{{ $t("home.home") }}</span>
          </router-link>
          <i class="pi pi-angle-right all-events-page__breadcrumb-sep" />
          <span class="all-events-page__breadcrumb-current">
            {{ $t("home.upcoming_events") }}
          </span>
        </nav>

        <div class="all-events-page__hero-row">
          <div class="all-events-page__hero-text">
            <span class="all-events-page__eyebrow">
              <i class="pi pi-calendar-clock" />
              {{ $t("home.what_is_on") }}
            </span>
            <h1 class="all-events-page__title">
              {{ $t("home.upcoming_events") }}
            </h1>
            <p class="all-events-page__subtitle">
              {{ $t("home.upcoming_events_subtitle") }}
            </p>
          </div>

          <div v-if="!isLoading && results.total" class="all-events-page__stat">
            <span class="all-events-page__stat-value">{{ results.total }}</span>
            <span class="all-events-page__stat-label">
              {{ $t("home.events_count") }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- ───── Body ───── -->
    <div class="all-events-page__container all-events-page__body">
      <!-- Mobile filter trigger -->
      <button
        type="button"
        class="all-events-page__filter-toggle"
        @click="filterOpen = !filterOpen"
      >
        <i class="pi pi-sliders-h" />
        <span>{{ $t("home.filter") }}</span>
        <span
          v-if="activeFilters"
          class="all-events-page__filter-toggle-count"
        >{{ activeFilters }}</span>
        <i
          class="pi all-events-page__filter-toggle-chev"
          :class="filterOpen ? 'pi-angle-up' : 'pi-angle-down'"
        />
      </button>

      <div class="all-events-page__layout">
        <!-- Sidebar filter -->
        <aside
          class="all-events-page__filter"
          :class="{ 'all-events-page__filter--open': filterOpen }"
        >
          <header class="all-events-page__filter-header">
            <span class="all-events-page__filter-title">
              <i class="pi pi-sliders-h" />
              {{ $t("home.filter") }}
            </span>
            <span
              v-if="activeFilters"
              class="all-events-page__filter-count"
            >{{ activeFilters }}</span>
          </header>

          <section class="all-events-page__filter-section">
            <h3 class="all-events-page__filter-label">
              <i class="pi pi-play" />
              {{ $t("home.start_date") }}
            </h3>
            <div class="all-events-page__field">
              <label>{{ $t("common.from") }}</label>
              <InputText
                v-model="filter.start_date.from"
                type="date"
                class="all-events-page__field-input"
              />
            </div>
            <div class="all-events-page__field">
              <label>{{ $t("common.until") }}</label>
              <InputText
                v-model="filter.start_date.to"
                type="date"
                class="all-events-page__field-input"
              />
            </div>
          </section>

          <section class="all-events-page__filter-section">
            <h3 class="all-events-page__filter-label">
              <i class="pi pi-stop" />
              {{ $t("home.end_date") }}
            </h3>
            <div class="all-events-page__field">
              <label>{{ $t("common.until") }}</label>
              <InputText
                v-model="filter.end_date.to"
                type="date"
                class="all-events-page__field-input"
              />
            </div>
          </section>

          <footer class="all-events-page__filter-footer">
            <Button
              :label="$t('home.apply')"
              class="all-events-page__filter-btn"
              @click="applyFilter"
            />
            <Button
              :label="$t('home.reset')"
              severity="secondary"
              outlined
              class="all-events-page__filter-btn"
              @click="resetFilter"
            />
          </footer>
        </aside>

        <!-- Results -->
        <section class="all-events-page__results">
          <div class="all-events-page__results-bar">
            <p v-if="!isLoading" class="all-events-page__meta">
              <strong>{{ results.total }}</strong>
              {{ $t("home.results") }}
              <span class="all-events-page__dot">•</span>
              {{ results.last_page }} {{ $t("home.pages") }}
            </p>
            <p v-else class="all-events-page__meta">{{ $t("home.loading") }}…</p>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="all-events-page__list">
            <div
              v-for="n in 4"
              :key="n"
              class="all-events-page__skeleton"
            >
              <Skeleton width="16rem" height="11rem" border-radius="0" />
              <div class="all-events-page__skeleton-body">
                <Skeleton height="0.7rem" width="40%" />
                <Skeleton height="1.1rem" width="80%" class="mt-2" />
                <Skeleton height="0.8rem" width="60%" class="mt-2" />
                <Skeleton height="0.8rem" width="50%" class="mt-2" />
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div
            v-else-if="results.data.length === 0"
            class="all-events-page__empty"
          >
            <i class="pi pi-calendar all-events-page__empty-icon" />
            <h3 class="all-events-page__empty-title">
              {{ $t("home.no_events_found") }}
            </h3>
            <p class="all-events-page__empty-text">
              {{ $t("home.no_events_text") }}
            </p>
            <Button
              :label="$t('home.reset')"
              severity="secondary"
              outlined
              size="small"
              @click="resetFilter"
            />
          </div>

          <!-- Results -->
          <template v-else>
            <div class="all-events-page__list">
              <EventListCard
                v-for="event in results.data"
                :key="(event as any).id ?? event.announcement_id"
                :event="event"
              />
            </div>

            <AppPaginator
              v-if="hasPagination"
              class="all-events-page__pagination"
              :meta="paginationMeta"
              :page="currentPage"
              @update:page="onPageChange"
            />
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-events-page {
  --aep-primary: #381f6e;
  --aep-accent: #f9a825;

  min-height: 100vh;
  background: var(--surface-ground);
  padding-bottom: 4rem;

  &__container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 3rem;

    @media (max-width: 1024px) { padding: 0 2rem; }
    @media (max-width: 768px)  { padding: 0 1.25rem; }
  }

  /* ───────── Hero ───────── */
  &__hero {
    background: linear-gradient(135deg, var(--aep-primary) 0%, #2d1b69 100%);
    color: #fff;
    padding: 2rem 0 4.5rem;
    position: relative;
    overflow: hidden;

    &::before,
    &::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    &::before {
      right: -120px;
      top: -80px;
      width: 320px;
      height: 320px;
      background: rgba(249, 168, 37, 0.08);
    }

    &::after {
      left: -100px;
      bottom: -140px;
      width: 280px;
      height: 280px;
      background: rgba(255, 255, 255, 0.04);
    }
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1.75rem;
    position: relative;
    z-index: 1;
  }

  &__breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: #fff; }
  }

  &__breadcrumb-sep {
    font-size: 0.65rem;
    opacity: 0.5;
  }

  &__breadcrumb-current {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
  }

  &__hero-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.25rem;
    }
  }

  &__hero-text {
    max-width: 48rem;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    margin-bottom: 1rem;
    border-radius: 999px;
    background: rgba(249, 168, 37, 0.18);
    color: var(--aep-accent);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    i { font-size: 0.7rem; }
  }

  &__title {
    font-size: 2.6rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.6rem;
    line-height: 1.15;
    font-style: italic;
    text-wrap: pretty;

    @media (max-width: 768px) { font-size: 1.75rem; }
  }

  &__subtitle {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
    line-height: 1.5;

    @media (max-width: 768px) { font-size: 0.95rem; }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 1rem 1.5rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    line-height: 1;

    @media (max-width: 768px) {
      align-items: flex-start;
      align-self: stretch;
    }
  }

  &__stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--aep-accent);
    margin-bottom: 0.3rem;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* ───────── Body ───────── */
  &__body {
    margin-top: -2.5rem;
    position: relative;
    z-index: 2;
  }

  /* mobile filter button */
  &__filter-toggle {
    display: none;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.85rem 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    background: var(--surface-card);
    color: var(--text-color);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);

    > i:first-child { color: var(--aep-primary); }

    @media (max-width: 992px) { display: inline-flex; }
  }

  &__filter-toggle-count {
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.45rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--aep-primary);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
  }

  &__filter-toggle-chev {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
  }

  &__layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: 992px) { grid-template-columns: 1fr; }
  }

  /* ───────── Filter ───────── */
  &__filter {
    display: flex;
    flex-direction: column;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 1.5rem;

    @media (max-width: 992px) {
      position: static;
      display: none;

      &--open { display: flex; }
    }
  }

  &__filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--surface-border);
  }

  &__filter-title {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--aep-primary);

    i { font-size: 1rem; }
  }

  &__filter-count {
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--aep-primary);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
  }

  &__filter-section {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--surface-border);

    &:last-of-type { border-bottom: none; }
  }

  &__filter-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0 0 0.75rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-color);

    i {
      font-size: 0.6rem;
      color: var(--aep-accent);
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.65rem;

    &:last-child { margin-bottom: 0; }

    label {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      font-weight: 500;
    }
  }

  &__field-input {
    width: 100%;

    :deep(input) {
      width: 100%;
      padding: 0.6rem 0.75rem !important;
      border-radius: 10px !important;
      font-size: 0.875rem;
      transition: box-shadow 0.15s, border-color 0.15s;
    }

    :deep(input:focus) {
      box-shadow: 0 0 0 3px rgba(56, 31, 110, 0.12);
      border-color: var(--aep-primary);
    }
  }

  &__filter-footer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    margin-top: 0.5rem;
    border-top: 1px solid var(--surface-border);
  }

  &__filter-btn {
    width: 100%;
  }

  /* ───────── Results ───────── */
  &__results {
    min-width: 0;
  }

  &__results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1.25rem;
    margin-bottom: 1.25rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
  }

  &__meta {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-color-secondary);

    strong {
      color: var(--text-color);
      font-weight: 700;
    }
  }

  &__dot {
    margin: 0 0.5rem;
    color: var(--surface-border);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__skeleton {
    display: grid;
    grid-template-columns: 16rem 1fr;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    overflow: hidden;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  &__skeleton-body {
    padding: 1.5rem;
  }

  &__pagination {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }

  /* ───────── Empty ───────── */
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 5rem 2rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    gap: 0.6rem;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
  }

  &__empty-icon {
    font-size: 3rem;
    color: var(--aep-primary);
    opacity: 0.35;
    margin-bottom: 0.25rem;
  }

  &__empty-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
  }

  &__empty-text {
    color: var(--text-color-secondary);
    font-size: 0.95rem;
    margin: 0 0 1rem;
    max-width: 28rem;
  }
}
</style>
