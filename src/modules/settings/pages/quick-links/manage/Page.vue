<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuickLinkManageDialog } from "./composables/useComposable";
import type { QuickLink } from "@/api/settings/quick-links/get/types";

const props = defineProps<{ item: QuickLink | null }>();
const visible = defineModel<boolean>("visible", { default: false });
const emit = defineEmits<{ (e: "success"): void }>();

const { form, isCreating, isUpdating, setForEdit, resetForm, save } =
  useQuickLinkManageDialog(() => {
    visible.value = false;
    emit("success");
  });

const activeLang = ref<"en" | "ru" | "kz">("en");

watch(() => props.item, (item) => {
  if (item) setForEdit(item);
  else resetForm();
}, { immediate: true });
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false" style="min-width: 32rem">
    <template #header>
      <span style="font-weight: 700">
        {{ item ? $t("settings.edit") : $t("settings.add") }} — {{ $t("settings.quick_links") }}
      </span>
    </template>

    <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem">
      <div class="settings-manage-page__tabs">
        <button
          v-for="lang in ['en', 'ru', 'kz']"
          :key="lang"
          class="settings-manage-page__tab"
          :class="{ 'settings-manage-page__tab--active': activeLang === lang }"
          type="button"
          @click="activeLang = lang as 'en' | 'ru' | 'kz'"
        >
          {{ lang.toUpperCase() }}
        </button>
      </div>

      <template v-if="activeLang === 'en'">
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_en") }}</div>
          <InputText v-model="form.title_en" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_en") }}</div>
          <Textarea v-model="form.description_en" rows="3" class="w-full" />
        </div>
      </template>

      <template v-else-if="activeLang === 'ru'">
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_ru") }}</div>
          <InputText v-model="form.title_ru" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_ru") }}</div>
          <Textarea v-model="form.description_ru" rows="3" class="w-full" />
        </div>
      </template>

      <template v-else>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_kz") }}</div>
          <InputText v-model="form.title_kz" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_kz") }}</div>
          <Textarea v-model="form.description_kz" rows="3" class="w-full" />
        </div>
      </template>

      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.link") }}</div>
        <InputText v-model="form.link" class="w-full" />
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end">
        <Button :label="$t('settings.cancel')" severity="secondary" outlined @click="visible = false" />
        <Button :label="$t('settings.save')" :loading="isCreating || isUpdating" @click="save" />
      </div>
    </div>
  </Dialog>
</template>