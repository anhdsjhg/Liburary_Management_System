<script setup lang="ts">
import { ref } from "vue";
import { useArrivalsSearch } from "./composables/useComposable";
import AppSkeleton from "@/application/components/AppSkeleton.vue";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import ManageDialog from "../manage/Page.vue";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";
import { ASSETS } from "@/application/configs/constants";

const {
  items,
  isLoading,
  deleteLoading,
  deleteConfirmVisible,
  refetch,
  requestDelete,
  confirmDelete,
} = useArrivalsSearch();

const manageVisible = ref(false);

function getImage(item: ArrivalItem): string {
  return item.image ?? ASSETS.NO_COVER;
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <span class="settings-page__title">{{ $t("settings.arrivals") }}</span>
      <div class="settings-page__actions">
        <Button
          :label="$t('settings.add')"
          icon="pi pi-plus"
          @click="manageVisible = true"
        />
      </div>
    </div>

    <AppSkeleton v-if="isLoading" variant="table" :rows="2" :cols="5" />

    <div v-else-if="items.length === 0" class="arrivals-settings__empty">
      <i class="pi pi-book arrivals-settings__empty-icon" />
      <span>{{ $t("settings.no_results") }}</span>
    </div>

    <div v-else class="arrivals-settings__grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="arrivals-settings__card"
      >
        <div
          class="arrivals-settings__card-image"
          :style="{ backgroundImage: `url(${getImage(item)})` }"
        />
        <div class="arrivals-settings__card-body">
          <p class="arrivals-settings__card-title">{{ item.title }}</p>
          <p v-if="item.author" class="arrivals-settings__card-author">{{ item.author }}</p>
          <p v-if="item.inv_id" class="arrivals-settings__card-inv">{{ $t("settings.inv_id") }}: {{ item.inv_id }}</p>
        </div>
        <Button
          class="arrivals-settings__card-delete"
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          :loading="deleteLoading"
          @click="requestDelete(item)"
        />
      </div>
    </div>

    <ManageDialog
      v-model:visible="manageVisible"
      @success="refetch"
    />

    <AppConfirmDialog
      v-model:visible="deleteConfirmVisible"
      :loading="deleteLoading"
      :on-confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.arrivals-settings__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.25rem;
  margin-top: 1rem;
}

@media (max-width: 1280px) {
  .arrivals-settings__grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 992px) {
  .arrivals-settings__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .arrivals-settings__grid { grid-template-columns: repeat(2, 1fr); }
}

.arrivals-settings__card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.arrivals-settings__card:hover {
  border-color: #381f6e;
  box-shadow: 0 8px 24px rgba(56, 31, 110, 0.12);
}

.arrivals-settings__card-image {
  width: 100%;
  aspect-ratio: 2 / 3;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--surface-ground);
}

.arrivals-settings__card-body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.arrivals-settings__card-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.arrivals-settings__card-author {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrivals-settings__card-inv {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.arrivals-settings__card-delete {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: rgba(255, 255, 255, 0.9) !important;
}

.arrivals-settings__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 2rem;
  color: var(--text-color-secondary);
  font-size: 1rem;
}

.arrivals-settings__empty-icon {
  font-size: 2.5rem;
  opacity: 0.35;
}
</style>
