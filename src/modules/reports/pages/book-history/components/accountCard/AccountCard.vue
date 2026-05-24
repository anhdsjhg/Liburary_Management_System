<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ReportTable from "@/modules/reports/components/ReportTable.vue";

const { t } = useI18n();

defineProps<{
  historyItems: Array<{ made_by: string | null; made_at: string | null }>;
}>();

const columns = computed(() => [
  { name: t("cataloging.made_by"), link: "made_by" },
  { name: t("cataloging.made_at"), link: "made_at" },
]);
</script>

<template>
  <ReportTable
    :columns="columns"
    :rows="historyItems as unknown as Record<string, unknown>[]"
  />
</template>