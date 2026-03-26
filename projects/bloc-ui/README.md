# @bloc-ui/kit

> **Latest:** v0.0.2

All-in-one umbrella package for the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library. Install this single package to get every Bloc UI component and service.

**[Live Documentation & Demos](https://debasish1996.github.io/BLOC-UI/)**

---

## Installation

```bash
npm install @bloc-ui/kit
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## What's included

| Re-exported package                                                          | Description                                     |
| ---------------------------------------------------------------------------- | ----------------------------------------------- |
| [`@bloc-ui/core`](https://www.npmjs.com/package/@bloc-ui/core)               | Button, Checkbox, Input, Radio, Spinner, Toggle |
| [`@bloc-ui/modal`](https://www.npmjs.com/package/@bloc-ui/modal)             | Service-driven modal dialogs                    |
| [`@bloc-ui/table`](https://www.npmjs.com/package/@bloc-ui/table)             | Declarative data table                          |
| [`@bloc-ui/toast`](https://www.npmjs.com/package/@bloc-ui/toast)             | Toast notification service                      |
| [`@bloc-ui/date-picker`](https://www.npmjs.com/package/@bloc-ui/date-picker) | Calendar date picker                            |
| [`@bloc-ui/tab`](https://www.npmjs.com/package/@bloc-ui/tab)                 | Tab group component                             |

---

## Usage

Import anything from `@bloc-ui/kit` — all public symbols are re-exported:

```ts
import { BlocButtonComponent } from '@bloc-ui/kit';
import { BlocModalService } from '@bloc-ui/kit';
import { BlocTableComponent } from '@bloc-ui/kit';
import { BlocToastService } from '@bloc-ui/kit';
import { BlocDatePickerComponent } from '@bloc-ui/kit';
import { BlocTabGroupComponent } from '@bloc-ui/kit';
```

### Smaller bundles

For better tree-shaking, import directly from individual packages instead:

```ts
import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocModalService } from '@bloc-ui/modal';
import { BlocTableComponent } from '@bloc-ui/table';
```

---

## Theming

Add the optional theme package for light/dark mode, brand colours, and design tokens:

```bash
npm install @bloc-ui/theme
```

```scss
@use '@bloc-ui/theme/styles/bloc-theme';
```

See the [`@bloc-ui/theme` README](https://www.npmjs.com/package/@bloc-ui/theme) for details.

---

## License

MIT
