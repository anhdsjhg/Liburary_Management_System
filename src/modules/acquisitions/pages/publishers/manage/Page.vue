<script setup lang="ts">
import { usePublisherManage } from "./composables/useComposable";

const { form, isEdit, isSaving, loadingPublisher, submit, cancel } = usePublisherManage();
</script>

<template>
  <div class="acquisition-form">
    <div class="acquisition-form__title">
      {{ isEdit ? $t("acquisitions.edit") : $t("acquisitions.add") }}
      {{ $t("acquisitions.publishers") }}
    </div>

    <Skeleton v-if="loadingPublisher" height="16rem" />

    <template v-else>
      <div class="acquisition-form__row">
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.publisher.name") }}</label>
          <InputText v-model="form.pub_name" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.publisher.com_name") }}</label>
          <InputText v-model="form.com_name" />
        </div>
      </div>

      <div class="acquisition-form__row">
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.publisher.phone") }}</label>
          <InputText v-model="form.phone" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.publisher.email") }}</label>
          <InputText v-model="form.email" />
        </div>
        <div class="acquisition-form__field">
          <label>{{ $t("acquisitions.publisher.fax") }}</label>
          <InputText v-model="form.fax" />
        </div>
      </div>

      <div class="acquisition-form__field">
        <label>{{ $t("acquisitions.publisher.address") }}</label>
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