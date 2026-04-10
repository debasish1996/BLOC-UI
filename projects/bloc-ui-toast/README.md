# @bloc-ui/toast

> **Latest:** v1.0.2

Toast notification service for Angular — part of the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library. Show info, success, warning, and error notifications programmatically with auto-dismiss and close button support.

**[Live Documentation & Demos](https://ui.bloc-verse.com/toast)**

> **Tip:** You can also install [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit) to get this package along with every other Bloc UI component in a single import.

---

## Installation

```bash
npm install @bloc-ui/toast
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Usage

The toast system is **service-driven**. Show notifications programmatically via `BlocToastService`.

```ts
import {
    BlocToastService,
    BlocToastConfig,
    BlocToastType,
    BlocToastPosition,
    BlocToastComponent,
    BlocToastContainerComponent,
    BlocToastModule,
} from '@bloc-ui/toast';
```

### `BlocToastService`

```ts
private readonly toast = inject(BlocToastService);

// Shorthand methods
toast.info('Something happened');
toast.success('Saved!', 'Success');
toast.warning('Check your input', 'Warning');
toast.error('Failed to save', 'Error');

// Full configuration
toast.show({
  message: 'Custom toast',
  title: 'Note',
  type: 'info',
  duration: 5000,
  dismissible: true,
  position: 'top-right',
});

// Dismiss
toast.dismiss(id);
toast.dismissAll();
```

### `BlocToastConfig`

| Property      | Type                                                                                              | Default       | Description                                   |
| ------------- | ------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------- |
| `message`     | `string`                                                                                          | —             | Toast message text (required)                 |
| `title`       | `string`                                                                                          | `''`          | Optional title                                |
| `type`        | `BlocToastType`                                                                                   | `'info'`      | `'info' \| 'success' \| 'warning' \| 'error'` |
| `duration`    | `number`                                                                                          | `4000`        | Auto-dismiss ms (`0` = no auto-dismiss)       |
| `dismissible` | `boolean`                                                                                         | `true`        | Show close button                             |
| `position`    | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'top-right'` | Screen position of the toast container        |

---

## CSS tokens

| Token                        | Fallback                      | Description                |
| ---------------------------- | ----------------------------- | -------------------------- |
| `--bloc-toast-padding`       | `12px 14px`                   | Toast padding              |
| `--bloc-toast-radius`        | `8px`                         | Toast border radius        |
| `--bloc-toast-bg`            | `#ffffff`                     | Toast background           |
| `--bloc-toast-border`        | `var(--bloc-border, #d1d5db)` | Toast border colour        |
| `--bloc-toast-shadow`        | `0 4px 12px rgba(0,0,0,0.1)`  | Toast shadow               |
| `--bloc-toast-info-color`    | `#6b7280`                     | Info icon colour           |
| `--bloc-toast-success-color` | `#16a34a`                     | Success icon colour        |
| `--bloc-toast-warning-color` | `#d97706`                     | Warning icon colour        |
| `--bloc-toast-error-color`   | `#dc2626`                     | Error icon colour          |
| `--bloc-toast-title-color`   | `#374151`                     | Title text colour          |
| `--bloc-toast-message-color` | `#6b7280`                     | Message text colour        |
| `--bloc-toast-close-color`   | `#9ca3af`                     | Close button colour        |
| `--bloc-toast-z-index`       | `9999`                        | Container z-index          |
| `--bloc-toast-offset`        | `16px`                        | Container top/right offset |
| `--bloc-toast-gap`           | `8px`                         | Gap between toasts         |
| `--bloc-toast-max-width`     | `380px`                       | Container max width        |

---

## Accessibility

- Each toast uses `role="alert"` and `aria-live="polite"` for screen reader announcements.
- Dismiss button is available when `dismissible` is `true`.
- Toasts can be programmatically dismissed via `dismiss(id)` or `dismissAll()`.

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-surface`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. The toast works without it — neutral fallbacks are applied automatically.

---

## License

MIT
