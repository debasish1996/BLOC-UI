# @bloc-ui/alert

> **Latest:** v1.0.5

Inline alert banner component for Angular with severity variants (`info`, `success`, `warning`, `danger`), an optional title, optional dismissal, and controlled external visibility.

**[Live Documentation & Demos](https://ui.bloc-verse.com/alert)**

---

## Installation

```bash
npm install @bloc-ui/alert
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Exports

| Export               | Selector     | Type      | Description                                   |
| -------------------- | ------------ | --------- | --------------------------------------------- |
| `BlocAlertComponent` | `bloc-alert` | Component | Alert banner with content projection          |
| `BlocAlertModule`    | —            | NgModule  | NgModule wrapper for template-based consumers |

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
<bloc-alert variant="info" title="Note">This item has been archived.</bloc-alert>
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

### Controlled visibility

Use the `visible` input to show or hide the alert from a parent component. The `(dismissed)` output fires when the user closes the alert, letting you sync your own state.

```ts
// my.component.ts
showAlert = true;
```

```html
<button type="button" (click)="showAlert = true">Show alert</button>

<bloc-alert
    variant="warning"
    title="Session expiring"
    [dismissible]="true"
    [visible]="showAlert"
    (dismissed)="showAlert = false"
>
    Your session will expire in 5 minutes.
</bloc-alert>
```

---

## Inputs — `BlocAlertComponent`

| Input         | Type                                           | Default           | Description                                                                                      |
| ------------- | ---------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `variant`     | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'`          | Visual severity of the alert                                                                     |
| `title`       | `string`                                       | `''`              | Bold heading shown above the message body                                                        |
| `dismissible` | `boolean`                                      | `false`           | Shows a close (×) button to hide the alert                                                       |
| `closeLabel`  | `string`                                       | `'Dismiss alert'` | `aria-label` on the dismiss button                                                               |
| `visible`     | `boolean`                                      | `true`            | External visibility gate. Set to `false` to hide without waiting for a user dismissal            |
| `hideIcon`    | `boolean`                                      | `false`           | Removes the icon column entirely. Useful for compact or text-only alerts                         |
| `live`        | `'assertive' \| 'polite' \| undefined`         | `undefined`       | Overrides the computed ARIA `role`. `'assertive'` → `role="alert"`, `'polite'` → `role="status"` |

---

## Outputs — `BlocAlertComponent`

| Output      | Payload | Description                                                          |
| ----------- | ------- | -------------------------------------------------------------------- |
| `dismissed` | `void`  | Emitted when the user clicks the dismiss button and the alert closes |

---

## Content Slots

| Attribute       | Description                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `blocAlertIcon` | Projected into the icon column in place of the default letter badge. Add to any element or SVG. |

### Custom icon example

```html
<bloc-alert variant="success" title="Deployed">
    <svg
        blocAlertIcon
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
    Your build passed all checks and is live in production.
</bloc-alert>
```

When `blocAlertIcon` content is present the letter badge is suppressed automatically. When the slot is empty, the badge renders as normal.

---

## Accessibility

### ARIA role — computed from variant and `live`

The host element's `role` is derived automatically:

| Condition                         | `role`     |
| --------------------------------- | ---------- |
| `live="assertive"`                | `"alert"`  |
| `live="polite"`                   | `"status"` |
| `variant="warning"` or `"danger"` | `"alert"`  |
| `variant="info"` or `"success"`   | `"status"` |

The `live` input takes precedence over the variant-based derivation. Use it when you need to force a specific live-region behaviour regardless of visual severity.

### Other a11y details

- The icon badge is `aria-hidden="true"` — it is decorative.
- The host element carries `aria-label` set to the variant name.
- The dismiss button's `aria-label` is controlled by the `closeLabel` input (default: `"Dismiss alert"`).
- The dismiss button has a `:focus-visible` outline using `--bloc-alert-focus`.

### Focus management after dismiss

When an alert is dismissed, the browser does not automatically move focus. Use the `(dismissed)` output to move focus to a contextually appropriate element — for example, the trigger button that surfaced the alert, or the next logical landmark in the page.

```ts
@ViewChild('triggerBtn') triggerBtn!: ElementRef<HTMLButtonElement>;

onDismissed(): void {
    this.triggerBtn.nativeElement.focus();
}
```

```html
<button #triggerBtn type="button" (click)="showAlert = true">Open alert</button>

<bloc-alert
    variant="danger"
    [visible]="showAlert"
    [dismissible]="true"
    (dismissed)="showAlert = false; onDismissed()"
>
    A critical error occurred.
</bloc-alert>
```

---

## CSS Custom Properties

All colour and visual tokens use neutral fallbacks so the component renders correctly without `@bloc-ui/theme`. Brand colours are applied by the theme layer.

### Base tokens

| Token                       | Fallback       | Description                         |
| --------------------------- | -------------- | ----------------------------------- |
| `--bloc-alert-border`       | `#d1d5db`      | Alert border colour                 |
| `--bloc-alert-bg`           | `#f9fafb`      | Alert background colour             |
| `--bloc-alert-color`        | `#374151`      | Alert text colour                   |
| `--bloc-alert-accent`       | `#f3f4f6`      | Icon badge background               |
| `--bloc-alert-accent-color` | `#374151`      | Icon badge text colour              |
| `--bloc-alert-focus`        | `currentColor` | Focus ring colour on dismiss button |

### Variant tokens

Each variant exposes four tokens that override the corresponding base token. Set these to theme individual severities without touching the base layer.

| Token                               | Fallback  | Applies to               |
| ----------------------------------- | --------- | ------------------------ |
| `--bloc-alert-info-border`          | `#d1d5db` | info border              |
| `--bloc-alert-info-bg`              | `#f9fafb` | info background          |
| `--bloc-alert-info-accent`          | `#f3f4f6` | info badge background    |
| `--bloc-alert-info-accent-color`    | `#374151` | info badge text          |
| `--bloc-alert-success-border`       | `#d1d5db` | success border           |
| `--bloc-alert-success-bg`           | `#f9fafb` | success background       |
| `--bloc-alert-success-accent`       | `#f3f4f6` | success badge background |
| `--bloc-alert-success-accent-color` | `#374151` | success badge text       |
| `--bloc-alert-warning-border`       | `#d1d5db` | warning border           |
| `--bloc-alert-warning-bg`           | `#f9fafb` | warning background       |
| `--bloc-alert-warning-accent`       | `#f3f4f6` | warning badge background |
| `--bloc-alert-warning-accent-color` | `#374151` | warning badge text       |
| `--bloc-alert-danger-border`        | `#d1d5db` | danger border            |
| `--bloc-alert-danger-bg`            | `#f9fafb` | danger background        |
| `--bloc-alert-danger-accent`        | `#f3f4f6` | danger badge background  |
| `--bloc-alert-danger-accent-color`  | `#374151` | danger badge text        |

### Theming example

Override tokens in your application stylesheet to apply brand colours:

```css
:root {
    --bloc-alert-info-border: #93c5fd;
    --bloc-alert-info-bg: #eff6ff;
    --bloc-alert-info-accent: #3b82f6;
    --bloc-alert-info-accent-color: #ffffff;

    --bloc-alert-success-border: #86efac;
    --bloc-alert-success-bg: #f0fdf4;
    --bloc-alert-success-accent: #22c55e;
    --bloc-alert-success-accent-color: #ffffff;

    --bloc-alert-warning-border: #fcd34d;
    --bloc-alert-warning-bg: #fffbeb;
    --bloc-alert-warning-accent: #f59e0b;
    --bloc-alert-warning-accent-color: #ffffff;

    --bloc-alert-danger-border: #fca5a5;
    --bloc-alert-danger-bg: #fef2f2;
    --bloc-alert-danger-accent: #ef4444;
    --bloc-alert-danger-accent-color: #ffffff;
}
```

Or install `@bloc-ui/theme` to get a pre-built token set for all Bloc-UI components.
