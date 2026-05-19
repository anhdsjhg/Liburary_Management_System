<script setup lang="ts">
/**
 * AppCheckbox
 * Consolidates legacy Checkbox.vue (square + round variants).
 * Real <input type="checkbox"> kept in DOM for accessibility.
 * All visual styles in _components.scss (.app-checkbox).
 */
interface Props {
  variant?: 'square' | 'round'
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'square',
  disabled: false,
})

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label
    class="app-checkbox"
    :class="[`app-checkbox--${variant}`, { 'app-checkbox--disabled': disabled }]"
    :aria-disabled="disabled"
  >
    <input
      type="checkbox"
      class="app-checkbox__input"
      v-model="model"
      :disabled="disabled"
      :aria-label="ariaLabel"
    />
    <span
      class="app-checkbox__box"
      :class="{ 'app-checkbox__box--checked': model }"
      aria-hidden="true"
    />
  </label>
</template>