# Bloc UI

Lightweight, accessible Angular component library — barebone structure and behaviour with zero design opinions. Bring your own styles or use the optional theme package.

[![npm @bloc-ui/core](https://img.shields.io/npm/v/@bloc-ui/core?label=%40bloc-ui%2Fcore)](https://www.npmjs.com/package/@bloc-ui/core)
[![npm @bloc-ui/theme](https://img.shields.io/npm/v/@bloc-ui/theme?label=%40bloc-ui%2Ftheme)](https://www.npmjs.com/package/@bloc-ui/theme)

---

## Packages

| Package                                                          | Description                                                            | Version |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| [`@bloc-ui/core`](https://www.npmjs.com/package/@bloc-ui/core)   | Component library — structure, behaviour, accessibility                | `0.0.6` |
| [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) | Optional theme layer — CSS custom properties, colour tokens, dark mode | `0.0.2` |

## Components

| Component    | Selector                          | Description                                                         |
| ------------ | --------------------------------- | ------------------------------------------------------------------- |
| **Button**   | `button[blocButton]`              | Primary / secondary / outline variants with loading state           |
| **Checkbox** | `bloc-checkbox`                   | Checkbox with forms integration and label positioning               |
| **Input**    | `input[blocInput]`                | Input directive with error detection, groups, prefix/suffix         |
| **Modal**    | Service-driven                    | Programmatic modals via `BlocModalService` + built-in alert/confirm |
| **Radio**    | `bloc-radio-group` / `bloc-radio` | Radio group with roving keyboard navigation                         |
| **Spinner**  | `bloc-spinner` / `[blocSpinner]`  | Inline loading spinner with preset sizes                            |
| **Toggle**   | `bloc-toggle`                     | Switch toggle with forms integration                                |

All components are `standalone: true` with companion NgModule wrappers.

## Quick Start

```bash
npm install @bloc-ui/core
```

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocInputDirective } from '@bloc-ui/core/input';
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

### Tailwind CSS users

Register bloc-ui cascade layers before importing Tailwind so utilities always win:

```css
@layer theme, base, bloc-input, bloc-spinner, components, utilities;
@import 'tailwindcss';
```

---

## Workspace Structure

```
bloc-ui-workspace/
├── projects/
│   ├── bloc-ui/           # @bloc-ui/core — component library
│   │   ├── button/
│   │   ├── checkbox/
│   │   ├── input/
│   │   ├── modal/
│   │   ├── radio/
│   │   ├── spinner/
│   │   └── toggle/
│   ├── bloc-ui-theme/     # @bloc-ui/theme — optional theme layer
│   └── demo/              # Demo app (ng serve)
```

## Development

**Prerequisites:** Node 24, npm

```bash
# Install dependencies
npm install

# Start the demo app
ng serve

# Build the libraries
ng build bloc-ui
ng build bloc-ui-theme

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
- **Tree-shakeable** — each component is a secondary entry point (`@bloc-ui/core/button`, etc.).

---

## License

MIT
