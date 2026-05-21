import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserVisualizationApi } from "@/api/admin/user-visualization/get";
import { useUserAvailablePermissionsApi } from "@/api/admin/user-available-permissions/get";
import { useGivePermissionsApi } from "@/api/admin/permissions/post";
import { useDeletePermissionsApi } from "@/api/admin/permissions/delete";
import type { AdminModuleWithPermissions, AdminPermissionItem } from "@/api/admin/permissions/get/types";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { RouteNames } from "@/application/router/routeNames";

export function useControlPage() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const userId = computed(() => route.params.userId as string);

  // ── API hooks ──────────────────────────────────────────────
  const { data: visualizationData, isLoading: visualizationLoading, refetch: refetchVisualization } =
    useUserVisualizationApi(userId);

  const { data: availableData, isLoading: availableLoading, refetch: refetchAvailable } =
    useUserAvailablePermissionsApi(userId);

  const { mutate: givePermissions, isPending: giveLoading } = useGivePermissionsApi();
  const { mutate: deletePermissions, isPending: deleteLoading } = useDeletePermissionsApi();

  // ── GIVE tab state ─────────────────────────────────────────
  const giveModules = computed<AdminModuleWithPermissions[]>(
    () => availableData.value?.res ?? []
  );
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
    if (!stagedToGive.value.length) return;
    givePermissions(
      {
        user_id: userId.value,
        permissions: stagedToGive.value.map((p) => p.id),
      },
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

  // ── REMOVE tab state ────────────────────────────────────────
  const removeModules = computed<AdminModuleWithPermissions[]>(
    () => visualizationData.value?.res ?? []
  );
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
    if (!stagedToRemove.value.length) return;
    deletePermissions(
      {
        user_id: userId.value,
        permissions: stagedToRemove.value.map((p) => p.id),
      },
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

  // ── Navigation ─────────────────────────────────────────────
  function goBack() {
    router.push({ name: RouteNames.ADMIN_PERMISSIONS });
  }

  return {
    userId,

    // give tab
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

    // remove tab
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

    goBack,
  };
}
