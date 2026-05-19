import { computed } from "vue";

import { useLayout } from "../composables/useLayout";

const { layoutConfig, layoutState } = useLayout();

export const containerClass = computed(() => [
  {
    "layout-light":
      layoutConfig.value.layoutTheme === "colorScheme" &&
      !layoutConfig.value.darkTheme,
    "layout-dark":
      layoutConfig.value.layoutTheme === "colorScheme" &&
      layoutConfig.value.darkTheme,
    "layout-primary":
      !layoutConfig.value.darkTheme &&
      layoutConfig.value.layoutTheme === "primaryColor",
    "layout-slim": layoutConfig.value.menuMode === "slim",
    "layout-slim-plus": layoutConfig.value.menuMode === "slim-plus",
    "layout-static": layoutConfig.value.menuMode === "static",
    "layout-overlay": layoutConfig.value.menuMode === "overlay",
    "layout-overlay-active": layoutState.overlayMenuActive,
    "layout-mobile-active": layoutState.staticMenuMobileActive,
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.value.menuMode === "static",
  },
]);
