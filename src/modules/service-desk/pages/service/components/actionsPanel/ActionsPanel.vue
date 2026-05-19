<script setup lang="ts">
import { useActionsPanel } from "./composables/useComposable";
import type { ScannedMaterial, ScannedUser } from "../../composables/useComposable";

const props = defineProps<{
  material: ScannedMaterial | null;
  user: ScannedUser | null;
}>();

const emit = defineEmits<{
  (e: "success"): void;
}>();

const { form, isGiving, isReturning, submitGive, submitReturn } =
  useActionsPanel(() => emit("success"));
</script>

<template>
  <div v-if="material" class="actions-panel">
    <div class="actions-panel__title">
      {{ material.title }}
      <span style="font-size: 0.875rem; color: var(--text-color-secondary)">
        · {{ material.inv_id }}
      </span>
    </div>

    <div class="actions-panel__grid">
      <div class="actions-panel__field">
        <label>{{ $t("serviceDesk.duration") }}</label>
        <InputNumber v-model="form.duration" :min="1" :max="90" :use-grouping="false" />
      </div>
    </div>

    <div class="actions-panel__actions">
      <Button
        v-if="material.status !== 'borrowed' && user"
        :label="$t('serviceDesk.give')"
        :loading="isGiving"
        icon="pi pi-arrow-right"
        @click="submitGive(material.inv_id, user.user_cid, material.material_id)"
      />
      <Button
        v-if="material.status === 'borrowed' && material.loan_id"
        :label="$t('serviceDesk.return')"
        :loading="isReturning"
        severity="success"
        icon="pi pi-arrow-left"
        @click="submitReturn(material.inv_id, material.user_cid ?? user?.user_cid ?? '', material.loan_id)"
      />
    </div>
  </div>
</template>