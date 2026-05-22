<script setup lang="ts">
import { useBackgroundImagePage } from "./composables/useComposable";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

const {
  images,
  isLoading,
  isUploading,
  isDeleting,
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

    <AppSkeleton v-if="isLoading" variant="table" :rows="3" :cols="1" />

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
            :loading="isDeleting"
            @click="doDelete(img)"
          />
        </div>
      </div>
    </div>
  </div>
</template>