<script setup lang="ts">
import { useActManage } from "./composables/useComposable";

const { form, isEdit, isSaving, submit, cancel } = useActManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.acts") }}
    </div>

    <div class="acquisition-form__row">
      <div class="acquisition-form__field">
        <label>{{ $t("acquisitions.act.act_date") }}</label>
        <InputText v-model="form.act_date" type="date" />
      </div>
      <div class="acquisition-form__field">
        <label>{{ $t("acquisitions.act.protocol_id") }}</label>
        <InputText v-model="form.protocol_id" />
      </div>
      <div class="acquisition-form__field">
        <label>{{ $t("acquisitions.act.protocol_date") }}</label>
        <InputText v-model="form.protocol_date" type="date" />
      </div>
    </div>

    <div v-if="!isEdit" class="acquisition-form__field">
      <label>{{ $t("acquisitions.act.id") }} (custom)</label>
      <InputNumber v-model="form.custom_id" :use-grouping="false" />
    </div>

    <div class="acquisition-form__field">
      <label>{{ $t("acquisitions.act.notes") }}</label>
      <Textarea v-model="form.notes" rows="3" />
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
  </div>
</template>