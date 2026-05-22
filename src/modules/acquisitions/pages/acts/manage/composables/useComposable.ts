import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { AxiosError } from "axios";
import { useActShowApi } from "@/api/acquisitions/acts/[id]/get";
import { useActCreateApi } from "@/api/acquisitions/acts/post";
import { useActUpdateApi } from "@/api/acquisitions/acts/[id]/patch";
import { useActForm, buildActFormConfig } from "./useFormComposable";
import { useFormErrors } from "@/application/composables/useFormErrors";
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

  const { form, toCreateRequest, toUpdateRequest, fillFromExisting } = useActForm();
  const { serverErrors, setFromAxiosError, clearAll } = useFormErrors();
  const formConfig = buildActFormConfig(isEdit);

  const { data: actData, isLoading: loadingAct } = useActShowApi(
    computed(() => id.value ?? "")
  );

  const { mutate: createAct, isPending: creating } = useActCreateApi();
  const { mutate: updateAct, isPending: updating } = useActUpdateApi();

  const isSaving = computed(() => creating.value || updating.value);

  watch(actData, (data) => {
    if (!data?.res) return;
    const res = data.res;
    fillFromExisting({
      act_date: res.act_date ?? "",
      protocol_id: res.protocol_id ?? "",
      protocol_date: res.protocol_date ?? "",
      notes: res.notes ?? "",
    });
  });

  function submit() {
    clearAll();
    const onError = (err: unknown) => {
      if ((err as AxiosError)?.response?.status === 422) setFromAxiosError(err);
      else showErrorToast(t("acquisitions.save"));
    };
    if (isEdit.value && id.value) {
      updateAct(toUpdateRequest(id.value), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_ACTS });
        },
        onError,
      });
    } else {
      createAct(toCreateRequest(), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_ACTS });
        },
        onError,
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.ACQUISITION_ACTS });
  }

  return { form, formConfig, serverErrors, isEdit, isSaving, loadingAct, submit, cancel };
}
