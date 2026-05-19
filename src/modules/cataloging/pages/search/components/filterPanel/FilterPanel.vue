<script setup lang="ts">
import type { CatalogingFilterForm } from "../../composables/useFormComposable";
import type { AuthorityType } from "@/api/cataloging/authority-data/get/types";

defineProps<{
  form: CatalogingFilterForm;
  stateOptions: Array<{ label: string; value: string }>;
  typeOptions: AuthorityType[];
}>();

const emit = defineEmits<{
  (e: "apply"): void;
  (e: "reset"): void;
}>();
</script>

<template>
  <aside class="cataloging-search-page__filter-sidebar">
    <div class="cataloging-search-page__filter-title">
      {{ $t("cataloging.filter") }}
    </div>

    <div>
      <div class="cataloging-search-page__filter-label">
        {{ $t("cataloging.query") }}
      </div>
      <InputText v-model="form.query" class="w-full" />
    </div>

    <div>
      <div class="cataloging-search-page__filter-label">
        {{ $t("cataloging.type") }}
      </div>
      <Select
        v-model="form.type"
        :options="[{ type: '', title: $t('cataloging.state.all') }, ...typeOptions]"
        option-label="title"
        option-value="type"
        class="w-full"
      />
    </div>

    <div>
      <div class="cataloging-search-page__filter-label">
        {{ $t("cataloging.state.label") }}
      </div>
      <Select
        v-model="form.state"
        :options="stateOptions"
        option-label="label"
        option-value="value"
        class="w-full"
      />
    </div>

    <div>
      <div class="cataloging-search-page__filter-label">
        {{ $t("cataloging.inv_id") }}
      </div>
      <InputText v-model="form.inv_id" class="w-full" />
    </div>

    <div>
      <div class="cataloging-search-page__filter-label">
        {{ $t("cataloging.batch_id") }}
      </div>
      <InputText v-model="form.batch_id" class="w-full" />
    </div>

    <div>
      <div class="cataloging-search-page__filter-label">
        {{ $t("cataloging.genre") }}
      </div>
      <InputText v-model="form.genres" class="w-full" />
    </div>

    <Button
      :label="$t('cataloging.apply')"
      class="cataloging-search-page__filter-apply"
      @click="$emit('apply')"
    />
    <Button
      :label="$t('cataloging.reset')"
      severity="secondary"
      outlined
      class="cataloging-search-page__filter-apply"
      @click="$emit('reset')"
    />
  </aside>
</template>