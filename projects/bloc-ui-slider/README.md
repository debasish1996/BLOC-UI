# @bloc-ui/slider

> **Latest:** v1.0.2

Range slider component for Angular with configurable min, max, and step values, optional label, and full Angular reactive forms integration via `ControlValueAccessor`.

**[Live Documentation & Demos](https://ui.bloc-verse.com/slider)**

---

## Installation

```bash
npm install @bloc-ui/slider
```

**Peer dependencies:** `@angular/common`, `@angular/core`, and `@angular/forms` ≥ 21.

---

## Selectors / API

| Export                | Selector      | Type      | Description                         |
| --------------------- | ------------- | --------- | ----------------------------------- |
| `BlocSliderComponent` | `bloc-slider` | Component | Range slider with forms integration |

---

## Usage

### With Angular reactive forms

```ts
import { BlocSliderComponent } from '@bloc-ui/slider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

readonly volumeControl = new FormControl(35, { nonNullable: true });
```

```html
<bloc-slider
    label="Volume"
    [min]="0"
    [max]="100"
    [step]="5"
    [formControl]="volumeControl"
></bloc-slider>
```

### Custom range

```ts
readonly budgetControl = new FormControl(60, { nonNullable: true });
```

```html
<bloc-slider
    label="Budget allocation"
    [min]="10"
    [max]="120"
    [step]="10"
    [formControl]="budgetControl"
></bloc-slider>
```

---

## Inputs — `BlocSliderComponent`

| Input      | Type      | Default | Description                               |
| ---------- | --------- | ------- | ----------------------------------------- |
| `label`    | `string`  | `''`    | Optional label displayed above the slider |
| `min`      | `number`  | `0`     | Minimum value                             |
| `max`      | `number`  | `100`   | Maximum value                             |
| `step`     | `number`  | `1`     | Increment step                            |
| `disabled` | `boolean` | `false` | Disables the slider                       |

---

## CSS Tokens

| Token                      | Fallback  | Description                      |
| -------------------------- | --------- | -------------------------------- |
| `--bloc-slider-track-bg`   | `#d1d5db` | Track background colour          |
| `--bloc-slider-fill-bg`    | `#374151` | Filled portion of the track      |
| `--bloc-slider-thumb-bg`   | `#374151` | Thumb (handle) background colour |
| `--bloc-slider-thumb-size` | `1.25rem` | Diameter of the thumb            |
