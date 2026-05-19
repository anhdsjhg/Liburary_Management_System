<script setup lang="ts">
import type { VideoContentItem } from "@/api/settings/video-content/get/types";

const props = defineProps<{ item: VideoContentItem | null }>();
const visible = defineModel<boolean>("visible", { default: false });
const emit = defineEmits<{ (e: "success"): void }>();

import { watch } from "vue";
import { useVideoManageDialog } from "./composables/useComposable";

const { form, isCreating, isUpdating, setForEdit, resetForm, save } = useVideoManageDialog(() => {
  visible.value = false;
  emit("success");
});

watch(() => props.item, (item) => {
  if (item) setForEdit(item);
  else resetForm();
}, { immediate: true });
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false" style="min-width: 32rem">
    <template #header>
      <span style="font-weight: 700">
        {{ item ? $t("settings.edit") : $t("settings.add") }} — {{ $t("settings.videos") }}
      </span>
    </template>

    <div class="settings-manage-page__form" style="padding: 1rem">
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.title_en") }}</div>
        <InputText v-model="form.title_en" class="w-full" />
      </div>
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.title_ru") }}</div>
        <InputText v-model="form.title_ru" class="w-full" />
      </div>
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.title_kz") }}</div>
        <InputText v-model="form.title_kz" class="w-full" />
      </div>
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.link") }}</div>
        <InputText v-model="form.link" class="w-full" />
      </div>
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.embed_link") }}</div>
        <InputText v-model="form.embed_link" class="w-full" />
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem">
        <Button
          :label="$t('settings.cancel')"
          severity="secondary"
          outlined
          @click="visible = false"
        />
        <Button
          :label="$t('settings.save')"
          :loading="isCreating || isUpdating"
          @click="save"
        />
      </div>
    </div>
  </Dialog>
</template>