<script setup lang="ts">
import { computed } from "vue";
import { useAllArrivals } from "./composables/useComposable";
import { RouteNames } from "@/application/router/routeNames";

const { arrivals, isLoading, getImageUrl } = useAllArrivals();

const arrivalsCount = computed(() => arrivals.value?.length ?? 0);
</script>

<template>
  <div class="arrivals-all-page">
    <!-- Hero -->
    <div class="arrivals-all-page__hero">
      <div class="arrivals-all-page__container">
        <nav class="arrivals-all-page__breadcrumb">
          <router-link
            :to="{ name: RouteNames.WEBSITE_HOME }"
            class="arrivals-all-page__breadcrumb-link"
          >
            <i class="pi pi-home" />
            <span>{{ $t("home.home") }}</span>
          </router-link>
          <i class="pi pi-angle-right arrivals-all-page__breadcrumb-sep" />
          <span class="arrivals-all-page__breadcrumb-current">
            {{ $t("home.new_arrivals") }}
          </span>
        </nav>

        <div class="arrivals-all-page__hero-row">
          <div class="arrivals-all-page__hero-text">
            <span class="arrivals-all-page__eyebrow">
              <i class="pi pi-sparkles" />
              {{ $t("home.fresh_on_shelf") }}
            </span>
            <h1 class="arrivals-all-page__title">
              {{ $t("home.new_arrivals") }}
            </h1>
            <p class="arrivals-all-page__subtitle">
              {{ $t("home.new_arrivals_subtitle") }}
            </p>
          </div>

          <div v-if="!isLoading && arrivalsCount" class="arrivals-all-page__stat">
            <span class="arrivals-all-page__stat-value">{{ arrivalsCount }}</span>
            <span class="arrivals-all-page__stat-label">
              {{ $t("home.titles") }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="arrivals-all-page__container arrivals-all-page__body">
      <!-- Loading -->
      <div v-if="isLoading" class="arrivals-all-page__grid">
        <div v-for="n in 12" :key="n" class="arrivals-all-page__skeleton-card">
          <Skeleton width="100%" height="260px" border-radius="0" />
          <div class="arrivals-all-page__skeleton-body">
            <Skeleton height="0.9rem" width="80%" />
            <Skeleton height="0.7rem" width="55%" class="mt-2" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!arrivalsCount" class="arrivals-all-page__empty">
        <i class="pi pi-book arrivals-all-page__empty-icon" />
        <h3 class="arrivals-all-page__empty-title">
          {{ $t("home.no_arrivals_yet") }}
        </h3>
        <p class="arrivals-all-page__empty-text">
          {{ $t("home.check_back_soon") }}
        </p>
      </div>

      <!-- Grid -->
      <div v-else class="arrivals-all-page__grid">
        <router-link
          v-for="(item, index) in arrivals"
          :key="item.id"
          :to="{ name: RouteNames.WEBSITE_BOOK, params: { id: item.id } }"
          class="arrival-grid-card"
        >
          <div class="arrival-grid-card__media">
            <div
              class="arrival-grid-card__image"
              :style="{ backgroundImage: `url(${getImageUrl(item)})` }"
            />
            <span v-if="index < 6" class="arrival-grid-card__ribbon">
              {{ $t("home.new") }}
            </span>
            <div class="arrival-grid-card__overlay">
              <span class="arrival-grid-card__overlay-cta">
                {{ $t("home.show_details") }}
                <i class="pi pi-arrow-right" />
              </span>
            </div>
          </div>

          <div class="arrival-grid-card__body">
            <h3 class="arrival-grid-card__title">{{ item.title }}</h3>
            <p v-if="item.author" class="arrival-grid-card__author">
              {{ item.author }}
            </p>
            <div class="arrival-grid-card__footer">
              <span class="arrival-grid-card__link">
                {{ $t("home.view") }}
                <i class="pi pi-arrow-right" />
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

