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

const imageUrl = ref<string>("");

watchEffect(async () => {
  const img = props.event.image;
  if (!img) {
    imageUrl.value = "";
    return;
  }
  if (img.endsWith(".txt")) {
    try {
      if (import.meta.env.DEV) {
        const res = await axiosInstance.get(img, { baseURL: "", headers: { Accept: "text/plain" } });
        imageUrl.value = String(res.data).trim();
      } else {
        const res = await fetch(IMAGE_BASE_URL + img);
        imageUrl.value = res.ok ? (await res.text()).trim() : "";
      }
    } catch {
      imageUrl.value = "";
    }
  } else {
    imageUrl.value = buildBackendImageUrl(img) ?? "";
  }
});

const imageStyle = computed(() => ({
  backgroundImage: imageUrl.value ? `url(${imageUrl.value})` : "none",
  backgroundColor: imageUrl.value ? "transparent" : "var(--surface-ground)",
}));

const title = computed(() => {
  const lang = locale.value as "en" | "ru" | "kz";
  return props.event[`title_${lang}`] ?? props.event.title_en ?? "";
});

const place = computed(() => {
  const lang = locale.value as "en" | "ru" | "kz";
  return props.event[`place_${lang}`] ?? props.event.place_en ?? "";
});

const startDate = computed(() =>
  props.event.start_date ? new Date(props.event.start_date) : null
);
const endDate = computed(() =>
  props.event.end_date ? new Date(props.event.end_date) : null
);

const dateBadge = computed(() => {
  const d = startDate.value;
  if (!d) return null;
  return {
    day: d.getDate(),
    month: d.toLocaleDateString(locale.value, { month: "short" }),
    weekday: d.toLocaleDateString(locale.value, { weekday: "short" }),
  };
});

const dateRangeLabel = computed(() => {
  if (!startDate.value) return "";
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const start = startDate.value.toLocaleDateString(locale.value, opts);
  if (!endDate.value) return start;
  const end = endDate.value.toLocaleDateString(locale.value, opts);
  return `${start} — ${end}`;
});

const hasImage = computed(() => !!imageUrl.value);
// const hasLink = computed(() => !!props.event.link);
const typeKey = computed(() =>
  props.event.type === "event" ? "home.event" : "home.announcement"
);
</script>

<template>
  <article
    class="event-list-card"
    :class="{ 'event-list-card--no-image': !hasImage }"
  >
    <!-- Media -->
    <div class="event-list-card__media">
      <div class="event-list-card__image" :style="imageStyle">
        <span
          v-if="!hasImage"
          class="event-list-card__image-placeholder"
        >
          <i class="pi pi-calendar" />
        </span>
      </div>

      <span class="event-list-card__type-pill">
        <i :class="event.type === 'event' ? 'pi pi-calendar-clock' : 'pi pi-megaphone'" />
        {{ $t(typeKey) }}
      </span>

      <div v-if="dateBadge" class="event-list-card__date-badge">
        <span class="event-list-card__date-day">{{ dateBadge.day }}</span>
        <span class="event-list-card__date-month">{{ dateBadge.month }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="event-list-card__body">
      <div v-if="dateRangeLabel" class="event-list-card__date-line">
        <i class="pi pi-calendar" />
        <span>{{ dateRangeLabel }}</span>
      </div>

      <a
        v-if="event.link"
        :href="event.link"
        target="_blank"
        rel="noopener noreferrer"
        class="event-list-card__title"
      >
        {{ title }}
      </a>
      <h3
        v-else
        class="event-list-card__title event-list-card__title--plain"
      >
        {{ title }}
      </h3>

      <div class="event-list-card__meta">
        <span v-if="place" class="event-list-card__meta-item">
          <i class="pi pi-map-marker" />
          {{ place }}
        </span>
        <span v-if="event.start_time" class="event-list-card__meta-item">
          <i class="pi pi-clock" />
          {{ event.start_time }}
          <template v-if="event.end_time"> — {{ event.end_time }}</template>
        </span>
      </div>

      <div class="event-list-card__footer">
        <a
          v-if="event.link"
          :href="event.link"
          target="_blank"
          rel="noopener noreferrer"
          class="event-list-card__cta"
        >
          <span>{{ $t("home.learn_more") }}</span>
          <i class="pi pi-arrow-right" />
        </a>
        <span v-else class="event-list-card__cta event-list-card__cta--plain">
          {{ $t(typeKey) }}
        </span>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.event-list-card {
  --elc-primary: #381f6e;
  --elc-accent: #f9a825;

  position: relative;
  display: grid;
  grid-template-columns: 16rem 1fr;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;

  &:hover {
    border-color: var(--elc-primary);
    box-shadow: 0 12px 28px rgba(56, 31, 110, 0.12);
    transform: translateY(-3px);

    .event-list-card__image { transform: scale(1.05); }
    .event-list-card__title:not(&--plain) { color: var(--elc-primary); }
    .event-list-card__cta i { transform: translateX(4px); }
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }

  /* ───── Media ───── */
  &__media {
    position: relative;
    overflow: hidden;
    background: var(--surface-ground);

    @media (max-width: 720px) {
      height: 200px;
    }
  }

  &__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.45s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: rgba(56, 31, 110, 0.08);
    color: var(--elc-primary);

    i { font-size: 1.5rem; }
  }

  &__type-pill {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    color: var(--elc-primary);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

    i { font-size: 0.7rem; }
  }

  &__date-badge {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 12px;
    background: var(--elc-accent);
    color: #1f1037;
    box-shadow: 0 6px 16px rgba(249, 168, 37, 0.4);
    line-height: 1;
  }

  &__date-day {
    font-size: 1.35rem;
    font-weight: 800;
  }

  &__date-month {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }

  /* ───── Body ───── */
  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.5rem 1.75rem;
    min-width: 0;

    @media (max-width: 720px) {
      padding: 1.25rem;
    }
  }

  &__date-line {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--elc-primary);
    text-transform: capitalize;

    i {
      font-size: 0.75rem;
      opacity: 0.7;
    }
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-color);
    text-decoration: none;
    line-height: 1.35;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;
    text-wrap: pretty;

    &--plain { cursor: default; }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }

  &__meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: var(--text-color-secondary);

    i {
      font-size: 0.75rem;
      color: var(--elc-primary);
      opacity: 0.7;
    }
  }

  &__footer {
    margin-top: auto;
    padding-top: 0.85rem;
    border-top: 1px solid var(--surface-border);
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--elc-primary);
    text-decoration: none;

    i {
      font-size: 0.75rem;
      transition: transform 0.2s;
    }

    &--plain {
      color: var(--text-color-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
    }
  }
}
</style>
