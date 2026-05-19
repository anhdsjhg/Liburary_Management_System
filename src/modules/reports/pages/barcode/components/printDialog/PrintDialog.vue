<script setup lang="ts">
import { usePrintDialog } from "./composables/useComposable";

const visible = defineModel<boolean>("visible", { default: false });
const props = defineProps<{ inventories: (string | number)[] }>();
const emit = defineEmits<{ (e: "success"): void }>();

const { isPrinting, submit } = usePrintDialog(() => {
  visible.value = false;
  emit("success");
});
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false">
    <template #header>
      <span style="font-weight: 700">{{ $t("reports.print") }}</span>
    </template>
    <div style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem">
      <div style="color: var(--text-color-secondary); font-size: 0.875rem">
        {{ inventories.length }} {{ $t("reports.results") }}
      </div>
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end">
        <Button
          :label="$t('reports.print')"
          :loading="isPrinting"
          @click="submit(inventories)"
        />
      </div>
    </div>
  </Dialog>
</template>