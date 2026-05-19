<script setup lang="ts">
interface Props {
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
}
withDefaults(defineProps<Props>(), { placeholder: '+x xxx xxx xxxx', disabled: false })
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="phone-input" :class="{ 'phone-input--disabled': disabled }">
    <span class="phone-input__prefix" aria-hidden="true">
      <i class="bi bi-telephone" />
    </span>
    <input
      :id="id"
      type="tel"
      class="phone-input__input"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      autocomplete="tel"
    />
  </div>
</template>