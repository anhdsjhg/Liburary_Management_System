````md
# Settings/Theme.vue

## Purpose

Theme selection panel for the application UI.

Allows users to switch between:
- Dark theme
- Light theme
- Default theme

The selected theme is persisted in browser local storage and applied globally through the shared theme mixin.

---

# Responsibilities

- Display available theme options
- Synchronize selected theme with local component state
- Apply selected theme through `setTheme()`
- Persist user preference between sessions

---

# UI Behavior

The component renders three radio buttons:

| Value | Description |
|---|---|
| `dark` | Dark UI theme |
| `light` | Light UI theme |
| `default` | Default application theme |

Changing the selected radio immediately applies the theme.

---

# Data Flow

```txt
localStorage('theme')
    ↓
data.theme
    ↓
v-model
    ↓
setTheme(theme)
````

---

# Dependencies

## Mixins

* `setTheme` — `../../mixins/settings`

## Browser APIs

* `localStorage`

## Global Dependencies

* Vue i18n `$t()`

---

# State

| Field   | Type             | Description            |
| ------- | ---------------- | ---------------------- |
| `theme` | `String \| null` | Current selected theme |

---

# Side Effects

* Reads `localStorage.theme`
* Applies global theme changes through mixin
* Persists theme preference

---

# Known Issues

## No fallback theme

If `localStorage.theme` is missing or invalid:

* no radio button is selected
* component depends on external CSS defaults

---

## Theme logic hidden in mixin

Theme application behavior is implemented inside:

```txt
mixins/settings
```

The component itself does not expose:

* DOM mutations
* class toggling
* persistence behavior

---

## Direct localStorage usage

The component accesses browser storage directly instead of using a centralized theme service/composable.

---

# Migration Notes

Recommended Vue 3 migration:

```js
const { theme, setTheme } = useTheme()
```

Suggested improvements:

* replace mixin with composable
* validate persisted theme values
* add fallback default theme
* centralize localStorage access
* support system color scheme (`prefers-color-scheme`)

---

# Suggested Refactor Targets

| Current                    | Target                      |
| -------------------------- | --------------------------- |
| `mixins/settings`          | `useTheme()` composable     |
| direct localStorage access | theme service               |
| local component state      | shared reactive theme store |

---

# Risk Level

LOW

This component contains:

* no API calls
* no Vuex coupling
* no async logic
* no domain-critical business behavior

Migration complexity is minimal.

```
```
