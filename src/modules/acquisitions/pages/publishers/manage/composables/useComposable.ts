import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { AxiosError } from "axios";
import { usePublisherCreateApi } from "@/api/acquisitions/publishers/post";
import { usePublisherUpdateApi } from "@/api/acquisitions/publishers/[id]/patch";
import { usePublisherForm, buildPublisherFormConfig } from "./useFormComposable";
import { useFormErrors } from "@/application/composables/useFormErrors";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { Publisher } from "@/api/acquisitions/publishers/get/types";

export function usePublisherManage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() =>
    route.params.id ? String(route.params.id) : null
  );
  const isEdit = computed(() => !!id.value);

  const { form, toCreateRequest, toUpdateRequest, fillFromExisting } = usePublisherForm();
  const { serverErrors, setFromAxiosError, clearAll } = useFormErrors();
  const formConfig = buildPublisherFormConfig();

  const { data: publisherData, isLoading: loadingPublisher } = useQuery<{ res: Publisher }>({
    queryKey: ["get:publisher-show", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`publisher/show/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });

  watch(publisherData, (data) => {
    if (!data?.res) return;
    const res = data.res;
    fillFromExisting({
      pub_name: res.name ?? "",
      com_name: res.com_name ?? "",
      address: res.address ?? "",
      email: res.email ?? "",
      fax: res.fax ?? "",
      phone: res.phone ?? "",
    });
  });

  const { mutate: createPublisher, isPending: creating } = usePublisherCreateApi();
  const { mutate: updatePublisher, isPending: updating } = usePublisherUpdateApi();

  const isSaving = computed(() => creating.value || updating.value);

  function submit() {
    clearAll();
    const onError = (err: unknown) => {
      if ((err as AxiosError)?.response?.status === 422) setFromAxiosError(err);
      else showErrorToast(t("acquisitions.save"));
    };
    if (isEdit.value && id.value) {
      updatePublisher(toUpdateRequest(id.value), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_PUBLISHERS });
        },
        onError,
      });
    } else {
      createPublisher(toCreateRequest(), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_PUBLISHERS });
        },
        onError,
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.ACQUISITION_PUBLISHERS });
  }

  return { form, formConfig, serverErrors, isEdit, isSaving, loadingPublisher, submit, cancel };
}