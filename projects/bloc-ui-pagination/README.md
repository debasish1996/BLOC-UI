# @bloc-ui/pagination

> ⚠️ **Experimental** — API may change before reaching stable status.

Page navigation component for Angular. Renders a row of page buttons with configurable sibling and boundary counts, first/last jump buttons, custom labels, and disabled state. Integrates with Angular reactive forms via two-way binding.

---

## Installation

```bash
npm install @bloc-ui/pagination
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Selectors / API

| Export                    | Selector          | Type      | Description             |
| ------------------------- | ----------------- | --------- | ----------------------- |
| `BlocPaginationComponent` | `bloc-pagination` | Component | Page navigation control |

---

## Usage

### Basic

```ts
import { BlocPaginationComponent } from '@bloc-ui/pagination';

readonly currentPage = signal(1);
```

```html
<bloc-pagination [(page)]="currentPage" [totalPages]="8"></bloc-pagination>
```

### Dense with siblings and boundaries

```html
<bloc-pagination
    [(page)]="currentPage"
    [totalPages]="24"
    [siblingCount]="2"
    [boundaryCount]="1"
></bloc-pagination>
```

### With first / last jump buttons

```html
<bloc-pagination [(page)]="currentPage" [totalPages]="20" [showFirstLast]="true"></bloc-pagination>
```

### Custom labels

```html
<bloc-pagination
    [(page)]="currentPage"
    [totalPages]="20"
    [showFirstLast]="true"
    prevLabel="Prev"
    nextLabel="Next"
    firstLabel="First"
    lastLabel="Last"
></bloc-pagination>
```

### Disabled

```html
<bloc-pagination [(page)]="currentPage" [totalPages]="8" [disabled]="true"></bloc-pagination>
```

---

## Inputs — `BlocPaginationComponent`

| Input           | Type      | Default | Description                                            |
| --------------- | --------- | ------- | ------------------------------------------------------ |
| `page`          | `number`  | `1`     | Current page (supports two-way binding via `[(page)]`) |
| `totalPages`    | `number`  | `1`     | Total number of pages                                  |
| `siblingCount`  | `number`  | `1`     | Pages shown on each side of the current page button    |
| `boundaryCount` | `number`  | `1`     | Pages shown at the start and end of the range          |
| `showFirstLast` | `boolean` | `false` | Shows First and Last jump buttons                      |
| `disabled`      | `boolean` | `false` | Disables all page buttons                              |
| `prevLabel`     | `string`  | `'‹'`   | Label for the Previous button                          |
| `nextLabel`     | `string`  | `'›'`   | Label for the Next button                              |
| `firstLabel`    | `string`  | `'«'`   | Label for the First button                             |
| `lastLabel`     | `string`  | `'»'`   | Label for the Last button                              |

## Outputs

| Output       | Type     | Description                             |
| ------------ | -------- | --------------------------------------- |
| `pageChange` | `number` | Emits the new page number on navigation |

---

## CSS Tokens

| Token                         | Fallback  | Description                          |
| ----------------------------- | --------- | ------------------------------------ |
| `--bloc-pagination-active-bg` | `#374151` | Background of the active page button |
| `--bloc-pagination-radius`    | `4px`     | Button border radius                 |
| `--bloc-pagination-border`    | `#d1d5db` | Button border colour                 |
