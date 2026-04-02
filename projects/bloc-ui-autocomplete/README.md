# @bloc-ui/autocomplete

> ⚠️ **Experimental** — API may change before reaching stable status.

Searchable single-select autocomplete for Angular forms. Renders a text input that filters a provided option list, supports keyboard navigation, disabled options, reactive forms integration, and a clearable mode.

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

| Input         | Type                          | Default | Description                                     |
| ------------- | ----------------------------- | ------- | ----------------------------------------------- |
| `options`     | `BlocAutocompleteOption<T>[]` | `[]`    | List of options to display and filter           |
| `placeholder` | `string`                      | `''`    | Placeholder text in the search input            |
| `clearable`   | `boolean`                     | `false` | Shows a clear (×) button to reset the selection |
| `disabled`    | `boolean`                     | `false` | Disables the control                            |

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
