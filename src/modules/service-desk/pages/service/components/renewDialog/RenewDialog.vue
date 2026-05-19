<script setup lang="ts">
import { watch } from "vue";
import { useRenewDialog } from "./composables/useComposable";

const visible = defineModel<boolean>("visible", { default: false });
const props = defineProps<{ loanId: number | null; defaultDuration?: number }>();
const emit = defineEmits<{ (e: "success"): void }>();

const { duration, isRenewing, setLoan, submit } = useRenewDialog(() => {
  visible.value = false;
  emit("success");
});

watch(
  () => props.loanId,
  (id) => {
    if (id) setLoan(id, props.defaultDuration ?? 21);
  },
  { immediate: true }
);
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false">
    <template #header>
      <span class="renew-dialog__title">{{ $t("serviceDesk.renew") }}</span>
    </template>

    <div class="renew-dialog">
      <div class="p-field">
        <label>{{ $t("serviceDesk.duration") }}</label>
        <InputNumber
          v-model="duration"
          :min="1"
          :max="90"
          :use-grouping="false"
          class="w-full"
        />
      </div>

      <div class="renew-dialog__actions">
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