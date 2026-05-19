# Media Module Overview

## Role in System

Media module is the central catalog layer of the library system. It unifies access to:

- Books
- Discs (AV / digital media)
- Journals (via issues)

It acts as a **polymorphic abstraction layer** over heterogeneous media types.

---

## Core Responsibilities

- Unified catalog querying (defaultQuery)
- Live availability computation via inventory + loans
- Media type resolution (MaterialTypeFactory)
- Cross-module identity reference (loans, reserves, acquisitions)

---

## Key Architectural Idea

Instead of separate systems per media type, the module:

- normalizes all media into a shared query contract
- maps inventory → availability dynamically
- keeps journal structure hierarchical (journal → issue → inventory)

---

## Critical Design Choice

Inventory is the **only physical layer**:

- books/discs/journal issues = metadata
- inventory = physical copy
- loans = state of copy
