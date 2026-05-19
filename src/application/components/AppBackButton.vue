<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  beforeExit?: () => void | Promise<void>
}

const props = defineProps<Props>()
const router = useRouter()
const { t } = useI18n()

async function goBack() {
  if (props.beforeExit) {
    await props.beforeExit()
  } else {
    router.go(-1)
  }
}
</script>

<template>
  <button
    type="button"
    class="app-back-button"
    :aria-label="t('back')"
    @click="goBack"
    @keydown.enter="goBack"
    @keydown.space.prevent="goBack"
  >
    <i class="bi bi-chevron-left app-back-button__icon" aria-hidden="true" />
    <span>{{ t('back') }}</span>
  </button>
</template>