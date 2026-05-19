<script setup lang="ts">
interface Props {
  placeholder?: string
  rows?: number
  maxlength?: number
  disabled?: boolean
  required?: boolean
  id?: string
}

withDefaults(defineProps<Props>(), { rows: 5 })
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <textarea
    v-bind="$attrs"
    class="app-textarea"
    :id="id"
    :value="model"
    :placeholder="placeholder"
    :rows="rows"
    :maxlength="maxlength"
    :disabled="disabled"
    :required="required"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>