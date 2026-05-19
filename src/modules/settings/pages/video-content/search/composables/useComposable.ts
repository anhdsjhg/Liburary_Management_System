import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useVideoContentGetApi } from "@/api/settings/video-content/get";
import { useVideoContentDeleteApi } from "@/api/settings/video-content/[id]/delete";
import type { VideoContentItem } from "@/api/settings/video-content/get/types";
import type { TableColumnDef } from "@/application/types/table";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useVideoContentSearch() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useVideoContentGetApi();
  const { mutate: deleteVideo, isPending: deleteLoading } = useVideoContentDeleteApi();

  const items = computed<VideoContentItem[]>(() => data.value?.res ?? []);

  const columns: TableColumnDef<VideoContentItem>[] = [
    { name: "settings.title_en", link: "title_en" },
    { name: "settings.title_ru", link: "title_ru" },
    { name: "settings.link", link: "link" },
  ];

  function onDelete(row: VideoContentItem) {
    deleteVideo(row.video_id, {
      onSuccess() {
        showSuccessToast(t("settings.deleted"));
        refetch();
      },
      onError() {
        showErrorToast(t("settings.deleted"));
      },
    });
  }

  return { items, columns, isLoading, deleteLoading, refetch, onDelete };
}