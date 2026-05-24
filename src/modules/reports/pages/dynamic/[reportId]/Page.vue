<script setup lang="ts">
import { computed } from "vue";
import { useDynamicReportDetail } from "./composables/useComposable";
import ReportTable from "../../../components/ReportTable.vue";

const {
  reportInfo,
  fields,
  parameters,
  selectedFields,
  parameterValues,
  results,
  loadingReport,
  isExecuting,
  run,
  doExport,
} = useDynamicReportDetail();

const columns = computed(() => {
  const displayFields = selectedFields.value.length ? selectedFields.value : fields.value;
  return displayFields.map((f) => ({ name: f.title, link: f.field }));
});
</script>

<template>
  <div class="report-page">
    <Skeleton v-if="loadingReport" height="10rem" />

    <template v-else>
      <div class="report-page__header">
        <span class="report-page__title">{{ reportInfo?.query_title }}</span>
        <div class="report-page__actions">
          <Button :label="$t('reports.export')" outlined icon="pi pi-download" @click="doExport" />
          <Button :label="$t('reports.execute')" :loading="isExecuting" icon="pi pi-play" @click="run" />
        </div>
      </div>

      <div v-if="parameters.length" class="report-page__filter">
        <div
          v-for="param in parameters"
          :key="param.parameter"
          class="report-page__filter-field"
        >
          <div class="report-page__filter-label">{{ param.title }}</div>
          <InputText
            v-if="param.v_component === 'input' || param.v_component === 'date'"
            v-model="parameterValues[param.parameter] as string"
            :type="param.v_component === 'date' ? 'date' : 'text'"
            class="w-full"
          />
          <Select
            v-else-if="param.v_component === 'select'"
            v-model="parameterValues[param.parameter]"
            :options="param.options ?? []"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
      </div>

      <ReportTable
        v-if="results.length"
        :columns="columns"
        :rows="results"
      />
    </template>
  </div>
</template>