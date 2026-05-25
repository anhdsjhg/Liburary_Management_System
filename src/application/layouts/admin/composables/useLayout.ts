import { computed, reactive, ref } from "vue";

export type MenuMode =
  | "overlay"
  | "static"
  | "slim"
  | "slim-plus"
  | "horizontal";

type TLayoutConfig = {
  preset: "Aura" | "Lara" | "Nora";
  primary: string;
  surface?: string;
  darkTheme: boolean;
  menuMode: MenuMode;
  layoutTheme: string;
  theme?: string;
};

const defaultConfig: TLayoutConfig = {
  preset: "Aura",
  primary: "emerald",
  darkTheme: false,
  menuMode: "slim-plus",
  layoutTheme: "colorScheme",
};

const _saved = localStorage.getItem("config");
const layoutConfig = ref<TLayoutConfig>(
  _saved ? { ...defaultConfig, ...JSON.parse(_saved) } : defaultConfig
);

// Restore dark mode class immediately on load
if (layoutConfig.value.darkTheme) {
  document.documentElement.className = "app-dark";
}

type TLayoutState = {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
  rightMenuActive: boolean;
  topbarMenuActive: boolean;
  sidebarActive: boolean;
  overlaySubmenuActive: boolean;
  activeMenuItem?: string;
};

const layoutState = reactive<TLayoutState>({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  rightMenuActive: false,
  topbarMenuActive: false,
  sidebarActive: false,
  overlaySubmenuActive: false,
});

export function useLayout() {
  function setActiveMenuItem(item: string) {
    layoutState.activeMenuItem = item;
  }

  function toggleMenu() {
    if (layoutConfig.value.menuMode === "overlay")
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive;

    if (window.innerWidth > 991)
      layoutState.staticMenuDesktopInactive =
        !layoutState.staticMenuDesktopInactive;
    else
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
  }

  function toggleConfigSidebar() {
    if (isSidebarActive.value) {
      layoutState.overlayMenuActive = false;
      layoutState.overlaySubmenuActive = false;
      layoutState.staticMenuMobileActive = false;
      layoutState.menuHoverActive = false;
    }
    layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
  }

  function setLayoutConfig(config?: TLayoutConfig) {
    if (config) localStorage.setItem("config", JSON.stringify(config));

    const localConfig = localStorage.getItem("config");
    if (localConfig) layoutConfig.value = JSON.parse(localConfig);
  }

  function setDarkMode() {
    document.documentElement.className = layoutConfig.value.darkTheme
      ? "app-dark"
      : "";
  }

  const isSidebarActive = computed(
    () =>
      layoutState.overlayMenuActive ||
      layoutState.staticMenuMobileActive ||
      layoutState.overlaySubmenuActive
  );

  const isDesktop = computed(() => window.innerWidth > 991);

  const isSlim = computed(() => layoutConfig.value.menuMode === "slim");
  const isSlimPlus = computed(
    () => layoutConfig.value.menuMode === "slim-plus"
  );
  const isHorizontal = computed(
    () => layoutConfig.value.menuMode === "horizontal"
  );
  const isOverlay = computed(() => layoutConfig.value.menuMode === "overlay");
  const isStatic = computed(() => layoutConfig.value.menuMode === "static");

  const isDarkTheme = computed(() => layoutConfig.value.darkTheme);
  const getPrimary = computed(() => layoutConfig.value.primary);
  const getSurface = computed(() => layoutConfig.value.surface);

  return {
    layoutConfig,
    layoutState,
    getPrimary,
    getSurface,
    isDarkTheme,
    toggleMenu,
    isSidebarActive,
    setActiveMenuItem,
    toggleConfigSidebar,
    isSlim,
    isSlimPlus,
    isHorizontal,
    isDesktop,
    isOverlay,
    isStatic,
    setLayoutConfig,
    setDarkMode,
  };
}