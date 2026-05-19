<template>
  <div class="layout-container" :class="containerClass">
    <AppTopbar></AppTopbar>
    <AppSidebar></AppSidebar>
    <div class="layout-content-wrapper">
      <div class="layout-content">
        <div class="layout-content-inner">
          <AppBreadcrumb></AppBreadcrumb>
          <router-view />
        </div>
      </div>
    </div>
    <AppConfig></AppConfig>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from "./composables/useLayout";
import { containerClass } from "./consts/containerClass";
import AppTopbar from "./components/topbar/AppTopbar.vue";
import AppSidebar from "./components/AppSidebar.vue";
import AppBreadcrumb from "./components/AppBreadcrumb.vue";
import AppConfig from "./components/AppConfig.vue";

const { layoutState, isSidebarActive } = useLayout();
</script>