# SDU Library Management System
## Frontend Component Architecture Documentation

---

# 1. Общая архитектура системы

Frontend построен на Vue 2 и имеет следующие ключевые особенности:

- Vuex используется как глобальный state manager
- Mixins содержат бизнес-логику
- Event Bus используется для глобальной коммуникации
- Table system является центральным UI ядром
- Много скрытых зависимостей между компонентами

---

# 2. Архитектурная классификация компонентов

## 2.1 Pure UI Components

Компоненты без бизнес-логики и без Vuex:

- back.vue
- dropdown.vue
- checkbox.vue

---

## back.vue

### Роль
Кнопка возврата назад

### Поведение
- вызывает `beforeExit` если передан
- иначе делает router.back()

### Особенности
- может выполнять родительскую бизнес-логику через callback

---

## dropdown.vue

### Роль
UI dropdown меню

### Особенности
- принимает функции через props
- может запускать внешнюю логику при создании

---

## checkbox.vue

### Роль
Кастомный checkbox

### Проблема
- есть локальное state, которое не используется в UI
- UI зависит только от props

---

# 2.2 Form Components

## input.vue (autocomplete версия)

### Роль
Универсальный input:
- autocomplete
- static select
- async search

### Архитектурные проблемы

- три разных источника данных
- debounce не очищается
- API response формат определяется через try/catch
- двойной фильтр данных (bug)

### Вывод
Сильно перегруженный компонент

---

## input.vue (selectable версия)

### Роль
Readonly input с dropdown search

### Особенности
- better filtering logic
- Object.freeze используется для оптимизации
- inconsistent API с первым input

---

# 2.3 Domain Components

## deletemodal.vue

### Роль
Удаление записей

### Делает:
- HTTP DELETE запрос
- обновление Vuex через mixin
- показывает уведомления
- закрывает модалку

### Проблема
Слишком много ответственности в UI компоненте

---

## more.vue

### Роль
Детальный просмотр записи

### Возможности
- редактирование
- удаление
- кастомные действия
- dynamic field rendering

### Риски
- использование v-html
- выполнение функций из конфигурации
- потенциальный XSS риск

---

# 2.4 Table System (Core Engine)

## table.vue (TableDiv)

### Роль
Главный компонент всей системы

---

### Функции:
- сортировка (client + server)
- pagination
- selection system
- edit/delete actions
- sticky headers
- Vuex integration
- event bus communication

---

## Критические проблемы

### 1. GOD COMPONENT
Один компонент управляет всей системой таблиц

---

### 2. Vuex coupling
- читает state напрямую
- пишет state напрямую
- используется как API layer

---

### 3. Event Bus leaks
Нет удаления listeners → memory leak

---

### 4. DOM manipulation
Прямой доступ к DOM через document queries

---

### 5. Selection system
Использует JSON stringify для сравнения объектов

---

### 6. Hidden business logic
- id / inv_id fallback
- status color mapping
- null sorting hacks

---

## Вывод
Table.vue — это core engine системы, но он слишком перегружен

---

# 2.5 Pagination System

## pagination.vue

### Роль
Постраничная навигация

### Как работает
- обновляет Vuex state
- вызывает mixin last()
- перезагружает данные

---

### Проблемы

- full reload на каждый клик
- нет optimistic update
- жёсткая зависимость от Vuex

---

# 2.6 Selection System

## selecteditems.vue

### Роль
Управление выбранными элементами

---

### Механика
- заменяет store data fake response объектом
- симулирует серверную структуру данных

---

### Проблема
Смешивание client state и server response structure

---

# 3. Mixins Layer

## last mixin

### Делает:
- fetch last request
- Vuex update
- loading state

### Проблема
Business logic скрыт в mixin

---

## showModal mixin

- динамически открывает модалки
- связывает компоненты runtime

---

## goTo mixin

- router navigation abstraction
- вызывает close events

---

# 4. Global System Issues

## 4.1 Vuex overuse

Используется как:
- API cache
- UI state
- pagination state
- loading manager

---

## 4.2 Event Bus dependency

Global communication layer без контроля lifecycle

---

## 4.3 Global utilities

- copy()
- capitalize()
- Date prototype extensions

---

## 4.4 Inconsistent API design

- multiple input systems
- multiple autocomplete implementations
- multiple delete patterns

---

# 5. Architecture Risk Map

## CRITICAL

- Table.vue
- Vuex pagination system
- last mixin
- event bus system

---

## HIGH RISK

- input.vue (autocomplete)
- deletemodal.vue
- selecteditems.vue

---

## MEDIUM RISK

- dropdown.vue
- more.vue
- checkbox.vue

---

## LOW RISK

- back.vue

---

# 6. Migration Strategy (Vue 3)

## Replace Vuex with:

- Pinia
- TanStack Query

---

## Replace Mixins with:

- composables

---

## Replace Event Bus with:

- provide/inject
- or Pinia events

---

## Decompose Table.vue into:

- TableCore
- TableHeader
- TableBody
- TableActions
- useTableSelection
- useTableSorting

---

# 7. Final Conclusion

Current architecture:

- tightly coupled system
- business logic spread across layers
- Vuex used as everything
- mixins hide critical logic

---

Target architecture:

- composable-driven system
- separation of concerns
- isolated domain logic
- predictable data flow

---