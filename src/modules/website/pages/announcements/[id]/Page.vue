<script setup lang="ts">
import { useAnnouncementDetail } from "./composables/useComposable";

const {
  announcement,
  isLoading,
  title,
  place,
  description,
  startDate,
  endDate,
  formatDate,
  goBack,
} = useAnnouncementDetail();
</script>

<template>
  <div class="announcement-detail-page">
    <Button
      class="announcement-detail-page__back"
      severity="secondary"
      outlined
      icon="pi pi-arrow-left"
      :label="$t('website.back')"
      @click="goBack"
    />

    <Skeleton v-if="isLoading" height="30rem" />

    <template v-else-if="announcement">
      <div
        v-if="announcement.image"
        class="announcement-detail-page__image"
        :style="{ backgroundImage: `url(${announcement.image})` }"
      />

      <div class="announcement-detail-page__meta">
        <span class="announcement-detail-page__type-badge">
          {{
            $t(
              announcement.type === "event"
                ? "website.event"
                : "website.announcement"
            )
          }}
        </span>

        <span v-if="startDate" class="announcement-detail-page__date">
          {{ formatDate(startDate) }}
          <span v-if="endDate"> — {{ formatDate(endDate) }}</span>
        </span>
      </div>

      <h1 class="announcement-detail-page__title">{{ title }}</h1>

      <div v-if="place" class="announcement-detail-page__place">
        <i class="pi pi-map-marker" /> {{ place }}
      </div>

      <div
        v-if="description"
        class="announcement-detail-page__description"
        v-html="description"
      />
    </template>
  </div>
</template>