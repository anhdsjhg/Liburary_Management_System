<script setup lang="ts">
import { useBackgroundImagePage } from "./composables/useComposable";

const {
  images,
  isLoading,
  isUploading,
  imageUrl,
  onFileChange,
  doUpload,
  doDelete,
} = useBackgroundImagePage();
</script>

<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <span class="settings-page__title">{{ $t("settings.background_image") }}</span>
    </div>

    <div class="settings-page__filter">
      <div class="settings-page__filter-field">
        <div class="settings-page__filter-label">{{ $t("settings.upload_image") }}</div>
        <input type="file" accept="image/*" @change="onFileChange" />
      </div>
      <div class="settings-page__filter-field">
        <div class="settings-page__filter-label">{{ $t("settings.link") }}</div>
        <InputText v-model="imageUrl" :placeholder="$t('settings.link')" class="w-full" />
      </div>
      <Button
        :label="$t('settings.upload')"
        :loading="isUploading"
        icon="pi pi-upload"
        @click="doUpload"
      />
    </div>

    <Skeleton v-if="isLoading" height="20rem" />

    <div v-else class="bg-images-grid">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="bg-images-grid__item"
      >
        <img :src="img" alt="bg" class="bg-images-grid__img" />
        <div class="bg-images-grid__overlay">
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            @click="doDelete(img)"
          />
        </div>
      </div>
    </div>
  </div>
</template>