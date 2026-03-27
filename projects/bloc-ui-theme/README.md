# @bloc-ui/theme

> **Latest:** v0.0.6

Optional theme layer for the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library — provides CSS custom properties, colour tokens, light/dark mode, and consistent design tokens. Components in `@bloc-ui/core` work without this package (neutral fallbacks are applied automatically), but installing it gives you the full design system.

**[Live Documentation & Demos](https://bloc-verse.com/)**

---

## Installation

```bash
npm install @bloc-ui/theme
```

No peer dependencies — this package is pure CSS.

---

## Usage

Import the theme stylesheet into your application's global styles:

**Option A — `angular.json` styles array (recommended):**

```json
"styles": [
  "node_modules/@bloc-ui/theme/styles/bloc-theme.scss",
  "src/styles.scss"
]
```

**Option B — global `styles.scss`:**

```scss
@use '@bloc-ui/theme/styles/bloc-theme';
```

---

## Design tokens

The theme defines CSS custom properties on `:root`. All bloc-ui components reference these tokens automatically.

### Brand

| Token              | Light     | Dark      |
| ------------------ | --------- | --------- |
| `--bloc-primary`   | `#3b82f6` | `#60a5fa` |
| `--bloc-secondary` | `#64748b` | `#94a3b8` |

### Typography

| Token                   | Value                            |
| ----------------------- | -------------------------------- |
| `--bloc-font-family`    | `'Inter', system-ui, sans-serif` |
| `--bloc-font-size-base` | `14px`                           |

### Neutrals

| Token            | Light     | Dark      |
| ---------------- | --------- | --------- |
| `--bloc-text`    | `#1e293b` | `#f1f5f9` |
| `--bloc-muted`   | `#94a3b8` | `#475569` |
| `--bloc-border`  | `#e2e8f0` | `#334155` |
| `--bloc-surface` | `#ffffff` | `#1e293b` |

### Shape & spacing

| Token               | Value |
| ------------------- | ----- |
| `--bloc-radius`     | `8px` |
| `--bloc-radius-sm`  | `4px` |
| `--bloc-spacing-sm` | `8px` |

### Modal

| Token                         | Light                         | Dark                         |
| ----------------------------- | ----------------------------- | ---------------------------- |
| `--bloc-modal-backdrop`       | `rgba(0,0,0,0.45)`            | `rgba(0,0,0,0.65)`           |
| `--bloc-modal-shadow`         | `0 8px 32px rgba(0,0,0,0.15)` | `0 8px 32px rgba(0,0,0,0.4)` |
| `--bloc-modal-z-index`        | `1000`                        | —                            |
| `--bloc-modal-sm`             | `360px`                       | —                            |
| `--bloc-modal-md`             | `560px`                       | —                            |
| `--bloc-modal-lg`             | `800px`                       | —                            |
| `--bloc-modal-title-size`     | `1rem`                        | —                            |
| `--bloc-modal-title-weight`   | `600`                         | —                            |
| `--bloc-modal-header-padding` | `16px 20px`                   | —                            |
| `--bloc-modal-body-padding`   | `20px`                        | —                            |
| `--bloc-modal-footer-padding` | `12px 20px`                   | —                            |

---

## Dark mode

Dark mode follows the operating system by default via `prefers-color-scheme: dark`.

### Pin a mode programmatically

```html
<!-- Always dark -->
<html data-theme="dark">
  <!-- Always light (overrides OS dark preference) -->
  <html data-theme="light"></html>
</html>
```

When no `data-theme` attribute is set, the theme auto-switches based on the user's OS preference.

---

## Overriding tokens

Redefine any token in your own `:root` rule **after** importing the theme:

```css
:root {
  --bloc-primary: #6366f1;
  --bloc-radius: 12px;
}
```

---

## Tailwind CSS integration

The theme pre-registers cascade layer ordering so bloc-ui defaults sit between Tailwind's `base` and `utilities` layers:

```
theme < base < bloc-spinner < bloc-input < components < utilities
```

Import the theme **before** Tailwind for correct layer precedence:

```css
@layer theme, base, bloc-spinner, bloc-input, components, utilities;
@import 'tailwindcss';
```

---

## License

MIT
