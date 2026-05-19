<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { VideoContentItem } from "@/api/settings/video-content/get/types";

const props = defineProps<{
  video: VideoContentItem;
}>();

const { locale } = useI18n();

const title = computed(() => {
  const lang = locale.value as "en" | "ru" | "kz";
  return props.video[`title_${lang}`] ?? props.video.title_en ?? "";
});
</script>

<template>
  <div class="video-block">
    <iframe
      class="video-block__iframe"
      :src="video.embed_link"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <div class="video-block__divider" />
    <a
      :href="video.link"
      target="_blank"
      class="video-block__title"
    >
      {{ title }}
    </a>
  </div>
</template>