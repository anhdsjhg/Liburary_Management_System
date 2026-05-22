<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";
import type { PaginationMeta } from "@/application/types/table";
import { formatDate } from "@/application/utils/date";
import AppConfirmDialog from "@/application/components/AppConfirmDialog.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const props = defineProps<{
  rows: AnnouncementItem[];
  meta: PaginationMeta;
  page: number;
  loading: boolean;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: AnnouncementItem): void;
  (e: "delete", row: AnnouncementItem): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

const deleteTarget = ref<AnnouncementItem | null>(null);
const deleteConfirmVisible = ref(false);

function requestDelete(row: AnnouncementItem) {
  deleteTarget.value = row;
  deleteConfirmVisible.value = true;
}

function onDeleteConfirmed() {
  if (deleteTarget.value) emit("delete", deleteTarget.value);
  deleteTarget.value = null;
}

function getTypeSeverity(type: string | null) {
  if (type === "event") return "info";
  return "secondary";
}
</script>

<template>
  <AppSkeleton v-if="loading" variant="table" :rows="5" :cols="5" />

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
        <template #body="{ data }: { data: AnnouncementItem }">
          {{ data.title_en ?? "-" }}
        </template>
      </Column>

      <Column field="start_date" :header="t('settings.start_date')" style="min-width: 9rem">
        <template #body="{ data }: { data: AnnouncementItem }">
          {{ formatDate(data.start_date) ?? "-" }}
        </template>
      </Column>

      <Column field="end_date" :header="t('settings.end_date')" style="min-width: 9rem">
        <template #body="{ data }: { data: AnnouncementItem }">
          {{ formatDate(data.end_date) ?? "-" }}
        </template>
      </Column>

      <Column field="type" :header="t('settings.type')" style="min-width: 8rem">
        <template #body="{ data }: { data: AnnouncementItem }">
          <Tag
            v-if="data.type"
            :value="t(`settings.${data.type}`)"
            :severity="getTypeSeverity(data.type)"
          />
          <span v-else>-</span>
        </template>
      </Column>

      <Column :header="t('common.actions')" style="min-width: 10rem" frozen align-frozen="right">
        <template #body="{ data }: { data: AnnouncementItem }">
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

    <AppPaginator
      :meta="meta"
      :page="page"
      @update:page="emit('update:page', $event)"
    />
  </template>

  <AppConfirmDialog
    v-model:visible="deleteConfirmVisible"
    :loading="deleteLoading"
    :on-confirm="onDeleteConfirmed"
  />
</template>
