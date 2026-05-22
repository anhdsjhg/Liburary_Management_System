<template>
  <div class="layout-topbar">
    <router-link to="/" class="app-logo">
      <img alt="app logo" :src="logo" />
    </router-link>

    <button
      ref="menubutton"
      class="topbar-menubutton"
      type="button"
      @click="toggleMenu"
    >
      <span></span>
    </button>

    <ul class="topbar-menu"></ul>

    <div class="topbar-actions">
      <LocaleSelector />
      <ToggleConfigComponent />
      <SearchComponent />
      <div class="topbar-profile">
        <ProfileComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useLayout } from "@/application/layouts/admin/composables/useLayout";
import LocaleSelector from "./components/LocaleSelector.vue";
import ProfileComponent from "./components/ProfileComponent.vue";
import SearchComponent from "./components/SearchComponent.vue";
import ToggleConfigComponent from "./components/ToggleConfigComponent.vue";
import logoDark from '@/application/assets/images/logo.png'
import logoLight from '@/application/assets/images/logo_black.png'

const { toggleMenu, layoutConfig, isDarkTheme } = useLayout();

const logo = computed(() => {
  if (isDarkTheme.value || layoutConfig.value.layoutTheme === "primaryColor") {
    return logoDark;
  }
  return logoLight;
});

</script>