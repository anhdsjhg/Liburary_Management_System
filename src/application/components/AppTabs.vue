<script setup lang="ts">
/**
 * Fixes:
 * 1. tc() → t() — tc not in Composition API
 * 2. tabs[0] can be undefined if empty array passed — guard added
 * 3. shallowRef typed explicitly to avoid TabDef | undefined
 */
import { ref, shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'

export interface TabDef {
  name: string
  component: Component
  props?: Record<string, unknown>
}

interface Props {
  tabs: TabDef[]
  onTabChange?: (tab: TabDef, index: number) => void
}

const props = defineProps<Props>()
const { t } = useI18n()

const activeIndex = ref(0)

// Explicit non-undefined type: tabs is guaranteed non-empty by caller convention.
// Guard: if tabs is empty we show nothing.
const activeTab = shallowRef<TabDef | null>(props.tabs[0] ?? null)

const hasActivTab = computed(() => activeTab.value !== null)

function setActive(index: number) {
  const tab = props.tabs[index]
  if (!tab) return
  activeIndex.value = index
  activeTab.value = tab
  props.onTabChange?.(tab, index)
}
</script>

<template>
  <div class="app-tabs">
    <div class="app-tabs__bar" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        type="button"
        role="tab"
        class="app-tabs__tab"
        :class="{ 'app-tabs__tab--active': activeIndex === index }"
        :aria-selected="activeIndex === index"
        :aria-controls="`tabpanel-${index}`"
        :id="`tab-${index}`"
        @click="setActive(index)"
        @keydown.right.prevent="setActive(Math.min(index + 1, tabs.length - 1))"
        @keydown.left.prevent="setActive(Math.max(index - 1, 0))"
      >
        {{ t(tab.name) }}
        <span
          v-if="activeIndex === index"
          class="app-tabs__indicator"
          aria-hidden="true"
        />
      </button>
    </div>

    <div
      v-if="hasActivTab && activeTab"
      class="app-tabs__panel"
      role="tabpanel"
      :id="`tabpanel-${activeIndex}`"
      :aria-labelledby="`tab-${activeIndex}`"
    >
      <keep-alive>
        <component
          :is="activeTab.component"
          v-bind="activeTab.props ?? {}"
        />
      </keep-alive>
    </div>
  </div>
</template>