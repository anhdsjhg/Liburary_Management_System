import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAnnouncementShowApi } from "@/api/settings/announcements/[id]/get";
import { useAnnouncementCreateApi } from "@/api/settings/announcements/post";
import { useAnnouncementUpdateApi } from "@/api/settings/announcements/[id]/patch";
import { useAnnouncementForm } from "./useFormComposable";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { build } from "vite";
import { buildBackendImageUrl } from "@/application/utils/urls";

export function useAnnouncementManage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() => route.params.id as string | undefined);
  const isEdit = computed(() => !!id.value);

  const { data, isLoading: isLoadingData } = useAnnouncementShowApi(
    computed(() => id.value ?? "")
  );
  const { mutate: create, isPending: isCreating } = useAnnouncementCreateApi();
  const { mutate: update, isPending: isUpdating } = useAnnouncementUpdateApi();

  const { form, fill } = useAnnouncementForm();

  const isSaving = computed(() => isCreating.value || isUpdating.value);

  watch(data, (val) => {
    const item = val?.res?.[0];
    if (item) {
      fill({
        title_en: item.title_en ?? "",
        title_ru: item.title_ru ?? "",
        title_kz: item.title_kz ?? "",
        place_en: item.place_en ?? "",
        place_ru: item.place_ru ?? "",
        place_kz: item.place_kz ?? "",
        start_date: item.start_date ?? "",
        end_date: item.end_date ?? null,
        description_en: item.description_en ?? "",
        description_ru: item.description_ru ?? "",
        description_kz: item.description_kz ?? "",
        link: item.link ?? "",
        start_time: item.start_time ?? "",
        end_time: item.end_time ?? null,
        type: item.type ?? "announcement",
        image: "",
      });
      // image is stored as a path to a base64 txt file — fetch its content
      if (buildBackendImageUrl(item.image)) {
        fetch(buildBackendImageUrl(item.image)!)
          .then((r) => r.text())
          .then((base64) => fill({ image: base64 }))
          .catch(() => {});
      }
    }
  });

  function save() {
    if (isEdit.value) {
      update(
        { announcement_id: id.value!, ...form },
        {
          onSuccess() {
            showSuccessToast(t("settings.saved"));
            router.push({ name: RouteNames.SETTINGS_ANNOUNCEMENTS });
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
          router.push({ name: RouteNames.SETTINGS_ANNOUNCEMENTS });
        },
        onError() {
          showErrorToast(t("settings.error"));
        },
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.SETTINGS_ANNOUNCEMENTS });
  }

  const showLoading = computed(() => isEdit.value && isLoadingData.value);

  return { form, isEdit, isLoadingData: showLoading, isSaving, save, cancel };
}