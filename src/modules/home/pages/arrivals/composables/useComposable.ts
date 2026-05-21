import { computed } from "vue";
import { useArrivalGetApi } from "@/api/settings/arrivals/get";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";
import { ASSETS } from "@/application/configs/constants";

export function useAllArrivals() {
  const { data, isLoading } = useArrivalGetApi();

  const arrivals = computed<ArrivalItem[]>(() => data.value?.res ?? []);

  function getImageUrl(item: ArrivalItem): string {
    return item.image ?? ASSETS.NO_COVER;
  }

  return {
    arrivals,
    isLoading,
    getImageUrl,
  };
}
