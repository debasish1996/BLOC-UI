# @bloc-ui/virtual-scroll

Lightweight virtual scrolling for Angular — renders only visible items, positions via `transform` (no reflow), signal-driven calculations.

## Install

```bash
npm install @bloc-ui/virtual-scroll
```

## Usage

### Template mode (generic lists)

```html
<bloc-virtual-scroll [items]="items" [itemHeight]="40" style="height: 400px">
    <ng-template blocVirtualItem let-item let-i="index">
        <div style="height: 40px">{{ i }}. {{ item.name }}</div>
    </ng-template>
</bloc-virtual-scroll>
```

### Projection mode (bloc-table integration)

```html
<bloc-virtual-scroll
    [items]="allRows"
    [itemHeight]="48"
    style="height: 500px"
    #vs="blocVirtualScroll"
>
    <bloc-table [data]="vs.visibleItems()">
        <bloc-column field="name" header="Name" />
        <bloc-column field="email" header="Email" />
    </bloc-table>
</bloc-virtual-scroll>
```

## Inputs

| Input        | Type     | Default | Description                       |
| ------------ | -------- | ------- | --------------------------------- |
| `items`      | `T[]`    | `[]`    | Full data array                   |
| `itemHeight` | `number` | —       | Fixed row height in px (required) |
| `overscan`   | `number` | `3`     | Extra items rendered above/below  |

## API (via template ref)

| Property           | Type             | Description                          |
| ------------------ | ---------------- | ------------------------------------ |
| `visibleItems()`   | `Signal<T[]>`    | Currently visible slice              |
| `startIndex()`     | `Signal<number>` | First visible index                  |
| `endIndex()`       | `Signal<number>` | Last visible index (excl.)           |
| `scrollToIndex(i)` | `method`         | Scrolls to bring index `i` into view |
