<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/application/layouts/public/PublicLayout.vue'
import { Toast } from 'primevue'

const route = useRoute()

const isPublicLayout = computed(() => route.meta?.layout === 'public')

</script>

<template>
  <PublicLayout v-if="isPublicLayout">
    <router-view />
  </PublicLayout>
  <router-view v-else />
  <Toast />
</template>
