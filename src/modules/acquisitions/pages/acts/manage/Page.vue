<script setup lang="ts">
import { useActManage } from "./composables/useComposable";
import AppForm from "@/application/components/AppForm/AppForm.vue";

const { form, formConfig, serverErrors, isEdit, isSaving, loadingAct, submit, cancel } = useActManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.acts") }}
    </div>

    <Skeleton v-if="loadingAct" height="16rem" />

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
