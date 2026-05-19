<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";
import axiosInstance from "@/application/configs/axios";

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
      const response = await axiosInstance.get(img, {
        baseURL: '',
        headers: { Accept: 'text/plain' },
      });
      imageUrl.value = String(response.data).trim();
    } catch {
      imageUrl.value = '';
    }
  } else {
    imageUrl.value = `http://localhost:8000${img}`;
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
        :href="event.link ?? `/events/${event.announcement_id}`"
        :target="event.link ? '_blank' : undefined"
        class="event-card__title"
      >
        {{ title }}
      </a>

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
        :href="event.link ?? `/events/${event.announcement_id}`"
        :target="event.link ? '_blank' : undefined"
        class="event-card__footer"
      >
        <span>{{ $t(event.type === "event" ? "home.event" : "home.announcement") }}</span>
        <i class="pi pi-arrow-right" />
      </a>
    </div>
  </div>
</template>