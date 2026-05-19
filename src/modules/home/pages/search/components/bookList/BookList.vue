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

const imageUrl = computed(() => props.item.image ?? ASSETS.NO_COVER);
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
  <div class="book-list-item">
    <div class="book-list-item__image"
      :style="{ backgroundImage: `url(${imageUrl})` }"
      @click="goToBook"
    />

    <div class="book-list-item__body">
      <div class="book-list-item__badges">
        <span v-if="item.type" class="book-list-item__badge">
          {{ $t(item.type) }}
        </span>
        <span v-if="item.call_number" class="book-list-item__badge">
          {{ item.call_number }}
        </span>
        <span v-if="item.location" class="book-list-item__badge">
          {{ item.location }}
        </span>
      </div>

      <div class="book-list-item__title" @click="goToBook">
        {{ item.title }}
      </div>

      <div class="book-list-item__meta">
        <span v-if="item.author">{{ $t("common.author") }}: {{ item.author }}</span>
        <span v-if="item.publisher"> | {{ $t("common.publisher") }}: {{ item.publisher }}</span>
        <span v-if="item.year"> | {{ $t("common.year") }}: {{ item.year }}</span>
      </div>
    </div>

    <div class="book-list-item__side">
      <AppCheckbox
        :model-value="selected"
        @update:model-value="$emit('toggle-select')"
      />
      <div class="book-list-item__availability">
        {{ availabilityText }} {{ $t("home.availability") }}
      </div>
      <Button
        :label="$t('home.show_details')"
        severity="secondary"
        outlined
        size="small"
        @click="goToBook"
      />
    </div>
  </div>
</template>