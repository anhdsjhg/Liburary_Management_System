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

<style scoped>
.app-skeleton--table {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  border: 1px solid var(--p-datatable-border-color, #e2e8f0);
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0.5rem;
  background: var(--p-datatable-header-background, #fff);
}

.app-skeleton__head,
.app-skeleton__row {
  display: flex;
  gap: 0.5rem;
}

.app-skeleton__head .app-skeleton__cell {
  border-radius: 0.25rem;
}

.app-skeleton__row .app-skeleton__cell {
  border-radius: 0.25rem;
}

.app-skeleton__cell {
  flex: 1;
}

.app-skeleton--form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-skeleton__form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>