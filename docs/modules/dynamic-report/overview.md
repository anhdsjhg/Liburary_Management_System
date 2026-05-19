# DynamicReport Module — Overview

## Purpose

DynamicReport is a **runtime report generation engine** that allows the system to:

- define SQL reports in the database
- attach input parameters dynamically
- render output columns dynamically
- execute queries without backend redeploy

---

## Core idea

> Reports are NOT coded in frontend or backend.
> They are stored as database metadata + SQL strings.

---

## What it solves

- removes hardcoded report pages
- allows admin-driven report creation
- supports multilingual reporting structure
- enables dynamic filter forms

---

## Architecture type

Metadata-driven SQL execution engine