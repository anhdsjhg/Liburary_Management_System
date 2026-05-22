import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useArrivalGetApi } from "@/api/settings/arrivals/get";
import { useAnnouncementGetApi } from "@/api/settings/announcements/get";
import { useVideoContentGetApi } from "@/api/settings/video-content/get";
import { useBackgroundImageGetApi } from "@/api/settings/background-image/get";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";
import type { VideoContentItem } from "@/api/settings/video-content/get/types";
import { useQuickLinkGetApi } from "@/api/settings/quick-links/get";

export function useHomeIndex() {
  const { locale } = useI18n();

  const { data: arrivalsData, isLoading: arrivalsLoading } = useArrivalGetApi(10);
  const { data: announcementsData, isLoading: eventsLoading } = useAnnouncementGetApi();
  const { data: videosData, isLoading: videosLoading } = useVideoContentGetApi();
  const { data: bgImagesData } = useBackgroundImageGetApi();
  const { data: quickLinksData } = useQuickLinkGetApi();

  const arrivals = computed<ArrivalItem[]>(
    () => arrivalsData.value?.res ?? []
  );

  const events = computed<AnnouncementItem[]>(() =>
    announcementsData.value?.res?.data ?? []
  );

  const videos = computed<VideoContentItem[]>(
    () => videosData.value?.res ?? []
  );

  const backgroundImages = computed<string[]>(
    () => (bgImagesData.value?.images ?? []).map((url: string) =>
      url.replace(/^https?:\/\/[^/]+/, '')
    )
  );
  
  const quickLinks = computed(() => quickLinksData.value?.res ?? []);

  const currentBgIndex = ref(0);
  const nextBgIndex = ref(1);
  const isFading = ref(false);
  let rotationTimer: ReturnType<typeof setInterval> | null = null;

  function startBgRotation() {
    if (backgroundImages.value.length <= 1) return;

    rotationTimer = setInterval(() => {
      isFading.value = true;
      setTimeout(() => {
        currentBgIndex.value = nextBgIndex.value;
        nextBgIndex.value =
          (nextBgIndex.value + 1) % backgroundImages.value.length;
        isFading.value = false;
      }, 500);
    }, 8000);
  }

  function stopBgRotation() {
    if (rotationTimer) {
      clearInterval(rotationTimer);
      rotationTimer = null;
    }
  }

  function getLocalizedTitle(item: AnnouncementItem): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`title_${lang}`] ?? item.title_en ?? "";
  }

  function getLocalizedPlace(item: AnnouncementItem): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`place_${lang}`] ?? item.place_en ?? "";
  }

  function getVideoTitle(item: VideoContentItem): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`title_${lang}`] ?? item.title_en ?? "";
  }

  onMounted(() => startBgRotation());
  onUnmounted(() => stopBgRotation());

  return {
    arrivals,
    events,
    videos,
    backgroundImages,
    quickLinks,
    currentBgIndex,
    nextBgIndex,
    isFading,
    arrivalsLoading,
    eventsLoading,
    videosLoading,
    getLocalizedTitle,
    getLocalizedPlace,
    getVideoTitle,
  };
}