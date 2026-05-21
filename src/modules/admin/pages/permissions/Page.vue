<script setup lang="ts">
import { onMounted } from "vue";
import { usePermissionsPage } from "./composables/useComposable";
import PermissionsTable from "./components/permissionsTable/PermissionsTable.vue";

const {
  modules,
  modulesLoading,
  selectedModuleId,
  userType,
  searchQuery,
  currentPage,
  users,
  total,
  perPage,
  lastPage,
  isLoading,
  onModuleSelect,
  onTypeChange,
  onSearch,
  load,
  goToControl,
} = usePermissionsPage();

onMounted(() => load(1));
</script>

<template>
  <div class="admin-permissions-page">
    <div class="admin-permissions-page__header">
      <span class="admin-permissions-page__title">
        {{ $t("admin.permissions") }}
      </span>
    </div>

    <div class="admin-permissions-page__body">
      <!-- Module sidebar -->
      <div class="admin-permissions-page__sidebar">
        <div class="admin-permissions-page__sidebar-label">
          {{ $t("admin.searchByModule") }}
        </div>

        <Skeleton v-if="modulesLoading" height="12rem" />
        <div v-else class="admin-permissions-page__module-list">
          <div
            class="admin-permissions-page__module-item"
            :class="{ 'admin-permissions-page__module-item--active': selectedModuleId === null }"
            @click="onModuleSelect(null)"
          >
            {{ $t("admin.allUsers") }}
          </div>
          <div
            v-for="mod in modules"
            :key="mod.id"
            class="admin-permissions-page__module-item"
            :class="{ 'admin-permissions-page__module-item--active': selectedModuleId === mod.id }"
            @click="onModuleSelect(mod.id)"
          >
            {{ $t(mod.route_name, 1) }}
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="admin-permissions-page__main">
        <!-- Search controls (only when no module filter) -->
        <div v-if="selectedModuleId === null" class="admin-permissions-page__search">
          <div class="admin-permissions-page__type-toggle">
            <Button
              :label="$t('admin.userType.employee')"
              :severity="userType === 'employee' ? 'primary' : 'secondary'"
              outlined
              size="small"
              @click="onTypeChange('employee')"
            />
            <Button
              :label="$t('admin.userType.student')"
              :severity="userType === 'student' ? 'primary' : 'secondary'"
              outlined
              size="small"
              @click="onTypeChange('student')"
            />
          </div>

          <div class="admin-permissions-page__search-row">
            <InputText
              v-model="searchQuery"
              :placeholder="$t('admin.searchUsers')"
              class="admin-permissions-page__search-input"
              @keydown.enter="onSearch"
            />
            <Button
              :label="$t('admin.search')"
              icon="pi pi-search"
              @click="onSearch"
            />
          </div>
        </div>

        <PermissionsTable
          :users="users"
          :is-loading="isLoading"
          :current-page="currentPage"
          :total="total"
          :per-page="perPage"
          :last-page="lastPage"
          @update:page="load"
          @manage="goToControl"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-permissions-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-permissions-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-permissions-page__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.admin-permissions-page__body {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.admin-permissions-page__sidebar {
  width: 13rem;
  flex-shrink: 0;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.admin-permissions-page__sidebar-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color-secondary);
  margin-bottom: 0.75rem;
}

.admin-permissions-page__module-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-permissions-page__module-item {
  padding: 0.4rem 0.6rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-color);
  transition: background 0.15s;

  &:hover {
    background: var(--surface-hover);
  }

  &--active {
    background: var(--primary-color);
    color: var(--primary-color-text);

    &:hover {
      background: var(--primary-color);
    }
  }
}

.admin-permissions-page__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-permissions-page__search {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.admin-permissions-page__type-toggle {
  display: flex;
  gap: 0.5rem;
}

.admin-permissions-page__search-row {
  display: flex;
  gap: 0.5rem;
}

.admin-permissions-page__search-input {
  flex: 1;
}
</style>
