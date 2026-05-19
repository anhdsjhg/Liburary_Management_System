<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/application/stores/auth.store";
import { EPermissions } from "@/application/enums/permissions";
import type { TBreadcrumb } from "@/application/router/types/route-meta.types";

defineProps({
  variant: {
    type: String,
    default: "light",
  },
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isAdmin, hasModule } = storeToRefs(authStore);

const home = {
  icon: "bi bi-house-door-fill",
  to: "/",
};

const breadcrumbs = computed<TBreadcrumb[]>(
  () => (route.meta.breadcrumbs ?? []) as TBreadcrumb[]
);

const canGoBack = computed(() => window.history.length > 1);

const shouldHideBreadcrumb = computed(
  () =>
    route.name === "profile/main/positions" &&
    !hasModule.value(EPermissions.admin)
);

function goBack(): void {
  if (canGoBack.value) {
    router.back();
  }
}
</script>

<template>
  <nav v-if="!shouldHideBreadcrumb" class="mb-12 flex items-center">
    <Button
      class="mr-6 size-[25px]"
      :disabled="!canGoBack"
      @click="goBack"
    >
      <i class="pi pi-chevron-left text-xs font-bold" />
    </Button>

    <ol class="flex items-center gap-4">
      <li>
        <router-link :to="home.to" style="color: inherit">
          <i :class="home.icon" />
        </router-link>
      </li>

      <li class="layout-breadcrumb-chevron">/</li>

      <template v-if="breadcrumbs.length">
        <template v-for="(breadcrumb, i) in breadcrumbs" :key="i">
          <router-link :to="{ path: breadcrumb.link ?? '', query: $route.query }">
            {{ $t(breadcrumb.name) }}
          </router-link>
          <span v-if="i !== breadcrumbs.length - 1">/</span>
        </template>
      </template>
    </ol>
  </nav>
</template>