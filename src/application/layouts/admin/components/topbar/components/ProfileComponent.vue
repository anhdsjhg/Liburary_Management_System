<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/application/stores/auth.store";
import { useAuthLogout } from "@/modules/auth/components/login/composables/useAuthLogin";
import LoginDialog from "@/modules/auth/components/login/LoginDialog.vue";

const authStore = useAuthStore();
const { user, userDisplayName } = storeToRefs(authStore);
const { loginVisible } = storeToRefs(authStore);
const { submitLogout } = useAuthLogout();

const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const showLogoutConfirm = ref(false);

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    menuOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

function openLogoutConfirm() {
  menuOpen.value = false;
  showLogoutConfirm.value = true;
}

function confirmLogout() {
  showLogoutConfirm.value = false;
  submitLogout();
}
</script>

<template>
  <template v-if="user">
    <div
      ref="menuRef"
      class="admin-profile"
      @click="menuOpen = !menuOpen"
    >
      <Avatar icon="pi pi-user" shape="circle" size="small" />
      <span class="admin-profile__name">{{ userDisplayName }}</span>
      <i class="pi" :class="menuOpen ? 'pi-angle-up' : 'pi-angle-down'" />

      <div v-if="menuOpen" class="admin-profile__dropdown">
        <div class="admin-profile__dropdown-header">
          <span class="admin-profile__dropdown-name">{{ userDisplayName }}</span>
          <span class="admin-profile__dropdown-username">{{ user.username }}</span>
        </div>
        <div class="admin-profile__dropdown-divider" />
        <a
          class="admin-profile__dropdown-item admin-profile__dropdown-item--danger"
          @click.stop="openLogoutConfirm"
        >
          <i class="pi pi-sign-out" />
          {{ $t("defaultLayout.topbar.profile.logout") }}
        </a>
      </div>
    </div>

    <Dialog
      v-model:visible="showLogoutConfirm"
      :header="$t('defaultLayout.topbar.profile.logout')"
      :modal="true"
      :draggable="false"
      :style="{ width: '22rem' }"
    >
      <p class="logout-confirm__message">
        {{ $t("defaultLayout.topbar.profile.logout_confirm") }}
      </p>
      <template #footer>
        <Button
          :label="$t('common.cancel')"
          severity="secondary"
          text
          @click="showLogoutConfirm = false"
        />
        <Button
          :label="$t('defaultLayout.topbar.profile.logout')"
          severity="danger"
          icon="pi pi-sign-out"
          @click="confirmLogout"
        />
      </template>
    </Dialog>
  </template>

  <template v-else>
    <Button type="button" @click="loginVisible = true">
      {{ $t("defaultLayout.topbar.profile.login") }}
    </Button>
  </template>

  <LoginDialog />
</template>

<style scoped>
.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--surface-border);
  background: var(--surface-card);
  position: relative;
  user-select: none;
}

.admin-profile__name {
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 480px) {
    display: none;
  }
}

.admin-profile__dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 14rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 200;
  overflow: hidden;
}

.admin-profile__dropdown-header {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.admin-profile__dropdown-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-profile__dropdown-username {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.admin-profile__dropdown-divider {
  height: 1px;
  background: var(--surface-border);
}

.admin-profile__dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--text-color);
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--surface-hover);
  }

  &--danger {
    color: var(--red-500);

    &:hover {
      background: var(--red-50);
    }
  }
}

.logout-confirm__message {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
