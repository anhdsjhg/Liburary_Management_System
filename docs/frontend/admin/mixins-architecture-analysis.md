📦 Mixin Architecture Analysis — SDU Library Frontend (Vue 2 Legacy)
📌 1. Общая архитектура системы mixins
🔷 Роль mixins в системе

Mixins в текущем проекте являются не вспомогательным слоем, а фактическим ядром бизнес-логики frontend приложения.

Они одновременно выполняют:

API orchestration (fetch / create / update / search)
Business logic transformation
UI side effects (loading, modals, navigation)
Global state mutation (Vuex bypass)
Device integration (RFID hardware)
File system interaction (download/print)
Error handling & notifications

👉 Это делает mixins скрытым "backend слоям фронтенда"

⚠️ 2. Критическая архитектурная проблема
❗ Mixins = "distributed monolith"

Вместо разделения слоёв:

UI → Composables → Services → API

сейчас:

UI → Mixins (API + State + UI + Business logic)
Основные последствия:
Нет разделения ответственности
Логика размазана по 11 файлам
Повторяемые паттерны не абстрагированы
Невозможно безопасно рефакторить store без mixins
Vuex не является источником truth — mixins его обходят
🧭 3. Классификация всех mixins
🟦 3.1 API / Data Layer Mixins (КРИТИЧЕСКИЕ)
getResults.js
Назначение

Универсальный механизм поиска и пагинации

Что делает:
строит search request
фильтрует пустые параметры
отправляет POST /search
пишет результат в Vuex через setStore
сохраняет request для replay
Проблемы:
содержит бизнес-правила фильтрации
хранит HTTP request внутри Vuex
зависит от store.request (hidden state dependency)
getAllData.js
GET /index
стандартная пагинация
дублирует getResults без search логики
last.js
❗ самый хрупкий механизм системы
пересобирает прошлый HTTP request из Vuex
зависит от предыдущего вызова getResults
поддерживает POST/GET branching

👉 Это фактически manual cache system поверх Vuex

create_it / edit_it / recreate_it
CRUD операции
emit close
показывают notifications
используют silent try/catch

❗ проблема: ошибки подавляются

specialities.js
Бизнес-логика:
превращает flat dataset → tree structure
faculty → department → speciality
recursive resolution f_*, d_* codes

❗ Это backend-level transformation на frontend

website.js
CMS engine внутри frontend
load configuration
writes directly to Vuex state
save full CMS object back to API

❗ проблемы:

bypass Vuex mutations
manual caching (fetched)
auto-run on created()
rfid.js ⚠️ CRITICAL
Hardware integration layer
synchronous XMLHttpRequest
local service: localhost/LibraryWebService
XML parsing → JSON

❗ критические проблемы:

blocking main thread
deprecated sync XHR
hardware coupling in UI layer
🟩 3.2 UI Behavior Mixins
showModal.js
wrapper over vue-js-modal
standardizes modal calls

✔ stateless

common.js
Navigation layer
goTo() → router navigation
goToMain() → full page reload

❗ window.location.replace = full app reset hack

setLocale.js
updates i18n locale
modifies axios global headers
persists to localStorage

❗ global side effects hidden in UI layer

setTheme.js
Dual responsibility:
DOM manipulation (<head><link>)
Vuex state mutation
localStorage persistence

❗ violates separation of concerns

🟨 3.3 Feedback / Notification Layer
messages.js
Central notification system
success / error handling
deep error parsing:
error.response.data.message
fallback chains

✔ most stable shared dependency

🟦 3.4 File System Layer
files.js
Responsibilities:
download files via Blob
print PDF in new window
export TXT (RFID/barcodes)

❗ issues:

memory leak (no revokeObjectURL)
DOM injection without cleanup
inconsistent implementation quality
🟩 3.5 Utility Layer
charts.js
Chart.js configuration presets
static label sets (non-i18n)

✔ clean, stateless

xml2json.js
wrapper around xml-js
duplicated logic exists in rfid.js

❗ duplication issue

reset (inside CRUD mixin)
resets search form
directly mutates Vuex state via getter reference

❗ bypasses mutation system

🔗 4. Dependency Graph
                 messages.js
                     ↑
    ┌────────────────┼────────────────┐
    │                │                │
getResults     create_it        specialities
getAllData     edit_it          website
last           recreate_it      rfid

✔ messages.js = single shared dependency hub

⚠️ 5. Cross-cutting architectural problems
5.1 Vuex bypass

Mixins directly:

mutate store.state
mutate getters references
bypass mutations entirely

👉 Vuex = not source of truth anymore

5.2 Hidden state machine

Examples:

last depends on previous getResults
website.loadData depends on fetched
rfid depends on local hardware service

👉 system behaves like implicit state machine

5.3 API logic in UI layer
no service layer exists
no API abstraction
no query layer

👉 components + mixins = backend replacement

5.4 Duplicate logic

Repeated everywhere:

search
data
page
per_page
sorting_fields
sort_by
pagination

👉 "table state schema" duplicated ~10+ times

5.5 Side effects everywhere

Mixins modify:

DOM
axios globals
localStorage
Vuex
router
hardware devices

👉 no pure layer exists

🚨 6. Risk classification
🔴 CRITICAL
rfid.js (sync XHR + hardware)
getResults.js (core search engine)
last.js (stateful request replay)
Vuex bypass patterns
🟠 HIGH
website.js
specialities.js
setTheme.js
reset
🟡 MEDIUM
files.js
messages.js
setLocale.js
CRUD mixins
🟢 LOW
charts.js
xml2json.js
showModal.js
navigation helpers
🧱 7. Architectural conclusion
Current system is:

"Vue 2 application behaving like backend monolith inside frontend layer"

🔄 8. Target architecture (migration vision)
Replace mixins with:
🧠 Composables
useTableState()
useLocale()
useModal()
useNotifications()
useFileDownload()
🔌 Services
ApiService
RfidService
XmlService
FileService
📡 TanStack Query
useSearchQuery()
useMutation()
usePaginatedQuery()
🗂 Pinia stores
auth store
ui store
theme store
🎯 Final takeaway

This mixin system is not a helper layer.

It is:

❗ The actual backend of the frontend application

and must be dismantled before any safe refactor of:

Vuex
API layer
component structure
or migration to Vue 3