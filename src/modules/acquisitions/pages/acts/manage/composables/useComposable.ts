import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useActCreateApi } from "@/api/acquisitions/acts/post";
import { useActUpdateApi } from "@/api/acquisitions/acts/[id]/patch";
import { useActForm } from "./useFormComposable";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useActManage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() =>
    route.params.id ? String(route.params.id) : null
  );
  const isEdit = computed(() => !!id.value);

  const { form, toCreateRequest, toUpdateRequest } = useActForm();
  const { mutate: createAct, isPending: creating } = useActCreateApi();
  const { mutate: updateAct, isPending: updating } = useActUpdateApi();

  const isSaving = computed(() => creating.value || updating.value);

  function submit() {
    if (isEdit.value && id.value) {
      updateAct(toUpdateRequest(id.value), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_ACTS });
        },
        onError() {
          showErrorToast(t("acquisitions.save"));
        },
      });
    } else {
      createAct(toCreateRequest(), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_ACTS });
        },
        onError() {
          showErrorToast(t("acquisitions.save"));
        },
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.ACQUISITION_ACTS });
  }

  return { form, isEdit, isSaving, submit, cancel };
}