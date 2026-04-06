# @bloc-ui/core

> **Latest:** v1.0.0

Lightweight, accessible Angular component library. Barebone structure and behaviour — no hard-coded colours, no design opinions. Pair with [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) to add a visual layer, or bring your own styles via CSS custom properties.

**[Live Documentation & Demos](https://bloc-verse.com/)**

> **Tip:** Need modal, table, toast, date-picker, or tab components too? Install [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit) for a single all-in-one import, or install each standalone package individually.

---

## Installation

```bash
npm install @bloc-ui/core
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

Each component ships as a **secondary entry point** for optimal tree-shaking:

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocSpinnerDirective } from '@bloc-ui/core/spinner';
```

You can also import everything from the primary entry point (`@bloc-ui/core`) for convenience.

---

## Components & Directives

| Export                    | Selector                               | Entry Point              | Type      |
| ------------------------- | -------------------------------------- | ------------------------ | --------- |
| `BlocButtonComponent`     | `button[blocButton]`                   | `@bloc-ui/core/button`   | Component |
| `BlocCheckboxComponent`   | `bloc-checkbox`                        | `@bloc-ui/core/checkbox` | Component |
| `BlocInputDirective`      | `input[blocInput]`                     | `@bloc-ui/core/input`    | Directive |
| `BlocInputGroupDirective` | `bloc-input-group`, `[blocInputGroup]` | `@bloc-ui/core/input`    | Directive |
| `BlocPrefixDirective`     | `bloc-prefix`, `[blocPrefix]`          | `@bloc-ui/core/input`    | Directive |
| `BlocSuffixDirective`     | `bloc-suffix`, `[blocSuffix]`          | `@bloc-ui/core/input`    | Directive |
| `BlocInputErrorDirective` | `[blocInputError]`, `bloc-input-error` | `@bloc-ui/core/input`    | Directive |
| `BlocRadioGroupComponent` | `bloc-radio-group`                     | `@bloc-ui/core/radio`    | Component |
| `BlocRadioComponent`      | `bloc-radio`                           | `@bloc-ui/core/radio`    | Component |
| `BlocSpinnerDirective`    | `bloc-spinner`, `[blocSpinner]`        | `@bloc-ui/core/spinner`  | Directive |
| `BlocToggleComponent`     | `bloc-toggle`                          | `@bloc-ui/core/toggle`   | Component |
| `BlocBadgeComponent`      | `bloc-badge`                           | `@bloc-ui/core/badge`    | Component |
| `BlocProgressComponent`   | `bloc-progress`                        | `@bloc-ui/core/progress` | Component |
| `BlocSkeletonDirective`   | `bloc-skeleton`, `[blocSkeleton]`      | `@bloc-ui/core/skeleton` | Directive |
| `BlocTextareaDirective`   | `textarea[blocTextarea]`               | `@bloc-ui/core/textarea` | Directive |

NgModule wrappers (`BlocButtonModule`, `BlocCheckboxModule`, `BlocInputModule`, `BlocRadioModule`, `BlocSpinnerModule`, `BlocToggleModule`, `BlocBadgeModule`, `BlocProgressModule`, `BlocSkeletonModule`, `BlocTextareaModule`) are also exported for NgModule-based applications.

Import each component from its secondary entry point:

```ts
import { BlocBadgeComponent } from '@bloc-ui/core/badge';
import { BlocProgressComponent } from '@bloc-ui/core/progress';
import { BlocSkeletonDirective } from '@bloc-ui/core/skeleton';
import { BlocTextareaDirective } from '@bloc-ui/core/textarea';
```

---

## Usage

All components are `standalone: true`. Import them directly or via their companion Module.

### Button

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
```

```html
<button blocButton>Default</button>
<button blocButton variant="secondary">Secondary</button>
<button blocButton variant="outline">Outline</button>
<button blocButton [loading]="isSaving">Save</button>
<button blocButton [disabled]="true">Disabled</button>
```

#### Inputs

| Input      | Type                                    | Default     | Description                                      |
| ---------- | --------------------------------------- | ----------- | ------------------------------------------------ |
| `variant`  | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual variant                                   |
| `disabled` | `boolean`                               | `false`     | Disables the button                              |
| `loading`  | `boolean`                               | `false`     | Shows an inline spinner and prevents interaction |

#### Outputs

| Output    | Type         | Description                                       |
| --------- | ------------ | ------------------------------------------------- |
| `clicked` | `MouseEvent` | Emits on click (skipped when disabled or loading) |

#### CSS tokens

| Token              | Fallback  | Description                         |
| ------------------ | --------- | ----------------------------------- |
| `--bloc-primary`   | `#3b82f6` | Primary background / outline colour |
| `--bloc-secondary` | `#64748b` | Secondary background colour         |

---

### Checkbox

```ts
import { BlocCheckboxComponent } from '@bloc-ui/core/checkbox';
```

```html
<bloc-checkbox [(ngModel)]="agreed">I agree to the terms</bloc-checkbox>
<bloc-checkbox [formControl]="acceptCtrl" size="lg">Accept</bloc-checkbox>
<bloc-checkbox [disabled]="true">Disabled</bloc-checkbox>
<bloc-checkbox labelPosition="before">Label before</bloc-checkbox>
```

Implements `ControlValueAccessor` — works with both template-driven and reactive forms.

#### Inputs

| Input           | Type                   | Default   | Description                     |
| --------------- | ---------------------- | --------- | ------------------------------- |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`    | Checkbox size                   |
| `labelPosition` | `'before' \| 'after'`  | `'after'` | Label placement relative to box |
| `disabled`      | `boolean`              | `false`   | Disables the checkbox           |

#### CSS tokens

| Token                            | Fallback                       | Description           |
| -------------------------------- | ------------------------------ | --------------------- |
| `--bloc-checkbox-border`         | `#aaafb7`                      | Default border colour |
| `--bloc-checkbox-bg`             | `#ffffff`                      | Default background    |
| `--bloc-checkbox-checked-border` | `var(--bloc-primary, #6b7280)` | Checked border colour |
| `--bloc-checkbox-checked-bg`     | `var(--bloc-primary, #6b7280)` | Checked background    |
| `--bloc-checkbox-check-color`    | `#ffffff`                      | Checkmark colour      |
| `--bloc-checkbox-focus-ring`     | `var(--bloc-primary, #6b7280)` | Focus ring colour     |

Keyboard: <kbd>Space</kbd> to toggle. ARIA: `role="checkbox"`, `aria-checked`, `aria-disabled`.

---

### Input

```ts
import {
    BlocInputDirective,
    BlocInputGroupDirective,
    BlocPrefixDirective,
    BlocSuffixDirective,
    BlocInputErrorDirective,
} from '@bloc-ui/core/input';
```

**Standalone input:**

```html
<input blocInput type="text" placeholder="Email" />
```

**With Angular reactive forms — validation error shown on touch:**

```html
<input blocInput [formControl]="emailCtrl" type="email" />
```

**Input group with prefix / suffix:**

```html
<bloc-input-group>
    <span blocPrefix>@</span>
    <input blocInput type="text" placeholder="username" />
    <span blocSuffix>.com</span>
</bloc-input-group>
```

**With error message:**

```html
<input blocInput [formControl]="emailCtrl" type="email" />
<span blocInputError>Please enter a valid email.</span>
```

#### `BlocInputDirective` inputs

| Input          | Type             | Default | Description                                                                                        |
| -------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `error`        | `boolean`        | `false` | Forces error styling. Also applied automatically when a bound `FormControl` is invalid and touched |
| `autocomplete` | `string \| null` | `null`  | Sets `autocomplete` attribute. Pass `"off"` to disable browser suggestions                         |

#### CSS tokens

| Token                                  | Fallback                       | Description                 |
| -------------------------------------- | ------------------------------ | --------------------------- |
| `--bloc-input-border`                  | `var(--bloc-border, #cbd5e1)`  | Default border colour       |
| `--bloc-input-focus-border`            | `var(--bloc-primary, #6b7280)` | Focus border colour         |
| `--bloc-input-error-border`            | `var(--bloc-error, #f87171)`   | Error border colour         |
| `--bloc-input-bg`                      | `#ffffff`                      | Input background            |
| `--bloc-input-color`                   | `#374151`                      | Input text colour           |
| `--bloc-input-radius`                  | `4px`                          | Border radius               |
| `--bloc-input-padding`                 | `8px 12px`                     | Inner padding               |
| `--bloc-input-font-size`               | `14px`                         | Font size                   |
| `--bloc-input-group-border`            | `var(--bloc-border, #cbd5e1)`  | Group border colour         |
| `--bloc-input-group-radius`            | `4px`                          | Group border radius         |
| `--bloc-input-group-bg`                | `#ffffff`                      | Group background            |
| `--bloc-input-group-focus-border`      | `var(--bloc-primary, #6b7280)` | Group focus border colour   |
| `--bloc-input-group-adornment-padding` | `0 8px`                        | Prefix / suffix padding     |
| `--bloc-input-group-adornment-color`   | `#9ca3af`                      | Prefix / suffix text colour |
| `--bloc-input-error-color`             | `var(--bloc-error, #f87171)`   | Error message text colour   |
| `--bloc-input-error-font-size`         | `0.75rem`                      | Error message font size     |

---

### Radio

```ts
import { BlocRadioGroupComponent, BlocRadioComponent } from '@bloc-ui/core/radio';
```

```html
<bloc-radio-group [(ngModel)]="colour">
    <bloc-radio value="red">Red</bloc-radio>
    <bloc-radio value="green">Green</bloc-radio>
    <bloc-radio value="blue">Blue</bloc-radio>
</bloc-radio-group>

<bloc-radio-group [formControl]="sizeCtrl" labelPosition="before">
    <bloc-radio value="sm" size="sm">Small</bloc-radio>
    <bloc-radio value="md">Medium</bloc-radio>
    <bloc-radio value="lg" size="lg">Large</bloc-radio>
</bloc-radio-group>
```

`BlocRadioGroupComponent` implements `ControlValueAccessor` — works with both template-driven and reactive forms. Each `<bloc-radio>` must be placed inside a `<bloc-radio-group>`.

#### `bloc-radio-group` inputs

| Input           | Type                  | Default   | Description                              |
| --------------- | --------------------- | --------- | ---------------------------------------- |
| `disabled`      | `boolean`             | `false`   | Disables the entire group                |
| `labelPosition` | `'before' \| 'after'` | `'after'` | Default label placement for all children |

#### `bloc-radio` inputs

| Input           | Type                          | Default | Description                                   |
| --------------- | ----------------------------- | ------- | --------------------------------------------- |
| `value`         | `unknown`                     | —       | **Required.** The value this radio represents |
| `disabled`      | `boolean`                     | `false` | Disables this radio                           |
| `size`          | `'sm' \| 'md' \| 'lg'`        | `'md'`  | Radio button size                             |
| `labelPosition` | `'before' \| 'after' \| null` | `null`  | Label placement (`null` = inherit from group) |

#### CSS tokens

| Token                         | Fallback                       | Description             |
| ----------------------------- | ------------------------------ | ----------------------- |
| `--bloc-radio-border`         | `#aaafb7`                      | Default border colour   |
| `--bloc-radio-bg`             | `#ffffff`                      | Default background      |
| `--bloc-radio-checked-border` | `var(--bloc-primary, #6b7280)` | Checked border colour   |
| `--bloc-radio-dot-color`      | `var(--bloc-primary, #6b7280)` | Dot colour when checked |
| `--bloc-radio-focus-ring`     | `var(--bloc-primary, #6b7280)` | Focus ring colour       |
| `--bloc-radio-group-gap`      | `8px`                          | Spacing between radios  |

Keyboard: <kbd>Space</kbd> to select, <kbd>Arrow keys</kbd> for roving focus (WAI-ARIA radio group pattern). ARIA: `role="radiogroup"` / `role="radio"`, `aria-checked`, `aria-disabled`.

---

### Spinner

```ts
import { BlocSpinnerDirective } from '@bloc-ui/core/spinner';
```

```html
<!-- element form -->
<bloc-spinner />
<bloc-spinner size="lg" />

<!-- attribute form — on any element -->
<span blocSpinner size="sm"></span>

<!-- custom size -->
<bloc-spinner [width]="'40px'" [height]="'40px'" />
```

#### Inputs

| Input    | Type                                           | Default | Description                                           |
| -------- | ---------------------------------------------- | ------- | ----------------------------------------------------- |
| `size`   | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| null` | `'md'`  | Preset size. Pass `null` to size manually             |
| `width`  | `string`                                       | `''`    | Explicit width (e.g. `'40px'`). Overrides size preset |
| `height` | `string`                                       | `''`    | Explicit height. Overrides size preset                |

Preset dimensions: `xs` 12 px · `sm` 16 px · `md` 24 px · `lg` 32 px · `xl` 48 px.

#### CSS tokens

| Token                  | Fallback  | Description                           |
| ---------------------- | --------- | ------------------------------------- |
| `--bloc-spinner-color` | `#6b7280` | Spinner colour (drives arc and track) |

The spinner colour can also be set with a Tailwind text colour class (e.g. `class="text-blue-500"`).

---

### Toggle

```ts
import { BlocToggleComponent } from '@bloc-ui/core/toggle';
```

```html
<bloc-toggle [(ngModel)]="darkMode">Dark mode</bloc-toggle>
<bloc-toggle [formControl]="notificationsCtrl" size="sm">Notifications</bloc-toggle>
<bloc-toggle [disabled]="true">Disabled</bloc-toggle>
<bloc-toggle labelPosition="before" size="lg">Label before</bloc-toggle>
```

Implements `ControlValueAccessor` — works with both template-driven and reactive forms.

#### Inputs

| Input           | Type                   | Default   | Description                       |
| --------------- | ---------------------- | --------- | --------------------------------- |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`    | Toggle size                       |
| `labelPosition` | `'before' \| 'after'`  | `'after'` | Label placement relative to track |
| `disabled`      | `boolean`              | `false`   | Disables the toggle               |

#### CSS tokens

| Token                            | Fallback                       | Description            |
| -------------------------------- | ------------------------------ | ---------------------- |
| `--bloc-toggle-track-bg`         | `#d1d5db`                      | Track background (off) |
| `--bloc-toggle-track-checked-bg` | `var(--bloc-primary, #6b7280)` | Track background (on)  |
| `--bloc-toggle-thumb-bg`         | `#ffffff`                      | Thumb background       |
| `--bloc-toggle-thumb-shadow`     | `rgba(0,0,0,0.2)`              | Thumb shadow           |
| `--bloc-toggle-focus-ring`       | `var(--bloc-primary, #6b7280)` | Focus ring colour      |
| `--bloc-toggle-width`            | `44px` (md)                    | Track width override   |
| `--bloc-toggle-height`           | `24px` (md)                    | Track height override  |

Keyboard: <kbd>Space</kbd> to toggle. ARIA: `role="switch"`, `aria-checked`, `aria-disabled`.

---

## Tailwind CSS integration

If you use Tailwind CSS, declare the `bloc-*` cascade layers **before** `@import "tailwindcss"` so that Tailwind's `utilities` layer always has priority over bloc-ui defaults:

```css
/* tailwind.css */
@layer theme, base, bloc-input, bloc-input-group, bloc-input-error, bloc-spinner, components, utilities;
@import 'tailwindcss';
```

Add one entry per bloc-ui directive you use (`bloc-input`, `bloc-input-group`, `bloc-input-error`, `bloc-spinner`, etc.).

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-error`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. Components work without it — neutral fallbacks are applied automatically.

---

## License

MIT
