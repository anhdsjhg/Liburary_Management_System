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

defineEmits<{
  (e: "toggle-select"): void;
}>();

const router = useRouter();

const imageUrl = computed(() => props.item.image ?? ASSETS.NO_COVER);

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
    class="book-list-item"
    :class="{ 'book-list-item--selected': selected }"
  >
    <div class="book-list-item__select" @click.stop>
      <AppCheckbox
        :model-value="selected"
        @update:model-value="$emit('toggle-select')"
      />
    </div>

    <div
      class="book-list-item__image"
      :style="{ backgroundImage: `url(${imageUrl})` }"
      @click="goToBook"
    />

    <div class="book-list-item__body">
      <div class="book-list-item__badges">
        <span v-if="item.type" class="book-list-item__badge book-list-item__badge--type">
          {{ $t(item.type) }}
        </span>
        <span v-if="item.call_number" class="book-list-item__badge">
          {{ item.call_number }}
        </span>
        <span v-if="item.location" class="book-list-item__badge">
          <i class="pi pi-map-marker" />
          {{ item.location }}
        </span>
      </div>

      <h3 class="book-list-item__title" @click="goToBook">
        {{ item.title }}
      </h3>

      <dl class="book-list-item__meta">
        <template v-if="item.author">
          <dt>{{ $t("common.author") }}</dt>
          <dd>{{ item.author }}</dd>
        </template>
        <template v-if="item.publisher">
          <dt>{{ $t("common.publisher") }}</dt>
          <dd>{{ item.publisher }}</dd>
        </template>
        <template v-if="item.year">
          <dt>{{ $t("common.year") }}</dt>
          <dd>{{ item.year }}</dd>
        </template>
      </dl>
    </div>

    <div class="book-list-item__side">
      <div
        class="book-list-item__availability"
        :class="{ 'book-list-item__availability--out': !isAvailable }"
      >
        <i :class="isAvailable ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
        <span class="book-list-item__availability-value">{{ availabilityText }}</span>
        <span class="book-list-item__availability-label">
          {{ $t("home.availability") }}
        </span>
      </div>

      <Button
        :label="$t('home.show_details')"
        icon="pi pi-arrow-right"
        icon-pos="right"
        severity="secondary"
        outlined
        size="small"
        class="book-list-item__action"
        @click="goToBook"
      />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.book-list-item {
  display: grid;
  grid-template-columns: auto 110px 1fr auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    border-color: var(--bsp-primary, #381f6e);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &--selected {
    border-color: var(--bsp-primary, #381f6e);
    box-shadow: 0 0 0 2px rgba(56, 31, 110, 0.12);
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 80px 1fr;
    grid-template-areas:
      "select image body"
      "side   side  side";
    gap: 0.85rem;

    .book-list-item__select { grid-area: select; }
    .book-list-item__image  { grid-area: image; }
    .book-list-item__body   { grid-area: body; }
    .book-list-item__side {
      grid-area: side;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--surface-border);
    }
  }

  &__select {
    align-self: flex-start;
  }

  &__image {
    width: 110px;
    height: 150px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    background-color: var(--surface-ground);
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.03);
    }

    @media (max-width: 768px) {
      width: 80px;
      height: 110px;
    }
  }

  &__body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.55rem;
    background: var(--surface-ground);
    color: var(--text-color-secondary);
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;

    i {
      font-size: 0.65rem;
    }

    &--type {
      background: rgba(56, 31, 110, 0.08);
      color: var(--bsp-primary, #381f6e);
    }
  }

  &__title {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-color);
    line-height: 1.35;
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

  &__meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.5rem;
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-color-secondary);

    dt {
      font-weight: 600;
      color: var(--text-color-secondary);
      opacity: 0.75;
    }

    dd {
      margin: 0;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.85rem;
    flex-shrink: 0;
  }

  &__availability {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    background: rgba(31, 138, 91, 0.08);
    color: #1f8a5b;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;

    &--out {
      background: rgba(192, 57, 43, 0.08);
      color: #c0392b;
    }
  }

  &__availability-value {
    font-weight: 700;
  }

  &__availability-label {
    opacity: 0.75;
    font-weight: 500;

    @media (max-width: 480px) {
      display: none;
    }
  }

  &__action {
    min-width: 9rem;
  }
}
</style>
