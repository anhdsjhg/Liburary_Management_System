<script setup lang="ts">
import { ref, computed } from "vue";
import { useServiceDeskUsers } from "./composables/useComposable";
import { useUserCard } from "./components/userCard/composables/useComposable";
import { useServiceReturnApi } from "@/api/service-desk/actions/return/post";
import { useServiceSetPenaltyApi, useServiceCancelPenaltyApi } from "@/api/service-desk/actions/penalty/post";
import { useAuthStore } from "@/application/stores/auth.store";
import { useI18n } from "vue-i18n";
import UserCard from "./components/userCard/UserCard.vue";
import BooksTable from "./components/booksTable/BooksTable.vue";
import RenewBooksDialog from "./components/renewBooksDialog/RenewBooksDialog.vue";
import AppPaginator from "@/application/components/AppPaginator.vue";
import type { LoanRecord } from "@/api/service-desk/users/[id]/get/types";
import type { ServiceUser } from "@/api/service-desk/users/get/types";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

const { t } = useI18n();
const authStore = useAuthStore();

const {
  searchQuery,
  selectedType,
  typeOptions,
  results,
  meta,
  isLoading,
  currentPage,
  load,
  onPageChange,
} = useServiceDeskUsers();

const selectedUser = ref<ServiceUser | null>(null);
const selectedUserType = computed(() => selectedUser.value?.type ?? "student");
const selectedUserId = computed(() => selectedUser.value?.id ?? "");

const {
  info,
  photo,
  total,
  currentLoans,
  history,
  penalty,
  duration,
  isUnlimited,
  refetch,
  toggleActivity,
  toggleUnlimited,
} = useUserCard(selectedUserType, selectedUserId);

const { mutate: returnMaterial } = useServiceReturnApi();
const { mutate: setPenalty } = useServiceSetPenaltyApi();
const { mutate: cancelPenalty } = useServiceCancelPenaltyApi();

const renewDialogVisible = ref(false);
const selectedLoan = ref<LoanRecord | null>(null);

function selectUser(user: ServiceUser) {
  selectedUser.value = user;
}

function onRenew(loan: LoanRecord) {
  selectedLoan.value = loan;
  renewDialogVisible.value = true;
}

function onReturn(loan: LoanRecord) {
  if (!info.value) return;
  returnMaterial(
    {
      inv_id: loan.inv_id,
      user_cid: info.value.user_cid,
      loan_id: loan.loan_id,
      librarian_user_cid: authStore.user?.user_cid ?? "",
      material_id: loan.material_id,
    },
    {
      onSuccess() {
        showSuccessToast(t("serviceDesk.return_success"));
        refetch();
      },
      onError() {
        showErrorToast(t("common.error"));
      },
    }
  );
}

function onSetPenalty() {
  if (!penalty.value || !info.value) return;
  setPenalty(
    { penalty_id: penalty.value.penalty_id, user_cid: info.value.user_cid },
    {
      onSuccess() {
        showSuccessToast(t("serviceDesk.penalty_set"));
        refetch();
      },
      onError() {
        showErrorToast(t("common.error"));
      },
    }
  );
}

function onCancelPenalty() {
  if (!penalty.value || !info.value) return;
  cancelPenalty(
    { penalty_id: penalty.value.penalty_id, user_cid: info.value.user_cid },
    {
      onSuccess() {
        showSuccessToast(t("serviceDesk.penalty_cancelled"));
        refetch();
      },
      onError() {
        showErrorToast(t("common.error"));
      },
    }
  );
}
</script>

<template>
  <div class="service-desk-users-page">
    <div class="service-desk-users-page__header">
      <span class="service-desk-users-page__title">
        {{ $t("serviceDesk.users") }}
      </span>
    </div>

    <div class="service-desk-users-page__search-bar">
      <Select
        v-model="selectedType"
        :options="typeOptions"
        option-label="label"
        option-value="value"
        class="service-desk-users-page__type-select"
      />
      <InputText
        v-model="searchQuery"
        :placeholder="$t('serviceDesk.user_placeholder')"
        class="service-desk-users-page__search-input"
        @keydown.enter="load(1)"
      />
      <Button :label="$t('serviceDesk.search')" @click="load(1)" />
    </div>

    <div style="display: flex; gap: 1.5rem; align-items: flex-start">
      <!-- Left: user search results -->
      <div style="flex: 1; min-width: 0">
        <Skeleton v-if="isLoading" height="12rem" />

        <template v-else>
          <div
            v-for="user in results.data"
            :key="user.id"
            class="service-desk-users-page__user-row"
            :class="{ 'service-desk-users-page__user-row--selected': selectedUser?.id === user.id }"
            @click="selectUser(user)"
          >
            <div style="font-weight: 600">{{ user.full_name }}</div>
            <div style="font-size: 0.875rem; color: var(--text-color-secondary)">
              {{ user.username }} · {{ user.type }}
            </div>
          </div>

          <div
            v-if="!results.data.length && searchQuery"
            style="color: var(--text-color-secondary); padding: 1rem 0"
          >
            {{ $t("serviceDesk.no_results") }}
          </div>

          <AppPaginator
            v-if="results.total > results.per_page"
            :meta="meta"
            :page="currentPage"
            @update:page="onPageChange"
          />
        </template>
      </div>

      <!-- Right: selected user details -->
      <div v-if="selectedUser" style="flex: 2; min-width: 0">
        <UserCard
          :info="info"
          :photo="photo"
          :total="total"
          :current-loans="currentLoans"
          :penalty="penalty"
          :duration="duration"
          :is-unlimited="isUnlimited"
          @toggle-activity="toggleActivity"
          @toggle-unlim="toggleUnlimited"
          @set-penalty="onSetPenalty"
          @cancel-penalty="onCancelPenalty"
        />

        <BooksTable
          v-if="currentLoans.length || history.length"
          :loans="currentLoans"
          :history="history"
          :duration="duration"
          @renew="onRenew"
          @return="onReturn"
        />
      </div>
    </div>

    <RenewBooksDialog
      v-model:visible="renewDialogVisible"
      :loan="selectedLoan"
      :user-cid="info?.user_cid ?? ''"
      :default-duration="duration"
      @success="refetch"
    />
  </div>
</template>

<style scoped>
.service-desk-users-page__user-row {
  padding: 0.75rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  cursor: pointer;
  background-color: var(--surface-card);
  transition: border-color 0.15s;
}
.service-desk-users-page__user-row--selected {
  border-color: var(--primary-color);
}
.service-desk-users-page__user-row:hover {
  border-color: var(--primary-color);
}
</style>
