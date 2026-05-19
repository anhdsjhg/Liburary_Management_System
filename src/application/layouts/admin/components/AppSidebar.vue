<script setup lang="ts">
import { storeToRefs } from "pinia";
import { menuItems, type AppMenuItemType } from "@/application/constants/menuItems";
import { useAuthStore } from "@/application/stores/auth.store";
import AppMenuItem from "./AppMenuItem.vue";

const authStore = useAuthStore();
const { user, hasModule } = storeToRefs(authStore);

function canSeeItem(item: AppMenuItemType): boolean {
  if (!item.permission) return true;
  if (!user.value) return false;
  return hasModule.value(item.permission);
}
</script>

<template>
  <div class="layout-sidebar">
    <div class="layout-menu-container">
      <ul class="layout-menu flex flex-col">
        <template v-for="(item, i) in menuItems" :key="i">
          <AppMenuItem :item="item" root :index="i" />
        </template>
      </ul>
    </div>
  </div>
</template>