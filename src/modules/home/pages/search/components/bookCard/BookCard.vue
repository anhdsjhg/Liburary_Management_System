<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { MediaSearchItem } from "@/api/media/search/get/types";
import { AppCheckbox } from "@/application/components";
import { ASSETS } from "@/application/configs/constants";
import { RouteNames } from "@/application/router/routeNames";

const props = defineProps<{
  item: MediaSearchItem;
  selected: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-select"): void;
}>();

const router = useRouter();

const imageUrl = computed(
  () => props.item.image ?? ASSETS.NO_COVER
);

const availabilityText = computed(
  () => `${props.item.available ?? 0} / ${props.item.total ?? 0}`
);

function goToBook() {
  router.push({
    name: RouteNames.WEBSITE_BOOK,
    params: { id: props.item.id },
  });
}
</script>

<template>
  <div class="book-card" :class="{ 'book-card--selected': selected }">
    <div class="book-card__checkbox">
      <AppCheckbox
        :model-value="selected"
        @update:model-value="$emit('toggle-select')"
      />
    </div>

    <div class="book-card__badges">
      <span v-if="item.location" class="book-card__badge">{{ item.location }}</span>
      <span v-if="item.call_number" class="book-card__badge">{{ item.call_number }}</span>
    </div>

    <div
      class="book-card__image"
      :style="{ backgroundImage: `url(${imageUrl})` }"
      @click="goToBook"
    />

    <div class="book-card__title" @click="goToBook">{{ item.title }}</div>
    <div v-if="item.author" class="book-card__author">{{ item.author }}</div>
    <div v-if="item.year" class="book-card__year">{{ item.year }}</div>

    <div class="book-card__footer">
      <div class="book-card__availability">
        {{ availabilityText }} {{ $t("home.availability") }}
      </div>
    </div>
  </div>
</template>