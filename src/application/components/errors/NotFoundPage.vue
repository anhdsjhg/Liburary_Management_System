<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="error-page">
    <i class="pi pi-search error-page__icon" />
    <h1 class="error-page__code">404</h1>
    <p class="error-page__message">{{ $t("common.notFound") }}</p>
    <Button :label="$t('common.goHome')" icon="pi pi-home" @click="router.push('/')" />
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  text-align: center;
}

.error-page__icon {
  font-size: 4rem;
  color: var(--blue-400);
}

.error-page__code {
  font-size: 5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
}

.error-page__message {
  font-size: 1.1rem;
  color: var(--text-color-secondary);
  margin: 0;
  max-width: 28rem;
}
</style>
