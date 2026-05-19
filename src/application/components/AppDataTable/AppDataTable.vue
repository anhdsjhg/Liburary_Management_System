<script setup lang="ts" generic="TRow extends object">
/**
 * Fixes applied:
 * 1. @/shared/types/table → relative ../../types/table
 * 2. tc() removed → t() only (tc not available in Composition API useI18n)
 * 3. selected ref typed as Ref<TRow[]> with explicit cast to avoid UnwrapRefSimple
 * 4. sortState null guards added in template via optional chaining
 */
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppCheckbox from '../AppCheckbox.vue'
import AppPaginator from '../AppPaginator.vue'
import AppConfirmDialog from '../AppConfirmDialog.vue'
import AppDropdown from '../AppDropdown.vue'
import type {
  TableColumnDef,
  PaginationMeta,
  SelectableConfig,
  EditConfig,
  DeleteConfig,
  CustomAction,
  ServiceConfig,
  ShowMoreConfig,
} from '../../types/table'
import { sortRows, nextSortDir, formatCellDate } from './utils'
import type { SortState } from './utils'

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 500] as const
type PerPageOption = (typeof PER_PAGE_OPTIONS)[number]

interface Props {
  columns: TableColumnDef<TRow>[]
  rows: TRow[]
  meta?: PaginationMeta
  page?: number
  perPage?: PerPageOption
  showRowNumbers?: boolean
  stickyHeaders?: boolean
  pagination?: boolean
  sortable?: boolean
  clientSort?: boolean
  selectable?: SelectableConfig<TRow>
  editConfig?: EditConfig<TRow>
  deleteConfig?: DeleteConfig
  customActions?: CustomAction<TRow>[]
  serviceConfig?: ServiceConfig<TRow>
  showMoreConfig?: ShowMoreConfig<TRow>
  showActions?: boolean
  canRefresh?: boolean
  showStatus?: boolean
  deleteLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRowNumbers: true,
  stickyHeaders: true,
  pagination: true,
  sortable: true,
  clientSort: false,
  showActions: true,
  canRefresh: true,
  showStatus: false,
  perPage: 25,
  page: 1,
  deleteLoading: false,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:perPage': [perPage: PerPageOption]
  'update:sort': [state: SortState]
  edit: [row: TRow]
  recreate: [row: TRow]
  delete: [row: TRow]
  service: [row: TRow]
  showMore: [row: TRow]
  refresh: []
  selection: [rows: TRow[]]
}>()

const { t } = useI18n()

// ---------------------------------------------------------------------------
// Sort
// ---------------------------------------------------------------------------
const sortState = ref<SortState | null>(null)

const displayedRows = computed<TRow[]>(() => {
  if (!props.clientSort || !sortState.value) return props.rows;
  return sortRows(props.rows, sortState.value) as TRow[];
});

function toggleSort(col: TableColumnDef<TRow>) {
  if (!props.sortable) return
  const dir = nextSortDir(sortState.value, col.link)
  sortState.value = { field: col.link, dir }
  if (!props.clientSort) emit('update:sort', sortState.value)
}

function isSortAsc(col: TableColumnDef<TRow>): boolean {
  return sortState.value?.field === col.link && sortState.value?.dir === 'asc'
}

function isSortDesc(col: TableColumnDef<TRow>): boolean {
  return sortState.value?.field === col.link && sortState.value?.dir === 'desc'
}

function isSortNone(col: TableColumnDef<TRow>): boolean {
  return sortState.value?.field !== col.link
}

// ---------------------------------------------------------------------------
// Selection
// Fix: use explicit TRow[] cast — avoids UnwrapRefSimple incompatibility
// ---------------------------------------------------------------------------
const selected = ref<TRow[]>([]) as { value: TRow[] }

const allSelected = ref(false)

function toggleRow(row: TRow) {
  const idx = selected.value.findIndex(
    (r) => JSON.stringify(r) === JSON.stringify(row),
  )
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else {
    if (props.selectable?.if && !props.selectable.if(row)) return
    selected.value.push(row)
  }
  allSelected.value = selected.value.length === displayedRows.value.length
  emit('selection', [...selected.value] as TRow[])
}

function toggleAll() {
  if (allSelected.value) {
    selected.value = []
  } else {
    selected.value = displayedRows.value.filter((row) =>
      props.selectable?.if ? props.selectable.if(row) : true,
    )
  }
  allSelected.value = !allSelected.value
  emit('selection', [...selected.value] as TRow[])
}

function isSelected(row: TRow): boolean {
  return selected.value.some(
    (r) => JSON.stringify(r) === JSON.stringify(row),
  )
}

watch(
  () => props.rows,
  () => {
    selected.value = []
    allSelected.value = false
  },
)

// ---------------------------------------------------------------------------
// Delete confirm
// ---------------------------------------------------------------------------
const deleteTarget = ref<TRow | null>(null)
const showDeleteConfirm = ref(false)

function requestDelete(row: TRow) {
  deleteTarget.value = row
  showDeleteConfirm.value = true
}

function onDeleteConfirmed() {
  if (deleteTarget.value) emit('delete', deleteTarget.value)
  deleteTarget.value = null
}

// ---------------------------------------------------------------------------
// Row click
// ---------------------------------------------------------------------------
function onRowClick(row: TRow) {
  if (props.serviceConfig?.available) {
    props.serviceConfig.showMore?.(row)
  } else if (props.showMoreConfig?.available && !props.showMoreConfig.title) {
    props.showMoreConfig.func?.(row)
  }
}
</script>

<template>
  <div class="app-data-table">
    <!-- Toolbar -->
    <div v-if="pagination" class="app-data-table__toolbar">
      <div class="app-data-table__per-page">
        <span>{{ t('per_page') }}</span>
        <AppDropdown
          :title="String(perPage)"
          :items="PER_PAGE_OPTIONS.map((n) => ({ name: String(n), key: String(n) }))"
          max-height="12em"
          @select="(item) => emit('update:perPage', Number((item as { key: string }).key) as PerPageOption)"
        />
      </div>
    </div>

    <!-- Table wrapper -->
    <div class="app-data-table__wrapper">
      <table class="app-data-table__table">
        <thead>
          <tr>
            <!-- Row number / select-all -->
            <th
              v-if="showRowNumbers"
              class="app-data-table__th app-data-table__th--num"
              :class="{
                'app-data-table__th--sticky': stickyHeaders,
                'app-data-table__th--selectable': selectable?.available,
              }"
            >
              <AppCheckbox
                v-if="selectable?.available"
                :model-value="allSelected"
                aria-label="Select all rows"
                @update:model-value="toggleAll"
              />
              <template v-else>#</template>
            </th>

            <!-- Status -->
            <th
              v-if="showStatus"
              class="app-data-table__th"
              :class="{ 'app-data-table__th--sticky': stickyHeaders }"
            >
              {{ t('status') }}
            </th>

            <!-- Data columns -->
            <th
              v-for="(col, idx) in columns"
              :key="idx"
              class="app-data-table__th"
              :class="{
                'app-data-table__th--sticky': stickyHeaders,
                'app-data-table__th--sortable': sortable && !!col.link,
                'app-data-table__th--selectable': selectable?.available,
                invisible: col.invisible,
              }"
              :colspan="col.colspan"
              :rowspan="col.rowspan"
              @click="sortable && col.link ? toggleSort(col) : undefined"
            >
              <span class="app-data-table__th-content">
                {{ t(col.name) }}
                <span
                  v-if="sortable && col.link"
                  class="app-data-table__sort-icon"
                  aria-hidden="true"
                >
                  <i
                    class="bi"
                    :class="{
                      'bi-sort-up': isSortAsc(col),
                      'bi-sort-down': isSortDesc(col),
                      'bi-arrow-down-up': isSortNone(col),
                    }"
                  />
                </span>
              </span>
            </th>

            <!-- Actions -->
            <th
              v-if="showActions"
              class="app-data-table__th"
              :class="{
                'app-data-table__th--sticky': stickyHeaders,
                'app-data-table__th--selectable': selectable?.available,
              }"
            />
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, idx) in displayedRows"
            :key="idx"
            class="app-data-table__row"
            :class="{
              'app-data-table__row--clickable':
                serviceConfig?.available ||
                (showMoreConfig?.available && !showMoreConfig.title),
              'app-data-table__row--selected': isSelected(row),
            }"
            @click="onRowClick(row)"
          >
            <!-- Row number / checkbox -->
            <td
              v-if="showRowNumbers"
              class="app-data-table__td app-data-table__td--num"
            >
              <AppCheckbox
                v-if="selectable?.available"
                :model-value="isSelected(row)"
                :aria-label="`Select row ${idx + 1}`"
                @update:model-value="() => toggleRow(row)"
                @click.stop
              />
              <template v-else>
                {{ ((row as Record<string, unknown>)['rn'] as number) ?? idx + 1 }}
              </template>
            </td>

            <!-- Status -->
            <td v-if="showStatus" class="app-data-table__td">
              <div
                class="app-data-table__status-badge"
                :class="{
                 'app-data-table__status-badge--open': (row as Record<string, unknown>)['status'] === 'Open',
                 'app-data-table__status-badge--checked': (row as Record<string, unknown>)['status'] === 'Checked',
                 'app-data-table__status-badge--closed': !['Open', 'Checked'].includes(String((row as Record<string, unknown>)['status'])),
                }"
              >
                {{ (row as Record<string, unknown>)['status'] }}
              </div>
            </td>

            <!-- Data cells -->
            <td
              v-for="(col, colIdx) in columns"
              :key="colIdx"
              class="app-data-table__td"
              :class="[
                { 'app-data-table__td--date': col.is_date },
                { invisible: col.invisible },
                col.class_func ? col.class_func(row) : {},
                { 'app-data-table__td--clickable': !!col.custom_func },
              ]"
              @click.stop="col.custom_func ? col.custom_func(row) : undefined"
            >
              <span v-if="col.display_func" v-html="col.display_func(row)" />
              <slot
                v-else-if="col.slot"
                :name="col.slot"
                :row="row"
                :col="col"
              />
              <template v-else-if="Array.isArray((row as Record<string, unknown>)[col.link])">
                <div
                  v-for="(item, i) in (((row as Record<string, unknown>)[col.link] as unknown[]))"
                  :key="i"
                  class="app-data-table__array-item"
                >
                  [{{ item }}]
                </div>
              </template>
              <template v-else-if="(row as Record<string, unknown>)[col.link] != null">
                {{ col.is_date ? formatCellDate((row as Record<string, unknown>)[col.link]) : (row as Record<string, unknown>)[col.link] }}
              </template>
            </td>

            <!-- Actions cell -->
            <td
              v-if="showActions"
              class="app-data-table__td app-data-table__td--actions"
              @click.stop
            >
              <div class="app-data-table__actions">
                <button
                  v-if="showMoreConfig?.available && showMoreConfig.title"
                  type="button"
                  class="app-data-table__action-btn app-data-table__action-btn--show"
                  @click="showMoreConfig.func?.(row)"
                >
                  {{ t(showMoreConfig.title) }}
                </button>

                <button
                  v-if="editConfig?.available"
                  type="button"
                  class="app-data-table__action-icon"
                  :aria-label="t('edit')"
                  @click="emit('edit', row)"
                >
                  <i class="bi bi-pencil" aria-hidden="true" />
                </button>

                <button
                  v-if="editConfig?.reCreate"
                  type="button"
                  class="app-data-table__action-icon"
                  :aria-label="t('recreate')"
                  @click="emit('recreate', row)"
                >
                  <i class="bi bi-arrow-clockwise" aria-hidden="true" />
                </button>

                <button
                  v-if="deleteConfig?.available"
                  type="button"
                  class="app-data-table__action-icon app-data-table__action-icon--danger"
                  :aria-label="t('delete')"
                  @click="requestDelete(row)"
                >
                  <i class="bi bi-trash" aria-hidden="true" />
                </button>

                <button
                  v-if="serviceConfig?.available && serviceConfig.title"
                  type="button"
                  class="app-data-table__action-btn"
                  @click="emit('service', row)"
                >
                  <i class="bi bi-book" aria-hidden="true" />
                  {{ t(serviceConfig.title) }}
                </button>

                <template
                  v-for="(action, actionIdx) in customActions"
                  :key="actionIdx"
                >
                  <button
                    v-if="action.available"
                    type="button"
                    class="app-data-table__action-btn"
                    :class="action.class"
                    @click="action.func(row)"
                  >
                    {{ t(action.title) }}
                  </button>
                </template>

                <slot name="row-actions" :row="row" />
              </div>
            </td>
          </tr>

          <slot name="table-footer" />
        </tbody>
      </table>
    </div>

    <!-- Selectable footer -->
    <div v-if="selectable?.available" class="app-data-table__select-bar">
      <div class="flex items-center gap-3">
        <AppCheckbox
          :model-value="allSelected"
          aria-label="Toggle select all"
          @update:model-value="toggleAll"
        />
        <button
          type="button"
          class="app-data-table__select-label"
          @click="selectable.showSelected?.(selected.value)"
        >
          {{ t('select_all', { num: selected.value.length }) }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="selectable.selected"
          type="button"
          class="app-data-table__action-btn"
          @click="selectable.copy?.(selected.value)"
        >
          {{ t('show_in_table') }}
        </button>
        <button
          v-if="selectable.func"
          type="button"
          class="app-data-table__action-btn app-data-table__action-btn--primary"
          @click="selectable.func(selected.value)"
        >
          {{ t(selectable.button_title ?? 'select') }}
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && meta" class="app-data-table__pagination">
      <AppPaginator
        :meta="meta"
        :page="page"
        @update:page="emit('update:page', $event)"
      />
      <button
        v-if="canRefresh"
        type="button"
        class="app-data-table__refresh-btn"
        @click="emit('refresh')"
      >
        <i class="bi bi-arrow-clockwise" aria-hidden="true" />
        {{ t('refresh') }}
      </button>
    </div>

    <!-- Delete confirmation -->
    <AppConfirmDialog
      v-model:visible="showDeleteConfirm"
      :loading="deleteLoading"
      :on-confirm="onDeleteConfirmed"
    />
  </div>
</template>