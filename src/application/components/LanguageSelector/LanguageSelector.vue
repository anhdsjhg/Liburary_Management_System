<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDropdown from '../AppDropdown.vue'
import type { DropdownItem } from '../AppDropdown.vue'

interface LocaleOption extends DropdownItem {
  code: string
  name: string
  key: string
}

const { locale, availableLocales, t } = useI18n()

const localeOptions = computed<LocaleOption[]>(() =>
  availableLocales.map(code => ({
    code,
    name: t(`locales.${code}`, code.toUpperCase()),
    key: code,
  }))
)

const currentLocale = computed(() =>
  localeOptions.value.find(l => l.code === locale.value)
)

function onSelect(item: DropdownItem | string | number) {
  if (typeof item === 'object' && 'code' in item) {
    locale.value = (item as LocaleOption).code
  }
}
</script>

<template>
  <div class="language-selector" :aria-label="t('select_language')">
    <AppDropdown
      :title="currentLocale?.name ?? locale"
      :items="localeOptions"
      @select="onSelect"
    />
  </div>
</template>