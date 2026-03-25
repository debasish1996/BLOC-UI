# @bloc-ui/date-picker

> **Latest:** v0.0.1

Date picker component with calendar dropdown for Angular — part of the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library.

---

## Installation

```bash
npm install @bloc-ui/date-picker
```

**Peer dependencies:** `@angular/common`, `@angular/core`, and `@angular/forms` ≥ 21.

---

## Usage

```ts
import { BlocDatePickerComponent, BlocDatePickerModule } from '@bloc-ui/date-picker';
```

### Basic

```html
<bloc-date-picker /> <bloc-date-picker placeholder="Pick a date" />
```

### With ngModel

```html
<bloc-date-picker [(ngModel)]="selectedDate" />
```

### With Reactive Forms

```html
<bloc-date-picker [formControl]="dateCtrl" />
```

### Sizes

```html
<bloc-date-picker size="sm" /> <bloc-date-picker size="lg" />
```

### Min / Max

```html
<bloc-date-picker [minDate]="minDate" [maxDate]="maxDate" />
```

---

## `BlocDatePickerComponent` inputs

| Input         | Type                   | Default         | Description             |
| ------------- | ---------------------- | --------------- | ----------------------- |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`          | Density preset          |
| `placeholder` | `string`               | `'Select date'` | Input placeholder text  |
| `format`      | `string`               | `'yyyy-MM-dd'`  | Display format          |
| `disabled`    | `boolean`              | `false`         | Disable the picker      |
| `minDate`     | `Date \| null`         | `null`          | Minimum selectable date |
| `maxDate`     | `Date \| null`         | `null`          | Maximum selectable date |

---

## CSS tokens

| Token                                | Fallback                       | Description              |
| ------------------------------------ | ------------------------------ | ------------------------ |
| `--bloc-date-picker-padding`         | `8px 36px 8px 12px`            | Input padding            |
| `--bloc-date-picker-font-size`       | `0.875rem`                     | Input font size          |
| `--bloc-date-picker-radius`          | `6px`                          | Input border radius      |
| `--bloc-date-picker-color`           | `#374151`                      | Input text colour        |
| `--bloc-date-picker-bg`              | `#ffffff`                      | Input background         |
| `--bloc-date-picker-border`          | `var(--bloc-border, #d1d5db)`  | Input border colour      |
| `--bloc-date-picker-focus-border`    | `var(--bloc-primary, #6b7280)` | Focus border colour      |
| `--bloc-date-picker-focus-ring`      | `rgba(107,114,128,0.2)`        | Focus ring colour        |
| `--bloc-date-picker-placeholder`     | `#9ca3af`                      | Placeholder colour       |
| `--bloc-date-picker-icon-color`      | `#9ca3af`                      | Calendar icon colour     |
| `--bloc-date-picker-z-index`         | `100`                          | Dropdown z-index         |
| `--bloc-date-picker-dropdown-bg`     | `#ffffff`                      | Dropdown background      |
| `--bloc-date-picker-dropdown-border` | `var(--bloc-border, #d1d5db)`  | Dropdown border          |
| `--bloc-date-picker-dropdown-shadow` | `0 4px 16px rgba(0,0,0,0.1)`   | Dropdown shadow          |
| `--bloc-date-picker-day-color`       | `#374151`                      | Day text colour          |
| `--bloc-date-picker-day-hover-bg`    | `#f3f4f6`                      | Day hover background     |
| `--bloc-date-picker-today-border`    | `var(--bloc-primary, #6b7280)` | Today border colour      |
| `--bloc-date-picker-selected-bg`     | `var(--bloc-primary, #6b7280)` | Selected day background  |
| `--bloc-date-picker-selected-color`  | `#ffffff`                      | Selected day text colour |

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-surface`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. The date picker works without it — neutral fallbacks are applied automatically.

---

## License

MIT
