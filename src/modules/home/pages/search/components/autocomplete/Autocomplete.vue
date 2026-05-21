<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useMediaAutocompleteApi } from "@/api/media/autocomplete/get";
import type { MediaAutocompleteRequest } from "@/api/media/autocomplete/get/types";
import type { MediaSearchOption } from "@/api/media/search/get/types";

const props = defineProps<{
  modelValue: string;
  selectedKey: MediaSearchOption["key"];
  placeholder?: string;
  inputClass?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "submit"): void;
}>();

const autocompleteKey = computed((): MediaAutocompleteRequest["key"] => {
  const k = props.selectedKey;
  if (k === "call_number") return "all";
  return k as MediaAutocompleteRequest["key"];
});

const autocompleteParams = computed<MediaAutocompleteRequest>(() => ({
  value: props.modelValue,
  key: autocompleteKey.value,
  max: 10,
}));

const { data } = useMediaAutocompleteApi(autocompleteParams);

const suggestions = computed(
  () => data.value?.res?.map((item) => item.result) ?? []
);

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (v) => {
    localValue.value = v;
  }
);

function onInput(value: string) {
  localValue.value = value;
  emit("update:modelValue", value);
}

function onSelect(value: string) {
  localValue.value = value;
  emit("update:modelValue", value);
  emit("submit");
}
</script>

<template>
  <div class="search-autocomplete">
    <i class="pi pi-search search-autocomplete__icon" />
    <AutoComplete
      :model-value="localValue"
      :suggestions="suggestions"
      :placeholder="placeholder"
      :class="['search-autocomplete__input', inputClass]"
      complete-on-focus
      @update:model-value="onInput"
      @item-select="(e: { value: string }) => onSelect(e.value)"
      @keydown.enter="$emit('submit')"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-autocomplete {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  &__icon {
    position: absolute;
    left: 0.85rem;
    color: var(--text-color-secondary);
    font-size: 0.85rem;
    pointer-events: none;
    z-index: 1;
  }

  &__input {
    width: 100%;

    :deep(.p-autocomplete-input),
    :deep(input) {
      width: 100%;
      padding: 0.75rem 0.85rem 0.75rem 2.25rem !important;
      border-radius: 10px !important;
      font-size: 0.95rem;
      transition: box-shadow 0.15s, border-color 0.15s;
    }

    :deep(.p-autocomplete-input:focus),
    :deep(input:focus) {
      box-shadow: 0 0 0 3px rgba(56, 31, 110, 0.12);
      border-color: var(--bsp-primary, #381f6e);
    }
  }
}
</style>
