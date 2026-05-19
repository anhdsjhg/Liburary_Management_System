import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useArrivalGetApi } from "@/api/settings/arrivals/get";
import { useRouter } from "vue-router";
import { RouteNames } from "@/application/router/routeNames";
import { ASSETS } from "@/application/configs/constants";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";

export function useArrivalsAll() {
  const { locale } = useI18n();
  const router = useRouter();

  const { data, isLoading } = useArrivalGetApi();

  const arrivals = computed<ArrivalItem[]>(() => data.value?.res ?? []);

  function getImageUrl(item: ArrivalItem): string {
    return item.image ?? ASSETS.NO_COVER;
  }

  function goToBook(id: number) {
    router.push({
      name: RouteNames.WEBSITE_BOOK,
      params: { id },
    });
  }

  return {
    arrivals,
    isLoading,
    getImageUrl,
    goToBook,
  };
}