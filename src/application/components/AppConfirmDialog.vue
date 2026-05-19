<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

/**
 * AppConfirmDialog
 * Replaces legacy DeleteModal.vue.
 * HTTP logic delegated to caller via onConfirm prop.
 * All styles in _components.scss (.app-confirm-dialog).
 */
interface Props {
  /** Called when user confirms */
  onConfirm?: () => void | Promise<void>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })

const emit = defineEmits<{
  closed: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { t } = useI18n()

async function confirm() {
  await props.onConfirm?.()
  visible.value = false
  emit('closed')
}

function cancel() {
  visible.value = false
  emit('closed')
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="!loading"
    :draggable="false"
    :style="{ width: '22rem' }"
  >
    <template #header>
      <span class="app-confirm-dialog__title">{{ t('confirmation') }}</span>
    </template>

    <p class="app-confirm-dialog__message">
      {{ t('confirm_delete_message') }}
    </p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          :label="t('no')"
          severity="secondary"
          outlined
          :disabled="loading"
          @click="cancel"
        />
        <Button
          :label="t('yes')"
          severity="danger"
          :loading="loading"
          @click="confirm"
        />
      </div>
    </template>
  </Dialog>
</template>