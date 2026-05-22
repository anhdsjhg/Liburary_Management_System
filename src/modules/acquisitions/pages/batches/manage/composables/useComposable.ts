import { computed, watch, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { AxiosError } from "axios";
import { useBatchShowApi } from "@/api/acquisitions/batches/[id]/get";
import { useBatchCreateApi } from "@/api/acquisitions/batches/post";
import { useBatchUpdateApi } from "@/api/acquisitions/batches/[id]/patch";
import { useBatchForm, buildBatchFormConfig } from "./useFormComposable";
import { useFormErrors } from "@/application/composables/useFormErrors";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export function useBatchManage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() =>
    route.params.id ? String(route.params.id) : null
  );
  const isEdit = computed(() => !!id.value);

  const { form, toCreateRequest, toUpdateRequest, fillFromExisting } = useBatchForm();
  const { serverErrors, setFromAxiosError, clearAll } = useFormErrors();

  const suppliers = ref<{ id: number; name: string }[]>([]);
  const formConfig = buildBatchFormConfig(isEdit, suppliers);

  const { data: batchData, isLoading: loadingBatch } = useBatchShowApi(
    computed(() => id.value ?? "")
  );

  const { mutate: createBatch, isPending: creating } = useBatchCreateApi();
  const { mutate: updateBatch, isPending: updating } = useBatchUpdateApi();

  const isSaving = computed(() => creating.value || updating.value);

  onMounted(async () => {
    try {
      const res = await axiosInstance.get("supplier/names");
      suppliers.value = res.data.res ?? [];
    } catch {
      suppliers.value = [];
    }
  });

  watch(batchData, (data) => {
    if (!data?.res) return;
    const res = data.res;
    fillFromExisting({
      invoice_date: res.invoice_date ?? "",
      doc_no: res.doc_no ?? "",
      contract_no: res.contract_no ?? "",
      invoice_details: res.invoice_details ?? "",
      cost: res.cost ?? null,
      sup_type: res.sup_type ?? "",
      sup_id: res.sup_id ?? null,
      items_no: res.items_no ?? null,
      titles_no: res.titles_no ?? null,
    });
  });

  function submit() {
    clearAll();
    const onError = (err: unknown) => {
      if ((err as AxiosError)?.response?.status === 422) setFromAxiosError(err);
      else showErrorToast(t("acquisitions.save"));
    };
    if (isEdit.value && id.value) {
      updateBatch(toUpdateRequest(id.value), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_BATCHES });
        },
        onError,
      });
    } else {
      createBatch(toCreateRequest(), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_BATCHES });
        },
        onError,
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.ACQUISITION_BATCHES });
  }

  return { form, formConfig, serverErrors, isEdit, isSaving, loadingBatch, submit, cancel };
}
