import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useBackgroundImageGetApi } from "@/api/settings/background-image/get";
import { useBackgroundImageUploadApi } from "@/api/settings/background-image/post";
import { useBackgroundImageForm } from "./useFormComposable";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export function useBackgroundImagePage() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useBackgroundImageGetApi();
  const { mutate: upload, isPending: isUploading } = useBackgroundImageUploadApi();
  const { file, imageUrl, reset } = useBackgroundImageForm();

  const images = computed<string[]>(() => data.value?.images ?? []);

  function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    file.value = target.files?.[0] ?? null;
  }

  function doUpload() {
    upload(
      { image: file.value ?? undefined, image_url: imageUrl.value || undefined },
      {
        onSuccess() {
          showSuccessToast(t("settings.saved"));
          reset();
          refetch();
        },
        onError() {
          showErrorToast(t("settings.saved"));
        },
      }
    );
  }

  async function doDelete(imageFullUrl: string) {
    const filename = imageFullUrl.split("/").pop() ?? "";
    try {
      await axiosInstance.delete(`background-image/delete/${filename}`);
      showSuccessToast(t("settings.deleted"));
      refetch();
    } catch {
      showErrorToast(t("settings.deleted"));
    }
  }

  return { images, isLoading, isUploading, file, imageUrl, onFileChange, doUpload, doDelete };
}