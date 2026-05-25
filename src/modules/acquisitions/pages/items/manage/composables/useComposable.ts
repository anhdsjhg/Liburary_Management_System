import { computed, watch, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { AxiosError } from "axios";
import { useItemShowApi } from "@/api/acquisitions/items/[id]/get";
import { useItemCreateApi } from "@/api/acquisitions/items/post";
import { useItemUpdateApi } from "@/api/acquisitions/items/[id]/patch";
import { useItemForm, buildItemFormConfig } from "./useFormComposable";
import { useFormErrors } from "@/application/composables/useFormErrors";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export function useItemManage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() =>
    route.params.id ? String(route.params.id) : null
  );
  const isEdit = computed(() => !!id.value);

  const { form, toCreateRequest, toUpdateRequest, fillFromExisting } = useItemForm();
  const { serverErrors, setFromAxiosError, clearAll } = useFormErrors();

  const publishers = ref<{ id: string; name: string }[]>([]);
  const formConfig = buildItemFormConfig(isEdit, publishers);

  const { data: itemData, isLoading: loadingItem } = useItemShowApi(
    computed(() => id.value ?? "")
  );

  const { mutate: createItem, isPending: creating } = useItemCreateApi();
  const { mutate: updateItem, isPending: updating } = useItemUpdateApi();

  const isSaving = computed(() => creating.value || updating.value);

  onMounted(async () => {
    try {
      const res = await axiosInstance.get("publisher/names");
      publishers.value = res.data.res ?? [];
    } catch {
      publishers.value = [];
    }
  });

  watch(itemData, (data) => {
    if (!data?.res) return;
    const res = data.res;
    fillFromExisting({
      title: res.title ?? "",
      author: res.author ?? "",
      isbn: res.isbn ?? "",
      item_type: res.item_type ?? "",
      batch_id: res.batch_id ?? null,
      publisher_id: res.publisher_id ?? null,
      cost: res.cost ?? null,
      currency: res.currency ?? "",
      location: res.location ?? "",
      pub_year: res.pub_year ?? null,
      pub_city: res.pub_city ?? "",
      prog_code: res.prog_code ?? "",
      status: res.status ?? null,
    });
  });

  function submit() {
    clearAll();
    const onError = (err: unknown) => {
      if ((err as AxiosError)?.response?.status === 422) setFromAxiosError(err);
      else showErrorToast(t("acquisitions.save"));
    };
    if (isEdit.value && id.value) {
      updateItem(toUpdateRequest(id.value), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_ITEMS });
        },
        onError,
      });
    } else {
      createItem(toCreateRequest(), {
        onSuccess() {
          showSuccessToast(t("acquisitions.save"));
          router.push({ name: RouteNames.ACQUISITION_ITEMS });
        },
        onError,
      });
    }
  }

  function cancel() {
    router.push({ name: RouteNames.ACQUISITION_ITEMS });
  }

  return { form, formConfig, serverErrors, isEdit, isSaving, loadingItem, submit, cancel };
}
