# @bloc-ui/modal

> **Latest:** v1.0.0

Modal dialog service for Angular — part of the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library.

**[Live Documentation & Demos](https://ui.bloc-verse.com/modal)**

> **Tip:** You can also install [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit) to get this package along with every other Bloc UI component in a single import.

---

## Installation

```bash
npm install @bloc-ui/modal
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Usage

The modal system is **service-driven** — there is no template component. Open modals programmatically via `BlocModalService`.

```ts
import {
    BlocModalService,
    BlocModalRef,
    BlocModal,
    BlocModalConfig,
    BLOC_MODAL_DATA,
} from '@bloc-ui/modal';
```

### `BlocModalService`

```ts
const ref = this.modalService.open(MyModalComponent, {
    title: 'Confirm action',
    size: 'md',
    data: { userId: 42 },
});

ref.afterClosed$.subscribe((result) => {
    console.log('Modal closed with:', result);
});
```

**Method:** `open<Comp>(component, config?): BlocModalRef<Comp, R>`

### `BlocModalConfig<D>`

| Property               | Type                   | Default | Description                          |
| ---------------------- | ---------------------- | ------- | ------------------------------------ |
| `title`                | `string`               | `''`    | Header title text                    |
| `size`                 | `'sm' \| 'md' \| 'lg'` | `'md'`  | Dialog width variant                 |
| `showBackdrop`         | `boolean`              | `true`  | Show the backdrop overlay            |
| `closeOnBackdropClick` | `boolean`              | `true`  | Close when clicking the backdrop     |
| `showCloseButton`      | `boolean`              | `true`  | Show the close button in header      |
| `backdropClass`        | `string`               | `''`    | Extra CSS class for the backdrop     |
| `panelClass`           | `string`               | `''`    | Extra CSS class for the panel        |
| `data`                 | `D`                    | `null`  | Data passed to the content component |

### `BlocModalRef<Comp, R>`

| Member              | Type                         | Description                         |
| ------------------- | ---------------------------- | ----------------------------------- |
| `afterClosed$`      | `Observable<R \| undefined>` | Emits once on close, then completes |
| `componentInstance` | `Comp`                       | The rendered content component      |
| `close(result?)`    | `void`                       | Closes the modal and emits result   |

### Content components

Extend the `BlocModal<Input, Result>` abstract class to get typed `data` and `modalRef`:

```ts
@Component({ ... })
export class MyModalComponent extends BlocModal<{ userId: number }, boolean> {
  confirm() {
    this.modalRef.close(true);
  }
}
```

---

## CSS tokens

| Token                         | Fallback                      | Description               |
| ----------------------------- | ----------------------------- | ------------------------- |
| `--bloc-modal-backdrop`       | `rgba(0,0,0,0.5)`             | Backdrop overlay colour   |
| `--bloc-modal-z-index`        | `1000`                        | Stack order               |
| `--bloc-modal-shadow`         | `0 8px 32px rgba(0,0,0,0.18)` | Dialog shadow             |
| `--bloc-modal-sm`             | `360px`                       | Max-width for `size="sm"` |
| `--bloc-modal-md`             | `560px`                       | Max-width for `size="md"` |
| `--bloc-modal-lg`             | `800px`                       | Max-width for `size="lg"` |
| `--bloc-surface`              | `#fff`                        | Dialog background         |
| `--bloc-border`               | `#e2e8f0`                     | Header/footer border      |
| `--bloc-text`                 | `inherit`                     | Dialog text colour        |
| `--bloc-radius`               | `8px`                         | Dialog border radius      |
| `--bloc-font-family`          | `inherit`                     | Dialog font family        |
| `--bloc-modal-header-padding` | `16px 20px`                   | Header padding            |
| `--bloc-modal-body-padding`   | `20px`                        | Body padding              |
| `--bloc-modal-footer-padding` | `12px 20px`                   | Footer padding            |
| `--bloc-modal-title-size`     | `1em`                         | Title font size           |
| `--bloc-modal-title-weight`   | `600`                         | Title font weight         |
| `--bloc-muted`                | `#94a3b8`                     | Close button colour       |

---

## Accessibility

- Dialog uses `role="dialog"` and `aria-modal="true"`.
- Optional close button in the header.
- Backdrop click can be disabled via `closeOnBackdropClick: false`.

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-surface`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. The modal works without it — neutral fallbacks are applied automatically.

---

## License

MIT
