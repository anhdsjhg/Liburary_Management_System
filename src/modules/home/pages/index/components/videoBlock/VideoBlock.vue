<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { VideoContentItem } from "@/api/settings/video-content/get/types";

const props = defineProps<{
  video: VideoContentItem;
}>();

const { locale } = useI18n();
const isPlaying = ref(false);

const title = computed(() => {
  const lang = locale.value as "en" | "ru" | "kz";
  return props.video[`title_${lang}`] ?? props.video.title_en ?? "";
});

const youtubeId = computed(() => {
  const url = props.video.embed_link ?? props.video.link ?? "";
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^&?/]+)/);
  return match?.[1] ?? null;
});

const thumbnailUrl = computed(() =>
  youtubeId.value
    ? `https://img.youtube.com/vi/${youtubeId.value}/hqdefault.jpg`
    : null
);

const embedUrl = computed(() =>
  youtubeId.value
    ? `https://www.youtube.com/embed/${youtubeId.value}?autoplay=1`
    : props.video.embed_link
);
</script>

<template>
  <div class="video-block">
    <!-- Показываем превью пока не кликнули -->
    <div v-if="!isPlaying" class="video-block__thumbnail" @click="isPlaying = true">
      <img v-if="thumbnailUrl" :src="thumbnailUrl" />
      <div class="video-block__play-btn">
        <i class="pi pi-play-circle" style="font-size: 3rem; color: white; filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));" />
      </div>
    </div>

    <iframe
      v-else
      class="video-block__iframe"
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />

    <div class="video-block__divider" />
    <a :href="video.link" target="_blank" class="video-block__title">
      {{ title }}
    </a>
  </div>
</template>

<style scoped>
.video-block__thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.video-block__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-block__play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.2s;
}

.video-block__thumbnail:hover .video-block__play-btn {
  background: rgba(0, 0, 0, 0.35);
}
</style>