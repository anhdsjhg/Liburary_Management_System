<script setup lang="ts">
import { computed } from "vue";
import type { ServiceUser } from "@/api/service-desk/users/get/types";
import { useControlDialog } from "./composables/useComposable";

const props = defineProps<{
  user: ServiceUser | null;
}>();

const visible = defineModel<boolean>("visible");

const userId = computed(() => props.user?.user_cid ?? null);

const {
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
} = useControlDialog(userId);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    :style="{ width: '80vw', maxWidth: '900px' }"
    :header="user ? `${$t('admin.managingUser')}: ${user.full_name}` : $t('admin.managingUser')"
  >
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
        <div v-else class="ctrl-dialog__panel">
          <div class="ctrl-dialog__sidebar">
            <div class="ctrl-dialog__sidebar-label">{{ $t("admin.allModules") }}</div>
            <div
              v-for="mod in giveModules"
              :key="mod.id"
              class="ctrl-dialog__module-item"
              :class="{ 'ctrl-dialog__module-item--active': giveSelectedModuleId === mod.id }"
              @click="giveSelectModule(mod.id)"
            >
              {{ $t(mod.route_name, 1) }}
            </div>
            <div v-if="!giveModules.length" class="ctrl-dialog__empty-hint">
              {{ $t("admin.noPermissions") }}
            </div>
          </div>

          <div class="ctrl-dialog__content">
            <div class="ctrl-dialog__staged-area">
              <div class="ctrl-dialog__staged-pills">
                <span
                  v-for="(perm, i) in stagedToGive"
                  :key="perm.id"
                  class="ctrl-dialog__pill ctrl-dialog__pill--add"
                >
                  {{ perm.display_name }}
                  <i class="pi pi-times ctrl-dialog__pill-remove" @click="unstageFromGiving(i)" />
                </span>
                <span v-if="!stagedToGive.length" class="ctrl-dialog__empty-hint">
                  {{ $t("admin.chooseModule") }}
                </span>
              </div>
              <div class="ctrl-dialog__staged-actions">
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

            <div class="ctrl-dialog__available">
              <div class="ctrl-dialog__available-label">{{ $t("admin.availableToAdd") }}</div>
              <div class="ctrl-dialog__pill-list">
                <span
                  v-for="perm in giveAvailablePermissions"
                  :key="perm.id"
                  class="ctrl-dialog__pill ctrl-dialog__pill--neutral"
                  @click="stageForGiving(perm)"
                >
                  {{ perm.display_name }}
                  <i class="pi pi-plus ctrl-dialog__pill-action" />
                </span>
                <span
                  v-if="giveSelectedModuleId !== null && !giveAvailablePermissions.length"
                  class="ctrl-dialog__empty-hint"
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
        <div v-else class="ctrl-dialog__panel">
          <div class="ctrl-dialog__sidebar">
            <div class="ctrl-dialog__sidebar-label">{{ $t("admin.myModules") }}</div>
            <div
              v-for="mod in removeModules"
              :key="mod.id"
              class="ctrl-dialog__module-item"
              :class="{ 'ctrl-dialog__module-item--active': removeSelectedModuleId === mod.id }"
              @click="removeSelectModule(mod.id)"
            >
              {{ $t(mod.route_name, 1) }}
            </div>
            <div v-if="!removeModules.length" class="ctrl-dialog__empty-hint">
              {{ $t("admin.noPermissions") }}
            </div>
          </div>

          <div class="ctrl-dialog__content">
            <div class="ctrl-dialog__staged-area">
              <div class="ctrl-dialog__staged-pills">
                <span
                  v-for="(perm, i) in stagedToRemove"
                  :key="perm.id"
                  class="ctrl-dialog__pill ctrl-dialog__pill--remove"
                >
                  {{ perm.display_name }}
                  <i class="pi pi-times ctrl-dialog__pill-remove" @click="unstageFromRemoving(i)" />
                </span>
                <span v-if="!stagedToRemove.length" class="ctrl-dialog__empty-hint">
                  {{ $t("admin.chooseModule") }}
                </span>
              </div>
              <div class="ctrl-dialog__staged-actions">
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

            <div class="ctrl-dialog__available">
              <div class="ctrl-dialog__available-label">{{ $t("admin.currentPermissions") }}</div>
              <div class="ctrl-dialog__pill-list">
                <span
                  v-for="perm in removeCurrentPermissions"
                  :key="perm.id"
                  class="ctrl-dialog__pill ctrl-dialog__pill--neutral"
                  @click="stageForRemoving(perm)"
                >
                  {{ perm.display_name }}
                  <i class="pi pi-minus ctrl-dialog__pill-action" />
                </span>
                <span
                  v-if="removeSelectedModuleId !== null && !removeCurrentPermissions.length"
                  class="ctrl-dialog__empty-hint"
                >
                  {{ $t("admin.noPermissions") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </Tabs>
  </Dialog>
</template>

<style scoped>
.ctrl-dialog__panel {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding-top: 1rem;
  min-height: 20rem;
}

.ctrl-dialog__sidebar {
  width: 13rem;
  flex-shrink: 0;
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ctrl-dialog__sidebar-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.ctrl-dialog__module-item {
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

.ctrl-dialog__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ctrl-dialog__staged-area {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ctrl-dialog__staged-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-height: 2rem;
}

.ctrl-dialog__staged-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.ctrl-dialog__available {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.ctrl-dialog__available-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color-secondary);
  margin-bottom: 0.75rem;
}

.ctrl-dialog__pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.ctrl-dialog__pill {
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

.ctrl-dialog__pill-remove {
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}

.ctrl-dialog__pill-action {
  font-size: 0.7rem;
  opacity: 0.6;
}

.ctrl-dialog__empty-hint {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  padding: 0.25rem 0;
}
</style>
