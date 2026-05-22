<script setup lang="ts">
import { ref, computed } from "vue";
import { useServiceLoansApi } from "@/api/service-desk/loans/get";
import { formatDate } from "@/application/utils/date";
import type { ServiceLoansRequest } from "@/api/service-desk/loans/get/types";
import AppPaginator from "@/application/components/AppPaginator.vue";

const query = ref("");
const selectedStatus = ref<string | null>(null);
const dateFrom = ref<string | null>(null);
const dateTo = ref<string | null>(null);
const currentPage = ref(1);
const PER_PAGE = 25;

const statusOptions = [
  { label: "All statuses", value: null },
  { label: "Issued", value: "issued" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

const params = computed<ServiceLoansRequest>(() => ({
  query: query.value.trim() || undefined,
  status: selectedStatus.value ?? undefined,
  date_from: dateFrom.value ?? undefined,
  date_to: dateTo.value ?? undefined,
  page: currentPage.value,
  per_page: PER_PAGE,
}));

const { data, isFetching, refetch } = useServiceLoansApi(params);

const loans = computed(() => data.value?.res?.data ?? []);
const total = computed(() => data.value?.res?.total ?? 0);

const meta = computed(() => ({
  total: total.value,
  current_page: data.value?.res?.current_page ?? 1,
  last_page: data.value?.res?.last_page ?? 1,
  per_page: PER_PAGE,
  from: ((data.value?.res?.current_page ?? 1) - 1) * PER_PAGE + 1,
  to: Math.min((data.value?.res?.current_page ?? 1) * PER_PAGE, total.value),
}));

function statusSeverity(status: string, isOverdue: boolean) {
  if (isOverdue) return "danger";
  if (status === "returned") return "success";
  if (status === "issued") return "warn";
  return "secondary";
}

function search() {
  currentPage.value = 1;
  refetch();
}

function onPageChange(page: number) {
  currentPage.value = page;
}
</script>

<template>
  <div class="sd-book-history">
    <div class="sd-book-history__header">
      <span class="sd-book-history__title">{{ $t("serviceDesk.book_history") }}</span>
    </div>

    <div class="sd-book-history__filters">
      <InputText
        v-model="query"
        :placeholder="$t('serviceDesk.user_placeholder')"
        @keydown.enter="search"
      />
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        :placeholder="$t('serviceDesk.all_statuses')"
      />
      <DatePicker
        v-model="dateFrom"
        :placeholder="$t('serviceDesk.date_from')"
        date-format="yy-mm-dd"
        show-button-bar
      />
      <DatePicker
        v-model="dateTo"
        :placeholder="$t('serviceDesk.date_to')"
        date-format="yy-mm-dd"
        show-button-bar
      />
      <Button :label="$t('serviceDesk.search')" @click="search" />
    </div>

    <Skeleton v-if="isFetching" height="20rem" />

    <DataTable v-else :value="loans" striped-rows>
      <Column field="id" header="ID" style="width: 4rem" />
      <Column field="user_name" :header="$t('serviceDesk.user_name')" />
      <Column field="user_cid" :header="$t('serviceDesk.user_cid')" />
      <Column field="media_title" :header="$t('serviceDesk.media_title')" />
      <Column field="inventory_number" :header="$t('serviceDesk.inventory_number')" />
      <Column :header="$t('serviceDesk.given_at')">
        <template #body="{ data: row }">{{ formatDate(row.given_at) }}</template>
      </Column>
      <Column :header="$t('serviceDesk.due_at')">
        <template #body="{ data: row }">{{ formatDate(row.due_at) }}</template>
      </Column>
      <Column :header="$t('serviceDesk.returned_at')">
        <template #body="{ data: row }">{{ row.returned_at ? formatDate(row.returned_at) : "—" }}</template>
      </Column>
      <Column :header="$t('serviceDesk.status')">
        <template #body="{ data: row }">
          <Tag
            :value="row.status"
            :severity="statusSeverity(row.status, row.is_overdue)"
          />
        </template>
      </Column>
    </DataTable>

    <AppPaginator
      v-if="total > PER_PAGE"
      :meta="meta"
      :page="currentPage"
      @update:page="onPageChange"
    />
  </div>
</template>

<style scoped>
.sd-book-history__header {
  margin-bottom: 1.5rem;
}
.sd-book-history__title {
  font-size: 1.25rem;
  font-weight: 600;
}
.sd-book-history__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
}
</style>
