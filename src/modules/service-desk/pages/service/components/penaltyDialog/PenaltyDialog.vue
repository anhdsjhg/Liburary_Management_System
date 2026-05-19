<script setup lang="ts">
import { watch } from "vue";
import { usePenaltyDialog } from "./composables/useComposable";

const visible = defineModel<boolean>("visible", { default: false });
const props = defineProps<{ penaltyId: number | null; isActive: boolean }>();
const emit = defineEmits<{ (e: "success"): void }>();

const { isSetting, isCancelling, setPenaltyId, submitSet, submitCancel } =
  usePenaltyDialog(() => {
    visible.value = false;
    emit("success");
  });

watch(
  () => props.penaltyId,
  (id) => { if (id) setPenaltyId(id); },
  { immediate: true }
);
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false">
    <template #header>
      <span class="penalty-dialog__title">
        {{ isActive ? $t("serviceDesk.cancel_penalty") : $t("serviceDesk.set_penalty") }}
      </span>
    </template>

    <div class="penalty-dialog">
      <div class="penalty-dialog__info">
        {{
          isActive
            ? $t("serviceDesk.cancel_penalty")
            : $t("serviceDesk.set_penalty")
        }}
      </div>

      <div class="penalty-dialog__actions">
        <Button
          :label="$t('serviceDesk.cancel')"
          severity="secondary"
          outlined
          @click="visible = false"
        />
        <Button
          v-if="!isActive"
          :label="$t('serviceDesk.confirm')"
          severity="danger"
          :loading="isSetting"
          @click="submitSet"
        />
        <Button
          v-else
          :label="$t('serviceDesk.confirm')"
          severity="warning"
          :loading="isCancelling"
          @click="submitCancel"
        />
      </div>
    </div>
  </Dialog>
</template>