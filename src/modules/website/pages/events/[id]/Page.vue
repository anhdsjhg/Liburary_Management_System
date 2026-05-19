<script setup lang="ts">
import { useEventDetail } from "./composables/useComposable";
import { useRouter } from "vue-router";
import { RouteNames } from "@/application/router/routeNames";

const router = useRouter();
const {
  announcement,
  isLoading,
  title,
  place,
  description,
  startDate,
  endDate,
  formatDate,
} = useEventDetail();

function goBack() {
  router.push({ name: RouteNames.WEBSITE_EVENTS });
}
</script>

<template>
  <div class="event-detail-page">
    <Button
      class="event-detail-page__back"
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
        class="event-detail-page__image"
        :style="{ backgroundImage: `url(${announcement.image})` }"
      />

      <div class="event-detail-page__meta">
        <span class="event-detail-page__type-badge">
          {{ $t(announcement.type === "event" ? "website.event" : "website.announcement") }}
        </span>

        <span v-if="startDate" class="event-detail-page__date">
          {{ formatDate(startDate) }}
          <span v-if="endDate"> — {{ formatDate(endDate) }}</span>
        </span>

        <span v-if="announcement.start_time" class="event-detail-page__time">
          {{ announcement.start_time }}
          <span v-if="announcement.end_time">— {{ announcement.end_time }}</span>
        </span>
      </div>

      <h1 class="event-detail-page__title">{{ title }}</h1>

      <div v-if="place" class="event-detail-page__place">
        <i class="pi pi-map-marker" /> {{ place }}
      </div>

      <div
        v-if="description"
        class="event-detail-page__description"
        v-html="description"
      />

      <a
        v-if="announcement.link"
        :href="announcement.link"
        target="_blank"
        class="event-detail-page__event-link"
      >
        <i class="pi pi-external-link" />
        {{ announcement.link }}
      </a>
    </template>
  </div>
</template>