import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useServiceGiveApi } from "@/api/service-desk/actions/give/post";
import { useServiceReturnApi } from "@/api/service-desk/actions/return/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export interface ScannedMaterial {
  inv_id: string;
  barcode: string;
  title: string;
  author: string | null;
  material_id: number | string;
  loan_id: number | null;
  status: string;
  available: number;
  total: number;
  user_cid: string | null;
}

export interface ScannedUser {
  user_cid: string;
  full_name: string;
  type: string;
  username: string;
  is_active: number;
}

export function useServiceDesk() {
  const { t } = useI18n();

  const { mutate: giveMaterial, isPending: isGiving } = useServiceGiveApi();
  const { mutate: returnMaterial, isPending: isReturning } = useServiceReturnApi();

  const materialBarcode = ref("");
  const userQuery = ref("");
  const duration = ref(21);

  const scannedMaterials = ref<ScannedMaterial[]>([]);
  const selectedUser = ref<ScannedUser | null>(null);
  const isLoadingMaterial = ref(false);
  const isLoadingUser = ref(false);

  async function scanMaterial() {
    if (!materialBarcode.value.trim()) return;
    isLoadingMaterial.value = true;
    try {
      const res = await axiosInstance.get("service/media/search/by-barcode", {
        params: { barcodes: [materialBarcode.value.trim()] },
      });
      const items: ScannedMaterial[] = res.data?.res ?? [];
      scannedMaterials.value = items;
      materialBarcode.value = "";
    } catch {
      showErrorToast(t("serviceDesk.no_results"));
    } finally {
      isLoadingMaterial.value = false;
    }
  }

  async function searchUser() {
    if (!userQuery.value.trim()) return;
    isLoadingUser.value = true;
    try {
      const res = await axiosInstance.get(
        `service/user/${userQuery.value.trim()}`
      );
      selectedUser.value = res.data?.res ?? null;
    } catch {
      showErrorToast(t("serviceDesk.no_results"));
    } finally {
      isLoadingUser.value = false;
    }
  }

  function give(material: ScannedMaterial) {
    if (!selectedUser.value) return;
    giveMaterial(
      {
        inv_id: material.inv_id,
        user_cid: selectedUser.value.user_cid,
        material_id: material.material_id,
        duration: duration.value,
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.give_success"));
          scannedMaterials.value = [];
        },
        onError() {
          showErrorToast(t("serviceDesk.give_success"));
        },
      }
    );
  }

  function returnItem(material: ScannedMaterial) {
    if (!material.loan_id || !selectedUser.value) return;
    returnMaterial(
      {
        inv_id: material.inv_id,
        user_cid: material.user_cid ?? selectedUser.value.user_cid,
        loan_id: material.loan_id,
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.return_success"));
          scannedMaterials.value = scannedMaterials.value.filter(
            (m) => m.inv_id !== material.inv_id
          );
        },
        onError() {
          showErrorToast(t("serviceDesk.return_success"));
        },
      }
    );
  }

  return {
    materialBarcode,
    userQuery,
    duration,
    scannedMaterials,
    selectedUser,
    isLoadingMaterial,
    isLoadingUser,
    isGiving,
    isReturning,
    scanMaterial,
    searchUser,
    give,
    returnItem,
  };
}