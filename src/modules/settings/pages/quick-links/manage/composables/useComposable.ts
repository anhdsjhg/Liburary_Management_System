import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useQuickLinkCreateApi } from "@/api/settings/quick-links/post";
import { useQuickLinkUpdateApi } from "@/api/settings/quick-links/[id]/patch";
import { useQuickLinkForm } from "./useFormComposable";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import type { QuickLink } from "@/api/settings/quick-links/get/types";

export function useQuickLinkManageDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { mutate: create, isPending: isCreating } = useQuickLinkCreateApi();
  const { mutate: update, isPending: isUpdating } = useQuickLinkUpdateApi();

  const editingId = ref<number | null>(null);
  const { form, fill, reset } = useQuickLinkForm();

  function setForEdit(item: QuickLink) {
    editingId.value = item.id;
    fill({
      title_en: item.title_en ?? "",
      title_ru: item.title_ru ?? "",
      title_kz: item.title_kz ?? "",
      description_en: item.description_en ?? "",
      description_ru: item.description_ru ?? "",
      description_kz: item.description_kz ?? "",
      link: item.link,
    });
  }

  function resetForm() {
    editingId.value = null;
    reset();
  }

  function save() {
    if (editingId.value) {
      update(
        { id: editingId.value, ...form },
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