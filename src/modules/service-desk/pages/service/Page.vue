<script setup lang="ts">
import { ref } from "vue";
import { useServiceDesk } from "./composables/useComposable";
import ActionsPanel from "./components/actionsPanel/ActionsPanel.vue";

const {
  materialBarcode,
  userQuery,
  scannedMaterials,
  selectedUser,
  isLoadingMaterial,
  isLoadingUser,
  scanMaterial,
  searchUser,
  give,
  returnItem,
} = useServiceDesk();

const selectedMaterial = ref(null);
</script>

<template>
  <div class="service-desk-service-page">
    <div class="service-desk-service-page__body">
      <aside class="service-desk-service-page__scanner">
        <div class="service-desk-service-page__scanner-title">
          {{ $t("serviceDesk.service") }}
        </div>

        <div class="p-field">
          <label>{{ $t("serviceDesk.user_placeholder") }}</label>
          <InputText
            v-model="userQuery"
            :placeholder="$t('serviceDesk.user_placeholder')"
            class="w-full"
            @keydown.enter="searchUser"
          />
          <Button
            :label="$t('serviceDesk.search')"
            :loading="isLoadingUser"
            class="w-full"
            style="margin-top: 0.5rem"
            @click="searchUser"
          />
        </div>

        <div v-if="selectedUser" style="font-size: 0.875rem; padding: 0.5rem; background-color: var(--surface-ground); border-radius: var(--border-radius)">
          <div style="font-weight: 700">{{ selectedUser.full_name }}</div>
          <div style="color: var(--text-color-secondary)">{{ selectedUser.username }}</div>
        </div>

        <div class="p-field">
          <label>{{ $t("serviceDesk.barcode") }}</label>
          <InputText
            v-model="materialBarcode"
            :placeholder="$t('serviceDesk.scanner_placeholder')"
            class="w-full"
            @keydown.enter="scanMaterial"
          />
          <Button
            :label="$t('serviceDesk.search')"
            :loading="isLoadingMaterial"
            class="w-full"
            style="margin-top: 0.5rem"
            @click="scanMaterial"
          />
        </div>
      </aside>

      <div class="service-desk-service-page__results">
        <div
          v-for="material in scannedMaterials"
          :key="material.inv_id"
        >
          <ActionsPanel
            :material="material"
            :user="selectedUser"
            @success="scanMaterial"
          />
        </div>

        <div
          v-if="!scannedMaterials.length"
          style="color: var(--text-color-secondary); padding: 2rem 0; text-align: center"
        >
          {{ $t("serviceDesk.scanner_placeholder") }}
        </div>
      </div>
    </div>
  </div>
</template>