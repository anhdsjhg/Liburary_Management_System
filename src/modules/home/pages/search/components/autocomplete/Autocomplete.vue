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
  <AutoComplete
    :model-value="localValue"
    :suggestions="suggestions"
    :placeholder="placeholder"
    :class="inputClass"
    complete-on-focus
    @update:model-value="onInput"
    @item-select="(e: { value: string }) => onSelect(e.value)"
    @keydown.enter="$emit('submit')"
  />
</template>