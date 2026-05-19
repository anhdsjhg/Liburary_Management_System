<template>
  <Select
    v-model="currentLocale"
    optionLabel="label"
    :options="[...locales]"
    @change="setLocale($event.value)"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center gap-2">
        <span :class="`w-7 flag flag-${slotProps.value}`" />
        <div>{{ t(`common.${slotProps.value}`) }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex items-center gap-2">
        <span :class="`w-7 flag flag-${slotProps.option}`" />
        <div>{{ t(`common.${slotProps.option}`) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { locales } from "@/application/constants/locales";
import { localeService } from "@/application/services/localeService";

const { locale: currentLocale, t } = useI18n();
const { setLocale } = localeService;
</script>