<script setup lang="ts">
import { useSupplierManage } from "./composables/useComposable";

const { form, isEdit, isSaving, loadingSupplier, submit, cancel } = useSupplierManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.suppliers") }}
    </div>

    <Skeleton v-if="loadingSupplier" height="16rem" />

    <template v-else>
      <div class="acquisition-form__row">
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.supplier.name") }}</label>
          <InputText v-model="form.sup_name" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.supplier.com_name") }}</label>
          <InputText v-model="form.com_name" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.supplier.bin") }}</label>
          <InputText v-model="form.bin" />
        </div>
      </div>

      <div class="acquisition-form__row">
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.supplier.phone") }}</label>
          <InputText v-model="form.phone" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.supplier.email") }}</label>
          <InputText v-model="form.email" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.supplier.fax") }}</label>
          <InputText v-model="form.fax" />
        </div>
      </div>

      <div class="acquisition-form__field">
        <label>{{ $t("acquisitions.supplier.address") }}</label>
        <Textarea v-model="form.address" rows="2" />
      </div>

      <div class="acquisition-form__actions">
        <Button
          :label="$t('acquisitions.cancel')"
          severity="secondary"
          outlined
          @click="cancel"
        />
        <Button
          :label="$t('acquisitions.save')"
          :loading="isSaving"
          :disabled="isSaving"
          @click="submit"
        />
      </div>
    </template>
  </div>
</template>