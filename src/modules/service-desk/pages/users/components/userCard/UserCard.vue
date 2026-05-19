<script setup lang="ts">
import type { ServiceUserInfo, LoanRecord, UserTotal, PenaltyRecord } from "@/api/service-desk/users/[id]/get/types";
import { ASSETS } from "@/application/configs/constants";

defineProps<{
  info: ServiceUserInfo | null;
  photo: string | null;
  total: UserTotal | null;
  currentLoans: LoanRecord[];
  penalty: PenaltyRecord | null;
  duration: number;
  isUnlimited: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-activity"): void;
  (e: "toggle-unlim"): void;
  (e: "set-penalty"): void;
  (e: "cancel-penalty"): void;
}>();
</script>

<template>
  <div v-if="info" class="user-card">
    <div class="user-card__photo">
      <img
        v-if="photo"
        :src="photo"
        :alt="info.full_name"
        style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover"
      />
      <i v-else class="pi pi-user" />
    </div>

    <div class="user-card__info">
      <div class="user-card__name">{{ info.full_name }}</div>
      <div class="user-card__meta">{{ info.username }}</div>
      <div v-if="info.department || info.faculty" class="user-card__meta">
        {{ info.department ?? info.faculty }}
      </div>
      <div v-if="info.contact_email" class="user-card__meta">
        {{ info.contact_email }}
      </div>

      <div class="user-card__badges">
        <span
          class="user-card__badge"
          :class="info.is_active ? 'user-card__badge--active' : 'user-card__badge--inactive'"
        >
          {{ info.is_active ? $t("serviceDesk.active") : $t("serviceDesk.inactive") }}
        </span>
        <span v-if="penalty?.is_active" class="user-card__badge user-card__badge--penalty">
          {{ $t("serviceDesk.penalty") }}
        </span>
        <span v-if="isUnlimited" class="user-card__badge user-card__badge--unlimited">
          {{ $t("serviceDesk.unlimited") }}
        </span>
      </div>

      <div v-if="total" class="user-card__stats">
        <div class="user-card__stat">
          <div class="user-card__stat-value">{{ total.borrowed }}</div>
          <div class="user-card__stat-label">{{ $t("serviceDesk.borrowed") }}</div>
        </div>
        <div class="user-card__stat">
          <div class="user-card__stat-value">{{ total.dept }}</div>
          <div class="user-card__stat-label">{{ $t("serviceDesk.overdue") }}</div>
        </div>
        <div class="user-card__stat">
          <div class="user-card__stat-value">{{ total.returned }}</div>
          <div class="user-card__stat-label">{{ $t("serviceDesk.returned") }}</div>
        </div>
      </div>
    </div>

    <div class="user-card__actions">
      <Button
        :label="info.is_active ? $t('serviceDesk.deactivate') : $t('serviceDesk.activate')"
        :severity="info.is_active ? 'danger' : 'success'"
        outlined
        size="small"
        @click="$emit('toggle-activity')"
      />
      <Button
        :label="$t('serviceDesk.toggle_unlim')"
        severity="info"
        outlined
        size="small"
        @click="$emit('toggle-unlim')"
      />
      <Button
        v-if="penalty?.is_active"
        :label="$t('serviceDesk.cancel_penalty')"
        severity="warning"
        outlined
        size="small"
        @click="$emit('cancel-penalty')"
      />
      <Button
        v-else
        :label="$t('serviceDesk.set_penalty')"
        severity="danger"
        outlined
        size="small"
        @click="$emit('set-penalty')"
      />
    </div>
  </div>
</template>