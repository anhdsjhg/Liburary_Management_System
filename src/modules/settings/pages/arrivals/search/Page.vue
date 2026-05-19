<script setup lang="ts">
import { ref, computed } from "vue";
import { useArrivalsSearch } from "./composables/useComposable";
import ManageDialog from "../manage/Page.vue";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";

const {
  items,
  isLoading,
  deleteLoading,
  refetch,
  onDelete,
} = useArrivalsSearch();

const manageVisible = ref(false);
const arrivals = computed<ArrivalItem[]>(() => items.value?.res ?? []);
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

    <Skeleton v-if="isLoading" height="20rem" />

    <div v-else class="arrivals-grid">
      <div
        v-for="item in arrivals"
        :key="item.id"
        class="arrivals-grid__card"
      >
        <img
          :src="item.image ?? '/images/no-cover.png'"
          :alt="item.title"
          class="arrivals-grid__cover"
        />
        <div class="arrivals-grid__info">
          <div class="arrivals-grid__title">{{ item.title }}</div>
          <div class="arrivals-grid__meta">{{ item.author }}</div>
          <div class="arrivals-grid__meta">{{ item.year }}</div>
        </div>
        <div class="arrivals-grid__actions">
          <Button
            icon="pi pi-trash"
            size="small"
            severity="danger"
            outlined
            :loading="deleteLoading"
            @click="onDelete(item)"
          />
        </div>
      </div>
    </div>

    <ManageDialog
      v-model:visible="manageVisible"
      @success="refetch"
    />
  </div>
</template>