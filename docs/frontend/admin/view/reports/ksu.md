# Reports/KSU/README.md

## Purpose

KSU is a statutory acquisition registry report with:

* 70+ columns
* multi-level table headers
* language grouping
* genre grouping
* acquisition analytics

This report reflects ministry-defined reporting requirements.

---

## Main Components

| Component         | Responsibility                 |
| ----------------- | ------------------------------ |
| `KSU.vue`         | Main KSU registry report       |
| `Periodicals.vue` | Periodical acquisitions report |

---

## Architectural Notes

### Multi-Level Header System

The report uses nested header structures:

```js
heads.data[][]
```

This structure is tightly coupled to `TableDiv`.

---

## Problems

### Huge Reactive Header Object

`heads` contains 150+ lines of configuration inside `data()`.

Problems:

* unnecessary reactivity
* difficult maintenance
* large render cost

Recommended:

```txt
/constants/ksu.ts
```

---

### Computed Mutation Bug (`Periodicals.vue`)

Current anti-pattern:

```js
this.heads.data[0][1].invisible = true
```

inside computed-generated objects.

Risk:

* mutation instantly lost
* inconsistent rendering

---

## Shared Domain Constants

Repeated values:

```txt
D = donated
B = bought
R = replacement
```

Should become:

```txt
/constants/supplyTypes.ts
```

---

## Recommended Refactor

### Extract:

* `KSU_HEADS`
* `PERIODICAL_HEADS`
* supply constants
* pagination logic

### Add:

* `useKSUReport()`
* `usePeriodicalsReport()`

---

## Migration Risk

| Area             | Risk   |
| ---------------- | ------ |
| Header rendering | HIGH   |
| Business logic   | MEDIUM |
| API layer        | LOW    |

---
