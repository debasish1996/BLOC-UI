# @bloc-ui/select

> **Latest:** v1.0.4

> ⚠️ **Experimental** — API may change before reaching stable status.

Single-select dropdown for Angular forms with overlay positioning, keyboard navigation,
optional search filtering, projected custom option markup, and disabled/loading states.

**[Live Documentation & Demos](https://ui.bloc-verse.com/select)**

---

## Installation

```bash
npm install @bloc-ui/select
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Selectors

| Export                | Selector        | Type      | Description                             |
| --------------------- | --------------- | --------- | --------------------------------------- |
| `BlocSelectComponent` | `bloc-select`   | Component | The select trigger and dropdown panel   |
| `BlocOptionDirective` | `[bloc-option]` | Directive | Marks an element as a selectable option |

---

## Usage

### Basic

```ts
import { BlocSelectComponent, BlocOptionDirective } from '@bloc-ui/select';
```

```html
<bloc-select placeholder="Select fruit">
    <div bloc-option value="apple">Apple</div>
    <div bloc-option value="banana">Banana</div>
    <div bloc-option value="orange">Orange</div>
</bloc-select>
```

### With Angular reactive forms

```ts
readonly fruitControl = new FormControl<string | null>(null);
```

```html
<bloc-select [formControl]="fruitControl" placeholder="Pick one">
    <div bloc-option value="apple">Apple</div>
    <div bloc-option value="banana">Banana</div>
    <div bloc-option value="orange">Orange</div>
</bloc-select>
```

### Searchable and clearable

```html
<bloc-select
    [formControl]="fruitControl"
    [searchable]="true"
    [clearable]="true"
    placeholder="Search fruit"
>
    <div bloc-option value="apple">Apple</div>
    <div bloc-option value="banana">Banana</div>
    <div bloc-option value="orange">Orange</div>
</bloc-select>
```

### Custom option markup

```html
<bloc-select [formControl]="fruitControl" [searchable]="true" placeholder="Choose fruit">
    <div bloc-option value="apple">
        <div class="flex items-center justify-between gap-3 w-full">
            <span class="font-medium">Apple</span>
            <span class="text-xs">Crisp and classic</span>
        </div>
    </div>
    <div bloc-option value="banana">
        <div class="flex items-center justify-between gap-3 w-full">
            <span class="font-medium">Banana</span>
            <span class="text-xs">Soft and sweet</span>
        </div>
    </div>
</bloc-select>
```

### In a FormGroup

```html
<form [formGroup]="profileForm">
    <bloc-select formControlName="fruit" placeholder="Favorite fruit">
        <div bloc-option value="apple">Apple</div>
        <div bloc-option value="banana">Banana</div>
    </bloc-select>
</form>
```

---

## Inputs — `BlocSelectComponent`

| Input         | Type      | Default | Description                                      |
| ------------- | --------- | ------- | ------------------------------------------------ |
| `placeholder` | `string`  | `''`    | Placeholder text shown when no value is selected |
| `searchable`  | `boolean` | `false` | Enables a search/filter input inside the panel   |
| `clearable`   | `boolean` | `false` | Renders a clear (×) button to reset the value    |
| `disabled`    | `boolean` | `false` | Disables the control                             |
| `loading`     | `boolean` | `false` | Shows a loading indicator in the trigger         |

## Inputs — `BlocOptionDirective`

| Input      | Type      | Default | Description                                    |
| ---------- | --------- | ------- | ---------------------------------------------- |
| `value`    | `unknown` | —       | The value emitted when this option is selected |
| `disabled` | `boolean` | `false` | Prevents this option from being selected       |

---

## CSS Tokens

| Token                           | Fallback           | Description                       |
| ------------------------------- | ------------------ | --------------------------------- |
| `--bloc-select-border-hover`    | `#9ca3af`          | Border colour on trigger hover    |
| `--bloc-select-option-selected` | `rgba(0,0,0,0.08)` | Background of the selected option |
| `--bloc-select-option-hover`    | `rgba(0,0,0,0.04)` | Background of a hovered option    |

Customise via inline style or a parent class:

```html
<bloc-select
    style="
    --bloc-select-border-hover: #10b981;
    --bloc-select-option-selected: rgba(16, 185, 129, 0.12);
    --bloc-select-option-hover: rgba(16, 185, 129, 0.06);
  "
    [formControl]="fruitControl"
    placeholder="Green themed"
>
    <div bloc-option value="apple">Apple</div>
    <div bloc-option value="banana">Banana</div>
</bloc-select>
```
