# Acquisitions Module — Overview

## 1. Purpose

The Acquisitions module manages the **procurement lifecycle of library materials**, including:

- acquisition batches
- suppliers
- publishers
- inventory item creation
- financial tracking of purchased materials

It is responsible for transforming **external purchases into library-owned inventory items**.

---

## 2. Core Responsibility

This module acts as the **entry point of all physical/digital assets** into the system.

Flow:
Supplier → Batch → Act → Item → lib_inventory

---

## 3. Key Architectural Role

- Centralized procurement system
- Controls inventory creation (via Oracle package)
- Links acquisitions with catalog module (Media)
- Tracks financial cost per batch and item

---

## 4. Critical System Constraint

Inventory creation is NOT handled in application code.

> All item creation flows through Oracle procedure:
`pkg_acquisition.manage_items`

This makes Acquisitions module partially **database-driven domain logic**, not purely application-layer logic.