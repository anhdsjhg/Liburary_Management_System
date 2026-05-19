<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

interface Props {
  variant?: 'table' | 'form' | 'card'
  rows?: number
  cols?: number
}

withDefaults(defineProps<Props>(), { variant: 'table', rows: 6, cols: 4 })
</script>

<template>
  <div v-if="variant === 'table'" class="app-skeleton app-skeleton--table">
    <div class="app-skeleton__head">
      <Skeleton v-for="c in cols" :key="c" height="2.5rem" class="app-skeleton__cell" />
    </div>
    <div v-for="r in rows" :key="r" class="app-skeleton__row">
      <Skeleton v-for="c in cols" :key="c" height="2rem" class="app-skeleton__cell" />
    </div>
  </div>

  <div v-else-if="variant === 'form'" class="app-skeleton app-skeleton--form">
    <div v-for="r in rows" :key="r" class="app-skeleton__form-field">
      <Skeleton width="6rem" height="0.875rem" class="mb-1" />
      <Skeleton height="2.25rem" />
    </div>
  </div>

  <div v-else class="app-skeleton app-skeleton--card">
    <Skeleton height="100%" />
  </div>
</template>