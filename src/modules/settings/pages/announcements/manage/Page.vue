<script setup lang="ts">
import { ref } from "vue";
import { useAnnouncementManage } from "./composables/useComposable";
import AppSkeleton from "@/application/components/AppSkeleton.vue";
import Select from "primevue/select";

const { form, isEdit, isLoadingData, isSaving, save, cancel } = useAnnouncementManage();
const activeLang = ref<"en" | "ru" | "kz">("en");

const typeOptions = [
  { label: "Announcement", value: "announcement" },
  { label: "Event", value: "event" },
];

function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { form.image = reader.result as string; };
  reader.readAsDataURL(file);
}

function clearImage() {
  form.image = "";
}
</script>

<template>
  <div class="settings-manage-page">
    <div class="settings-manage-page__header">
      <span class="settings-manage-page__title">
        {{ isEdit ? $t("settings.edit") : $t("settings.add") }} —
        {{ $t("settings.announcements") }}
      </span>
      <div class="settings-manage-page__actions">
        <Button
          :label="$t('settings.cancel')"
          severity="secondary"
          outlined
          @click="cancel"
        />
        <Button
          :label="$t('settings.save')"
          :loading="isSaving"
          @click="save"
        />
      </div>
    </div>

    <AppSkeleton v-if="isLoadingData" variant="form" :rows="8" />

    <div v-else class="settings-manage-page__form">

      <!-- Type selector -->
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.type") }} <span style="color:var(--p-red-500)">*</span></div>
        <Select
          v-model="form.type"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          class="w-full"
        />
      </div>

      <!-- Language tabs -->
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
          <div class="settings-manage-page__label">{{ $t("settings.title_en") }} <span style="color:var(--p-red-500)">*</span></div>
          <InputText v-model="form.title_en" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.place_en") }}</div>
          <InputText v-model="form.place_en" class="w-full" />
        </div>
        <div v-if="form.type === 'announcement'" class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_en") }}</div>
          <Textarea v-model="form.description_en" rows="4" class="w-full" />
        </div>
      </template>

      <template v-else-if="activeLang === 'ru'">
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_ru") }} <span style="color:var(--p-red-500)">*</span></div>
          <InputText v-model="form.title_ru" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.place_ru") }}</div>
          <InputText v-model="form.place_ru" class="w-full" />
        </div>
        <div v-if="form.type === 'announcement'" class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_ru") }}</div>
          <Textarea v-model="form.description_ru" rows="4" class="w-full" />
        </div>
      </template>

      <template v-else>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_kz") }} <span style="color:var(--p-red-500)">*</span></div>
          <InputText v-model="form.title_kz" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.place_kz") }}</div>
          <InputText v-model="form.place_kz" class="w-full" />
        </div>
        <div v-if="form.type === 'announcement'" class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_kz") }}</div>
          <Textarea v-model="form.description_kz" rows="4" class="w-full" />
        </div>
      </template>

      <!-- Event link (only for event type) -->
      <div v-if="form.type === 'event'" class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.link") }} <span style="color:var(--p-red-500)">*</span></div>
        <InputText v-model="form.link" class="w-full" />
      </div>

      <!-- Dates & times -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.start_date") }} <span style="color:var(--p-red-500)">*</span></div>
          <InputText v-model="form.start_date" type="date" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.end_date") }}</div>
          <InputText v-model="form.end_date" type="date" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.start_time") }} <span style="color:var(--p-red-500)">*</span></div>
          <InputText v-model="form.start_time" type="time" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.end_time") }}</div>
          <InputText v-model="form.end_time" type="time" class="w-full" />
        </div>
      </div>

      <!-- Image upload -->
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.image") }}</div>
        <div v-if="form.image" class="settings-manage-page__image-wrap">
          <img
            :src="form.image"
            alt="preview"
            class="settings-manage-page__image-preview"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            size="small"
            outlined
            :label="$t('settings.delete_image')"
            @click="clearImage"
          />
        </div>
        <input v-else type="file" accept="image/*" @change="onImageChange" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-manage-page__image-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.settings-manage-page__image-preview {
  max-width: 300px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.375rem;
  border: 1px solid var(--p-surface-border);
}
</style>