<script setup lang="ts">
import { usePublisherManage } from "./composables/useComposable";
import AppForm from "@/application/components/AppForm/AppForm.vue";

const { form, formConfig, serverErrors, isEdit, isSaving, loadingPublisher, submit, cancel } = usePublisherManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.publishers") }}
    </div>

    <Skeleton v-if="loadingPublisher" height="16rem" />

    <AppForm
      v-else
      v-model="form"
      :config="formConfig"
      :loading="isSaving"
      :server-errors="serverErrors"
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>
