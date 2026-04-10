# @bloc-ui/virtual-scroll

> **Latest:** v1.0.3

Lightweight virtual scrolling for Angular — renders only visible items, positions via `transform` (no reflow), signal-driven calculations.

**[Live Documentation & Demos](https://ui.bloc-verse.com/virtual-scroll)**

## Install

```bash
npm install @bloc-ui/virtual-scroll
```

## Usage

### Template mode (generic lists)

Provide a `blocVirtualItem` template. The component renders only the currently visible rows and positions them via `translate3d` — zero DOM reflow on scroll.

```html
<bloc-virtual-scroll [items]="items" [itemHeight]="40" style="height: 400px">
    <ng-template blocVirtualItem let-item let-i="index">
        <div style="height: 40px; padding: 8px 16px; border-bottom: 1px solid #e2e8f0">
            {{ i + 1 }}. {{ item.label }}
        </div>
    </ng-template>
</bloc-virtual-scroll>
```

### Projection mode (`bloc-table` integration)

Omit the `blocVirtualItem` template and project any content directly. The component uses spacer `<div>` elements instead of `transform` positioning — this keeps `position: sticky` working for table headers.

Use `#vs="blocVirtualScroll"` to get a template reference and pass the visible slice to `bloc-table`:

```html
<bloc-virtual-scroll
    [items]="allRows"
    [itemHeight]="48"
    style="height: 500px"
    #vs="blocVirtualScroll"
>
    <bloc-table [data]="vs.visibleItems()" [sticky]="true">
        <bloc-column field="name" header="Name" />
        <bloc-column field="email" header="Email" />
    </bloc-table>
</bloc-virtual-scroll>
```

### Variable-height rows (`autoMeasure`)

Set `[autoMeasure]="true"` to measure actual row heights after render and cache them. This enables correct scroll positions and total-height calculations when rows have different heights. Use the estimated `itemHeight` as a fallback for unmeasured rows.

```html
<bloc-virtual-scroll [items]="items" [itemHeight]="40" [autoMeasure]="true" style="height: 400px">
    <ng-template blocVirtualItem let-item>
        <div style="padding: 8px 16px; border-bottom: 1px solid #e2e8f0">{{ item.text }}</div>
    </ng-template>
</bloc-virtual-scroll>
```

## Inputs

| Input         | Type      | Default | Description                                                      |
| ------------- | --------- | ------- | ---------------------------------------------------------------- |
| `items`       | `T[]`     | `[]`    | Full data array                                                  |
| `itemHeight`  | `number`  | —       | Estimated (or fixed) row height in px (required)                 |
| `overscan`    | `number`  | `10`    | Extra items rendered above/below the viewport to prevent flash   |
| `autoMeasure` | `boolean` | `false` | Measure actual row heights after render (supports variable rows) |

## API (via template ref)

Export the component as `#vs="blocVirtualScroll"` to access the public API from a parent template:

| Property           | Type             | Description                          |
| ------------------ | ---------------- | ------------------------------------ |
| `visibleItems()`   | `Signal<T[]>`    | Currently visible slice              |
| `startIndex()`     | `Signal<number>` | First visible index                  |
| `endIndex()`       | `Signal<number>` | Last visible index (exclusive)       |
| `totalHeight()`    | `Signal<number>` | Total scroll height in px            |
| `scrollToIndex(i)` | `method`         | Scrolls to bring index `i` into view |

## Template context (`BlocVirtualItemContext<T>`)

Each `blocVirtualItem` template receives the following context variables:

| Variable    | Type     | Description                            |
| ----------- | -------- | -------------------------------------- |
| `$implicit` | `T`      | The current item (use `let-item`)      |
| `index`     | `number` | Absolute index in the full items array |

```html
<ng-template blocVirtualItem let-item let-i="index"> {{ i + 1 }}. {{ item.name }} </ng-template>
```

## NgModule usage

For NgModule-based applications, import `BlocVirtualScrollModule`:

```ts
import { BlocVirtualScrollModule } from '@bloc-ui/virtual-scroll';

@NgModule({
    imports: [BlocVirtualScrollModule],
})
export class AppModule {}
```

The module exports both `BlocVirtualScrollComponent` and `BlocVirtualItemDirective`.
