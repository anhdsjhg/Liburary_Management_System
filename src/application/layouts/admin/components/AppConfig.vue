<template>
  <button
    v-if="simple"
    class="layout-config-button config-link"
    type="button"
    @click="toggleConfigSidebar"
  >
    <i class="pi pi-cog"></i>
  </button>
  <Drawer
    v-model:visible="layoutState.configSidebarVisible"
    position="right"
    class="layout-config-sidebar w-full sm:w-72"
    header="Settings"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <div class="config-sections">
      <div class="config-section">
        <span class="config-section-title">Primary</span>
        <div class="swatch-row">
          <button
            v-for="primaryColor of primaryColors"
            :key="primaryColor.name"
            type="button"
            class="swatch-btn"
            :class="{ 'swatch-btn--active': layoutConfig.primary === primaryColor.name }"
            :style="{
              backgroundColor: primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500'],
            }"
            @click="updateColors('primary', primaryColor)"
          ></button>
        </div>
      </div>

      <div class="config-section">
        <span class="config-section-title">Surface</span>
        <div class="swatch-row">
          <button
            v-for="surface of surfaces"
            :key="surface.name"
            type="button"
            class="swatch-btn"
            :class="{
              'swatch-btn--active': layoutConfig.surface
                ? layoutConfig.surface === surface.name
                : isDarkTheme
                  ? surface.name === 'zinc'
                  : surface.name === 'slate',
            }"
            :style="{ backgroundColor: surface.palette['500'] }"
            @click="updateColors('surface', surface)"
          ></button>
        </div>
      </div>

      <div class="config-section">
        <span class="config-section-title">Presets</span>
        <SelectButton
          v-model="preset"
          :options="presetOptions"
          :allowEmpty="false"
        />
      </div>

      <div class="config-section">
        <span class="config-section-title">Color Scheme</span>
        <SelectButton
          v-model="darkTheme"
          :options="themeOptions"
          optionLabel="name"
          optionValue="value"
          :allowEmpty="false"
          @change="toggleDarkMode"
        />
      </div>

      <template v-if="!simple">
        <div class="config-section">
          <span class="config-section-title">Menu Type</span>
          <div class="config-radio-grid">
            <div v-for="menu in menuModes" :key="menu.value" class="config-radio-row">
              <RadioButton
                v-model="menuMode"
                name="menuMode"
                :value="menu.value"
                :inputId="menu.value"
                @update:model-value="setMenuMode"
              />
              <label :for="menu.value">{{ menu.title }}</label>
            </div>
          </div>
        </div>

        <div class="config-section">
          <span class="config-section-title">Layout Theme</span>
          <div class="config-radio-list">
            <div v-for="theme in layoutThemes" :key="theme.value" class="config-radio-row">
              <RadioButton
                v-model="layoutTheme"
                name="layoutTheme"
                :value="theme.value"
                :inputId="theme.value"
                @change="changeLayoutTheme"
              />
              <label :for="theme.value">{{ theme.title }}</label>
            </div>
          </div>
        </div>
      </template>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { $t, updatePreset, updateSurfacePalette } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import Lara from "@primeuix/themes/lara";
import Nora from "@primeuix/themes/nora";
import { ref, watch } from "vue";

// ✅ Адаптированы пути: старый layout/default → новый layouts/admin
import {
  useLayout,
  type MenuMode,
} from "@/application/layouts/admin/composables/useLayout";
// ✅ Адаптированы пути consts внутри admin layout
import { primaryColors } from "@/application/layouts/admin/consts/primaryColors";
import { surfaces } from "@/application/layouts/admin/consts/surfaces";

defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
});

const {
  layoutState,
  layoutConfig,
  isDarkTheme,
  setDarkMode,
  toggleConfigSidebar,
  setLayoutConfig,
} = useLayout();

const presets = {
  Aura,
  Lara,
  Nora,
};

const layoutThemes = [
  { value: "colorScheme", title: "Color Scheme" },
  { value: "primaryColor", title: "Primary Color (Light Only)" },
];
const menuModes = [
  { value: "static", title: "Static" },
  { value: "overlay", title: "Overlay" },
  { value: "slim", title: "Slim" },
  { value: "slim-plus", title: "Slim+" },
];
const presetOptions = ref(Object.keys(presets));
const preset = ref(layoutConfig.value.preset);
const themeOptions = ref([
  { name: "Light", value: false },
  { name: "Dark", value: true },
]);
const darkTheme = ref(layoutConfig.value.darkTheme);
const menuMode = ref(layoutConfig.value.menuMode);
const layoutTheme = ref(layoutConfig.value.layoutTheme);
const previousLightTheme = ref(layoutConfig.value.layoutTheme);

function toggleDarkMode() {
  const isDark = darkTheme.value;

  if (isDark) {
    previousLightTheme.value = layoutConfig.value.layoutTheme;

    if (layoutConfig.value.layoutTheme === "primaryColor")
      layoutConfig.value.layoutTheme = "colorScheme";
  } else layoutConfig.value.layoutTheme = previousLightTheme.value;

  layoutConfig.value.darkTheme = isDark;

  if (!document.startViewTransition) executeDarkModeToggle();
  else document.startViewTransition(() => executeDarkModeToggle());

  setDarkMode();
  saveLocally();
}

function executeDarkModeToggle() {
  if (
    layoutConfig.value.darkTheme === true &&
    layoutConfig.value.layoutTheme === "primaryColor"
  )
    layoutConfig.value.layoutTheme = "colorScheme";
}

function getPresetExt() {
  const color = primaryColors.value.find(
    (c) => c.name === layoutConfig.value.primary
  );

  if (color?.name === "noir")
    return {
      semantic: {
        primary: {
          50: "{surface.50}",
          100: "{surface.100}",
          200: "{surface.200}",
          300: "{surface.300}",
          400: "{surface.400}",
          500: "{surface.500}",
          600: "{surface.600}",
          700: "{surface.700}",
          800: "{surface.800}",
          900: "{surface.900}",
          950: "{surface.950}",
        },
        colorScheme: {
          light: {
            primary: {
              color: "{primary.950}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.800}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.950}",
              focusBackground: "{primary.700}",
              color: "#ffffff",
              focusColor: "#ffffff",
            },
          },
          dark: {
            primary: {
              color: "{primary.50}",
              contrastColor: "{primary.950}",
              hoverColor: "{primary.200}",
              activeColor: "{primary.300}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.300}",
              color: "{primary.950}",
              focusColor: "{primary.950}",
            },
          },
        },
      },
    };
  else
    return {
      semantic: {
        primary: color?.palette,
        colorScheme: {
          light: {
            primary: {
              color: "{primary.500}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.600}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.100}",
              color: "{primary.700}",
              focusColor: "{primary.800}",
            },
          },
          dark: {
            primary: {
              color: "{primary.400}",
              contrastColor: "{surface.900}",
              hoverColor: "{primary.300}",
              activeColor: "{primary.200}",
            },
            highlight: {
              background: "color-mix(in srgb, {primary.400}, transparent 84%)",
              focusBackground:
                "color-mix(in srgb, {primary.400}, transparent 76%)",
              color: "rgba(255,255,255,.87)",
              focusColor: "rgba(255,255,255,.87)",
            },
          },
        },
      },
    };
}

function updateColors(
  type: string,
  color: (typeof primaryColors.value)[number]
) {
  if (type === "primary") layoutConfig.value.primary = color.name;
  else if (type === "surface") layoutConfig.value.surface = color.name;

  applyTheme(type, color);
  saveLocally();
}

function applyTheme(type: string, color: (typeof primaryColors.value)[number]) {
  if (type === "primary") updatePreset(getPresetExt());
  else if (type === "surface") updateSurfacePalette(color.palette);
}

function onPresetChange() {
  layoutConfig.value.preset = preset.value;
  const presetValue = presets[preset.value];
  const surfacePalette = surfaces.value.find(
    (s) => s.name === layoutConfig.value.surface
  )?.palette;

  $t()
    .preset(presetValue)
    .preset(getPresetExt())
    .surfacePalette(surfacePalette)
    .use({ useDefaultOptions: true });
  saveLocally();
}

function setMenuMode(mode: MenuMode) {
  layoutConfig.value.menuMode = mode;

  if (mode === "static") layoutState.staticMenuDesktopInactive = false;

  saveLocally();
}

function changeLayoutTheme() {
  layoutConfig.value.layoutTheme = layoutTheme.value;
  saveLocally();
}

function saveLocally() {
  setLayoutConfig(layoutConfig.value);
}

watch(
  [layoutConfig.value, preset.value],
  () => {
    onPresetChange();
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
/* ── Sections layout ── */
.config-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

/* ── Radio groups ── */
.config-radio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.config-radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.config-radio-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

/* ── Color swatches ── */
.swatch-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.swatch-btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  display: block;
  transition: transform 0.15s ease;
}

.swatch-btn:hover {
  transform: scale(1.2);
}

.swatch-btn--active {
  outline: 2px solid var(--p-primary-color, #6366f1);
  outline-offset: 2px;
}
</style>