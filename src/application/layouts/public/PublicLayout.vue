<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/application/stores/auth.store";
import { storeToRefs } from "pinia";
import { useAuthLogout } from "@/modules/auth/components/login/composables/useAuthLogin";
import { EPermissions } from "@/application/enums/permissions";
import LoginDialog from "@/modules/auth/components/login/LoginDialog.vue";
import { RouteNames } from "@/application/router/routeNames";

const { locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { user, userDisplayName, loginVisible } = storeToRefs(authStore);
const { submitLogout } = useAuthLogout();

const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const showLogoutConfirm = ref(false);

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

const hasAdminAccess = computed(() => authStore.moduleRouteNames?.length > 0);

function goToAdmin() {
  userMenuOpen.value = false;
  const modules = authStore.moduleRouteNames;
  if (modules.includes(EPermissions.batches)) router.push("/admin/acquisition/acts");
  else if (modules.includes(EPermissions.serviceDesk)) router.push("/admin/service-desk/users");
  else if (modules.includes(EPermissions.cataloging)) router.push("/admin/cataloging/search");
  else if (modules.includes(EPermissions.report)) router.push("/admin/reports/inventory-books");
  else if (modules.includes(EPermissions.website)) router.push("/admin/settings/announcements");
  else if (modules.includes(EPermissions.admin)) router.push("/admin/permissions");
}

function openLogoutConfirm() {
  userMenuOpen.value = false;
  showLogoutConfirm.value = true;
}

function confirmLogout() {
  showLogoutConfirm.value = false;
  submitLogout();
}

const locales = [
  { label: "EN", value: "en" },
  { label: "RU", value: "ru" },
  { label: "KZ", value: "kz" },
];
</script>

<template>
  <div class="public-layout">
    <header class="public-layout__header">
      <div class="public-layout__header-inner">
        <router-link to="/" class="public-layout__logo">
          <img
            src="@/application/assets/images/logo_horizontal.png"
            alt="SDU Library"
            class="public-layout__logo-img"
          />
        </router-link>

        <div class="public-layout__header-actions">
          <Select
            v-model="locale"
            :options="locales"
            option-label="label"
            option-value="value"
            class="public-layout__lang-select"
          />

          <div
            v-if="user"
            ref="userMenuRef"
            class="public-layout__user-menu"
            @click="userMenuOpen = !userMenuOpen"
          >
            <Avatar icon="pi pi-user" shape="circle" size="small" />
            <span class="public-layout__user-name">{{ userDisplayName }}</span>
            <i class="pi" :class="userMenuOpen ? 'pi-angle-up' : 'pi-angle-down'" />

            <div v-if="userMenuOpen" class="public-layout__user-dropdown">
              <div class="public-layout__user-dropdown-header">
                <span class="public-layout__user-dropdown-name">{{ userDisplayName }}</span>
                <span class="public-layout__user-dropdown-username">{{ user.username }}</span>
              </div>
              <div class="public-layout__user-dropdown-divider" />
              <RouterLink
                class="public-layout__user-dropdown-item"
                :to="{ name: RouteNames.WEBSITE_MY_BOOKS }"
                @click.stop="userMenuOpen = false"
              >
                <i class="pi pi-book" />
                {{ $t("home.my_books") }}
              </RouterLink>
              <a
                v-if="hasAdminAccess"
                class="public-layout__user-dropdown-item"
                @click.stop="goToAdmin"
              >
                <i class="pi pi-th-large" />
                {{ $t("home.admin_panel") }}
              </a>
              <a
                class="public-layout__user-dropdown-item public-layout__user-dropdown-item--danger"
                @click.stop="openLogoutConfirm"
              >
                <i class="pi pi-sign-out" />
                {{ $t("home.logout") }}
              </a>
            </div>
          </div>

          <Button
            v-else
            :label="$t('home.login')"
            icon="pi pi-sign-in"
            size="small"
            @click="loginVisible = true"
          />
        </div>
      </div>
    </header>
    <main class="public-layout__main">
      <slot />
    </main>

    <LoginDialog />

    <Dialog
      v-model:visible="showLogoutConfirm"
      :header="$t('home.logout')"
      :modal="true"
      :draggable="false"
      :style="{ width: '22rem' }"
    >
      <p class="logout-confirm__message">
        {{ $t("home.logout_confirm") }}
      </p>
      <template #footer>
        <Button
          :label="$t('common.cancel')"
          severity="secondary"
          text
          @click="showLogoutConfirm = false"
        />
        <Button
          :label="$t('home.logout')"
          severity="danger"
          icon="pi pi-sign-out"
          @click="confirmLogout"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.public-layout {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
}

.public-layout__header {
  background: rgba(255, 255, 255, 0.95);
  width: 100%;
  margin: 0;
  padding: 0;
}

.public-layout__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  max-width: 1600px;
  margin: 0 auto;
  height: 5rem;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    padding: 0 1.25rem;
    height: 4rem;
  }
}

.public-layout__logo-img {
  height: 5rem;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 3.25rem;
  }
}

.public-layout__header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
}

.public-layout__lang-select {
  width: auto !important;
  min-width: 5rem;
}

.public-layout__user-menu {
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

.public-layout__user-name {
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 480px) {
    display: none;
  }
}

.public-layout__user-dropdown {
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

.public-layout__user-dropdown-header {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.public-layout__user-dropdown-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.public-layout__user-dropdown-username {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.public-layout__user-dropdown-divider {
  height: 1px;
  background: var(--surface-border);
}

.public-layout__user-dropdown-item {
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

.public-layout__main {
  flex: 1;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
}

.logout-confirm__message {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>