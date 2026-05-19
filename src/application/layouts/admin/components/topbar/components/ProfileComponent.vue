<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/application/stores/auth.store";
import { useAuthLogout } from "@/modules/auth/components/login/composables/useAuthLogin";
import LoginDialog from "@/modules/auth/components/login/LoginDialog.vue";

const authStore = useAuthStore();
const { user, userDisplayName } = storeToRefs(authStore);
const { submitLogout } = useAuthLogout();

const { loginVisible } = storeToRefs(authStore);

</script>

<template>
  <template v-if="user">
    <button
      v-styleclass="{
        selector: '@next',
        enterFromClass: 'hidden',
        enterActiveClass: 'animate-scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'animate-fadeout',
        hideOnOutsideClick: true,
      }"
      class="topbar-profile-button"
      type="button"
    >
      <Avatar
        icon="pi pi-user"
        class="me-3"
        size="large"
        shape="circle"
      />

      <span class="profile-details">
        <span class="profile-name">{{ userDisplayName }}</span>
        <span class="profile-job">{{ user.username }}</span>
      </span>

      <i class="pi pi-angle-down" />
    </button>

    <ul
      class="absolute right-0 top-auto m-0 mt-2 hidden w-full origin-top list-none rounded-border bg-surface-0 p-4 shadow sm:w-48 dark:bg-surface-900"
    >
      <li>
        <a
          class="flex cursor-pointer items-center rounded-border p-2 transition-colors duration-150 hover:bg-emphasis"
          @click="submitLogout"
        >
          <i class="pi pi-power-off !mr-4" />
          <span class="hidden sm:inline">
            {{ $t("defaultLayout.topbar.profile.logout") }}
          </span>
        </a>
      </li>
    </ul>
  </template>

  <template v-else>
    <Button type="button" @click="loginVisible = true">
      {{ $t("defaultLayout.topbar.profile.login") }}
    </Button>
  </template>

  <LoginDialog />
</template>