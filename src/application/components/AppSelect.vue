<script setup lang="ts" generic="TItem">
/**
 * Fixes:
 * 1. @vueuse/core removed — click-outside via native addEventListener.
 * 2. select(item) — item is always TItem here (loop variable), cast is safe.
 * 3. find() returns TItem | undefined — handled with null check before getLabel.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  items: TItem[]
  labelKey?: keyof TItem
  valueKey?: keyof TItem
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const model = defineModel<TItem | TItem[keyof TItem] | null>({ default: null })

const { t } = useI18n()
const shown = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(-1)

function handleOutsideClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    shown.value = false
    focusedIndex.value = -1
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

function getLabel(item: TItem): string {
  if (props.labelKey) return t(String(item[props.labelKey]))
  return t(String(item))
}

const displayValue = computed<string>(() => {
  if (model.value == null) return props.placeholder ?? t('select_placeholder', 'Select…')

  const found = props.items.find((item) =>
    props.valueKey
      ? item[props.valueKey] === model.value
      : item === model.value,
  )

  // found can be undefined — handle gracefully
  if (!found) return String(model.value)
  return getLabel(found)
})

function select(item: TItem) {
  model.value = props.valueKey
    ? (item[props.valueKey] as TItem[keyof TItem])
    : item
  shown.value = false
  focusedIndex.value = -1
}

function toggle() {
  if (props.disabled) return
  shown.value = !shown.value
  if (shown.value) focusedIndex.value = -1
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!shown.value) {
        shown.value = true
      } else if (focusedIndex.value >= 0) {
        const item = props.items[focusedIndex.value]
        if (!item) return
        select(item)
      }
      break
    case 'ArrowDown':
      e.preventDefault()
      shown.value = true
      if (!props.items.length) return
        focusedIndex.value = Math.min(focusedIndex.value + 1, props.items.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      break
    case 'Escape':
      shown.value = false
      focusedIndex.value = -1
      break
  }
}

function isItemSelected(item: TItem): boolean {
  return props.valueKey
    ? item[props.valueKey] === model.value
    : item === model.value
}
</script>

<template>
  <div
    ref="containerRef"
    class="app-select"
    :class="{ 'app-select--disabled': disabled, 'app-select--open': shown }"
    tabindex="0"
    role="combobox"
    :aria-expanded="shown"
    :aria-disabled="disabled"
    aria-haspopup="listbox"
    @click="toggle"
    @keydown="onKeydown"
  >
    <div class="app-select__display">
      <span
        class="app-select__value"
        :class="{ 'app-select__value--placeholder': model == null }"
      >
        {{ displayValue }}
      </span>
      <i
        class="bi bi-chevron-up app-select__caret"
        :class="{ 'app-select__caret--open': shown }"
        aria-hidden="true"
      />
    </div>

    <Transition name="app-select-panel">
      <div v-show="shown" role="listbox" class="app-select__panel">
        <div
          v-for="(item, index) in items"
          :key="index"
          role="option"
          :aria-selected="isItemSelected(item)"
          class="app-select__option"
          :class="{
            'app-select__option--selected': isItemSelected(item),
            'app-select__option--focused': focusedIndex === index,
          }"
          @click.stop="select(item)"
        >
          {{ getLabel(item) }}
        </div>
      </div>
    </Transition>
  </div>
</template>