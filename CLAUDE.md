# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build (also the quickest full compile check; there are no tests)
- `npm run lint` — oxlint
- `npm run preview` — serve the production build

## What this is

WealthShare: a personal-finance dashboard demo (accounts, income/expense tracking, savings goals, community feed) built as a Vite + React 19 SPA. Everything is frontend-only mock data — there is no backend, and "persistence" is in-memory React state seeded from `src/data/mock.js` (only settings survive reload via localStorage: `ws-theme`, `ws-lang`, `ws-currency`, `ws-sidebar`).

## Architecture

**No router.** `src/App.jsx` (`Shell`) holds a `page` string state and switch-renders the page component inside `Layout`. Page ids: `dashboard`, `accounts`, `income`, `expense`, `savings`, `community`, `settings`. `income` and `expense` are the same component (`pages/Transactions.jsx`) parameterized by a `type` prop. Every page change shows a ~550ms simulated load rendering `PageSkeleton` from `components/ui.jsx`, which is keyed by page id — each page has a skeleton mirroring its real layout, so if you change a page's structure, update its skeleton variant too.

**All state lives in `src/store.jsx`** via a single React Context (`AppProvider` / `useApp()`): user/auth, accounts, transactions, goals, posts, settings (theme/currency/lang), derived dashboard `summary`, and all mutation functions. Note: `@reduxjs/toolkit` and `react-redux` are in `package.json` but are currently unused — the store is plain Context.

**Money is stored in THB base units.** The active currency is a module-level `CURRENCY` variable in `store.jsx` kept in sync by the provider, so `fmtMoney()` works anywhere without prop drilling. Convert user input back with `toBase()` before storing; `convert()` goes base→display.

**i18n** (`src/i18n.js`): English + Thai. `t('group.key', {vars})` resolves static UI strings by dot-path; `tl('labelGroup', value)` translates data labels (categories, account types, portfolio names) by exact value with fallback to the original string. Both come from `useApp()`. Any new user-facing string must be added to both `en` and `th` objects.

**Theming**: `light`/`dark`/`system`, applied as a `data-theme` attribute on `<html>` that swaps CSS variables. All styling is plain CSS in one global `src/index.css` (plus `pages/Login.css`) — no CSS framework, modules, or utility classes. Reuse the existing variables (`--ink`, `--primary`, `--positive`/`--negative`, etc.) and layout classes (`kpi-row`, `dash-grid`, `card`, …).

**No external UI/chart/icon libraries.** Charts are hand-rolled SVG in `components/charts.jsx` (line + donut; categorical palette `SERIES` there is contrast-validated — don't reorder or cycle it). Icons are inline SVG stroke icons in `components/icons.jsx` (24×24 grid, `currentColor`, 1.8 stroke — same style as the nav icons in `Layout.jsx`); add new icons there rather than introducing a library.

**No emoji in UI or data.** They were deliberately removed for a professional look — use `Icon` / `CategoryIcon` / `AccountTypeIcon` from `components/icons.jsx` instead. Plain typographic glyphs (`✓`, `✕`, `▲`/`▼`) are fine.

Shared primitives (StatTile, Modal/bottom-sheet, skeletons, EmptyState, TxRow/TxList) live in `components/ui.jsx`; the add-transaction modal used by Dashboard and Transactions is `components/TransactionModal.jsx`.
