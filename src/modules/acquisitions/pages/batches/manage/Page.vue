<script setup lang="ts">
import { useBatchManage } from "./composables/useComposable";
import AppForm from "@/application/components/AppForm/AppForm.vue";

const { form, formConfig, serverErrors, isEdit, isSaving, loadingBatch, submit, cancel } = useBatchManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.batches") }}
    </div>

    <Skeleton v-if="loadingBatch" height="20rem" />

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
