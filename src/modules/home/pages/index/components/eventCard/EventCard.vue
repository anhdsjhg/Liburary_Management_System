<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";
import axiosInstance from "@/application/configs/axios";
import { IMAGE_BASE_URL, buildBackendImageUrl } from "@/application/configs/constants";

const props = defineProps<{
  event: AnnouncementItem;
}>();

const { locale } = useI18n();

const imageUrl = ref<string>('');

watchEffect(async () => {
  const img = props.event.image;
  if (!img) {
    imageUrl.value = '';
    return;
  }

  if (img.endsWith('.txt')) {
    try {
      if (import.meta.env.DEV) {
        const res = await axiosInstance.get(img, { baseURL: '', headers: { Accept: 'text/plain' } });
        imageUrl.value = String(res.data).trim();
      } else {
        const res = await fetch(IMAGE_BASE_URL + img);
        imageUrl.value = res.ok ? (await res.text()).trim() : '';
      }
    } catch {
      imageUrl.value = '';
    }
  } else {
    imageUrl.value = buildBackendImageUrl(img) ?? '';
  }
});

const imageStyle = computed(() => ({
  backgroundImage: imageUrl.value ? `url(${imageUrl.value})` : 'none',
  backgroundColor: imageUrl.value ? 'transparent' : 'var(--surface-ground)',
}));

const title = computed(() => {
  const lang = locale.value as "en" | "ru" | "kz";
  return props.event[`title_${lang}`] ?? props.event.title_en ?? "";
});

const place = computed(() => {
  const lang = locale.value as "en" | "ru" | "kz";
  return props.event[`place_${lang}`] ?? props.event.place_en ?? "";
});

const startDate = computed(() => new Date(props.event.start_date));

const endDate = computed(() =>
  props.event.end_date ? new Date(props.event.end_date) : null
);

const monthKey = computed(() =>
  startDate.value.toLocaleString(locale.value, { month: "short" }).toUpperCase()
);
</script>

<template>
  <div class="event-card">
    <div class="event-card__image" :style="imageStyle">
      <div class="event-card__date-badge">
        <span class="event-card__date-day">{{ startDate.getDate() }}</span>
        <span class="event-card__date-month">{{ monthKey }}</span>
      </div>
    </div>

    <div class="event-card__body">
      <a
        v-if="event.link"
        :href="event.link"
        target="_blank"
        rel="noopener noreferrer"
        class="event-card__title"
      >
        {{ title }}
      </a>
      <span v-else class="event-card__title event-card__title--plain">{{ title }}</span>

      <div v-if="place" class="event-card__place">{{ place }}</div>

      <div class="event-card__time">
        {{ event.start_time }}
        <span v-if="event.end_time"> — {{ event.end_time }}</span>
        <span v-if="endDate">
          ({{ startDate.getDate() }}
          {{ startDate.toLocaleString(locale, { month: "short" }) }} —
          {{ endDate.getDate() }}
          {{ endDate.toLocaleString(locale, { month: "short" }) }})
        </span>
      </div>

      <div class="event-card__divider" />
      <a
        v-if="event.link"
        :href="event.link"
        target="_blank"
        rel="noopener noreferrer"
        class="event-card__footer"
      >
        <span>{{ $t(event.type === "event" ? "home.event" : "home.announcement") }}</span>
        <i class="pi pi-arrow-right" />
      </a>
      <div v-else class="event-card__footer event-card__footer--plain">
        <span>{{ $t(event.type === "event" ? "home.event" : "home.announcement") }}</span>
      </div>
    </div>
  </div>
</template>