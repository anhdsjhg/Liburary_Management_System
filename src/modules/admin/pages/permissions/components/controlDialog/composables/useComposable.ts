import { ref, computed, watch, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useUserVisualizationApi } from "@/api/admin/user-visualization/get";
import { useUserAvailablePermissionsApi } from "@/api/admin/user-available-permissions/get";
import { useGivePermissionsApi } from "@/api/admin/permissions/post";
import { useDeletePermissionsApi } from "@/api/admin/permissions/delete";
import type { AdminModuleWithPermissions, AdminPermissionItem } from "@/api/admin/permissions/get/types";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useControlDialog(userId: Ref<string | null>) {
  const { t } = useI18n();

  const { data: visualizationData, isLoading: visualizationLoading, refetch: refetchVisualization } =
    useUserVisualizationApi(userId);

  const { data: availableData, isLoading: availableLoading, refetch: refetchAvailable } =
    useUserAvailablePermissionsApi(userId);

  const { mutate: givePermissions, isPending: giveLoading } = useGivePermissionsApi();
  const { mutate: deletePermissions, isPending: deleteLoading } = useDeletePermissionsApi();

  // ── GIVE tab ──────────────────────────────────────────────────
  const giveModules = computed<AdminModuleWithPermissions[]>(() => availableData.value?.res ?? []);
  const giveSelectedModuleId = ref<number | null>(null);
  const stagedToGive = ref<(AdminPermissionItem & { moduleId: number })[]>([]);

  const giveAvailablePermissions = computed<AdminPermissionItem[]>(() => {
    if (giveSelectedModuleId.value === null) return [];
    const mod = giveModules.value.find((m) => m.id === giveSelectedModuleId.value);
    if (!mod) return [];
    const stagedIds = new Set(stagedToGive.value.map((p) => p.id));
    return (mod.visualization ?? []).filter((p) => !stagedIds.has(p.id));
  });

  function giveSelectModule(id: number) {
    giveSelectedModuleId.value = id;
  }

  function stageForGiving(perm: AdminPermissionItem) {
    if (giveSelectedModuleId.value === null) return;
    stagedToGive.value.push({ ...perm, moduleId: giveSelectedModuleId.value });
  }

  function unstageFromGiving(index: number) {
    stagedToGive.value.splice(index, 1);
  }

  function giveChooseAll() {
    giveAvailablePermissions.value.forEach((p) => stageForGiving(p));
  }

  function saveGivePermissions() {
    if (!stagedToGive.value.length || !userId.value) return;
    givePermissions(
      { user_id: userId.value, permissions: stagedToGive.value.map((p) => p.id) },
      {
        onSuccess() {
          showSuccessToast(t("admin.giveSuccess"));
          stagedToGive.value = [];
          giveSelectedModuleId.value = null;
          refetchAvailable();
        },
        onError() {
          showErrorToast(t("admin.giveError"));
        },
      }
    );
  }

  // ── REMOVE tab ────────────────────────────────────────────────
  const removeModules = computed<AdminModuleWithPermissions[]>(() => visualizationData.value?.res ?? []);
  const removeSelectedModuleId = ref<number | null>(null);
  const stagedToRemove = ref<(AdminPermissionItem & { moduleId: number })[]>([]);

  const removeCurrentPermissions = computed<AdminPermissionItem[]>(() => {
    if (removeSelectedModuleId.value === null) return [];
    const mod = removeModules.value.find((m) => m.id === removeSelectedModuleId.value);
    if (!mod) return [];
    const stagedIds = new Set(stagedToRemove.value.map((p) => p.id));
    return (mod.permissions ?? []).filter((p) => !stagedIds.has(p.id));
  });

  function removeSelectModule(id: number) {
    removeSelectedModuleId.value = id;
  }

  function stageForRemoving(perm: AdminPermissionItem) {
    if (removeSelectedModuleId.value === null) return;
    stagedToRemove.value.push({ ...perm, moduleId: removeSelectedModuleId.value });
  }

  function unstageFromRemoving(index: number) {
    stagedToRemove.value.splice(index, 1);
  }

  function removeChooseAll() {
    removeCurrentPermissions.value.forEach((p) => stageForRemoving(p));
  }

  function saveRemovePermissions() {
    if (!stagedToRemove.value.length || !userId.value) return;
    deletePermissions(
      { user_id: userId.value, permissions: stagedToRemove.value.map((p) => p.id) },
      {
        onSuccess() {
          showSuccessToast(t("admin.deleteSuccess"));
          stagedToRemove.value = [];
          removeSelectedModuleId.value = null;
          refetchVisualization();
        },
        onError() {
          showErrorToast(t("admin.deleteError"));
        },
      }
    );
  }

  // Reset staged state when userId changes (new user opened)
  watch(userId, () => {
    stagedToGive.value = [];
    stagedToRemove.value = [];
    giveSelectedModuleId.value = null;
    removeSelectedModuleId.value = null;
  });

  return {
    giveModules,
    giveSelectedModuleId,
    stagedToGive,
    giveAvailablePermissions,
    availableLoading,
    giveLoading,
    giveSelectModule,
    stageForGiving,
    unstageFromGiving,
    giveChooseAll,
    saveGivePermissions,

    removeModules,
    removeSelectedModuleId,
    stagedToRemove,
    removeCurrentPermissions,
    visualizationLoading,
    deleteLoading,
    removeSelectModule,
    stageForRemoving,
    unstageFromRemoving,
    removeChooseAll,
    saveRemovePermissions,
  };
}
