import { computed, ref, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBackgroundImageGetApi } from "@/api/settings/background-image/get";
import { useBackgroundImageUploadApi } from "@/api/settings/background-image/post";
import { useBackgroundImageDeleteApi } from "@/api/settings/background-image/[image]/delete";
import { useBackgroundImageForm } from "./useFormComposable";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export function useBackgroundImagePage() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useBackgroundImageGetApi();
  const { mutate: upload, isPending: isUploading } = useBackgroundImageUploadApi();
  const { mutate: deleteImage, isPending: isDeleting } = useBackgroundImageDeleteApi();
  const { file, imageUrl, reset } = useBackgroundImageForm();

  const rawImages = computed<string[]>(() => data.value?.images ?? []);
  const images = ref<string[]>([]);
  let prevBlobUrls: string[] = [];

  watch(rawImages, async (urls) => {
    prevBlobUrls.forEach((u) => URL.revokeObjectURL(u));
    prevBlobUrls = [];
    images.value = await Promise.all(
      urls.map((url) =>
        axiosInstance.get(url, { responseType: "blob" })
          .then((res) => {
            const blobUrl = URL.createObjectURL(res.data);
            prevBlobUrls.push(blobUrl);
            return blobUrl;
          })
          .catch(() => url)
      )
    );
  }, { immediate: true });

  onUnmounted(() => {
    prevBlobUrls.forEach((u) => URL.revokeObjectURL(u));
  });

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
          showErrorToast(t("settings.error"));
        },
      }
    );
  }

  function doDelete(blobOrUrl: string) {
    const blobIndex = images.value.indexOf(blobOrUrl);
    const originalUrl = blobIndex !== -1 ? (rawImages.value[blobIndex] ?? blobOrUrl) : blobOrUrl;
    const filename = originalUrl.split("/").pop() ?? "";
    deleteImage(filename, {
      onSuccess() {
        showSuccessToast(t("settings.deleted"));
        refetch();
      },
      onError() {
        showErrorToast(t("settings.error"));
      },
    });
  }

  return { images, isLoading, isUploading, isDeleting, file, imageUrl, onFileChange, doUpload, doDelete };
}
