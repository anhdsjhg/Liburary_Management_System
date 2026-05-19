<template>
  <li
    ref="menuItemRef"
    :class="[
      {
        'layout-root-menuitem': root,
        'active-menuitem':
          isStatic || isOverlay ? !root && isActiveMenu : isActiveMenu,
      },
      item.class,
    ]"
  >
    <template v-if="item.visible !== false">
      <!-- static and overlay - main menu items -->
      <template v-if="root">
        <router-link
          v-if="item.to && !item.items"
          :to="{ ...item.to }"
          class="layout-menuitem-root-text hover:rounded-lg hover:bg-[var(--v-menuitem-hover-bg)]"
          :class="item.class"
          @click="itemClick($event, item)"
        >
          <div class="px-2">
            <div class="flex">
              <span class="layout-menuitem-text">{{ t(label) }}</span>
              <i class="bi bi-arrow-right-circle ml-auto"></i>
            </div>
          </div>
        </router-link>
        <div v-else class="layout-menuitem-root-text" :class="item.class">
          <div class="px-2">
            <span>{{ t(label) }}</span>
            <i class="layout-menuitem-root-icon"></i>
          </div>
        </div>
      </template>

      <!-- slim and slim + - main menu items that have children -->
      <a
        v-if="!item.to || item.items"
        v-tooltip.hover="isSlim && root && !isActiveMenu ? t(label) : null"
        :href="item.url"
        :class="item.class"
        :target="item.target"
        tabindex="0"
        @click="itemClick($event, item)"
        @mouseenter="onMouseEnter"
      >
        <i :class="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ t(label) }}</span>
        <i
          v-if="item.items"
          class="pi pi-fw pi-angle-down layout-submenu-toggler"
        ></i>
      </a>

      <!-- main router links - submenu items -->
      <router-link
        v-if="item.to && !item.items"
        v-tooltip.hover="
          (isSlim || isSlimPlus) && root && !isActiveMenu ? t(label) : null
        "
        :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
        tabindex="0"
        :to="{ ...item.to }"
        @click="itemClick($event, item)"
        @mouseenter="onMouseEnter"
      >
        <i :class="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ t(label) }}</span>
      </router-link>

      <!-- submenu items recursion -->
      <ul
        v-if="item.items"
        :id="`layout-root-submenulist-${itemKey}`"
        ref="subMenuRef"
        :class="{ 'layout-root-submenulist': root }"
      >
        <AppMenuItem
          v-for="(child, i) in item.items"
          :key="i"
          :index="i"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
        ></AppMenuItem>
      </ul>
    </template>
  </li>
</template>

<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";
import {
  computed,
  nextTick,
  onBeforeMount,
  ref,
  watch,
  type PropType,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// ✅ Адаптирован: старый путь @/application/layout/default/composables/useLayout
//               новый путь @/application/layouts/admin/composables/useLayout
import { useLayout } from "@/application/layouts/admin/composables/useLayout";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const {
  layoutConfig,
  layoutState,
  setActiveMenuItem,
  toggleMenu,
  isHorizontal,
  isDesktop,
  isOverlay,
  isStatic,
  isSlim,
  isSlimPlus,
} = useLayout();

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
});

const label = computed(
  () =>
    (typeof props.item.label === "function"
      ? props.item.label()
      : props.item.label) ?? ""
);

const isActiveMenu = ref(false);
const itemKey = ref();
const subMenuRef = ref();
const menuItemRef = ref();

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? `${props.parentItemKey}-${props.index}`
    : String(props.index);

  const activeItem = layoutState.activeMenuItem;

  isActiveMenu.value =
    activeItem && activeItem === itemKey.value
      ? activeItem.startsWith(`${itemKey.value}-`)
      : false;
  handleRouteChange(route.path);
});

watch(
  () => isActiveMenu.value,
  () => {
    const rootIndex = props.root
      ? props.index
      : parseInt(`${props.parentItemKey}`[0]!, 10);

    const overlay = document.getElementById(
      `layout-root-submenulist-${itemKey.value}`
    ) as HTMLElement;
    const target = document.querySelectorAll(".layout-root-menuitem")[
      rootIndex
    ];

    if ((isSlim.value || isSlimPlus.value || isHorizontal.value) && isDesktop)
      nextTick(() => {
        calculatePosition(overlay, target!);
      });
  }
);

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value =
      (newVal === itemKey.value || newVal?.startsWith(`${itemKey.value}-`)) ??
      false;
  }
);

watch(
  () => layoutConfig.value.menuMode,
  () => {
    isActiveMenu.value = false;
  }
);

watch(
  () => layoutState.overlaySubmenuActive,
  (newValue) => {
    if (!newValue) isActiveMenu.value = false;
  }
);

function handleRouteChange(newPath: string) {
  if (
    !(isSlim.value || isSlimPlus.value || isHorizontal.value) &&
    props.item.to &&
    props.item.to === newPath
  )
    setActiveMenuItem(itemKey.value);
  else if (isSlim.value || isSlimPlus.value || isHorizontal.value)
    isActiveMenu.value = false;
}

watch(() => route.path, handleRouteChange);

async function itemClick(event: Event, item: MenuItem) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  if (
    (item.to || item.url) &&
    (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)
  )
    toggleMenu();

  if (item.command) item.command({ originalEvent: event, item: item });

  if (item.to && (!item.data || !item.data.fullPage)) {
    router.push(item.to);
    event.preventDefault();
  }

  if (item.items) {
    if (
      props.root &&
      isActiveMenu.value &&
      (isSlim.value || isSlimPlus.value || isHorizontal.value)
    ) {
      layoutState.overlaySubmenuActive = false;
      layoutState.menuHoverActive = false;
      return;
    }

    setActiveMenuItem(isActiveMenu.value ? props.parentItemKey : itemKey.value);

    if (
      props.root &&
      !isActiveMenu.value &&
      (isSlim.value || isSlimPlus.value || isHorizontal.value)
    ) {
      layoutState.overlaySubmenuActive = true;
      layoutState.menuHoverActive = true;
      isActiveMenu.value = true;
      removeAllTooltips();
    }
  } else {
    if (!isDesktop)
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;

    if (isSlim.value || isSlimPlus.value || isHorizontal.value) {
      layoutState.overlaySubmenuActive = false;
      layoutState.menuHoverActive = false;
      return;
    }

    setActiveMenuItem(itemKey.value);
  }
}

function onMouseEnter() {
  if (
    props.root &&
    (isSlim.value || isSlimPlus.value || isHorizontal.value) &&
    isDesktop
  )
    if (!isActiveMenu.value && layoutState.menuHoverActive)
      setActiveMenuItem(itemKey.value);
}

function removeAllTooltips() {
  const tooltips = document.querySelectorAll(".p-tooltip");
  tooltips.forEach((tooltip) => {
    tooltip.remove();
  });
}

function calculatePosition(overlay: HTMLElement, target: Element) {
  if (overlay) {
    const { top } = target.getBoundingClientRect();
    const vHeight = window.innerHeight;
    const oHeight = overlay.offsetHeight;
    const topbarEl = document.querySelector(".layout-topbar") as HTMLElement;
    const topbarHeight = topbarEl?.offsetHeight || 0;

    overlay.style.top = "";
    overlay.style.left = "";

    if (isSlim || isSlimPlus) {
      const topOffset = top - topbarHeight;
      const height = topOffset + oHeight + topbarHeight;

      overlay.style.top =
        vHeight < height
          ? `${topOffset - (height - vHeight)}px`
          : `${topOffset}px`;
    }
  }
}

function checkActiveRoute(item: MenuItem) {
  return route.path === item.to;
}
</script>