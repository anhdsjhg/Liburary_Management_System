<script setup lang="ts">
import { useControlPage } from "./composables/useComposable";

const {
  userId,

  giveModules,
  giveSelectedModuleId,
  stagedToGive,
  giveAvailablePermissions,
  availableLoading,
  giveLoading,
  giveSelectModule,
  stageForGiving,
  unstageFromGiving,
  giveChooseAll,
  saveGivePermissions,

  removeModules,
  removeSelectedModuleId,
  stagedToRemove,
  removeCurrentPermissions,
  visualizationLoading,
  deleteLoading,
  removeSelectModule,
  stageForRemoving,
  unstageFromRemoving,
  removeChooseAll,
  saveRemovePermissions,

  goBack,
} = useControlPage();
</script>

<template>
  <div class="control-page">
    <!-- Header -->
    <div class="control-page__header">
      <Button
        icon="pi pi-arrow-left"
        :label="$t('admin.backToList')"
        severity="secondary"
        outlined
        size="small"
        @click="goBack"
      />
      <span class="control-page__title">
        {{ $t("admin.managingUser") }}: <code>{{ userId }}</code>
      </span>
    </div>

    <!-- Tabs -->
    <Tabs value="give">
      <TabList>
        <Tab value="give">
          <i class="pi pi-plus-circle" style="margin-right: 0.4rem" />
          {{ $t("admin.addPermissions") }}
        </Tab>
        <Tab value="remove">
          <i class="pi pi-minus-circle" style="margin-right: 0.4rem" />
          {{ $t("admin.removePermissions") }}
        </Tab>
      </TabList>

      <!-- ══ ADD PERMISSIONS TAB ══ -->
      <TabPanel value="give">
        <Skeleton v-if="availableLoading" height="20rem" />
        <div v-else class="control-page__panel">
          <!-- Module sidebar -->
          <div class="control-page__sidebar">
            <div class="control-page__sidebar-label">{{ $t("admin.allModules") }}</div>
            <div
              v-for="mod in giveModules"
              :key="mod.id"
              class="control-page__module-item"
              :class="{ 'control-page__module-item--active': giveSelectedModuleId === mod.id }"
              @click="giveSelectModule(mod.id)"
            >
              {{ $t(mod.route_name, 1) }}
            </div>
          </div>

          <!-- Permissions area -->
          <div class="control-page__content">
            <!-- Staged pills -->
            <div class="control-page__staged-area">
              <div class="control-page__staged-pills">
                <span
                  v-for="(perm, i) in stagedToGive"
                  :key="perm.id"
                  class="control-page__pill control-page__pill--add"
                >
                  {{ perm.display_name }}
                  <i
                    class="pi pi-times control-page__pill-remove"
                    @click="unstageFromGiving(i)"
                  />
                </span>
                <span v-if="!stagedToGive.length" class="control-page__empty-hint">
                  {{ $t("admin.chooseModule") }}
                </span>
              </div>

              <div class="control-page__staged-actions">
                <Button
                  v-if="giveSelectedModuleId !== null"
                  :label="$t('admin.chooseAll')"
                  severity="secondary"
                  outlined
                  size="small"
                  :disabled="!giveAvailablePermissions.length"
                  @click="giveChooseAll"
                />
                <Button
                  :label="$t('admin.save')"
                  icon="pi pi-check"
                  size="small"
                  :loading="giveLoading"
                  :disabled="!stagedToGive.length"
                  @click="saveGivePermissions"
                />
              </div>
            </div>

            <!-- Available permissions -->
            <div class="control-page__available">
              <div class="control-page__available-label">
                {{ $t("admin.availableToAdd") }}
              </div>
              <div class="control-page__pill-list">
                <span
                  v-for="perm in giveAvailablePermissions"
                  :key="perm.id"
                  class="control-page__pill control-page__pill--neutral"
                  @click="stageForGiving(perm)"
                >
                  {{ perm.display_name }}
                  <i class="pi pi-plus control-page__pill-action" />
                </span>
                <span
                  v-if="giveSelectedModuleId !== null && !giveAvailablePermissions.length"
                  class="control-page__empty-hint"
                >
                  {{ $t("admin.noPermissions") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>

      <!-- ══ REMOVE PERMISSIONS TAB ══ -->
      <TabPanel value="remove">
        <Skeleton v-if="visualizationLoading" height="20rem" />
        <div v-else class="control-page__panel">
          <!-- Module sidebar -->
          <div class="control-page__sidebar">
            <div class="control-page__sidebar-label">{{ $t("admin.myModules") }}</div>
            <div
              v-for="mod in removeModules"
              :key="mod.id"
              class="control-page__module-item"
              :class="{ 'control-page__module-item--active': removeSelectedModuleId === mod.id }"
              @click="removeSelectModule(mod.id)"
            >
              {{ $t(mod.route_name, 1) }}
            </div>
            <div v-if="!removeModules.length" class="control-page__empty-hint">
              {{ $t("admin.noPermissions") }}
            </div>
          </div>

          <!-- Permissions area -->
          <div class="control-page__content">
            <!-- Staged to remove pills -->
            <div class="control-page__staged-area">
              <div class="control-page__staged-pills">
                <span
                  v-for="(perm, i) in stagedToRemove"
                  :key="perm.id"
                  class="control-page__pill control-page__pill--remove"
                >
                  {{ perm.display_name }}
                  <i
                    class="pi pi-times control-page__pill-remove"
                    @click="unstageFromRemoving(i)"
                  />
                </span>
                <span v-if="!stagedToRemove.length" class="control-page__empty-hint">
                  {{ $t("admin.chooseModule") }}
                </span>
              </div>

              <div class="control-page__staged-actions">
                <Button
                  v-if="removeSelectedModuleId !== null"
                  :label="$t('admin.chooseAll')"
                  severity="secondary"
                  outlined
                  size="small"
                  :disabled="!removeCurrentPermissions.length"
                  @click="removeChooseAll"
                />
                <Button
                  :label="$t('admin.save')"
                  icon="pi pi-check"
                  size="small"
                  severity="danger"
                  :loading="deleteLoading"
                  :disabled="!stagedToRemove.length"
                  @click="saveRemovePermissions"
                />
              </div>
            </div>

            <!-- Current permissions to move to staged -->
            <div class="control-page__available">
              <div class="control-page__available-label">
                {{ $t("admin.currentPermissions") }}
              </div>
              <div class="control-page__pill-list">
                <span
                  v-for="perm in removeCurrentPermissions"
                  :key="perm.id"
                  class="control-page__pill control-page__pill--neutral"
                  @click="stageForRemoving(perm)"
                >
                  {{ perm.display_name }}
                  <i class="pi pi-minus control-page__pill-action" />
                </span>
                <span
                  v-if="removeSelectedModuleId !== null && !removeCurrentPermissions.length"
                  class="control-page__empty-hint"
                >
                  {{ $t("admin.noPermissions") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </Tabs>
  </div>
</template>

<style scoped>
.control-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-page__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-page__title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
}

/* Two-column panel inside each tab */
.control-page__panel {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding-top: 1rem;
}

/* Sidebar */
.control-page__sidebar {
  width: 13rem;
  flex-shrink: 0;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-page__sidebar-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.control-page__module-item {
  padding: 0.4rem 0.6rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.875rem;
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

/* Main content */
.control-page__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Staged area (top box) */
.control-page__staged-area {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-page__staged-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-height: 2rem;
}

.control-page__staged-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Available permissions (bottom) */
.control-page__available {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.control-page__available-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color-secondary);
  margin-bottom: 0.75rem;
}

.control-page__pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* Permission chips */
.control-page__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8125rem;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
  }

  &--add {
    background: var(--green-100);
    color: var(--green-800);
    cursor: default;
  }

  &--remove {
    background: var(--red-100);
    color: var(--red-800);
    cursor: default;
  }

  &--neutral {
    background: var(--surface-100);
    border: 1px solid var(--surface-border);
    color: var(--text-color);
  }
}

.control-page__pill-remove {
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}

.control-page__pill-action {
  font-size: 0.7rem;
  opacity: 0.6;
}

.control-page__empty-hint {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  padding: 0.25rem 0;
}
</style>
