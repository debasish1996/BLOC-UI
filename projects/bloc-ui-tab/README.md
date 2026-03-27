# @bloc-ui/tab

> **Latest:** v0.0.3

Tab group component for Angular — part of the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library. Supports size presets, disabled tabs, animated active indicator, and selection change events.

**[Live Documentation & Demos](https://bloc-verse.com/tab)**

> **Tip:** You can also install [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit) to get this package along with every other Bloc UI component in a single import.

---

## Installation

```bash
npm install @bloc-ui/tab
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Usage

```ts
import { BlocTabGroupComponent, BlocTabComponent, BlocTabModule } from '@bloc-ui/tab';
```

### Basic

```html
<bloc-tab-group>
  <bloc-tab label="Profile">Profile content</bloc-tab>
  <bloc-tab label="Settings">Settings content</bloc-tab>
  <bloc-tab label="Billing">Billing content</bloc-tab>
</bloc-tab-group>
```

### Sizes

```html
<bloc-tab-group size="sm">…</bloc-tab-group> <bloc-tab-group size="lg">…</bloc-tab-group>
```

### Disabled tab

```html
<bloc-tab-group>
  <bloc-tab label="Active">…</bloc-tab>
  <bloc-tab label="Disabled" [disabled]="true">…</bloc-tab>
</bloc-tab-group>
```

### Controlled selection

```html
<bloc-tab-group [selectedIndex]="1" (selectedIndexChange)="onTabChange($event)">
  <bloc-tab label="First">…</bloc-tab>
  <bloc-tab label="Second">…</bloc-tab>
</bloc-tab-group>
```

---

## `BlocTabGroupComponent` inputs

| Input           | Type                   | Default | Description                       |
| --------------- | ---------------------- | ------- | --------------------------------- |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`  | Tab density preset                |
| `selectedIndex` | `number`               | `0`     | Index of the initially active tab |

### Outputs

| Output                | Type     | Description                       |
| --------------------- | -------- | --------------------------------- |
| `selectedIndexChange` | `number` | Emits when the active tab changes |

## `BlocTabComponent` inputs

| Input      | Type      | Default | Description                 |
| ---------- | --------- | ------- | --------------------------- |
| `label`    | `string`  | —       | Tab header label            |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |

---

## CSS tokens

| Token                     | Fallback                       | Description                 |
| ------------------------- | ------------------------------ | --------------------------- |
| `--bloc-tab-header-gap`   | `0`                            | Gap between tab buttons     |
| `--bloc-tab-border`       | `var(--bloc-border, #d1d5db)`  | Header bottom border colour |
| `--bloc-tab-padding`      | `10px 16px`                    | Tab button padding          |
| `--bloc-tab-font-size`    | `0.875rem`                     | Tab button font size        |
| `--bloc-tab-color`        | `#6b7280`                      | Inactive tab text colour    |
| `--bloc-tab-hover-color`  | `#374151`                      | Tab hover text colour       |
| `--bloc-tab-indicator`    | `var(--bloc-primary, #6b7280)` | Active tab indicator colour |
| `--bloc-tab-active-color` | `var(--bloc-primary, #374151)` | Active tab text colour      |
| `--bloc-tab-focus-ring`   | `var(--bloc-primary, #6b7280)` | Focus ring colour           |
| `--bloc-tab-body-padding` | `16px 0`                       | Tab body padding            |

---

## Accessibility

- Active panel uses `role="tabpanel"`.
- Focus-visible outline on tab buttons.
- Disabled tabs are visually indicated and non-interactive.

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-surface`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. The tab group works without it — neutral fallbacks are applied automatically.

---

## License

MIT
