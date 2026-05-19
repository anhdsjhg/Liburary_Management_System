<script setup lang="ts">
import { ref } from "vue";
import { useAnnouncementManage } from "./composables/useComposable";

const { form, isEdit, isLoadingData, isSaving, save, cancel } = useAnnouncementManage();
const activeLang = ref<"en" | "ru" | "kz">("en");
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

    <Skeleton v-if="isLoadingData" height="30rem" />

    <div v-else class="settings-manage-page__form">
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
          <div class="settings-manage-page__label">{{ $t("settings.place_en") }}</div>
          <InputText v-model="form.place_en" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_en") }}</div>
          <Textarea v-model="form.description_en" rows="4" class="w-full" />
        </div>
      </template>

      <template v-else-if="activeLang === 'ru'">
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_ru") }}</div>
          <InputText v-model="form.title_ru" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.place_ru") }}</div>
          <InputText v-model="form.place_ru" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_ru") }}</div>
          <Textarea v-model="form.description_ru" rows="4" class="w-full" />
        </div>
      </template>

      <template v-else>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.title_kz") }}</div>
          <InputText v-model="form.title_kz" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.place_kz") }}</div>
          <InputText v-model="form.place_kz" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.description_kz") }}</div>
          <Textarea v-model="form.description_kz" rows="4" class="w-full" />
        </div>
      </template>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.start_date") }}</div>
          <InputText v-model="form.start_date" type="date" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.end_date") }}</div>
          <InputText v-model="form.end_date" type="date" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.start_time") }}</div>
          <InputText v-model="form.start_time" type="time" class="w-full" />
        </div>
        <div class="settings-manage-page__field">
          <div class="settings-manage-page__label">{{ $t("settings.end_time") }}</div>
          <InputText v-model="form.end_time" type="time" class="w-full" />
        </div>
      </div>

      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.link") }}</div>
        <InputText v-model="form.link" class="w-full" />
      </div>

      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.image") }}</div>
        <div
          v-if="form.image"
          class="settings-manage-page__image-preview"
          :style="{ backgroundImage: `url(${form.image})` }"
        />
        <InputText
          v-model="form.image"
          placeholder="Image URL or base64"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>