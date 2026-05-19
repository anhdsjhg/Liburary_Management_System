<script setup lang="ts">
import { useRouter } from "vue-router";
import { RouteNames } from "@/application/router/routeNames";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";
import { ASSETS } from "@/application/configs/constants";

const props = defineProps<{ arrivals: ArrivalItem[] }>();
const router = useRouter();

const responsiveOptions = [
  { breakpoint: '1024px', numVisible: 4, numScroll: 1 },
  { breakpoint: '768px', numVisible: 3, numScroll: 1 },
  { breakpoint: '560px', numVisible: 2, numScroll: 1 },
];

function goToBook(id: number) {
  router.push({ name: RouteNames.WEBSITE_BOOK, params: { id } });
}

function getImageUrl(item: ArrivalItem): string {
  return item.image ?? ASSETS.NO_COVER;
}
</script>

<template>
  <Carousel
    :value="arrivals"
    :numVisible="5"
    :numScroll="1"
    :responsiveOptions="responsiveOptions"
    :autoplayInterval="10000"
    circular
  >
    <template #item="{ data }">
      <div class="arrival-card mx-2" @click="goToBook(data.id)">
        <div
          class="arrival-card__image"
          :style="{ backgroundImage: `url(${getImageUrl(data)})` }"
        />
        <div class="arrival-card__title">{{ data.title }}</div>
        <div v-if="data.author" class="arrival-card__author">{{ data.author }}</div>
        <a class="arrival-card__link">{{ $t("home.show_details") }}</a>
      </div>
    </template>
  </Carousel>
</template>