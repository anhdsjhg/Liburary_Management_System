<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import type { LoanRecord } from "@/api/service-desk/users/[id]/get/types";
import { formatDate } from "@/application/utils/date";

const { t } = useI18n();

defineProps<{
  loans: LoanRecord[];
  history: LoanRecord[];
  duration: number;
}>();

const emit = defineEmits<{
  (e: "renew", loan: LoanRecord): void;
  (e: "return", loan: LoanRecord): void;
}>();

type Tab = "loans" | "history";
const activeTab = ref<Tab>("loans");

function getStatusSeverity(status: string) {
  if (status === "issued") return "warn";
  if (status === "overdue") return "danger";
  if (status === "returned") return "success";
  return "secondary";
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    issued: t("serviceDesk.borrowed"),
    returned: t("serviceDesk.returned"),
    overdue: t("serviceDesk.overdue"),
    "returned/overdue": t("serviceDesk.overdue"),
  };
  return map[status] ?? status;
}
</script>

<template>
  <div class="books-table">
    <div class="books-table__tabs">
      <Button
        :label="$t('serviceDesk.current_loans') + ` (${loans.length})`"
        :severity="activeTab === 'loans' ? 'primary' : 'secondary'"
        :outlined="activeTab !== 'loans'"
        size="small"
        @click="activeTab = 'loans'"
      />
      <Button
        :label="$t('serviceDesk.history') + ` (${history.length})`"
        :severity="activeTab === 'history' ? 'primary' : 'secondary'"
        :outlined="activeTab !== 'history'"
        size="small"
        @click="activeTab = 'history'"
      />
    </div>

    <!-- Current loans -->
    <DataTable
      v-if="activeTab === 'loans'"
      :value="loans"
      scrollable
      scroll-height="auto"
      size="small"
      striped-rows
    >
      <Column field="inv_id" :header="$t('serviceDesk.inv_id')" style="min-width: 7rem" />
      <Column field="barcode" :header="$t('serviceDesk.barcode')" style="min-width: 8rem" />
      <Column field="title" :header="$t('serviceDesk.title')" style="min-width: 14rem" />
      <Column field="author" :header="$t('serviceDesk.author')" style="min-width: 10rem">
        <template #body="{ data }">{{ data.author ?? "—" }}</template>
      </Column>
      <Column field="borrow_date" :header="$t('serviceDesk.borrow_date')" style="min-width: 8rem">
        <template #body="{ data }">{{ formatDate(data.borrow_date) ?? "—" }}</template>
      </Column>
      <Column field="due_date" :header="$t('serviceDesk.due_date')" style="min-width: 8rem">
        <template #body="{ data }">{{ formatDate(data.due_date) ?? "—" }}</template>
      </Column>
      <Column field="renew_times" :header="$t('serviceDesk.renew_times')" style="min-width: 6rem" />
      <Column field="status" :header="$t('serviceDesk.status')" style="min-width: 8rem">
        <template #body="{ data }">
          <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
        </template>
      </Column>
      <Column field="comments" :header="$t('serviceDesk.comments')" style="min-width: 10rem">
        <template #body="{ data }">{{ data.comments ?? "—" }}</template>
      </Column>
      <Column :header="$t('common.actions')" style="min-width: 11rem" frozen align-frozen="right">
        <template #body="{ data }">
          <div style="display: flex; gap: 0.375rem">
            <Button
              :label="$t('serviceDesk.renew')"
              size="small"
              severity="info"
              outlined
              @click="emit('renew', data)"
            />
            <Button
              :label="$t('serviceDesk.return')"
              size="small"
              severity="success"
              outlined
              @click="emit('return', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- History -->
    <DataTable
      v-else
      :value="history"
      scrollable
      scroll-height="auto"
      size="small"
      striped-rows
    >
      <Column field="inv_id" :header="$t('serviceDesk.inv_id')" style="min-width: 7rem" />
      <Column field="barcode" :header="$t('serviceDesk.barcode')" style="min-width: 8rem" />
      <Column field="title" :header="$t('serviceDesk.title')" style="min-width: 14rem" />
      <Column field="author" :header="$t('serviceDesk.author')" style="min-width: 10rem">
        <template #body="{ data }">{{ data.author ?? "—" }}</template>
      </Column>
      <Column field="borrow_date" :header="$t('serviceDesk.borrow_date')" style="min-width: 8rem">
        <template #body="{ data }">{{ formatDate(data.borrow_date) ?? "—" }}</template>
      </Column>
      <Column field="due_date" :header="$t('serviceDesk.due_date')" style="min-width: 8rem">
        <template #body="{ data }">{{ formatDate(data.due_date) ?? "—" }}</template>
      </Column>
      <Column field="delivery_date" :header="$t('serviceDesk.delivery_date')" style="min-width: 8rem">
        <template #body="{ data }">{{ data.delivery_date ? formatDate(data.delivery_date) : "—" }}</template>
      </Column>
      <Column field="status" :header="$t('serviceDesk.status')" style="min-width: 8rem">
        <template #body="{ data }">
          <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
        </template>
      </Column>
      <Column field="comments" :header="$t('serviceDesk.comments')" style="min-width: 10rem">
        <template #body="{ data }">{{ data.comments ?? "—" }}</template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.books-table {
  margin-top: 1.5rem;
}
.books-table__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
</style>
