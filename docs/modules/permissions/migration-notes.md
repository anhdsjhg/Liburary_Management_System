# Permission Module — Migration Guide

## Step 1
Hydrate permissions at login only

## Step 2
Move all guards to Pinia store

## Step 3
Replace route checks:
Vue 2 → API calls
Vue 3 → local Set lookup

## Step 4
Admin panel uses TanStack Query

## DO NOT
- call API inside route guards
- recompute permissions per navigation