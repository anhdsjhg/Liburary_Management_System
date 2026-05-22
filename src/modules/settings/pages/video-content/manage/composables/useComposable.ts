import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useVideoContentCreateApi } from "@/api/settings/video-content/post";
import { useVideoContentUpdateApi } from "@/api/settings/video-content/[id]/patch";
import { useVideoForm } from "./useFormComposable";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import type { VideoContentItem } from "@/api/settings/video-content/get/types";

export function useVideoManageDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { mutate: create, isPending: isCreating } = useVideoContentCreateApi();
  const { mutate: update, isPending: isUpdating } = useVideoContentUpdateApi();

  const editingId = ref<number | null>(null);
  const { form, fill } = useVideoForm();

  function setForEdit(item: VideoContentItem) {
    editingId.value = item.video_id;
    fill({
      title_en: item.title_en ?? "",
      title_ru: item.title_ru ?? "",
      title_kz: item.title_kz ?? "",
      link: item.link,
      embed_link: item.embed_link,
    });
  }

  function resetForm() {
    editingId.value = null;
    fill({ title_en: "", title_ru: "", title_kz: "", link: "", embed_link: "" });
  }

  function save() {
    if (editingId.value) {
      update(
        { video_id: editingId.value, ...form },
        {
          onSuccess() {
            showSuccessToast(t("settings.saved"));
            onSuccess?.();
          },
          onError() {
            showErrorToast(t("settings.error"));
          },
        }
      );
    } else {
      create({ ...form }, {
        onSuccess() {
          showSuccessToast(t("settings.created"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("settings.error"));
        },
      });
    }
  }

  return { form, editingId, isCreating, isUpdating, setForEdit, resetForm, save };
}