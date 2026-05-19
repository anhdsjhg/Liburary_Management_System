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
    <div class="flex flex-col gap-4">
      <div>
        <span class="text-lg font-semibold">Primary</span>
        <div class="flex flex-wrap gap-2 pt-2">
          <button
            v-for="primaryColor of primaryColors"
            :key="primaryColor.name"
            type="button"
            :class="[
              'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 outline-none outline-offset-1',
              { 'outline-primary': layoutConfig.primary === primaryColor.name },
            ]"
            :style="{
              backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}`,
            }"
            @click="updateColors('primary', primaryColor)"
          ></button>
        </div>
      </div>

      <div>
        <span class="text-lg font-semibold">Surface</span>
        <div class="flex flex-wrap gap-2 pt-2">
          <button
            v-for="surface of surfaces"
            :key="surface.name"
            type="button"
            :class="[
              'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 outline-none outline-offset-1',
              {
                'outline-primary': layoutConfig.surface
                  ? layoutConfig.surface === surface.name
                  : isDarkTheme
                    ? surface.name === 'zinc'
                    : surface.name === 'slate',
              },
            ]"
            :style="{ backgroundColor: `${surface.palette['500']}` }"
            @click="updateColors('surface', surface)"
          ></button>
        </div>
      </div>

      <div>
        <div class="flex flex-col gap-2">
          <span class="text-lg font-semibold">Presets</span>
          <SelectButton
            v-model="preset"
            :options="presetOptions"
            :allowEmpty="false"
          />
        </div>
      </div>

      <div>
        <div class="flex flex-col gap-2">
          <span class="text-lg font-semibold">Color Scheme</span>
          <SelectButton
            v-model="darkTheme"
            :options="themeOptions"
            optionLabel="name"
            optionValue="value"
            :allowEmpty="false"
            @change="toggleDarkMode"
          />
          {{ darkTheme }}
        </div>
      </div>

      <template v-if="!simple">
        <div>
          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">Menu Type</span>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="menu in menuModes" class="flex items-center gap-2">
                <RadioButton
                  v-model="menuMode"
                  name="menuMode"
                  :value="menu.value"
                  :inputId="menu.value"
                  @update:model-value="setMenuMode"
                ></RadioButton>
                <label for="static">{{ menu.title }}</label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">Layout Theme</span>
            <div class="flex flex-col gap-4">
              <div
                v-for="theme in layoutThemes"
                class="flex items-center gap-2"
              >
                <RadioButton
                  v-model="layoutTheme"
                  name="layoutTheme"
                  :value="theme.value"
                  :inputId="theme.value"
                  @change="changeLayoutTheme"
                ></RadioButton>
                <label :for="theme.value">{{ theme.title }}</label>
              </div>
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