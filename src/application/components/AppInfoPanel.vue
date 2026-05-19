<script setup lang="ts" generic="TRow extends Record<string, unknown>">
/**
 * Fixes:
 * 1. @/shared/types/table → relative ../../types/table
 * 2. tc() → t() — Composition API useI18n does not expose tc()
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import AppConfirmDialog from './AppConfirmDialog.vue'
import type { TableColumnDef } from '../types/table'

interface Props {
  data: TRow
  heads: TableColumnDef<TRow>[]
  tableName?: string
  showEdit?: boolean
  showDelete?: boolean
  customAction?: { title: string; class?: string; func: (row: TRow) => void }
  deleteLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tableName: 'detail',
  showEdit: false,
  showDelete: false,
  deleteLoading: false,
})

const emit = defineEmits<{
  close: []
  edit: [row: TRow]
  deleted: []
}>()

const { t } = useI18n()
const showDeleteConfirm = ref(false)

function formatValue(row: TRow, col: TableColumnDef<TRow>): string {
  const val = row[col.link]
  if (val == null) return '—'
  if (col.is_date) return new Date(String(val)).toLocaleDateString()
  return String(val)
}
</script>

<template>
  <div class="app-info-panel">
    <div class="app-info-panel__header">
      <span class="app-info-panel__title">{{ t(tableName) }}</span>
      <button
        type="button"
        class="app-info-panel__close"
        :aria-label="t('close')"
        @click="emit('close')"
      >
        <i class="bi bi-x" aria-hidden="true" />
      </button>
    </div>

    <div class="app-info-panel__body">
      <dl class="app-info-panel__list">
        <template v-for="(col, index) in heads" :key="index">
          <div
            v-if="!col.invisible"
            class="app-info-panel__row"
            :class="{ 'app-info-panel__row--clickable': !!col.custom_func }"
            @click="col.custom_func?.(data)"
          >
            <dt class="app-info-panel__label">{{ t(col.name) }}</dt>
            <dd class="app-info-panel__value">
              <span v-if="col.display_func" v-html="col.display_func(data)" />
              <span v-else>{{ formatValue(data, col) }}</span>
            </dd>
          </div>
        </template>
      </dl>
    </div>

    <div class="app-info-panel__footer">
      <Button
        v-if="showEdit"
        :label="t('edit')"
        severity="secondary"
        outlined
        size="small"
        icon="bi bi-pencil"
        @click="emit('edit', data)"
      />
      <Button
        v-if="showDelete"
        :label="t('delete')"
        severity="danger"
        outlined
        size="small"
        icon="bi bi-trash"
        :loading="deleteLoading"
        @click="showDeleteConfirm = true"
      />
      <Button
        v-if="customAction"
        :label="t(customAction.title)"
        :class="customAction.class"
        severity="secondary"
        outlined
        size="small"
        @click="customAction.func(data)"
      />
    </div>

    <AppConfirmDialog
      v-if="showDelete"
      v-model:visible="showDeleteConfirm"
      :loading="deleteLoading"
      :on-confirm="() => { emit('deleted'); emit('close') }"
    />
  </div>
</template>