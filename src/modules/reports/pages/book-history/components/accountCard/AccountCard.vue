<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";

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
  <AppDataTable
    :columns="columns"
    :rows="historyItems as unknown as Record<string, unknown>[]"
    :show-row-numbers="false"
    :show-actions="false"
    :pagination="false"
    :sortable="false"
  />
</template>