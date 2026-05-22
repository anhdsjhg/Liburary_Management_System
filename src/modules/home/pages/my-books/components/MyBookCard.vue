<script setup lang="ts">
import { computed } from "vue";
import { RouteNames } from "@/application/router/routeNames";

type Severity = "info" | "success" | "danger" | "warn" | "secondary";

const props = defineProps<{
  bookId?: number | string | null;
  title: string;
  author?: string;
  inv?: string;
  cover?: string;
  status?: string;
  statusLabel?: string;
  statusSeverity?: Severity;
  dates?: Array<{ label: string; value: string; danger?: boolean }>;
  history?: boolean;
  canRenew?: boolean;
  canCancel?: boolean;
  isRenewing?: boolean;
  isCanceling?: boolean;
}>();

const emit = defineEmits<{
  renew: [];
  cancel: [];
}>();

const linkTo = computed(() =>
  props.bookId
    ? { name: RouteNames.WEBSITE_BOOK, params: { id: props.bookId } }
    : null
);
</script>

<template>
  <article
    class="mb-book-card"
    :class="{ 'mb-book-card--history': history }"
  >
    <div class="mb-book-card__cover">
      <img v-if="cover" :src="cover" :alt="title" />
      <i v-else class="pi pi-book" />
    </div>

    <div class="mb-book-card__info">
      <router-link
        v-if="linkTo"
        :to="linkTo"
        class="mb-book-card__title"
      >{{ title }}</router-link>
      <h3
        v-else
        class="mb-book-card__title mb-book-card__title--plain"
      >{{ title }}</h3>

      <p v-if="author" class="mb-book-card__author">{{ author }}</p>
      <p v-if="inv" class="mb-book-card__inv">
        <i class="pi pi-tag" />
        {{ inv }}
      </p>
    </div>

    <dl v-if="dates && dates.length" class="mb-book-card__dates">
      <div
        v-for="row in dates"
        :key="row.label"
        class="mb-book-card__date-row"
        :class="{ 'mb-book-card__date-row--danger': row.danger }"
      >
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
    </dl>

    <div class="mb-book-card__right">
      <div v-if="statusLabel" class="mb-book-card__status">
        <Tag :value="statusLabel" :severity="statusSeverity" />
      </div>

      <div v-if="canRenew || canCancel" class="mb-book-card__actions">
        <Button
          v-if="canRenew"
          v-tooltip.top="$t('home.renew')"
          icon="pi pi-refresh"
          size="small"
          text
          severity="secondary"
          :loading="isRenewing"
          @click.prevent="emit('renew')"
        />
        <Button
          v-if="canCancel"
          v-tooltip.top="$t('home.cancel_reserve')"
          icon="pi pi-times-circle"
          size="small"
          text
          severity="danger"
          :loading="isCanceling"
          @click.prevent="emit('cancel')"
        />
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.mb-book-card {
  --mbc-primary: #381f6e;

  display: grid;
  grid-template-columns: 3.5rem 1fr auto auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    border-color: var(--mbc-primary);
    box-shadow: 0 8px 24px rgba(56, 31, 110, 0.08);
    transform: translateY(-2px);

    .mb-book-card__title:not(.mb-book-card__title--plain) {
      color: var(--mbc-primary);
    }
  }

  &--history { opacity: 0.85; }

  @media (max-width: 768px) {
    grid-template-columns: 3rem 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.85rem 1rem;

    .mb-book-card__dates { grid-column: 2 / -1; grid-row: 2; }
    .mb-book-card__right { grid-row: 1; align-self: center; }
  }

  @media (max-width: 480px) {
    padding: 0.85rem 1rem;
  }

  &__cover {
    width: 3.5rem;
    height: 4.5rem;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(56,31,110,0.08), rgba(249,168,37,0.08));
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    img { width: 100%; height: 100%; object-fit: cover; }
    i { font-size: 1.25rem; color: var(--mbc-primary); opacity: 0.5; }

    @media (max-width: 768px) { width: 3rem; height: 4rem; }
  }

  &__info { min-width: 0; }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 700;
    font-size: 0.975rem;
    color: var(--text-color);
    text-decoration: none;
    line-height: 1.35;
    margin: 0;
    transition: color 0.15s;

    &--plain { cursor: default; }
  }

  &__author {
    font-size: 0.825rem;
    color: var(--text-color-secondary);
    margin: 0.25rem 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__inv {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: var(--text-color-secondary);
    margin: 0.35rem 0 0;
    padding: 0.15rem 0.5rem;
    background: var(--surface-ground);
    border-radius: 999px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    opacity: 0.85;

    i { font-size: 0.6rem; opacity: 0.6; }
  }

  &__dates {
    display: grid;
    grid-auto-rows: auto;
    gap: 0.4rem;
    margin: 0;
    font-size: 0.8rem;
    flex-shrink: 0;

    @media (max-width: 480px) { display: none; }
  }

  &__date-row {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;
    align-items: baseline;
    justify-content: flex-end;

    dt {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-color-secondary);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      opacity: 0.85;
    }

    dd {
      margin: 0;
      color: var(--text-color);
      font-weight: 500;
    }

    &--danger {
      dt, dd { color: #c0392b; font-weight: 700; }
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__status {
    :deep(.p-tag) {
      font-weight: 700;
      letter-spacing: 0.02em;
      border-radius: 999px;
      padding: 0.3rem 0.7rem;
    }
  }

  &__actions {
    display: flex;
    gap: 0.1rem;

    :deep(.p-button) {
      width: 2rem;
      height: 2rem;
      padding: 0;
    }
  }
}
</style>
