# @bloc-ui/autocomplete

> **Latest:** v1.0.2

> ⚠️ **Experimental** — API may change before reaching stable status.

Searchable single-select autocomplete for Angular forms. Renders a text input that filters a provided option list, supports keyboard navigation, disabled options, reactive forms integration, and a clearable mode.

**[Live Documentation & Demos](https://ui.bloc-verse.com/autocomplete)**

---

## Installation

```bash
npm install @bloc-ui/autocomplete
```

**Peer dependencies:** `@angular/common`, `@angular/core`, and `@angular/forms` ≥ 21.

---

## Selectors / API

| Export                      | Selector            | Type      | Description                                 |
| --------------------------- | ------------------- | --------- | ------------------------------------------- |
| `BlocAutocompleteComponent` | `bloc-autocomplete` | Component | Searchable select with floating option list |

---

## Usage

### Basic

```ts
import { BlocAutocompleteComponent, BlocAutocompleteOption } from '@bloc-ui/autocomplete';

readonly teamOptions: readonly BlocAutocompleteOption<string>[] = [
  { label: 'Design',      value: 'design'      },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Growth',      value: 'growth'      },
];
```

```html
<bloc-autocomplete
    [options]="teamOptions"
    [clearable]="true"
    placeholder="Search teams"
    (selectionChange)="selectedTeam = $event"
></bloc-autocomplete>
```

### With Angular reactive forms

```ts
import { FormControl } from '@angular/forms';

readonly teamControl = new FormControl<string | null>('design');
```

```html
<bloc-autocomplete
    [options]="teamOptions"
    [formControl]="teamControl"
    placeholder="Assign owner"
></bloc-autocomplete>
```

### Options with descriptions and disabled state

```ts
readonly teamOptions: readonly BlocAutocompleteOption<string>[] = [
  { label: 'Design',      value: 'design',      description: 'Brand, motion, and UI systems' },
  { label: 'Engineering', value: 'engineering', description: 'Frontend and platform' },
  { label: 'Operations',  value: 'ops',         description: 'Disabled for this flow', disabled: true },
];
```

---

## Inputs — `BlocAutocompleteComponent`

| Input         | Type                          | Default                | Description                                     |
| ------------- | ----------------------------- | ---------------------- | ----------------------------------------------- |
| `options`     | `BlocAutocompleteOption<T>[]` | `[]`                   | List of options to display and filter           |
| `placeholder` | `string`                      | `'Search options'`     | Placeholder text in the search input            |
| `clearable`   | `boolean`                     | `false`                | Shows a clear (×) button to reset the selection |
| `disabled`    | `boolean`                     | `false`                | Disables the control                            |
| `loading`     | `boolean`                     | `false`                | Replaces the option list with `loadingText`     |
| `loadingText` | `string`                      | `'Loading options...'` | Message shown while `loading` is true           |
| `emptyText`   | `string`                      | `'No results found'`   | Message shown when the filtered list is empty   |

## Outputs

| Output            | Type        | Description                                          |
| ----------------- | ----------- | ---------------------------------------------------- |
| `selectionChange` | `T \| null` | Emits the selected option value (or `null` on clear) |

## `BlocAutocompleteOption<T>`

```ts
interface BlocAutocompleteOption<T> {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
}
```

---

## CSS Custom Properties

All visual properties are token-driven. Override any token on the `bloc-autocomplete` element.

| Token                                 | Default                        | Description                                     |
| ------------------------------------- | ------------------------------ | ----------------------------------------------- |
| `--bloc-autocomplete-bg`              | `var(--bloc-surface, #ffffff)` | Input and panel background                      |
| `--bloc-autocomplete-border`          | `var(--bloc-border, #d1d5db)`  | Default border colour                           |
| `--bloc-autocomplete-border-focus`    | `var(--bloc-primary, #6b7280)` | Border colour when input is focused             |
| `--bloc-autocomplete-color`           | `var(--bloc-text, #374151)`    | Text colour                                     |
| `--bloc-autocomplete-muted`           | `var(--bloc-muted, #9ca3af)`   | Muted text (descriptions, empty state, clear ×) |
| `--bloc-autocomplete-radius`          | `4px`                          | Border radius for input, panel, and options     |
| `--bloc-autocomplete-panel-radius`    | inherits `radius`              | Override panel border radius independently      |
| `--bloc-autocomplete-panel-shadow`    | `0 4px 16px rgba(0,0,0,0.08)`  | Drop shadow on the floating panel               |
| `--bloc-autocomplete-option-hover`    | `rgba(0, 0, 0, 0.04)`          | Option background on hover                      |
| `--bloc-autocomplete-option-active`   | `rgba(0, 0, 0, 0.06)`          | Option background when keyboard-active          |
| `--bloc-autocomplete-option-selected` | `rgba(0, 0, 0, 0.08)`          | Option background when selected                 |
