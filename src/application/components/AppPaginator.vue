<script setup lang="ts">
/**
 * Fix: @/shared/types/table → relative ../types/table
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaginationMeta } from '../types/table'

interface Props {
  meta: PaginationMeta
  page: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const { t } = useI18n()
const jumpInput = ref<string>('')

function navigate(n: number) {
  const clamped = Math.max(1, Math.min(n, props.meta.last_page))
  if (clamped !== props.page) emit('update:page', clamped)
}

function jump() {
  const n = parseInt(jumpInput.value, 10)
  if (!isNaN(n)) {
    navigate(n)
    jumpInput.value = ''
  }
}

const visiblePages = computed<(number | '...')[]>(() => {
  const total = props.meta.last_page
  const cur = props.page

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (cur > 3) pages.push('...')

  const start = Math.max(2, cur - 2)
  const end = Math.min(total - 1, cur + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  if (cur < total - 2) pages.push('...')

  pages.push(total)
  return pages
})
</script>

<template>
  <div class="app-paginator" role="navigation" :aria-label="t('pagination')">
    <div class="app-paginator__pages">
      <button
        type="button"
        class="app-paginator__btn"
        :disabled="page <= 1"
        :aria-label="t('previous_page')"
        @click="navigate(page - 1)"
      >
        <i class="pi pi-chevron-left" />
      </button>

      <template v-for="(p, i) in visiblePages" :key="i">
        <span v-if="p === '...'" class="app-paginator__ellipsis">…</span>
        <button
          v-else
          type="button"
          class="app-paginator__page"
          :class="{ 'app-paginator__page--active': p === page }"
          @click="navigate(p)"
        >
          {{ p }}
        </button>
      </template>

      <button
        type="button"
        class="app-paginator__btn"
        :disabled="page >= meta.last_page"
        :aria-label="t('next_page')"
        @click="navigate(page + 1)"
      >
        <i class="pi pi-chevron-right" />
      </button>
    </div>

    <form class="app-paginator__jump" @submit.prevent="jump">
      <span class="app-paginator__jump-label">{{ t('common.move_to') }} :</span>
      <input
        v-model="jumpInput"
        type="number"
        class="app-paginator__jump-input"
        :min="1"
        :max="meta.last_page"
        :aria-label="t('go_to_page')"
      />
      <button type="submit" class="app-paginator__jump-btn" :aria-label="t('go_to_page')">
        <i class="pi pi-arrow-right" />
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.app-paginator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 0;

  &__pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__btn,
  &__page {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.4rem;
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    background: var(--surface-card);
    color: var(--text-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;

    i {
      font-size: 0.75rem;
    }

    &:hover:not(:disabled):not(.app-paginator__page--active) {
      border-color: var(--bsp-primary, #381f6e);
      color: var(--bsp-primary, #381f6e);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__page--active {
    border-color: var(--bsp-primary, #381f6e);
    color: var(--bsp-primary, #381f6e);
    font-weight: 700;
    cursor: default;
  }

  &__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
    color: var(--text-color-secondary);
    user-select: none;
  }

  &__jump {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__jump-label {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
  }

  &__jump-input {
    width: 3.5rem;
    height: 2rem;
    padding: 0 0.4rem;
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    background: var(--surface-card);
    color: var(--text-color);
    font-size: 0.875rem;
    text-align: center;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--bsp-primary, #381f6e);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }

  &__jump-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    background: var(--surface-card);
    color: var(--text-color);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;

    i {
      font-size: 0.75rem;
    }

    &:hover {
      border-color: var(--bsp-primary, #381f6e);
      color: var(--bsp-primary, #381f6e);
    }
  }
}
</style>
