# Bloc UI

Lightweight, accessible Angular component library — barebone structure and behaviour with zero design opinions. Bring your own styles or use the optional theme package.

[![npm @bloc-ui/core](https://img.shields.io/npm/v/@bloc-ui/core?label=%40bloc-ui%2Fcore)](https://www.npmjs.com/package/@bloc-ui/core)
[![npm @bloc-ui/theme](https://img.shields.io/npm/v/@bloc-ui/theme?label=%40bloc-ui%2Ftheme)](https://www.npmjs.com/package/@bloc-ui/theme)
[![npm @bloc-ui/modal](https://img.shields.io/npm/v/@bloc-ui/modal?label=%40bloc-ui%2Fmodal)](https://www.npmjs.com/package/@bloc-ui/modal)
[![npm @bloc-ui/table](https://img.shields.io/npm/v/@bloc-ui/table?label=%40bloc-ui%2Ftable)](https://www.npmjs.com/package/@bloc-ui/table)
[![npm @bloc-ui/toast](https://img.shields.io/npm/v/@bloc-ui/toast?label=%40bloc-ui%2Ftoast)](https://www.npmjs.com/package/@bloc-ui/toast)
[![npm @bloc-ui/date-picker](https://img.shields.io/npm/v/@bloc-ui/date-picker?label=%40bloc-ui%2Fdate-picker)](https://www.npmjs.com/package/@bloc-ui/date-picker)
[![npm @bloc-ui/tab](https://img.shields.io/npm/v/@bloc-ui/tab?label=%40bloc-ui%2Ftab)](https://www.npmjs.com/package/@bloc-ui/tab)
[![npm @bloc-ui/kit](https://img.shields.io/npm/v/@bloc-ui/kit?label=%40bloc-ui%2Fkit)](https://www.npmjs.com/package/@bloc-ui/kit)

**[Live Documentation & Demos](https://debasish1996.github.io/BLOC-UI/)**

---

## Packages

| Package                                                                      | Description                                                            | Version |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit)                 | All-in-one umbrella — re-exports every package below                   | `0.0.1` |
| [`@bloc-ui/core`](https://www.npmjs.com/package/@bloc-ui/core)               | Component library — button, checkbox, input, radio, spinner, toggle    | `0.0.9` |
| [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme)             | Optional theme layer — CSS custom properties, colour tokens, dark mode | `0.0.4` |
| [`@bloc-ui/modal`](https://www.npmjs.com/package/@bloc-ui/modal)             | Service-driven modal dialogs with typed data & results                 | `0.0.1` |
| [`@bloc-ui/table`](https://www.npmjs.com/package/@bloc-ui/table)             | Declarative data table with custom cell templates                      | `0.0.1` |
| [`@bloc-ui/toast`](https://www.npmjs.com/package/@bloc-ui/toast)             | Toast notification service with severity helpers                       | `0.0.1` |
| [`@bloc-ui/date-picker`](https://www.npmjs.com/package/@bloc-ui/date-picker) | Calendar date picker with forms integration                            | `0.0.1` |
| [`@bloc-ui/tab`](https://www.npmjs.com/package/@bloc-ui/tab)                 | Tab group with animated indicator and disabled tabs                    | `0.0.1` |

## Components

| Component       | Package                | Selector / API                    | Description                                                  |
| --------------- | ---------------------- | --------------------------------- | ------------------------------------------------------------ |
| **Button**      | `@bloc-ui/core`        | `button[blocButton]`              | Primary / secondary / outline variants with loading state    |
| **Checkbox**    | `@bloc-ui/core`        | `bloc-checkbox`                   | Checkbox with forms integration and label positioning        |
| **Input**       | `@bloc-ui/core`        | `input[blocInput]`                | Input directive with error detection, groups, prefix/suffix  |
| **Radio**       | `@bloc-ui/core`        | `bloc-radio-group` / `bloc-radio` | Radio group with roving keyboard navigation                  |
| **Spinner**     | `@bloc-ui/core`        | `bloc-spinner` / `[blocSpinner]`  | Inline loading spinner with preset sizes                     |
| **Toggle**      | `@bloc-ui/core`        | `bloc-toggle`                     | Switch toggle with forms integration                         |
| **Modal**       | `@bloc-ui/modal`       | `BlocModalService.open()`         | Programmatic modals with typed data injection                |
| **Table**       | `@bloc-ui/table`       | `bloc-table` / `bloc-column`      | Declarative data table with striped, bordered, hover options |
| **Toast**       | `@bloc-ui/toast`       | `BlocToastService`                | Toast notifications with info, success, warning, error types |
| **Date Picker** | `@bloc-ui/date-picker` | `bloc-date-picker`                | Calendar dropdown with min/max date support                  |
| **Tab**         | `@bloc-ui/tab`         | `bloc-tab-group` / `bloc-tab`     | Tab group with animated active indicator                     |

All components are `standalone: true` with companion NgModule wrappers.

---

## Quick Start

### Option A — All-in-one

```bash
npm install @bloc-ui/kit
```

```ts
import { BlocButtonComponent } from '@bloc-ui/kit';
import { BlocModalService } from '@bloc-ui/kit';
```

### Option B — Individual packages (smaller bundles)

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

### Add theming (optional)

```bash
npm install @bloc-ui/theme
```

```scss
// styles.scss
@use '@bloc-ui/theme/styles/bloc-theme';
```

This gives you light/dark mode (auto-follows OS), brand colour tokens, and consistent spacing/typography across all components.

### Tailwind CSS users

Register bloc-ui cascade layers before importing Tailwind so utilities always win:

```css
@layer theme, base, bloc-spinner, bloc-input, components, utilities;
@import 'tailwindcss';
```

Add one entry per bloc-ui directive you use (`bloc-input`, `bloc-spinner`, etc.).

---

## Workspace Structure

```
bloc-ui-workspace/
├── projects/
│   ├── bloc-ui/                # @bloc-ui/kit  — umbrella package
│   ├── bloc-ui-core/           # @bloc-ui/core — component library
│   │   ├── button/
│   │   ├── checkbox/
│   │   ├── input/
│   │   ├── radio/
│   │   ├── spinner/
│   │   └── toggle/
│   ├── bloc-ui-theme/          # @bloc-ui/theme       — optional theme layer
│   ├── bloc-ui-modal/          # @bloc-ui/modal       — modal dialog service
│   ├── bloc-ui-table/          # @bloc-ui/table       — data table
│   ├── bloc-ui-toast/          # @bloc-ui/toast       — toast notifications
│   ├── bloc-ui-date-picker/    # @bloc-ui/date-picker — calendar date picker
│   ├── bloc-ui-tab/            # @bloc-ui/tab         — tab group
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
npm run build:bloc-ui

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

## License

MIT
