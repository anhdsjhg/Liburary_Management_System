<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/application/stores/auth.store";
import { RouteNames } from "@/application/router/routeNames";
import { useMyBooks } from "./composables/useMyBooks";
import MyBookCard from "./components/MyBookCard.vue";
import { useUserRenewApi } from "@/api/user/renew/post";
import { useServiceCancelReserveApi } from "@/api/service-desk/actions/cancel-reserve/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import type { UserMyBooksLoan } from "@/api/user/my-books/get/types";
import type { UserReserveItem } from "@/api/user/reserve-list/get/types";

const { t } = useI18n();
const authStore = useAuthStore();
const { user, loginVisible } = storeToRefs(authStore);
const queryClient = useQueryClient();

const activeTab = ref<"loans" | "reserves">("loans");

const {
  loans,
  activeLoans,
  reserves,
  userInfo,
  photo,
  total,
  isUnlimited,
  duration,
  loansLoading,
  reservesLoading,
} = useMyBooks();

// ── Renew ──────────────────────────────────────────────────────────────────
const { mutate: renewBook, isPending: isRenewing } = useUserRenewApi();
const showRenewDialog = ref(false);
const selectedLoan = ref<UserMyBooksLoan | null>(null);
const renewDuration = ref(30);

function openRenewDialog(loan: UserMyBooksLoan) {
  selectedLoan.value = loan;
  renewDuration.value = duration.value || 21;
  showRenewDialog.value = true;
}

function confirmRenew() {
  if (!selectedLoan.value || !user.value) return;
  renewBook(
    {
      loan_id: Number(selectedLoan.value.loan_id),
      inv_id: selectedLoan.value.inv_id,
      user_cid: user.value.user_cid,
      duration: renewDuration.value || 21,
      librarian_user_cid: "0",
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["get:user-my-books"] });
        showRenewDialog.value = false;
        showSuccessToast(t("home.renew_success"));
      },
      onError() {
        showErrorToast(t("home.renew_error"));
      },
    }
  );
}

// ── Cancel reservation ─────────────────────────────────────────────────────
const { mutate: cancelReserve, isPending: isCanceling } = useServiceCancelReserveApi();
const showCancelDialog = ref(false);
const selectedReserve = ref<UserReserveItem | null>(null);

function openCancelDialog(reserve: UserReserveItem) {
  selectedReserve.value = reserve;
  showCancelDialog.value = true;
}

function confirmCancel() {
  if (!selectedReserve.value) return;
  cancelReserve(
    { material_id: selectedReserve.value.material_id },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["get:user-reserve-list"] });
        showCancelDialog.value = false;
        showSuccessToast(t("home.cancel_reserve_success"));
      },
      onError() {
        showErrorToast(t("home.cancel_reserve_error"));
      },
    }
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function loanStatusSeverity(
  status: string
): "info" | "success" | "danger" | "secondary" {
  if (status === "returned") return "success";
  if (status === "overdue") return "danger";
  if (status === "issued") return "info";
  return "secondary";
}

function reserveStatusSeverity(
  status: string
): "success" | "warn" | "danger" | "secondary" {
  const s = status.toLowerCase();
  if (s === "expired") return "danger";
  if (s === "in queue") return "warn";
  if (s === "ready") return "success";
  return "secondary";
}

function statusKey(status: string) {
  return `home.status_${status.toLowerCase().replace(/\s+/g, "_")}`;
}

function formatDate(d?: string | null) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

function typeKey(type: string) {
  const t = type.toLowerCase();
  if (t === "employee") return "home.info_type_employee";
  if (t === "student") return "home.info_type_student";
  return type;
}

const initials = computed(() => {
  if (!userInfo.value?.full_name) return "?";
  return userInfo.value.full_name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
});

const totalBorrowed = computed(
  () => (total.value?.borrowed ?? 0) + (activeLoans.value?.length ?? 0)
);
</script>

<template>
  <div class="my-books-page">
    <!-- ── Hero ── -->
    <header class="my-books-page__hero">
      <div class="my-books-page__container">
        <nav class="my-books-page__breadcrumb">
          <RouterLink to="/" class="my-books-page__breadcrumb-link">
            <i class="pi pi-home" />
            <span>{{ $t("home.home") }}</span>
          </RouterLink>
          <i class="pi pi-angle-right my-books-page__breadcrumb-sep" />
          <span class="my-books-page__breadcrumb-current">
            {{ $t("home.my_books") }}
          </span>
        </nav>

        <div class="my-books-page__hero-text">
          <span class="my-books-page__eyebrow">
            <i class="pi pi-user" />
            {{ $t("home.personal_library") }}
          </span>
          <h1 class="my-books-page__title">{{ $t("home.my_books") }}</h1>
          <p class="my-books-page__subtitle">
            {{ $t("home.my_books_subtitle") }}
          </p>
        </div>
      </div>
    </header>

    <!-- ── Unauthenticated ── -->
    <div v-if="!user" class="my-books-page__container my-books-page__body">
      <div class="my-books-page__auth-prompt">
        <div class="my-books-page__auth-icon-wrap">
          <i class="pi pi-lock" />
        </div>
        <h2>{{ $t("home.my_books_login_title") }}</h2>
        <p>{{ $t("home.my_books_login_desc") }}</p>
        <Button
          :label="$t('home.login')"
          icon="pi pi-sign-in"
          size="large"
          @click="loginVisible = true"
        />
      </div>
    </div>

    <!-- ── Authenticated ── -->
    <template v-else>
      <div class="my-books-page__container my-books-page__body">
        <!-- Profile card -->
        <section v-if="userInfo" class="my-books-page__profile">
          <div class="my-books-page__profile-main">
            <div class="my-books-page__avatar">
              <img
                v-if="photo"
                :src="photo"
                :alt="userInfo.full_name"
              />
              <span v-else class="my-books-page__avatar-initials">
                {{ initials }}
              </span>
            </div>

            <div class="my-books-page__profile-info">
              <div class="my-books-page__profile-name-row">
                <h2 class="my-books-page__profile-name">
                  {{ userInfo.full_name }}
                </h2>
                <span class="my-books-page__profile-type">
                  {{ $t(typeKey(userInfo.type)) }}
                </span>
                <span v-if="isUnlimited" class="my-books-page__unlimited">
                  <i class="pi pi-infinity" />
                  {{ $t("home.unlimited_borrowing") }}
                </span>
              </div>

              <p v-if="userInfo.position" class="my-books-page__profile-sub">
                {{ userInfo.position }}
                <template v-if="userInfo.department">
                  <span class="my-books-page__profile-divider">•</span>
                  {{ userInfo.department }}
                </template>
              </p>

              <ul class="my-books-page__profile-details">
                <li v-if="userInfo.degree">
                  <i class="pi pi-graduation-cap" />
                  <span>{{ userInfo.degree }}</span>
                </li>
                <li v-if="userInfo.mobile">
                  <i class="pi pi-phone" />
                  <span>{{ userInfo.mobile }}</span>
                </li>
                <li v-if="userInfo.contact_email">
                  <i class="pi pi-envelope" />
                  <span>{{ userInfo.contact_email }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Stats -->
          <div v-if="total" class="my-books-page__stats">
            <div class="my-books-page__stat">
              <span class="my-books-page__stat-icon"><i class="pi pi-book" /></span>
              <div>
                <span class="my-books-page__stat-value">{{ totalBorrowed }}</span>
                <span class="my-books-page__stat-label">
                  {{ $t("home.stat_borrowed") }}
                </span>
              </div>
            </div>

            <div
              v-if="total.dept > 0"
              class="my-books-page__stat my-books-page__stat--danger"
            >
              <span class="my-books-page__stat-icon">
                <i class="pi pi-exclamation-triangle" />
              </span>
              <div>
                <span class="my-books-page__stat-value">{{ total.dept }}</span>
                <span class="my-books-page__stat-label">
                  {{ $t("home.stat_overdue") }}
                </span>
              </div>
            </div>

            <div class="my-books-page__stat">
              <span class="my-books-page__stat-icon">
                <i class="pi pi-check-circle" />
              </span>
              <div>
                <span class="my-books-page__stat-value">{{ total.returned }}</span>
                <span class="my-books-page__stat-label">
                  {{ $t("home.stat_returned") }}
                </span>
              </div>
            </div>

            <div
              v-if="total.penalty > 0"
              class="my-books-page__stat my-books-page__stat--danger"
            >
              <span class="my-books-page__stat-icon">
                <i class="pi pi-wallet" />
              </span>
              <div>
                <span class="my-books-page__stat-value">{{ total.penalty }}</span>
                <span class="my-books-page__stat-label">
                  {{ $t("home.stat_penalty") }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Tabs -->
        <div class="my-books-page__tabs" role="tablist">
          <button
            role="tab"
            type="button"
            class="my-books-page__tab"
            :class="{ 'my-books-page__tab--active': activeTab === 'loans' }"
            :aria-selected="activeTab === 'loans'"
            @click="activeTab = 'loans'"
          >
            <i class="pi pi-book" />
            <span>{{ $t("home.borrowed_books") }}</span>
            <span
              v-if="activeLoans.length"
              class="my-books-page__tab-badge"
            >{{ activeLoans.length }}</span>
          </button>
          <button
            role="tab"
            type="button"
            class="my-books-page__tab"
            :class="{ 'my-books-page__tab--active': activeTab === 'reserves' }"
            :aria-selected="activeTab === 'reserves'"
            @click="activeTab = 'reserves'"
          >
            <i class="pi pi-clock" />
            <span>{{ $t("home.reserved_books") }}</span>
            <span
              v-if="reserves.length"
              class="my-books-page__tab-badge"
            >{{ reserves.length }}</span>
          </button>
        </div>

        <!-- ── Loans tab ── -->
        <div v-show="activeTab === 'loans'" role="tabpanel">
          <div v-if="loansLoading" class="my-books-page__list">
            <Skeleton v-for="i in 4" :key="i" height="96px" border-radius="14px" />
          </div>

          <div v-else-if="!activeLoans.length" class="my-books-page__empty">
            <div class="my-books-page__empty-icon-wrap">
              <i class="pi pi-inbox" />
            </div>
            <h3>{{ $t("home.no_loans_title") }}</h3>
            <p>{{ $t("home.no_loans") }}</p>
            <RouterLink
              :to="{ name: RouteNames.WEBSITE_HOME }"
              class="my-books-page__empty-link"
            >
              {{ $t("home.browse_catalog") }}
              <i class="pi pi-arrow-right" />
            </RouterLink>
          </div>

          <div v-else class="my-books-page__list">
            <MyBookCard
              v-for="loan in activeLoans"
              :key="loan.loan_id"
              :book-id="loan.media_id"
              :title="loan.title"
              :author="loan.authors"
              :inv="loan.barcode ?? String(loan.inv_id)"
              :status="loan.status"
              :status-label="$t(statusKey(loan.status))"
              :status-severity="loanStatusSeverity(loan.status)"
              :can-renew="loan.status !== 'returned' && Number(loan.renew_times ?? 0) < 2"
              :is-renewing="isRenewing && selectedLoan?.loan_id === loan.loan_id"
              :dates="[
                { label: $t('home.given_at'), value: formatDate(loan.issue_date) },
                {
                  label: $t('home.due_at'),
                  value: formatDate(loan.due_date),
                  danger: loan.status === 'overdue',
                },
              ]"
              @renew="openRenewDialog(loan)"
            />
          </div>

          <details
            v-if="!loansLoading && loans.length"
            class="my-books-page__history"
          >
            <summary class="my-books-page__history-toggle">
              <div class="my-books-page__history-label">
                <i class="pi pi-history" />
                <span>{{ $t("home.all_history") }}</span>
                <span class="my-books-page__tab-badge my-books-page__tab-badge--neutral">
                  {{ loans.length }}
                </span>
              </div>
              <i class="pi pi-chevron-down my-books-page__history-chev" />
            </summary>

            <div class="my-books-page__list my-books-page__list--history">
              <MyBookCard
                v-for="loan in loans"
                :key="loan.loan_id"
                history
                :book-id="loan.media_id"
                :title="loan.title"
                :author="loan.authors"
                :status="loan.status"
                :status-label="$t(statusKey(loan.status))"
                :status-severity="loanStatusSeverity(loan.status)"
                :dates="[
                  { label: $t('home.given_at'), value: formatDate(loan.issue_date) },
                  { label: $t('home.returned_at'), value: formatDate(loan.delivery_date) },
                ]"
              />
            </div>
          </details>
        </div>

        <!-- ── Reserves tab ── -->
        <div v-show="activeTab === 'reserves'" role="tabpanel">
          <div v-if="reservesLoading" class="my-books-page__list">
            <Skeleton v-for="i in 3" :key="i" height="96px" border-radius="14px" />
          </div>

          <div v-else-if="!reserves.length" class="my-books-page__empty">
            <div class="my-books-page__empty-icon-wrap">
              <i class="pi pi-clock" />
            </div>
            <h3>{{ $t("home.no_reserves_title") }}</h3>
            <p>{{ $t("home.no_reserves") }}</p>
            <RouterLink
              :to="{ name: RouteNames.WEBSITE_HOME }"
              class="my-books-page__empty-link"
            >
              {{ $t("home.browse_catalog") }}
              <i class="pi pi-arrow-right" />
            </RouterLink>
          </div>

          <div v-else class="my-books-page__list">
            <MyBookCard
              v-for="(reserve, index) in reserves"
              :key="index"
              :book-id="reserve.material_id"
              :title="reserve.title"
              :author="reserve.author"
              :status="reserve.status"
              :status-label="$t(statusKey(reserve.status))"
              :status-severity="reserveStatusSeverity(reserve.status)"
              :can-cancel="reserve.status.toLowerCase() !== 'expired'"
              :is-canceling="isCanceling && selectedReserve?.material_id === reserve.material_id"
              :dates="[
                {
                  label: $t('home.reserved_at'),
                  value: formatDate(reserve.reservation_date),
                },
              ]"
              @cancel="openCancelDialog(reserve)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- ── Renew Dialog ── -->
    <Dialog
      v-model:visible="showRenewDialog"
      :header="$t('home.renew')"
      :modal="true"
      :draggable="false"
      :style="{ width: '22rem' }"
    >
      <div class="renew-dialog__body">
        <p v-if="selectedLoan" class="renew-dialog__book-title">
          {{ selectedLoan.title }}
        </p>
        <label class="renew-dialog__label">{{ $t("home.renew_days") }}</label>
        <InputNumber
          v-model="renewDuration"
          :min="1"
          :max="duration"
          show-buttons
          class="w-full"
        />
      </div>
      <template #footer>
        <Button
          :label="$t('common.cancel')"
          severity="secondary"
          text
          @click="showRenewDialog = false"
        />
        <Button
          :label="$t('home.renew')"
          icon="pi pi-refresh"
          :loading="isRenewing"
          @click="confirmRenew"
        />
      </template>
    </Dialog>

    <!-- ── Cancel Reservation Dialog ── -->
    <Dialog
      v-model:visible="showCancelDialog"
      :header="$t('home.cancel_reserve')"
      :modal="true"
      :draggable="false"
      :style="{ width: '22rem' }"
    >
      <p class="cancel-dialog__message">
        {{ $t("home.cancel_reserve_confirm") }}
      </p>
      <p v-if="selectedReserve" class="cancel-dialog__book-title">
        {{ selectedReserve.title }}
      </p>
      <template #footer>
        <Button
          :label="$t('common.cancel')"
          severity="secondary"
          text
          @click="showCancelDialog = false"
        />
        <Button
          :label="$t('home.cancel_reserve')"
          icon="pi pi-times-circle"
          severity="danger"
          :loading="isCanceling"
          @click="confirmCancel"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.renew-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.renew-dialog__book-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.renew-dialog__label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.cancel-dialog__message {
  margin: 0 0 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.cancel-dialog__book-title {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}
</style>
