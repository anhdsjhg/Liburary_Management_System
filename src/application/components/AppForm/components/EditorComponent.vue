ъ<script setup lang="ts">
import Editor from 'primevue/editor'

interface Props {
  placeholder?: string
  disabled?: boolean
  editorStyle?: string
}
withDefaults(defineProps<Props>(), { editorStyle: 'height: 12rem', disabled: false })
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="editor-component" :class="{ 'editor-component--disabled': disabled }">
    <Editor
      v-model="model"
      :placeholder="placeholder"
      :readonly="disabled"
      :editor-style="editorStyle"
    />
  </div>
</template>