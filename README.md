# Bloc UI

Lightweight, accessible Angular component library. Barebone structure and behaviour with zero design opinions. 
You can easily add your own styles or use the optional theme package.


[![CI](https://github.com/debasish1996/BLOC-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/debasish1996/BLOC-UI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![npm @bloc-ui/kit](https://img.shields.io/npm/v/@bloc-ui/kit?label=%40bloc-ui%2Fkit)](https://www.npmjs.com/package/@bloc-ui/kit)
[![npm @bloc-ui/core](https://img.shields.io/npm/v/@bloc-ui/core?label=%40bloc-ui%2Fcore)](https://www.npmjs.com/package/@bloc-ui/core)


If this saves you time, consider supporting [⭐ Star on GitHub](https://github.com/debasish1996/BLOC-UI)

> [!WARNING]
> ⚠️ This is a work in progress. The API may change in breaking ways. 🙂

> [!NOTE] **This is a solo-maintained project.**
> That said, it can be a great **research direction** or a learning resource for **emerging developers**. Contributions are welcome — feel free to open issues or PRs!

**[Live Documentation & Demos](https://ui.bloc-verse.com/)** · **[Open in StackBlitz](https://stackblitz.com/github/debasish1996/BLOC-UI)** (StackBlitz is broken atm, but will fix it soon.)

---

### Stable components
These components have full README, demo route, unit tests, and documentation. </br>
All components are `standalone: true` along with an NgModule wrappers.

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
| **Autocomplete**   | `@bloc-ui/autocomplete`   | `@bloc-ui/autocomplete`   | `bloc-autocomplete`                       | Searchable single-select with async-friendly option list             |
| **Virtual Scroll** | `@bloc-ui/virtual-scroll` | `@bloc-ui/virtual-scroll` | `bloc-virtual-scroll` / `blocVirtualItem` | Lightweight virtual scrolling for large lists and tables             |
| **Badge**          | `@bloc-ui/core`           | `@bloc-ui/core/badge`     | `bloc-badge`                              | Labelling pill with variant and size presets                         |
| **Progress**       | `@bloc-ui/core`           | `@bloc-ui/core/progress`  | `bloc-progress`                           | Horizontal progress bar with label and value display                 |
| **Skeleton**       | `@bloc-ui/core`           | `@bloc-ui/core/skeleton`  | `bloc-skeleton` / `[blocSkeleton]`        | Loading placeholder directive with line, rect, and circle shapes     |
| **Textarea**       | `@bloc-ui/core`           | `@bloc-ui/core/textarea`  | `textarea[blocTextarea]`                  | Textarea directive with error state and forms integration            |
| **Accordion**      | `@bloc-ui/accordion`      | `@bloc-ui/accordion`      | `bloc-accordion` / `[blocAccordionItem]`  | Collapsible panels with single/multi mode and keyboard navigation    |
| **Pagination**     | `@bloc-ui/pagination`     | `@bloc-ui/pagination`     | `bloc-pagination`                         | Page navigation with sibling/boundary config                         |
| **Select**         | `@bloc-ui/select`         | `@bloc-ui/select`         | `bloc-select` / `[bloc-option]`           | Single-select dropdown with overlay, keyboard nav, and search        |
| **Slider**         | `@bloc-ui/slider`         | `@bloc-ui/slider`         | `bloc-slider`                             | Range slider with Angular forms integration                          |
| **Text Highlight** | `@bloc-ui/text-highlight` | `@bloc-ui/text-highlight` | `[blocTextHighlight]`                     | Highlights matching substrings inside rendered text                  |

### Experimental components
It may be functional, but may not be stable, can break easily.

| Component                | Package                 | Entry Point             | Selector / API                                                  | Description                                                    |
| ------------------------ | ----------------------- | ----------------------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| **Layout** `[EXP]`       | `@bloc-ui/layout`       | `@bloc-ui/layout`       | `bloc-sidebar-layout` / `bloc-sidebar` / `bloc-sidebar-content` | Sidebar layout with collapsible panel                          |
| **Video Player** `[EXP]` | `@bloc-ui/video-player` | `@bloc-ui/video-player` | `bloc-video-player`                                             | Lightweight HTML5 video player with native controls and events |





---

## Quick Start

Full guide: **[Getting Started](https://ui.bloc-verse.com/getting-started)**

### 1. Choose installation strategy

#### Option A - All-in-one

```bash
npm install @bloc-ui/kit
```

```ts
import { BlocButtonComponent } from '@bloc-ui/kit';
import { BlocModalService } from '@bloc-ui/kit';
```

#### Option B - Individual packages (smaller bundles)

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

## Development

**Prerequisites:** Node 24, npm

```bash
# Install dependencies
npm install

# Start the demo app
ng serve

# Build all libraries
npm run build
# or
bash build.sh

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
# or
bash test.sh
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
