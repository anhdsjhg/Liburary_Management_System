<script setup lang="ts">
import { useQuickLinks } from "./composables/useComposable";

const { quickLinks, isLoading, getTitle, getDescription } = useQuickLinks();
</script>

<template>
  <div class="quick-links-page">
    <h1 class="quick-links-page__title">
      {{ $t("home.quick_links") }}
    </h1>

    <Skeleton v-if="isLoading" height="12rem" />

    <div v-else class="quick-links-page__grid">
      <a
        v-for="link in quickLinks"
        :key="link.id"
        :href="link.link"
        target="_blank"
        class="quick-link-card"
      >
        <div class="quick-link-card__title">{{ getTitle(link) }}</div>
        <div class="quick-link-card__divider" />
        <div class="quick-link-card__description">
          {{ getDescription(link) }}
        </div>
      </a>
    </div>
  </div>
</template>