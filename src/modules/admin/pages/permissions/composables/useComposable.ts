import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAdminModulesApi } from "@/api/admin/modules/get";
import { useServiceUsersSearchApi } from "@/api/service-desk/users/get";
import { useUsersByModuleApi } from "@/api/admin/users-by-module/post";
import type { ServiceUser } from "@/api/service-desk/users/get/types";
import { RouteNames } from "@/application/router/routeNames";

export function usePermissionsPage() {
  const router = useRouter();

  const { data: modulesData, isLoading: modulesLoading } = useAdminModulesApi();
  const { mutate: searchUsers, isPending: usersLoading } = useServiceUsersSearchApi();
  const { mutate: searchByModule, isPending: byModuleLoading } = useUsersByModuleApi();

  const modules = computed(() => modulesData.value?.res ?? []);
  const selectedModuleId = ref<number | null>(null);
  const userType = ref<"employee" | "student">("employee");
  const searchQuery = ref("");
  const currentPage = ref(1);
  const perPage = ref(25);

  const users = ref<ServiceUser[]>([]);
  const total = ref(0);
  const lastPage = ref(1);

  const isLoading = computed(() => usersLoading.value || byModuleLoading.value);

  function load(page = 1) {
    currentPage.value = page;

    if (selectedModuleId.value !== null) {
      searchByModule(
        {
          add_options: [{ key: "module_id", value: selectedModuleId.value }],
          page,
          per_page: perPage.value,
        },
        {
          onSuccess(data) {
            users.value = data.res.data;
            total.value = data.res.total;
            lastPage.value = data.res.last_page;
          },
        }
      );
    } else {
      const opts: Array<{ key: string; value: string }> = [
        { key: "type", value: userType.value },
      ];
      if (searchQuery.value.trim()) {
        opts.push({ key: "all", value: searchQuery.value.trim() });
      }
      searchUsers(
        { add_options: opts, page, per_page: perPage.value },
        {
          onSuccess(data) {
            users.value = data.res.data;
            total.value = data.res.total;
            lastPage.value = data.res.last_page;
          },
        }
      );
    }
  }

  function onModuleSelect(moduleId: number | null) {
    selectedModuleId.value = moduleId;
    currentPage.value = 1;
    load(1);
  }

  function onTypeChange(type: "employee" | "student") {
    userType.value = type;
    selectedModuleId.value = null;
    load(1);
  }

  function onSearch() {
    selectedModuleId.value = null;
    load(1);
  }

  function goToControl(user: ServiceUser) {
    router.push({
      name: RouteNames.ADMIN_CONTROL,
      params: { userId: user.user_cid },
    });
  }

  return {
    modules,
    modulesLoading,
    selectedModuleId,
    userType,
    searchQuery,
    currentPage,
    users,
    total,
    perPage,
    lastPage,
    isLoading,
    onModuleSelect,
    onTypeChange,
    onSearch,
    load,
    goToControl,
  };
}
