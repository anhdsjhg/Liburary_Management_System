<script setup lang="ts">
import { ASSETS } from "@/application/configs/constants";

defineProps<{
  image: string | null;
  id: number;
  type: string;
  state: string;
  createdBy: string | null;
  createdAt: string | null;
}>();
</script>

<template>
  <div class="cataloging-edit-page__preview">
    <div
      class="cataloging-edit-page__cover"
      :style="{
        backgroundImage: `url(${image ?? ASSETS.NO_COVER})`,
      }"
    />

    <div class="cataloging-edit-page__info-row">
      ID: <span>{{ id }}</span>
    </div>
    <div class="cataloging-edit-page__info-row">
      {{ $t("cataloging.type") }}: <span>{{ type }}</span>
    </div>
    <div class="cataloging-edit-page__info-row">
      {{ $t("cataloging.state.label") }}: <span>{{ state }}</span>
    </div>
    <div v-if="createdBy" class="cataloging-edit-page__info-row">
      {{ $t("cataloging.created_by") }}: <span>{{ createdBy }}</span>
    </div>
    <div v-if="createdAt" class="cataloging-edit-page__info-row">
      {{ $t("cataloging.created_at") }}: <span>{{ createdAt }}</span>
    </div>
  </div>
</template>