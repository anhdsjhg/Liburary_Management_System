<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import type { FilterState } from "../../composables/useComposable";
import { AppCheckbox } from "@/application/components";

const props = defineProps<{
  filterData: Record<string, string[]>;
  modelValue: FilterState;
}>();

const emit = defineEmits<{
  (e: "apply", value: FilterState): void;
  (e: "reset"): void;
}>();

const local = reactive<FilterState>({
  types: [...(props.modelValue.types ?? [])],
  languages: [...(props.modelValue.languages ?? [])],
  genre: props.modelValue.genre ?? "",
  year: { ...(props.modelValue.year ?? { from: null, to: null }) },
  available: props.modelValue.available ?? false,
});

const availableTypes = computed(() => props.filterData["type"] ?? []);
const availableLanguages = computed(() => props.filterData["language"] ?? []);
const availableGenres = computed(() => {
  const genres = props.filterData["genre"] ?? [];
  return [
    { label: "All", value: "" },
    ...genres.map((g) => ({ label: g, value: g })),
  ];
});

const activeCount = computed(
  () =>
    local.types.length +
    local.languages.length +
    (local.genre ? 1 : 0) +
    (local.year.from != null || local.year.to != null ? 1 : 0) +
    (local.available ? 1 : 0)
);

function isInvalidYear(val: number | null): boolean {
  return val !== null && (val < 1000 || val > 9999);
}

const yearFromInvalid = computed(() => isInvalidYear(local.year.from));
const yearToInvalid = computed(() => isInvalidYear(local.year.to));
const yearInvalid = computed(() => yearFromInvalid.value || yearToInvalid.value);

const openSections = ref<Record<string, boolean>>({
  type: true,
  language: true,
  genre: true,
  year: true,
  status: true,
});

function toggleSection(key: string) {
  openSections.value[key] = !openSections.value[key];
}

function toggleType(type: string) {
  const idx = local.types.indexOf(type);
  if (idx >= 0) local.types.splice(idx, 1);
  else local.types.push(type);
}

function toggleLanguage(lang: string) {
  const idx = local.languages.indexOf(lang);
  if (idx >= 0) local.languages.splice(idx, 1);
  else local.languages.push(lang);
}

function onApply() {
  emit("apply", JSON.parse(JSON.stringify(local)));
}

function onReset() {
  local.types = [];
  local.languages = [];
  local.genre = "";
  local.year = { from: null, to: null };
  local.available = false;
  emit("reset");
}
</script>

<template>
  <aside class="filter-panel">
    <header class="filter-panel__header">
      <div class="filter-panel__heading">
        <i class="pi pi-sliders-h" />
        <span>{{ $t("home.filter") }}</span>
      </div>
      <span v-if="activeCount" class="filter-panel__count">{{ activeCount }}</span>
    </header>

    <!-- Types -->
    <section v-if="availableTypes.length" class="filter-panel__section">
      <button
        type="button"
        class="filter-panel__section-toggle"
        @click="toggleSection('type')"
      >
        <span>{{ $t("home.types") }}</span>
        <i
          class="pi"
          :class="openSections.type ? 'pi-chevron-up' : 'pi-chevron-down'"
        />
      </button>

      <ul v-show="openSections.type" class="filter-panel__list">
        <li
          v-for="type in availableTypes"
          :key="type"
          class="filter-panel__item"
        >
          <label class="filter-panel__item-label">
            <AppCheckbox
              :model-value="local.types.includes(type)"
              @update:model-value="toggleType(type)"
            />
            <span>{{ type }}</span>
          </label>
        </li>
      </ul>
    </section>

    <!-- Languages -->
    <section v-if="availableLanguages.length" class="filter-panel__section">
      <button
        type="button"
        class="filter-panel__section-toggle"
        @click="toggleSection('language')"
      >
        <span>{{ $t("home.languages") }}</span>
        <i
          class="pi"
          :class="openSections.language ? 'pi-chevron-up' : 'pi-chevron-down'"
        />
      </button>

      <ul v-show="openSections.language" class="filter-panel__list">
        <li
          v-for="lang in availableLanguages"
          :key="lang"
          class="filter-panel__item"
        >
          <label class="filter-panel__item-label">
            <AppCheckbox
              :model-value="local.languages.includes(lang)"
              @update:model-value="toggleLanguage(lang)"
            />
            <span>{{ lang }}</span>
          </label>
        </li>
      </ul>
    </section>

    <!-- Genre -->
    <section class="filter-panel__section">
      <button
        type="button"
        class="filter-panel__section-toggle"
        @click="toggleSection('genre')"
      >
        <span>{{ $t("home.genre") }}</span>
        <i
          class="pi"
          :class="openSections.genre ? 'pi-chevron-up' : 'pi-chevron-down'"
        />
      </button>

      <div v-show="openSections.genre" class="filter-panel__field">
        <Select
          v-model="local.genre"
          :options="availableGenres"
          option-label="label"
          option-value="value"
          class="w-full"
          :placeholder="$t('home.genre')"
        />
      </div>
    </section>

    <!-- Year -->
    <section class="filter-panel__section">
      <button
        type="button"
        class="filter-panel__section-toggle"
        @click="toggleSection('year')"
      >
        <span>{{ $t("home.year") }}</span>
        <i
          class="pi"
          :class="openSections.year ? 'pi-chevron-up' : 'pi-chevron-down'"
        />
      </button>

      <div v-show="openSections.year" class="year-range">
        <div class="filter-panel__year-input">
          <label>{{ $t("home.year_from") }}</label>
          <InputNumber
            v-model="local.year.from"
            :use-grouping="false"
            :max="9999"
            :input-props="{ maxlength: 4 }"
            :invalid="yearFromInvalid"
            class="w-full"
            placeholder="—"
          />
          <small v-if="yearFromInvalid" class="filter-panel__year-error">
            Введите 4-значный год
          </small>
        </div>
        <div class="filter-panel__year-input">
          <label>{{ $t("home.year_to") }}</label>
          <InputNumber
            v-model="local.year.to"
            :use-grouping="false"
            :max="9999"
            :input-props="{ maxlength: 4 }"
            :invalid="yearToInvalid"
            class="w-full"
            placeholder="—"
          />
          <small v-if="yearToInvalid" class="filter-panel__year-error">
            Введите 4-значный год
          </small>
        </div>
      </div>
    </section>

    <!-- Status -->
    <section class="filter-panel__section">
      <label class="filter-panel__switch">
        <span>{{ $t("home.available") }}</span>
        <AppCheckbox v-model="local.available" />
      </label>
    </section>

    <footer class="filter-panel__footer">
      <Button
        :label="$t('home.apply')"
        :disabled="yearInvalid"
        class="filter-panel__apply"
        @click="onApply"
      />
      <Button
        :label="$t('home.reset')"
        severity="secondary"
        outlined
        class="filter-panel__reset"
        @click="onReset"
      />
    </footer>
  </aside>
</template>

<style lang="scss" scoped>
.filter-panel {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--surface-border);
    margin-bottom: 0.5rem;
  }

  &__heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--bsp-primary, #381f6e);

    i {
      font-size: 1rem;
    }
  }

  &__count {
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--bsp-primary, #381f6e);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
  }

  &__section {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--surface-border);

    &:last-of-type {
      border-bottom: none;
    }
  }

  &__section-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    padding: 0.5rem 0;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-color);

    i {
      font-size: 0.7rem;
      color: var(--text-color-secondary);
      transition: color 0.15s;
    }

    &:hover i {
      color: var(--bsp-primary, #381f6e);
    }
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    max-height: 14rem;
    overflow-y: auto;
  }

  &__item {
    margin: 0;
  }

  &__item-label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.4rem 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-color);
    transition: background 0.15s;

    &:hover {
      background: var(--surface-ground);
    }

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__field {
    padding: 0.5rem 0 0.75rem;
  }

  &__year-range {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.5rem 0 0.75rem;
  }

  &__year-input {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    label {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      font-weight: 500;
    }
  }

  &__year-error {
    font-size: 0.7rem;
    color: var(--red-500, #ef4444);
  }

  &__switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    margin-top: 0.5rem;
    border-top: 1px solid var(--surface-border);
  }

  &__apply,
  &__reset {
    width: 100%;
  }
}
</style>
