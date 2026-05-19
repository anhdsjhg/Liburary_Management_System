# User Module — Overview

## Role in system

User module is the **identity backbone** of the entire library system.

It does NOT own user data — it only adapts external ERP data (`dbmaster`) into library context.

## Core responsibility

- Authentication (login, token)
- Identity bridging (ERP → library user)
- User profile aggregation
- Loan & penalty ownership
- Permission system linkage
- Analytics (login logs)

---

## Key architectural principle

> The library system NEVER stores real user identity.
> It only stores `user_cid` as a bridge to ERP.

---

## Two user types

- Student (`dbmaster.students`)
- Employee (`dbmaster.employee`)

Both are unified through:
lib_user_cards.user_cid

---

## System dependency graph

ERP (dbmaster)
    ↓
lib_user_cards (bridge layer)
    ↓
Library modules (loans, permissions, logs, reports)