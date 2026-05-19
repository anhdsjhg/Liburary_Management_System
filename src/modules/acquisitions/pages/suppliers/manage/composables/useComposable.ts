import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSupplierCreateApi } from "@/api/acquisitions/suppliers/post";
import { useSupplierUpdateApi } from "@/api/acquisitions/suppliers/[id]/patch";
import { useSupplierForm } from "./useFormComposable";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { Supplier } from "@/api/acquisitions/suppliers/get/types";

export function useSupplierManage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() =>
    route.params.id ? String(route.params.id) : null
  );
  const isEdit = computed(() => !!id.value);

  const { form, toCreateRequest, toUpdateRequest, fillFromExisting } = useSupplierForm();

  const { data: supplierData, isLoading: loadingSupplier } = useQuery<{ res: Supplier }>({
    queryKey: ["get:supplier-show", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`supplier/show/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });

  watch(supplierData, (data) => {
    if (!data?.res) return;
    const res = data.res;
    fillFromExisting({
      sup_name: res.name ?? "",
      bin: res.bin ?? "",
      com_name: res.com_name ?? "",
      address: res.address ?? "",
      email: res.email ?? "",
      fax: res.fax ?? "",
      phone: res.phone ?? "",
    });
  });

  const { mutate: createSupplier, isPending: creating } = useSupplierCreateApi();
  const { mutate: updateSupplier, isPending: updating } = useSupplierUpdateApi();

  const isSaving = computed(() => creating.value || updating.value);

  function submit() {
    if (isEdit.value && id.value) {
      updateSupplier(toUpdateRequest(id.value), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_SUPPLIERS });
        },
        onError() {
          showErrorToast(t("acquisitions.save"));
        },
      });
    } else {
      createSupplier(toCreateRequest(), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_SUPPLIERS });
        },
        onError() {
          showErrorToast(t("acquisitions.save"));
        },
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.ACQUISITION_SUPPLIERS });
  }

  return { form, isEdit, isSaving, loadingSupplier, submit, cancel };
}