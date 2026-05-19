import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useServiceUserShowApi } from "@/api/service-desk/users/[id]/get";
import { useServiceSetActivityApi } from "@/api/service-desk/actions/reserve/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import type { Ref, ComputedRef } from "vue";

export function useUserCard(
  type: Ref<string> | ComputedRef<string>,
  id: Ref<number | string> | ComputedRef<number | string>
) {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useServiceUserShowApi(type, id);
  const { mutate: setActivity } = useServiceSetActivityApi();

  const user = computed(() => data.value?.res ?? null);
  const info = computed(() => user.value?.info ?? null);
  const photo = computed(() => user.value?.photo ?? null);
  const total = computed(() => user.value?.total ?? null);
  const currentLoans = computed(() => user.value?.return ?? []);
  const history = computed(() => user.value?.history ?? []);
  const penalty = computed(() => user.value?.penalty ?? null);
  const duration = computed(() => user.value?.duration ?? 21);
  const isUnlimited = computed(() => user.value?.isUnlimited ?? false);

  function toggleActivity() {
    if (!info.value) return;
    setActivity(
      {
        user_cid: info.value.user_cid,
        inactive: info.value.is_active === 1 ? 1 : 0,
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.activate"));
          refetch();
        },
        onError() {
          showErrorToast(t("serviceDesk.activate"));
        },
      }
    );
  }

  return {
    info,
    photo,
    total,
    currentLoans,
    history,
    penalty,
    duration,
    isUnlimited,
    isLoading,
    refetch,
    toggleActivity,
  };
}