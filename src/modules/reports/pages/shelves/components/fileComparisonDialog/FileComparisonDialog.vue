<script setup lang="ts">
import { useFileComparisonDialog } from "./composables/useComposable";

const visible = defineModel<boolean>("visible", { default: false });
const emit = defineEmits<{ (e: "success"): void }>();

const { originalFile, deviceFile, isComparing, comparisonResult, submit } = useFileComparisonDialog(() => {
  emit("success");
});
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false" style="min-width: 32rem">
    <template #header>
      <span style="font-weight: 700">{{ $t("reports.compare_files") }}</span>
    </template>

    <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem">
      <div class="shelves-comparison__files">
        <div class="report-page__filter-field">
          <div class="report-page__filter-label">{{ $t("reports.original_file") }}</div>
          <input
            type="file"
            accept=".csv,.txt"
            @change="(e) => { originalFile = (e.target as HTMLInputElement).files?.[0] ?? null }"
          />
        </div>
        <div class="report-page__filter-field">
          <div class="report-page__filter-label">{{ $t("reports.device_file") }}</div>
          <input
            type="file"
            accept=".csv,.txt"
            @change="(e) => { deviceFile = (e.target as HTMLInputElement).files?.[0] ?? null }"
          />
        </div>
      </div>

      <Button
        :label="$t('reports.apply')"
        :loading="isComparing"
        :disabled="!originalFile || !deviceFile"
        @click="submit"
      />

      <div v-if="comparisonResult" class="shelves-comparison__results">
        <a :href="comparisonResult.files.matched" target="_blank" class="shelves-comparison__result-link">
          {{ $t("reports.matched") }}
        </a>
        <a :href="comparisonResult.files.missing" target="_blank" class="shelves-comparison__result-link">
          {{ $t("reports.missing") }}
        </a>
        <a :href="comparisonResult.files.extra" target="_blank" class="shelves-comparison__result-link">
          {{ $t("reports.extra") }}
        </a>
        <a :href="comparisonResult.files.invalid" target="_blank" class="shelves-comparison__result-link">
          {{ $t("reports.invalid") }}
        </a>
      </div>
    </div>
  </Dialog>
</template>