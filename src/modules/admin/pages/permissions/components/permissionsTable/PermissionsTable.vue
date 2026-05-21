<script setup lang="ts">
import type { ServiceUser } from "@/api/service-desk/users/get/types";

defineProps<{
  users: ServiceUser[];
  isLoading: boolean;
  currentPage: number;
  total: number;
  perPage: number;
  lastPage: number;
}>();

const emit = defineEmits<{
  "update:page": [page: number];
  manage: [user: ServiceUser];
}>();
</script>

<template>
  <div class="admin-user-table">
    <Skeleton v-if="isLoading" height="20rem" />

    <template v-else>
      <DataTable
        :value="users"
        class="admin-user-table__table"
        striped-rows
      >
        <Column field="full_name" :header="$t('admin.fullName')" />
        <Column field="username" :header="$t('admin.username')" />
        <Column :header="$t('admin.type')">
          <template #body="{ data }">
            {{ $t(`admin.userType.${data.type}`) }}
          </template>
        </Column>
        <Column :header="$t('admin.manage')" style="width: 8rem; text-align: center">
          <template #body="{ data }">
            <Button
              icon="pi pi-lock-open"
              size="small"
              severity="secondary"
              :label="$t('admin.manage')"
              @click="emit('manage', data)"
            />
          </template>
        </Column>

        <template #empty>
          <div class="admin-user-table__empty">{{ $t("admin.noUsers") }}</div>
        </template>
      </DataTable>

      <div v-if="lastPage > 1" class="admin-user-table__pagination">
        <Paginator
          :rows="perPage"
          :total-records="total"
          :first="(currentPage - 1) * perPage"
          @page="(e) => emit('update:page', e.page + 1)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.admin-user-table__empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.admin-user-table__pagination {
  margin-top: 1rem;
}
</style>
