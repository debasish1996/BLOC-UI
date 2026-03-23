# @bloc-ui/core

Lightweight, accessible Angular component library. Barebone structure and behaviour — no hard-coded colours, no design opinions. Pair with [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) to add a visual layer, or bring your own styles via CSS custom properties.

---

## Installation

```bash
npm install @bloc-ui/core
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Components & Directives

| Export                    | Selector                               | Type      |
| ------------------------- | -------------------------------------- | --------- |
| `BlocButtonComponent`     | `button[blocButton]`                   | Component |
| `BlocInputDirective`      | `input[blocInput]`                     | Directive |
| `BlocInputGroupDirective` | `bloc-input-group`, `[blocInputGroup]` | Directive |
| `BlocPrefixDirective`     | `bloc-prefix`, `[blocPrefix]`          | Directive |
| `BlocSuffixDirective`     | `bloc-suffix`, `[blocSuffix]`          | Directive |
| `BlocInputErrorDirective` | `[blocInputError]`, `bloc-input-error` | Directive |
| `BlocModalComponent`      | `bloc-modal`                           | Component |
| `BlocSpinnerDirective`    | `bloc-spinner`, `[blocSpinner]`        | Directive |

NgModule wrappers (`BlocButtonModule`, `BlocInputModule`, `BlocModalModule`, `BlocSpinnerModule`) are also exported for NgModule-based applications.

---

## Usage

All components are `standalone: true`. Import them directly or via their companion Module.

### Button

```ts
import { BlocButtonComponent } from '@bloc-ui/core';
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

### Spinner

```ts
import { BlocSpinnerDirective } from '@bloc-ui/core';
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

### Input

```ts
import {
  BlocInputDirective,
  BlocInputGroupDirective,
  BlocPrefixDirective,
  BlocSuffixDirective,
  BlocInputErrorDirective,
} from '@bloc-ui/core';
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

| Token                       | Fallback                     | Description               |
| --------------------------- | ---------------------------- | ------------------------- |
| `--bloc-input-border`       | `#cbd5e1`                    | Default border colour     |
| `--bloc-input-focus-border` | `--bloc-primary` → `#6b7280` | Focus border colour       |
| `--bloc-input-error-border` | `--bloc-error` → `#f87171`   | Error border colour       |
| `--bloc-input-bg`           | `#ffffff`                    | Input background          |
| `--bloc-input-color`        | `#374151`                    | Input text colour         |
| `--bloc-input-radius`       | `4px`                        | Border radius             |
| `--bloc-input-padding`      | `8px 12px`                   | Inner padding             |
| `--bloc-input-font-size`    | `14px`                       | Font size                 |
| `--bloc-input-error-color`  | `--bloc-error` → `#f87171`   | Error message text colour |

---

### Modal

```ts
import { BlocModalComponent } from '@bloc-ui/core';
```

```html
<button blocButton (clicked)="isOpen = true">Open modal</button>

<bloc-modal [isOpen]="isOpen" title="Confirm action" size="md" (closed)="isOpen = false">
  <p>Are you sure you want to proceed?</p>

  <div slot="footer">
    <button blocButton variant="outline" (clicked)="isOpen = false">Cancel</button>
    <button blocButton (clicked)="confirm()">Confirm</button>
  </div>
</bloc-modal>
```

#### Inputs

| Input                  | Type                   | Default | Description                       |
| ---------------------- | ---------------------- | ------- | --------------------------------- |
| `isOpen`               | `boolean`              | `false` | Controls visibility               |
| `title`                | `string`               | `''`    | Header title text                 |
| `size`                 | `'sm' \| 'md' \| 'lg'` | `'md'`  | Dialog width variant              |
| `closeOnBackdropClick` | `boolean`              | `true`  | Closes when clicking the backdrop |

#### Outputs

| Output   | Type   | Description                                                               |
| -------- | ------ | ------------------------------------------------------------------------- |
| `closed` | `void` | Emitted when the modal requests to close (close button or backdrop click) |

#### Slots (content projection)

| Slot              | Description                           |
| ----------------- | ------------------------------------- |
| _(default)_       | Main body content                     |
| `[slot="footer"]` | Footer area, typically action buttons |

#### CSS tokens

| Token                   | Fallback                      | Description               |
| ----------------------- | ----------------------------- | ------------------------- |
| `--bloc-modal-backdrop` | `rgba(0,0,0,0.5)`             | Backdrop overlay colour   |
| `--bloc-modal-z-index`  | `1000`                        | Stack order               |
| `--bloc-modal-shadow`   | `0 8px 32px rgba(0,0,0,0.18)` | Dialog shadow             |
| `--bloc-modal-sm`       | `360px`                       | Max-width for `size="sm"` |
| `--bloc-modal-md`       | `560px`                       | Max-width for `size="md"` |
| `--bloc-modal-lg`       | `800px`                       | Max-width for `size="lg"` |
| `--bloc-surface`        | `#fff`                        | Dialog background         |
| `--bloc-border`         | `#e2e8f0`                     | Header border colour      |
| `--bloc-text`           | `inherit`                     | Dialog text colour        |
| `--bloc-radius`         | `8px`                         | Dialog border radius      |

---

## Tailwind CSS integration

If you use Tailwind CSS, declare the `bloc-*` cascade layers **before** `@import "tailwindcss"` so that Tailwind's `utilities` layer always has priority over bloc-ui defaults:

```css
/* tailwind.css */
@layer theme, base, bloc-input, bloc-spinner, components, utilities;
@import 'tailwindcss';
```

Add one entry per bloc-ui directive you use (`bloc-input`, `bloc-spinner`, etc.).

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-error`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. Components work without it — neutral fallbacks are applied automatically.

---

## License

MIT
