# Plugin Layer Analysis — SDU Library Management System

---

## 1. Purpose of Plugin Layer

The plugin layer in this system acts as:

- Wrapper for external libraries (Chart.js)
- Vue lifecycle adapter
- Rendering abstraction layer

It is NOT a global plugin system — it's a collection of UI adapters.

---

## 2. Analyzed Plugin: Pie Chart Wrapper

### Base Library

- vue-chartjs
- chartjs-plugin-labels

---

## 3. Architecture Overview

This component:

- Extends `Pie` chart
- Accepts `data` and `options` as props
- Forces full re-render on every data change

---

## 4. Core Logic

### Render function

```js
render() {
  this.renderChart(
    this.data,
    Object.assign(
      {},
      { plugins: { datalabels: { display: false } } },
      this.options
    )
  );
}

5. Reactive Behavior
Watcher
watch: {
  data() {
    this.render();
  }
}
Lifecycle
mounted → render()
data change → render()
6. Key Issues
🔴 1. Full re-render on every update

No incremental updates — chart is fully destroyed/recreated.

🔴 2. Missing deep reactivity

watch: data is shallow only

🔴 3. No separation of concerns
init logic
update logic
config merge logic
all inside one method
🔴 4. Plugin duplication risk

chartjs-plugin-labels is imported globally but:

not managed centrally
no version control layer
7. Hidden Behavior
Every prop change triggers full chart redraw
No memoization of chart instance
No destroy hook handling
8. Migration Path (Vue 3 / Modern Architecture)
Replace with:
Vue wrapper composable:
useChart()
Chart lifecycle:
initChart()
updateChart()
destroyChart()
Add improvements:
debounce updates
shallow vs deep watch separation
chart instance reuse