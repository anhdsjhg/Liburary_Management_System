<script setup lang="ts">
interface Props {
  text: string
  for?: string
  required?: boolean
}
defineProps<Props>()
</script>

<template>
  <label class="app-field-label" :for="$props.for">
    {{ text }}
    <span v-if="required" class="app-field-label__required" aria-hidden="true">*</span>
  </label>
</template>