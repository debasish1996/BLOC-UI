# @bloc-ui/date-picker

> **Latest:** v0.0.4

Directive-based date picker for Angular — part of the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library. Apply the trigger directive to any element (input, button, etc.) to attach a calendar dropdown. Supports **single date** and **date range** selection, template-driven and reactive forms, min/max constraints, month/year drill-down navigation, and a customisable display format.

**[Live Documentation & Demos](https://bloc-verse.com/date-picker)**

> **Tip:** You can also install [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit) to get this package along with every other Bloc UI component in a single import.

---

## Installation

```bash
npm install @bloc-ui/date-picker
```

**Peer dependencies:** `@angular/common`, `@angular/core`, and `@angular/forms` ≥ 21.

---

## Directives

| Directive                             | Selector                       | Exports as                   |
| ------------------------------------- | ------------------------------ | ---------------------------- |
| `BlocDatePickerTriggerDirective`      | `[blocDatePickerTrigger]`      | `blocDatePickerTrigger`      |
| `BlocDateRangePickerTriggerDirective` | `[blocDateRangePickerTrigger]` | `blocDateRangePickerTrigger` |

```ts
import {
  BlocDatePickerTriggerDirective,
  BlocDateRangePickerTriggerDirective,
  BlocDatePickerModule,
} from '@bloc-ui/date-picker';
```

---

## Single date picker

Apply `blocDatePickerTrigger` to any element. Use the `displayValue` signal via a template reference to render the formatted date.

### Basic

```html
<input
  blocDatePickerTrigger
  #dp="blocDatePickerTrigger"
  [value]="dp.displayValue()"
  readonly
  placeholder="Select date"
/>
```

### With ngModel

```html
<input
  blocDatePickerTrigger
  #dp="blocDatePickerTrigger"
  [(ngModel)]="selectedDate"
  [value]="dp.displayValue()"
  readonly
/>
```

### With Reactive Forms

```html
<input
  blocDatePickerTrigger
  #dp="blocDatePickerTrigger"
  [formControl]="dateCtrl"
  [value]="dp.displayValue()"
  readonly
/>
```

### Min / Max

```html
<input
  blocDatePickerTrigger
  #dp="blocDatePickerTrigger"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [value]="dp.displayValue()"
  readonly
/>
```

### Custom format

```html
<input
  blocDatePickerTrigger
  #dp="blocDatePickerTrigger"
  format="dd/MM/yyyy"
  [value]="dp.displayValue()"
  readonly
/>
```

---

## `BlocDatePickerTriggerDirective` inputs

| Input      | Type           | Default        | Description             |
| ---------- | -------------- | -------------- | ----------------------- |
| `minDate`  | `Date \| null` | `null`         | Minimum selectable date |
| `maxDate`  | `Date \| null` | `null`         | Maximum selectable date |
| `format`   | `string`       | `'yyyy-MM-dd'` | Display format          |
| `disabled` | `boolean`      | `false`        | Disable the picker      |

## `BlocDatePickerTriggerDirective` exported state

| Signal           | Type      | Description                         |
| ---------------- | --------- | ----------------------------------- |
| `displayValue()` | `string`  | Formatted selected date for display |
| `isOpen()`       | `boolean` | Whether the calendar panel is open  |

---

## Date range picker

Apply `blocDateRangePickerTrigger` to any element. The **first click** sets the start date; the **second click** completes the range. A hover preview highlights days between the anchor and the cursor.

The control value and `ngModel` type is `DateRange`:

```ts
interface DateRange {
  from: Date | null;
  to: Date | null;
}
```

### With ngModel

```html
<input
  blocDateRangePickerTrigger
  #rp="blocDateRangePickerTrigger"
  [(ngModel)]="dateRange"
  [value]="rp.displayValue()"
  readonly
  placeholder="Select range"
/>
```

### With Reactive Forms

```html
<input
  blocDateRangePickerTrigger
  #rp="blocDateRangePickerTrigger"
  [formControl]="rangeCtrl"
  [value]="rp.displayValue()"
  readonly
/>
```

### With separate from / to inputs

Use `displayValueFrom` and `displayValueTo` to populate two separate fields. Supply a `FormGroup` via `rangeFormGroup` to have `from` and `to` controls patched automatically:

```html
<input
  blocDateRangePickerTrigger
  #rp="blocDateRangePickerTrigger"
  [rangeFormGroup]="rangeFg"
  [value]="rp.displayValueFrom()"
  placeholder="From"
  readonly
/>

<input [value]="rp.displayValueTo()" placeholder="To" readonly />
```

---

## `BlocDateRangePickerTriggerDirective` inputs

| Input            | Type                | Default        | Description                                                             |
| ---------------- | ------------------- | -------------- | ----------------------------------------------------------------------- |
| `minDate`        | `Date \| null`      | `null`         | Minimum selectable date                                                 |
| `maxDate`        | `Date \| null`      | `null`         | Maximum selectable date                                                 |
| `format`         | `string`            | `'yyyy-MM-dd'` | Display format                                                          |
| `disabled`       | `boolean`           | `false`        | Disable the picker                                                      |
| `rangeFormGroup` | `FormGroup \| null` | `null`         | FormGroup with `from` / `to` controls to patch directly on range commit |

## `BlocDateRangePickerTriggerDirective` exported state

| Signal               | Type      | Description                        |
| -------------------- | --------- | ---------------------------------- |
| `displayValue()`     | `string`  | `"from → to"` or partial           |
| `displayValueFrom()` | `string`  | Formatted start date               |
| `displayValueTo()`   | `string`  | Formatted end date                 |
| `isOpen()`           | `boolean` | Whether the calendar panel is open |

---

## Calendar navigation

The calendar supports three views:

| View      | How to reach                               |
| --------- | ------------------------------------------ |
| **Day**   | Default view                               |
| **Month** | Click the month/year label in the header   |
| **Year**  | Click the year label inside the month view |

Clicking a year navigates to the month view; clicking a month navigates back to the day view.

---

## CSS tokens

| Token                                  | Fallback                       | Description                   |
| -------------------------------------- | ------------------------------ | ----------------------------- |
| `--bloc-date-picker-z-index`           | `100`                          | Dropdown z-index              |
| `--bloc-date-picker-dropdown-bg`       | `#ffffff`                      | Dropdown background           |
| `--bloc-date-picker-dropdown-border`   | `var(--bloc-border, #d1d5db)`  | Dropdown border colour        |
| `--bloc-date-picker-dropdown-radius`   | `8px`                          | Dropdown border radius        |
| `--bloc-date-picker-dropdown-shadow`   | `0 4px 16px rgba(0,0,0,0.1)`   | Dropdown shadow               |
| `--bloc-date-picker-header-color`      | `#374151`                      | Header month/year text colour |
| `--bloc-date-picker-nav-color`         | `#6b7280`                      | Navigation arrow colour       |
| `--bloc-date-picker-nav-hover-bg`      | `#f3f4f6`                      | Navigation arrow hover bg     |
| `--bloc-date-picker-weekday-color`     | `#9ca3af`                      | Weekday label colour          |
| `--bloc-date-picker-day-color`         | `#374151`                      | Day number text colour        |
| `--bloc-date-picker-day-radius`        | `6px`                          | Day button border radius      |
| `--bloc-date-picker-day-hover-bg`      | `#f3f4f6`                      | Day hover background          |
| `--bloc-date-picker-today-border`      | `var(--bloc-primary, #6b7280)` | Today outline colour          |
| `--bloc-date-picker-selected-bg`       | `var(--bloc-primary, #6b7280)` | Selected / range-end bg       |
| `--bloc-date-picker-selected-color`    | `#ffffff`                      | Selected day text colour      |
| `--bloc-date-picker-range-bg`          | `#f3f4f6`                      | In-range highlight background |
| `--bloc-date-picker-footer-border`     | `var(--bloc-border, #d1d5db)`  | Footer divider colour         |
| `--bloc-date-picker-action-color`      | `var(--bloc-primary, #6b7280)` | Today / action button colour  |
| `--bloc-date-picker-action-hover-bg`   | `#f3f4f6`                      | Action button hover bg        |
| `--bloc-date-picker-clear-color`       | `#9ca3af`                      | Clear button colour           |
| `--bloc-date-picker-clear-hover-color` | `#374151`                      | Clear button hover colour     |

---

## Accessibility

- Trigger element sets `aria-expanded` and `aria-haspopup="dialog"`.
- Dropdown uses `role="dialog"` with `aria-label="Date picker"` (or `"Date range picker"`).
- Navigation buttons carry descriptive `aria-label` attributes.
- Disabled days have the `disabled` attribute on the button element.
- Closes on <kbd>Escape</kbd> key and outside click.

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-border`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. The date picker works without it — neutral fallbacks are applied automatically.

---

## License

MIT
