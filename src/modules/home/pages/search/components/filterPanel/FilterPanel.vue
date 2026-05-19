<script setup lang="ts">
import { reactive, computed } from "vue";
import type { FilterState } from "../../composables/useComposable";
import { AppCheckbox } from "@/application/components";

const props = defineProps<{
  filterData: Record<string, string[]>;
  modelValue: FilterState;
}>();

const emit = defineEmits<{
  (e: "apply", value: FilterState): void;
  (e: "reset"): void;
}>();

const local = reactive<FilterState>({ ...props.modelValue });

const availableTypes = computed(
  () => props.filterData["type"] ?? []
);

const availableLanguages = computed(
  () => props.filterData["language"] ?? []
);

const availableGenres = computed(() => {
  const genres = props.filterData["genre"] ?? [];
  return [{ label: "All", value: "" }, ...genres.map((g) => ({ label: g, value: g }))];
});

function toggleType(type: string) {
  const idx = local.types.indexOf(type);
  if (idx >= 0) local.types.splice(idx, 1);
  else local.types.push(type);
}

function toggleLanguage(lang: string) {
  const idx = local.languages.indexOf(lang);
  if (idx >= 0) local.languages.splice(idx, 1);
  else local.languages.push(lang);
}
</script>

<template>
  <div class="filter-panel">
    <div class="filter-panel__title">{{ $t("home.filter") }}</div>

    <div v-if="availableTypes.length">
      <div class="filter-panel__section-label">{{ $t("home.types") }}</div>
      <div
        v-for="type in availableTypes"
        :key="type"
        class="filter-panel__item"
      >
        <span>{{ type }}</span>
        <AppCheckbox
          :model-value="local.types.includes(type)"
          @update:model-value="toggleType(type)"
        />
      </div>
    </div>

    <div v-if="availableLanguages.length">
      <div class="filter-panel__section-label">{{ $t("home.languages") }}</div>
      <div
        v-for="lang in availableLanguages"
        :key="lang"
        class="filter-panel__item"
      >
        <span>{{ lang }}</span>
        <AppCheckbox
          :model-value="local.languages.includes(lang)"
          @update:model-value="toggleLanguage(lang)"
        />
      </div>
    </div>

    <div class="filter-panel__section-label">{{ $t("home.genre") }}</div>
    <Select
      v-model="local.genre"
      :options="availableGenres"
      option-label="label"
      option-value="value"
      class="w-full"
    />

    <div class="filter-panel__year-range">
      <div class="filter-panel__section-label">{{ $t("home.year_from") }}</div>
      <InputNumber v-model="local.year.from" :use-grouping="false" class="w-full" />
      <div class="filter-panel__section-label">{{ $t("home.year_to") }}</div>
      <InputNumber v-model="local.year.to" :use-grouping="false" class="w-full" />
    </div>

    <div class="filter-panel__item">
      <span>{{ $t("home.available") }}</span>
      <AppCheckbox v-model="local.available" />
    </div>

    <Button
      :label="$t('home.apply')"
      class="filter-panel__apply"
      @click="$emit('apply', local)"
    />
    <Button
      :label="$t('home.reset')"
      severity="secondary"
      outlined
      class="filter-panel__apply"
      @click="$emit('reset')"
    />
  </div>
</template>