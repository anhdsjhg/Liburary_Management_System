<script setup lang="ts">
/**
 * Fixes:
 * 1. @vueuse/core removed — not in project dependencies.
 *    Click-outside implemented with native addEventListener in onMounted/onUnmounted.
 * 2. Type cast for item.link access made safe.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export interface DropdownItem {
  name?: string
  key?: string
  link?: string
  on_click?: () => void
  invisible?: boolean
}

interface Props {
  title?: string | number
  items: (DropdownItem | string | number)[]
  openUpward?: boolean
  maxHeight?: string
  titleClass?: string | string[]
  itemClass?: string | string[]
  externalLinks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  openUpward: false,
  maxHeight: '20rem',
  externalLinks: false,
})

const emit = defineEmits<{ select: [item: DropdownItem | string | number] }>()

const { t } = useI18n()
const shown = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function handleOutsideClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    shown.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

function toggle() {
  shown.value = !shown.value
}

function selectItem(item: DropdownItem | string | number) {
  if (typeof item === 'object' && !Array.isArray(item) && item.on_click) {
    item.on_click()
  }
  emit('select', item)
  shown.value = false
}

function getLabel(item: DropdownItem | string | number): string {
  if (typeof item === 'string' || typeof item === 'number') return t(String(item))
  return t(item.name ?? item.key ?? String(item))
}

function isVisible(item: DropdownItem | string | number): boolean {
  if (typeof item === 'object' && !Array.isArray(item) && 'invisible' in item) {
    return !item.invisible
  }
  return true
}

function getHref(item: DropdownItem | string | number): string | undefined {
  if (typeof item === 'object' && !Array.isArray(item)) return item.link
  return undefined
}

function isLink(item: DropdownItem | string | number): boolean {
  return typeof item === 'object' && !Array.isArray(item) && !!item.link
}
</script>

<template>
  <div
    ref="containerRef"
    class="app-dropdown"
    :class="{ 'app-dropdown--open-upward': openUpward }"
  >
    <button
      type="button"
      class="app-dropdown__trigger"
      :class="titleClass"
      :aria-expanded="shown"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span>{{ typeof title === 'string' ? t(title) : title }}</span>
      <i
        class="bi bi-chevron-up app-dropdown__caret"
        :class="{ 'app-dropdown__caret--open': shown }"
        aria-hidden="true"
      />
    </button>

    <Transition name="app-dropdown-panel">
      <div
        v-show="shown"
        role="listbox"
        class="app-dropdown__panel"
        :class="{ 'app-dropdown__panel--upward': openUpward }"
        :style="{ maxHeight }"
      >
        <template v-for="(item, index) in items" :key="index">
          <a
            v-if="isVisible(item) && isLink(item)"
            :href="getHref(item)"
            :target="externalLinks ? '_blank' : undefined"
            role="option"
            class="app-dropdown__item"
            :class="itemClass"
          >
            {{ getLabel(item) }}
          </a>
          <button
            v-else-if="isVisible(item)"
            type="button"
            role="option"
            class="app-dropdown__item"
            :class="itemClass"
            @click="selectItem(item)"
          >
            {{ getLabel(item) }}
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>