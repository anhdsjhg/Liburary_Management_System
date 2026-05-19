<script setup lang="ts">
interface Props {
  label?: string
  disabled?: boolean
  ariaLabel?: string
}
withDefaults(defineProps<Props>(), { disabled: false })
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="toggle-switch" :class="{ 'toggle-switch--disabled': disabled }">
    <input
      type="checkbox"
      class="sr-only"
      role="switch"
      v-model="model"
      :disabled="disabled"
      :aria-label="ariaLabel ?? label"
      :aria-checked="model"
    />
    <span class="toggle-switch__track" :class="{ 'toggle-switch__track--on': model }">
      <span class="toggle-switch__thumb" />
    </span>
    <span v-if="label" class="toggle-switch__label">{{ label }}</span>
  </label>
</template>