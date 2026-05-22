<script setup lang="ts">
import { watch } from "vue";
import { useRenewDialog } from "./composables/useComposable";
import type { LoanRecord } from "@/api/service-desk/users/[id]/get/types";

const props = defineProps<{
  loan: LoanRecord | null;
  userCid: string;
  defaultDuration: number;
}>();

const visible = defineModel<boolean>("visible", { default: false });

const emit = defineEmits<{
  (e: "success"): void;
}>();

const { form, isRenewing, setLoan, submit } = useRenewDialog(() => {
  visible.value = false;
  emit("success");
});

watch(
  () => props.loan,
  (loan) => {
    if (loan) setLoan(loan.loan_id, loan.inv_id, props.userCid, props.defaultDuration);
  },
  { immediate: true }
);
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false" style="width: 24rem">
    <template #header>
      <span class="renew-dialog__title">{{ $t("serviceDesk.renew") }}</span>
    </template>

    <div class="renew-dialog">
      <div v-if="loan" style="font-size: 0.875rem; color: var(--text-color-secondary); margin-bottom: 1rem">
        {{ loan.inv_id }} — {{ loan.title }}
      </div>

      <div class="p-field">
        <label>{{ $t("serviceDesk.duration") }}</label>
        <InputNumber
          v-model="form.duration"
          :min="1"
          :max="90"
          :use-grouping="false"
          class="w-full"
        />
      </div>

      <div class="renew-dialog__actions" style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem">
        <Button
          :label="$t('serviceDesk.cancel')"
          severity="secondary"
          outlined
          @click="visible = false"
        />
        <Button
          :label="$t('serviceDesk.confirm')"
          :loading="isRenewing"
          @click="submit"
        />
      </div>
    </div>
  </Dialog>
</template>
