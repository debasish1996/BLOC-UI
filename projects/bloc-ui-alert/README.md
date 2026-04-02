# @bloc-ui/alert

> ⚠️ **Experimental** — API may change before reaching stable status.

Inline alert banner component for Angular with severity variants (`info`, `success`, `warning`, `danger`), an optional title, and optional dismissal support.

---

## Installation

```bash
npm install @bloc-ui/alert
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Selectors / API

| Export               | Selector     | Type      | Description                          |
| -------------------- | ------------ | --------- | ------------------------------------ |
| `BlocAlertComponent` | `bloc-alert` | Component | Alert banner with content projection |

---

## Usage

### Basic

```ts
import { BlocAlertComponent } from '@bloc-ui/alert';
```

```html
<bloc-alert variant="info" title="Heads up">
    Alerts work well for inline guidance, success messaging, and warnings.
</bloc-alert>
```

### Severity variants

```html
<bloc-alert variant="success" title="Saved">Your changes have been saved.</bloc-alert>
<bloc-alert variant="warning" title="Sync paused">Reconnect to resume background sync.</bloc-alert>
<bloc-alert variant="danger" title="Error">Something went wrong. Please try again.</bloc-alert>
```

### Dismissible

```html
<bloc-alert variant="warning" title="Sync paused" [dismissible]="true">
    Reconnect to resume background sync.
</bloc-alert>
```

---

## Inputs — `BlocAlertComponent`

| Input         | Type                                           | Default  | Description                                |
| ------------- | ---------------------------------------------- | -------- | ------------------------------------------ |
| `variant`     | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Visual severity of the alert               |
| `title`       | `string`                                       | `''`     | Bold heading shown above the message body  |
| `dismissible` | `boolean`                                      | `false`  | Shows a close (×) button to hide the alert |

---

## CSS Tokens

| Token                      | Fallback  | Description         |
| -------------------------- | --------- | ------------------- |
| `--bloc-alert-border`      | `#d1d5db` | Alert border colour |
| `--bloc-alert-bg`          | `#f3f4f6` | Alert background    |
| `--bloc-alert-color`       | `#374151` | Alert text colour   |
| `--bloc-alert-title-color` | `#374151` | Title text colour   |
