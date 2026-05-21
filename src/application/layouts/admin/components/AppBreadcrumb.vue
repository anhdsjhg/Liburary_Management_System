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
  <nav v-if="!shouldHideBreadcrumb" class="mb-12 flex items-center" style="gap: 12px">
    <Button
      class="size-[25px]"
      :disabled="!canGoBack"
      @click="goBack"
    >
      <i class="pi pi-chevron-left text-xs font-bold" />
    </Button>

    <div class="flex items-center" style="gap: 10px">
      <router-link :to="home.to" style="color: inherit">
        <i :class="home.icon" />
      </router-link>

      <template v-if="breadcrumbs.length">
        <span style="color: var(--text-color-secondary)">/</span>

        <template v-for="(breadcrumb, i) in breadcrumbs" :key="i">
          <router-link
            :to="{ path: breadcrumb.link ?? '', query: $route.query }"
            style="color: inherit"
          >
            {{ $t(breadcrumb.name) }}
          </router-link>
          <span
            v-if="i !== breadcrumbs.length - 1"
            style="color: var(--text-color-secondary)"
          >
            /
          </span>
        </template>
      </template>
    </div>
  </nav>
</template>
