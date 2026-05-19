# Acquisitions Module — Frontend Mapping

## 1. Server State (TanStack Query)

### Batches
- key: ['acquisitions', 'batches']
- staleTime: 5 min

### Batch Detail
- key: ['acquisitions', 'batches', id]
- invalidates on:
  - item creation
  - act updates
  - journal issue updates

---

## 2. Critical Invalidation Rule

Must invalidate batch when:

- lib_inventory changes
- lib_journal_issues changes

Because counts are split across BOTH tables

---

## 3. Item Creation (IMPORTANT)

Frontend MUST NOT:

- create inventory directly
- assume REST insert works

Must call: POST /items/create

which triggers Oracle procedure

---

## 4. Pinia State (ONLY UI)

Allowed:
- selected batch
- selected supplier
- modal state
- form steps

NOT allowed:
- inventory data
- batch totals
- item lists

---

## 5. Type System

```ts
type InventoryItem =
  | BookInventory
  | JournalInventory
  | DiscInventory

Discriminated by:

book_id
j_issue_id
disc_id
