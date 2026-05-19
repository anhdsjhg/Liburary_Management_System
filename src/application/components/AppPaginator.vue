<script setup lang="ts">
/**
 * Fix: @/shared/types/table → relative ../types/table
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaginationMeta } from '../types/table'

interface Props {
  meta: PaginationMeta
  page: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const { t } = useI18n()
const jumpInput = ref('')

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
</script>

<template>
  <div class="app-paginator" role="navigation" :aria-label="t('pagination')">
    <span class="app-paginator__summary">
      {{
        t('showing_pages', {
          total: meta.total,
          from: meta.from ?? 0,
          to: meta.to ?? 0,
        })
      }}
    </span>

    <div class="app-paginator__controls">
      <button
        type="button"
        class="app-paginator__btn"
        :disabled="page <= 1"
        :aria-label="t('previous_page')"
        @click="navigate(page - 1)"
      >
        <i class="bi bi-chevron-left" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="app-paginator__btn"
        :disabled="page >= meta.last_page"
        :aria-label="t('next_page')"
        @click="navigate(page + 1)"
      >
        <i class="bi bi-chevron-right" aria-hidden="true" />
      </button>

      <form class="app-paginator__jump" @submit.prevent="jump">
        <input
          v-model="jumpInput"
          type="number"
          class="app-paginator__jump-input"
          :placeholder="t('page')"
          :min="1"
          :max="meta.last_page"
          :aria-label="t('go_to_page')"
        />
        <button type="submit" class="app-paginator__jump-btn">
          {{ t('move_to') }}
        </button>
      </form>

      <span class="app-paginator__counter" aria-live="polite">
        {{ t('page_num', { num: page, last: meta.last_page }) }}
      </span>
    </div>
  </div>
</template>