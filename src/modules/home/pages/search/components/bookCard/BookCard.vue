<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { MediaSearchItem } from "@/api/media/search/get/types";
import { AppCheckbox } from "@/application/components";
import { ASSETS } from "@/application/configs/constants";
import { RouteNames } from "@/application/router/routeNames";
import { buildBackendImageUrl } from "@/application/utils/urls";

const props = defineProps<{
  item: MediaSearchItem;
  selected: boolean;
}>();

defineEmits<{
  (e: "toggle-select"): void;
}>();

const router = useRouter();

const imageUrl = computed(() => buildBackendImageUrl(props.item.image) ?? ASSETS.NO_COVER);



const availabilityText = computed(
  () => `${props.item.available ?? 0} / ${props.item.total ?? 0}`
);

const isAvailable = computed(() => (props.item.available ?? 0) > 0);

function goToBook() {
  router.push({
    name: RouteNames.WEBSITE_BOOK,
    params: { id: props.item.id },
  });
}
</script>

<template>
  <article
    class="book-card"
    :class="{ 'book-card--selected': selected }"
  >
    <div class="book-card__media" @click="goToBook">
      <div
        class="book-card__image"
        :style="{ backgroundImage: `url(${imageUrl})` }"
      />

      <div class="book-card__checkbox" @click.stop>
        <AppCheckbox
          :model-value="selected"
          @update:model-value="$emit('toggle-select')"
        />
      </div>

      <div
        v-if="item.location || item.call_number"
        class="book-card__badges"
      >
        <span v-if="item.location" class="book-card__badge">
          <i class="pi pi-map-marker" />
          {{ item.location }}
        </span>
        <span v-if="item.call_number" class="book-card__badge">
          {{ item.call_number }}
        </span>
      </div>

      <span
        class="book-card__availability-pill"
        :class="{ 'book-card__availability-pill--out': !isAvailable }"
      >
        <i :class="isAvailable ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
        {{ availabilityText }}
      </span>
    </div>

    <div class="book-card__body">
      <h3 class="book-card__title" @click="goToBook">{{ item.title }}</h3>
      <p v-if="item.author" class="book-card__author">{{ item.author }}</p>
      <p v-if="item.year" class="book-card__year">{{ item.year }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.book-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    border-color: var(--bsp-primary, #381f6e);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);

    .book-card__image {
      transform: scale(1.04);
    }
  }

  &--selected {
    border-color: var(--bsp-primary, #381f6e);
    box-shadow: 0 0 0 2px rgba(56, 31, 110, 0.12);
  }

  &__media {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    cursor: pointer;
    background: var(--surface-ground);
  }

  &__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.35s ease;
  }

  &__checkbox {
    position: absolute;
    top: 0.65rem;
    left: 0.65rem;
    z-index: 2;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 6px;
    padding: 0.15rem;
    backdrop-filter: blur(4px);
  }

  &__badges {
    position: absolute;
    top: 0.65rem;
    right: 0.65rem;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
    max-width: 70%;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.55rem;
    background: rgba(255, 255, 255, 0.92);
    color: var(--bsp-primary, #381f6e);
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    i {
      font-size: 0.65rem;
    }
  }

  &__availability-pill {
    position: absolute;
    left: 0.65rem;
    bottom: 0.65rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.6rem;
    background: rgba(255, 255, 255, 0.95);
    color: #1f8a5b;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    i {
      font-size: 0.75rem;
    }

    &--out {
      color: #c0392b;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    flex: 1;
  }

  &__title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
    line-height: 1.4;
    margin: 0;
    cursor: pointer;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.15s;

    &:hover {
      color: var(--bsp-primary, #381f6e);
    }
  }

  &__author {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__year {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    opacity: 0.85;
    margin: 0;
  }
}
</style>
