<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { QuickLink } from "@/api/settings/quick-links/get/types";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: QuickLink[];
  loading: boolean;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: QuickLink): void;
  (e: "delete", row: QuickLink): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

const deleteTarget = ref<QuickLink | null>(null);
const deleteConfirmVisible = ref(false);

function requestDelete(row: QuickLink) {
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
}

function onDeleteConfirmed() {
  if (deleteTarget.value) emit("delete", deleteTarget.value);
  deleteTarget.value = null;
}
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="3" />

  <template v-else>
    <DataTable
      :value="rows"
      scrollable
      scroll-height="auto"
      size="small"
      striped-rows
    >
      <template #empty>
        <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
          {{ $t("no_data") }}
        </div>
      </template>

      <Column field="id" header="#" style="min-width: 5rem" />

      <Column field="title_en" :header="t('settings.title_en')" style="min-width: 12rem">
        <template #body="{ data }: { data: QuickLink }">
          {{ data.title_en ?? "-" }}
        </template>
      </Column>

      <Column field="title_ru" :header="t('settings.title_ru')" style="min-width: 12rem">
        <template #body="{ data }: { data: QuickLink }">
          {{ data.title_ru ?? "-" }}
        </template>
      </Column>

      <Column field="link" :header="t('settings.link')" style="min-width: 14rem">
        <template #body="{ data }: { data: QuickLink }">
          <a
            v-if="data.link"
            :href="data.link"
            target="_blank"
            rel="noopener noreferrer"
            style="color: var(--p-primary-color); word-break: break-all"
          >{{ data.link }}</a>
          <span v-else>-</span>
        </template>
      </Column>

      <Column :header="t('common.actions')" style="min-width: 9rem" frozen align-frozen="right">
        <template #body="{ data }: { data: QuickLink }">
          <div class="flex gap-1">
            <Button
              size="small"
              severity="secondary"
              outlined
              icon="pi pi-pencil"
              @click="emit('edit', data)"
            />
            <Button
              size="small"
              severity="danger"
              outlined
              icon="pi pi-trash"
              @click="requestDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </template>

  <AppConfirmDialog
    v-model:visible="deleteConfirmVisible"
    :loading="deleteLoading"
    :on-confirm="onDeleteConfirmed"
  />
</template>
