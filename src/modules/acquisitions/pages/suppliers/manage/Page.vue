<script setup lang="ts">
import { useSupplierManage } from "./composables/useComposable";
import AppForm from "@/application/components/AppForm/AppForm.vue";

const { form, formConfig, serverErrors, isEdit, isSaving, loadingSupplier, submit, cancel } = useSupplierManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.suppliers") }}
    </div>

    <Skeleton v-if="loadingSupplier" height="16rem" />

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
