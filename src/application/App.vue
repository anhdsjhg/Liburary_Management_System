<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/application/layouts/public/PublicLayout.vue'
import AdminLayout from '@/application/layouts/admin/AdminLayout.vue'
import AuthLayout from '@/application/layouts/auth/AuthLayout.vue'
import EmptyLayout from '@/application/layouts/empty/EmptyLayout.vue'
import { Toast } from 'primevue'

const route = useRoute()

const layout = computed(() => {
  const name = (route.meta?.layout as string) || 'default'
  const layouts: Record<string, any> = {
    default: PublicLayout,
    public: PublicLayout,
    admin: AdminLayout,
    auth: AuthLayout,
    empty: EmptyLayout
  }
  return layouts[name] || PublicLayout
})
</script>

<template>
  <router-view />
  <Toast />
</template>
