<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

interface Props {
  url: string
  filename?: string
  mimeType?: string
}

const props = withDefaults(defineProps<Props>(), { filename: 'file' })
const visible = defineModel<boolean>('visible', { default: false })
const { t } = useI18n()

type FileKind = 'image' | 'pdf' | 'other'

const fileKind = computed<FileKind>(() => {
  if (props.mimeType) {
    if (props.mimeType.startsWith('image/')) return 'image'
    if (props.mimeType === 'application/pdf') return 'pdf'
    return 'other'
  }
  const ext = props.url.split('.').pop()?.toLowerCase() ?? ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  return 'other'
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :header="filename"
    :draggable="false"
    :style="{ width: '56rem', maxWidth: '95vw' }"
  >
    <div v-if="fileKind === 'image'" class="file-preview-modal__image-wrap">
      <img :src="url" :alt="filename" class="file-preview-modal__image" />
    </div>

    <div v-else-if="fileKind === 'pdf'" class="file-preview-modal__pdf-wrap">
      <iframe :src="url" :title="filename" class="file-preview-modal__iframe" />
    </div>

    <div v-else class="file-preview-modal__other">
      <i class="bi bi-file-earmark text-4xl text-surface-400" aria-hidden="true" />
      <p>{{ t('no_preview_available') }}</p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          :label="t('open_in_tab')"
          severity="secondary"
          outlined
          size="small"
          icon="bi bi-box-arrow-up-right"
          :as="'a'"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
        />
        <Button
          :label="t('download')"
          size="small"
          icon="bi bi-download"
          :as="'a'"
          :href="url"
          :download="filename"
        />
      </div>
    </template>
  </Dialog>
</template>