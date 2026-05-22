import { computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCatalogingShowApi } from "@/api/cataloging/[id]/get";
import { useCatalogingUpdateApi } from "@/api/cataloging/[id]/patch";
import { useCatalogingDeleteApi } from "@/api/cataloging/[id]/delete";
import { useMarcFieldsForm } from "./useFormComposable";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export function useCatalogingEdit() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() => Number(route.params.id));
  const type = computed(() => String(route.query.type ?? "BK"));

  const { data, isLoading } = useCatalogingShowApi(type, id);
  const { mutate: updateMaterial, isPending: isSaving } = useCatalogingUpdateApi();
  const { mutate: deleteMaterial, isPending: isDeleting } = useCatalogingDeleteApi();

  const { fields, isDirty, setFields, updateFields, toUpdatePayload } =
    useMarcFieldsForm();

  const image = computed(() => data.value?.image ?? null);
  const state = computed(() => data.value?.state ?? "");
  const createdBy = computed(
    () => data.value?.created_info?.created_by ?? null
  );
  const createdAt = computed(
    () => data.value?.created_info?.created_at ?? null
  );

  const historyItems = ref<{ made_by: string; made_at: string }[]>([]);

  watch(data, (val) => {
    if (val?.res) {
      setFields(val.res);
    }
  });

  async function loadHistory() {
    const res = await axiosInstance.get(
      `cataloging/material/made-by-history/${type.value}/${id.value}`
    );
    historyItems.value = res.data.res ?? [];
  }

  function save() {
    updateMaterial(
      { type: type.value, id: id.value, data: toUpdatePayload() },
      {
        onSuccess() {
          showSuccessToast(t("cataloging.save"));
          isDirty.value = false;
        },
        onError() {
          showErrorToast(t("cataloging.save"));
        },
      }
    );
  }

  async function markComplete() {
    await axiosInstance.put(
      `cataloging/material/complete/${type.value}/${id.value}`
    );
    showSuccessToast(t("cataloging.complete"));
  }

  function exportXml() {
    window.open(
      `${axiosInstance.defaults.baseURL}cataloging/material/export-xml/${type.value}/${id.value}`,
      "_blank"
    );
  }

  function onDelete() {
    deleteMaterial(
      { type: type.value, id: id.value },
      {
        onSuccess() {
          showSuccessToast(t("cataloging.delete"));
          router.push({ name: RouteNames.CATALOGING_SEARCH });
        },
        onError() {
          showErrorToast(t("cataloging.delete"));
        },
      }
    );
  }

  function cancel() {
    router.push({ name: RouteNames.CATALOGING_SEARCH });
  }

  return {
    id,
    type,
    image,
    state,
    createdBy,
    createdAt,
    fields,
    isDirty,
    isLoading,
    isSaving,
    isDeleting,
    historyItems,
    updateFields,
    save,
    markComplete,
    exportXml,
    onDelete,
    cancel,
    loadHistory,
  };
}