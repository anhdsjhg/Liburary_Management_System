<script setup lang="ts">
import { useBatchManage } from "./composables/useComposable";

const { form, isEdit, isSaving, loadingBatch, submit, cancel } = useBatchManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.batches") }}
    </div>

    <Skeleton v-if="loadingBatch" height="20rem" />

    <template v-else>
      <div class="acquisition-form__row">
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.batch.invoice_date") }}</label>
          <InputText v-model="form.invoice_date" type="date" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.batch.doc_no") }}</label>
          <InputText v-model="form.doc_no" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.batch.contract_no") }}</label>
          <InputText v-model="form.contract_no" />
        </div>
      </div>

      <div class="acquisition-form__row">
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.batch.cost") }}</label>
          <InputNumber v-model="form.cost" :use-grouping="false" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.batch.titles_no") }}</label>
          <InputNumber v-model="form.titles_no" :use-grouping="false" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.batch.items_no") }}</label>
          <InputNumber v-model="form.items_no" :use-grouping="false" />
        </div>
      </div>

      <div v-if="!isEdit" class="acquisition-form__field">
        <label>{{ $t("acquisitions.batch.id") }} (custom)</label>
        <InputNumber v-model="form.custom_id" :use-grouping="false" />
      </div>

      <div class="acquisition-form__field">
        <label>{{ $t("acquisitions.batch.invoice_details") }}</label>
        <Textarea v-model="form.invoice_details" rows="3" />
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