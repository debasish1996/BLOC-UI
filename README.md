# Bloc UI

Lightweight, accessible Angular component library — barebone structure and behaviour with zero design opinions. Bring your own styles or use the optional theme package.

[![npm @bloc-ui/core](https://img.shields.io/npm/v/@bloc-ui/core?label=%40bloc-ui%2Fcore)](https://www.npmjs.com/package/@bloc-ui/core)
[![npm @bloc-ui/theme](https://img.shields.io/npm/v/@bloc-ui/theme?label=%40bloc-ui%2Ftheme)](https://www.npmjs.com/package/@bloc-ui/theme)
[![npm @bloc-ui/modal](https://img.shields.io/npm/v/@bloc-ui/modal?label=%40bloc-ui%2Fmodal)](https://www.npmjs.com/package/@bloc-ui/modal)
[![npm @bloc-ui/table](https://img.shields.io/npm/v/@bloc-ui/table?label=%40bloc-ui%2Ftable)](https://www.npmjs.com/package/@bloc-ui/table)
[![npm @bloc-ui/toast](https://img.shields.io/npm/v/@bloc-ui/toast?label=%40bloc-ui%2Ftoast)](https://www.npmjs.com/package/@bloc-ui/toast)
[![npm @bloc-ui/date-picker](https://img.shields.io/npm/v/@bloc-ui/date-picker?label=%40bloc-ui%2Fdate-picker)](https://www.npmjs.com/package/@bloc-ui/date-picker)
[![npm @bloc-ui/tab](https://img.shields.io/npm/v/@bloc-ui/tab?label=%40bloc-ui%2Ftab)](https://www.npmjs.com/package/@bloc-ui/tab)
[![npm @bloc-ui/tooltip](https://img.shields.io/npm/v/@bloc-ui/tooltip?label=%40bloc-ui%2Ftooltip)](https://www.npmjs.com/package/@bloc-ui/tooltip)
[![npm @bloc-ui/alert](https://img.shields.io/npm/v/@bloc-ui/alert?label=%40bloc-ui%2Falert)](https://www.npmjs.com/package/@bloc-ui/alert)
[![npm @bloc-ui/virtual-scroll](https://img.shields.io/npm/v/@bloc-ui/virtual-scroll?label=%40bloc-ui%2Fvirtual-scroll)](https://www.npmjs.com/package/@bloc-ui/virtual-scroll)
[![npm @bloc-ui/kit](https://img.shields.io/npm/v/@bloc-ui/kit?label=%40bloc-ui%2Fkit)](https://www.npmjs.com/package/@bloc-ui/kit)

If this saves you time, consider supporting 🙌 — [☕ Ko-fi](https://ko-fi.com/blocverse) · [⭐ Star on GitHub](https://github.com/debasish1996/BLOC-UI)

**[Live Documentation & Demos](https://ui.bloc-verse.com/)**

---

## Packages

### Stable

Packages that are production-ready: full README, demo route, unit tests, and documentation.

| Package                                                                            | Description                                                               | Version  |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit)                       | All-in-one umbrella — re-exports every stable and experimental package    | `1.0.3`  |
| [`@bloc-ui/core`](https://www.npmjs.com/package/@bloc-ui/core)                     | Component library — button, checkbox, input, radio, spinner, toggle       | `0.0.12` |
| [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme)                   | Optional theme layer — CSS custom properties, colour tokens, dark mode    | `0.0.7`  |
| [`@bloc-ui/modal`](https://www.npmjs.com/package/@bloc-ui/modal)                   | Service-driven modal dialogs with typed data & results                    | `0.0.4`  |
| [`@bloc-ui/table`](https://www.npmjs.com/package/@bloc-ui/table)                   | Declarative data table with custom cell templates                         | `0.0.4`  |
| [`@bloc-ui/toast`](https://www.npmjs.com/package/@bloc-ui/toast)                   | Toast notification service with severity helpers                          | `0.0.4`  |
| [`@bloc-ui/date-picker`](https://www.npmjs.com/package/@bloc-ui/date-picker)       | Calendar date picker with forms integration                               | `0.0.6`  |
| [`@bloc-ui/tab`](https://www.npmjs.com/package/@bloc-ui/tab)                       | Tab group with animated indicator and disabled tabs                       | `0.0.4`  |
| [`@bloc-ui/tooltip`](https://www.npmjs.com/package/@bloc-ui/tooltip)               | Hover/focus tooltip with intelligent repositioning and delay control      | `0.1.0`  |
| [`@bloc-ui/alert`](https://www.npmjs.com/package/@bloc-ui/alert)                   | Inline alert banners with severity variants and optional dismiss          | `1.0.1`  |
| [`@bloc-ui/virtual-scroll`](https://www.npmjs.com/package/@bloc-ui/virtual-scroll) | Lightweight virtual scrolling — renders only visible items, signal-driven | `1.0.0`  |

### Experimental

Available and functional, but the API may change. Not yet at the full stable bar.

> ⚠️ Experimental packages are shipped in `@bloc-ui/kit` and can be imported directly. Use them with the understanding that breaking changes may occur before they reach stable status.

| Package                 | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `@bloc-ui/accordion`    | Collapsible accordion with single/multi-open modes and keyboard navigation   |
| `@bloc-ui/autocomplete` | Searchable single-select with async-friendly option list                     |
| `@bloc-ui/layout`       | Sidebar layout with collapsible panel and responsive stacking                |
| `@bloc-ui/pagination`   | Page navigation with configurable sibling/boundary counts and custom labels  |
| `@bloc-ui/select`       | Single-select dropdown with overlay, keyboard nav, search, and loading state |
| `@bloc-ui/slider`       | Range slider with Angular forms integration                                  |

## Components

### Stable components

| Component          | Package                   | Entry Point               | Selector / API                            | Description                                                          |
| ------------------ | ------------------------- | ------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| **Button**         | `@bloc-ui/core`           | `@bloc-ui/core/button`    | `button[blocButton]`                      | Primary / secondary / outline variants with loading state            |
| **Checkbox**       | `@bloc-ui/core`           | `@bloc-ui/core/checkbox`  | `bloc-checkbox`                           | Checkbox with forms integration and label positioning                |
| **Input**          | `@bloc-ui/core`           | `@bloc-ui/core/input`     | `input[blocInput]`                        | Input directive with error detection, groups, prefix/suffix          |
| **Radio**          | `@bloc-ui/core`           | `@bloc-ui/core/radio`     | `bloc-radio-group` / `bloc-radio`         | Radio group with roving keyboard navigation                          |
| **Spinner**        | `@bloc-ui/core`           | `@bloc-ui/core/spinner`   | `bloc-spinner` / `[blocSpinner]`          | Inline loading spinner with preset sizes                             |
| **Toggle**         | `@bloc-ui/core`           | `@bloc-ui/core/toggle`    | `bloc-toggle`                             | Switch toggle with forms integration                                 |
| **Modal**          | `@bloc-ui/modal`          | `@bloc-ui/modal`          | `BlocModalService.open()`                 | Programmatic modals with typed data injection                        |
| **Table**          | `@bloc-ui/table`          | `@bloc-ui/table`          | `bloc-table` / `bloc-column`              | Declarative data table with striped, bordered, hover options         |
| **Toast**          | `@bloc-ui/toast`          | `@bloc-ui/toast`          | `BlocToastService`                        | Toast notifications with info, success, warning, error types         |
| **Date Picker**    | `@bloc-ui/date-picker`    | `@bloc-ui/date-picker`    | `bloc-date-picker`                        | Calendar dropdown with min/max date support                          |
| **Tab**            | `@bloc-ui/tab`            | `@bloc-ui/tab`            | `bloc-tab-group` / `bloc-tab`             | Tab group with animated active indicator                             |
| **Tooltip**        | `@bloc-ui/tooltip`        | `@bloc-ui/tooltip`        | `[blocTooltip]`                           | Hover/focus tooltip with intelligent repositioning and delay control |
| **Alert**          | `@bloc-ui/alert`          | `@bloc-ui/alert`          | `bloc-alert`                              | Inline alert banner with severity variants and optional dismiss      |
| **Virtual Scroll** | `@bloc-ui/virtual-scroll` | `@bloc-ui/virtual-scroll` | `bloc-virtual-scroll` / `blocVirtualItem` | Lightweight virtual scrolling for large lists and tables             |

### Experimental components

| Component                | Package                 | Entry Point              | Selector / API                                                  | Description                                                      |
| ------------------------ | ----------------------- | ------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Badge** `[EXP]`        | `@bloc-ui/core`         | `@bloc-ui/core/badge`    | `bloc-badge`                                                    | Labelling pill with variant and size presets                     |
| **Progress** `[EXP]`     | `@bloc-ui/core`         | `@bloc-ui/core/progress` | `bloc-progress`                                                 | Horizontal progress bar with label and value display             |
| **Skeleton** `[EXP]`     | `@bloc-ui/core`         | `@bloc-ui/core/skeleton` | `bloc-skeleton` / `[blocSkeleton]`                              | Loading placeholder directive with line, rect, and circle shapes |
| **Textarea** `[EXP]`     | `@bloc-ui/core`         | `@bloc-ui/core/textarea` | `textarea[blocTextarea]`                                        | Textarea directive with error state and forms integration        |
| **Accordion** `[EXP]`    | `@bloc-ui/accordion`    | `@bloc-ui/accordion`     | `bloc-accordion` / `[blocAccordionItem]`                        | Collapsible panels with single/multi mode                        |
| **Autocomplete** `[EXP]` | `@bloc-ui/autocomplete` | `@bloc-ui/autocomplete`  | `bloc-autocomplete`                                             | Searchable single-select with keyboard nav and forms support     |
| **Layout** `[EXP]`       | `@bloc-ui/layout`       | `@bloc-ui/layout`        | `bloc-sidebar-layout` / `bloc-sidebar` / `bloc-sidebar-content` | Sidebar layout with collapsible panel                            |
| **Pagination** `[EXP]`   | `@bloc-ui/pagination`   | `@bloc-ui/pagination`    | `bloc-pagination`                                               | Page navigation with sibling/boundary config                     |
| **Select** `[EXP]`       | `@bloc-ui/select`       | `@bloc-ui/select`        | `bloc-select` / `[bloc-option]`                                 | Single-select dropdown with overlay and keyboard navigation      |
| **Slider** `[EXP]`       | `@bloc-ui/slider`       | `@bloc-ui/slider`        | `bloc-slider`                                                   | Range slider with Angular forms integration                      |

`[EXP]` = Experimental — API may change before reaching stable.

All components are `standalone: true` with companion NgModule wrappers.

---

## Quick Start

Full guide: **[Getting Started](https://ui.bloc-verse.com/getting-started)**

### 1. Choose installation strategy

#### Option A — All-in-one

```bash
npm install @bloc-ui/kit
```

```ts
import { BlocButtonComponent } from '@bloc-ui/kit';
import { BlocModalService } from '@bloc-ui/kit';
```

#### Option B — Individual packages (smaller bundles)

```bash
npm install @bloc-ui/core @bloc-ui/modal @bloc-ui/table
```

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocInputDirective } from '@bloc-ui/core/input';
import { BlocModalService } from '@bloc-ui/modal';
import { BlocTableComponent } from '@bloc-ui/table';
```

```html
<button blocButton variant="primary" [loading]="saving">Save</button>
<input blocInput type="text" placeholder="Email" />
```

### 2. Add theming (optional)

```bash
npm install @bloc-ui/theme
```

```scss
// styles.scss
@use '@bloc-ui/theme/styles/bloc-theme';
```

This gives you light/dark mode (auto-follows OS), brand colour tokens, and consistent spacing/typography across all components.

### 3. Tailwind CSS users

Register bloc-ui cascade layers before importing Tailwind so utilities always win:

```css
@layer theme, base, bloc-spinner, bloc-input, bloc-input-group, bloc-input-error, components, utilities;
@import 'tailwindcss';
```

Add one entry per bloc-ui directive you use (`bloc-input`, `bloc-spinner`, etc.).

---

## Workspace Structure

```
bloc-ui-workspace/
├── projects/
│   ├── bloc-ui/                # @bloc-ui/kit         — umbrella package
│   ├── bloc-ui-core/           # @bloc-ui/core        — component library
│   │   ├── button/
│   │   ├── checkbox/
│   │   ├── input/
│   │   ├── radio/
│   │   ├── spinner/
│   │   ├── toggle/
│   │   ├── badge/              [EXPERIMENTAL]
│   │   ├── progress/           [EXPERIMENTAL]
│   │   ├── skeleton/           [EXPERIMENTAL]
│   │   └── textarea/           [EXPERIMENTAL]
│   ├── bloc-ui-theme/          # @bloc-ui/theme       — optional theme layer
│   ├── bloc-ui-modal/          # @bloc-ui/modal       — modal dialog service
│   ├── bloc-ui-table/          # @bloc-ui/table       — data table
│   ├── bloc-ui-toast/          # @bloc-ui/toast       — toast notifications
│   ├── bloc-ui-date-picker/    # @bloc-ui/date-picker — calendar date picker
│   ├── bloc-ui-tab/            # @bloc-ui/tab         — tab group
│   ├── bloc-ui-accordion/      # @bloc-ui/accordion   — accordion [EXPERIMENTAL]
│   ├── bloc-ui-alert/          # @bloc-ui/alert       — alert banners
│   ├── bloc-ui-autocomplete/   # @bloc-ui/autocomplete — autocomplete [EXPERIMENTAL]
│   ├── bloc-ui-layout/         # @bloc-ui/layout      — sidebar layout [EXPERIMENTAL]
│   ├── bloc-ui-pagination/     # @bloc-ui/pagination  — pagination [EXPERIMENTAL]
│   ├── bloc-ui-select/         # @bloc-ui/select      — select dropdown [EXPERIMENTAL]
│   ├── bloc-ui-slider/         # @bloc-ui/slider      — range slider [EXPERIMENTAL]
│   ├── bloc-ui-tooltip/        # @bloc-ui/tooltip        — tooltip
│   ├── bloc-ui-virtual-scroll/ # @bloc-ui/virtual-scroll — virtual scrolling
│   └── demo/                   # Demo app (ng serve)
```

## Development

**Prerequisites:** Node 24, npm

```bash
# Install dependencies
npm install

# Start the demo app
ng serve

# Build all libraries
npm run build

# Build individual libraries
ng build bloc-ui-core
ng build bloc-ui-theme
ng build bloc-ui-modal
ng build bloc-ui-table
ng build bloc-ui-toast
ng build bloc-ui-date-picker
ng build bloc-ui-tab

# Run tests
ng test
```

The demo app runs at `http://localhost:4200/` and showcases all components.

---

## Design Principles

- **Barebone by default** — components ship with minimal structural styles and neutral grey fallbacks.
- **Zero hard-coded colours** — all colour in component styles goes through `var()` CSS custom properties.
- **Cascade-friendly** — barebone styles use `:where()` (zero specificity) and `@layer` so consumer classes, Tailwind utilities, and theme tokens always win.
- **Accessible** — ARIA roles, keyboard navigation, and focus management built in.
- **Tree-shakeable** — each component is a secondary entry point (`@bloc-ui/core/button`, etc.) or a standalone package.
- **Forms-ready** — checkbox, toggle, radio, and date picker implement `ControlValueAccessor` for seamless Angular forms integration.

---

If this saves you time, consider supporting 🙌 — [☕ Ko-fi](https://ko-fi.com/blocverse) · [⭐ Star on GitHub](https://github.com/debasish1996/BLOC-UI)

## License

MIT
