<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";
import type { LoanRecord } from "@/api/service-desk/users/[id]/get/types";

const { t } = useI18n();

const props = defineProps<{
  loans: LoanRecord[];
  duration: number;
}>();

const emit = defineEmits<{
  (e: "renew", loan: LoanRecord): void;
  (e: "return", loan: LoanRecord): void;
}>();

const columns = computed(() => [
  { name: t("serviceDesk.inv_id"), link: "inv_id" },
  { name: t("serviceDesk.title"), link: "title" },
  { name: t("serviceDesk.borrow_date"), link: "borrow_date" },
  { name: t("serviceDesk.due_date"), link: "due_date" },
  { name: t("serviceDesk.status"), link: "status" },
  {
    name: "",
    link: "loan_id",
    slot: "actions",
  },
]);
</script>

<template>
  <div class="books-table">
    <div class="books-table__header">{{ $t("serviceDesk.current_loans") }}</div>

    <AppDataTable
      :columns="columns"
      :rows="loans as unknown as Record<string, unknown>[]"
      :show-row-numbers="false"
      :show-actions="false"
      :pagination="false"
      :sortable="false"
    >
      <template #actions="{ row }">
        <div style="display: flex; gap: 0.5rem">
          <Button
            :label="$t('serviceDesk.renew')"
            size="small"
            outlined
            @click="$emit('renew', row as unknown as LoanRecord)"
          />
          <Button
            :label="$t('serviceDesk.return')"
            size="small"
            severity="success"
            outlined
            @click="$emit('return', row as unknown as LoanRecord)"
          />
        </div>
      </template>
    </AppDataTable>
  </div>
</template>