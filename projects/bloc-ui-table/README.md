# @bloc-ui/table

> **Latest:** v1.0.0

Lightweight, declarative data table component for Angular — part of the [Bloc UI](https://github.com/debasish1996/BLOC-UI) component library. Supports striped rows, bordered cells, hover highlighting, size presets, and custom cell templates.

**[Live Documentation & Demos](https://bloc-verse.com/table)**

> **Tip:** You can also install [`@bloc-ui/kit`](https://www.npmjs.com/package/@bloc-ui/kit) to get this package along with every other Bloc UI component in a single import.

---

## Installation

```bash
npm install @bloc-ui/table
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Usage

```ts
import {
    BlocTableComponent,
    BlocColumnComponent,
    BlocCellDefDirective,
    BlocTableModule,
} from '@bloc-ui/table';
```

### Basic table

```html
<bloc-table [data]="users">
    <bloc-column field="name" header="Name" />
    <bloc-column field="email" header="Email" />
    <bloc-column field="role" header="Role" />
</bloc-table>
```

### Variants

```html
<!-- Striped rows -->
<bloc-table [data]="users" [striped]="true">…</bloc-table>

<!-- Bordered cells -->
<bloc-table [data]="users" [bordered]="true">…</bloc-table>

<!-- Hoverable rows -->
<bloc-table [data]="users" [hoverable]="true">…</bloc-table>

<!-- Size: sm / md (default) / lg -->
<bloc-table [data]="users" size="sm">…</bloc-table>
```

### Custom cell template

```html
<bloc-table [data]="users">
    <bloc-column field="status" header="Status">
        <ng-template blocCellDef let-value let-row="row">
            <span [class]="value === 'Active' ? 'text-green-600' : 'text-red-500'">
                {{ value }}
            </span>
        </ng-template>
    </bloc-column>
</bloc-table>
```

---

## `BlocTableComponent` inputs

| Input       | Type                        | Default | Description             |
| ----------- | --------------------------- | ------- | ----------------------- |
| `data`      | `Record<string, unknown>[]` | `[]`    | Array of row objects    |
| `striped`   | `boolean`                   | `false` | Alternating row stripes |
| `bordered`  | `boolean`                   | `false` | Show cell borders       |
| `hoverable` | `boolean`                   | `false` | Highlight rows on hover |
| `size`      | `'sm' \| 'md' \| 'lg'`      | `'md'`  | Table density preset    |

## `BlocColumnComponent` inputs

| Input    | Type     | Default | Description                      |
| -------- | -------- | ------- | -------------------------------- |
| `field`  | `string` | —       | Object key to read from each row |
| `header` | `string` | `''`    | Column header label              |

---

## CSS tokens

| Token                     | Fallback                      | Description            |
| ------------------------- | ----------------------------- | ---------------------- |
| `--bloc-table-th-padding` | `10px 14px`                   | Header cell padding    |
| `--bloc-table-td-padding` | `10px 14px`                   | Body cell padding      |
| `--bloc-table-font-size`  | `0.8125rem`                   | Table font size        |
| `--bloc-table-th-color`   | `#374151`                     | Header text colour     |
| `--bloc-table-th-bg`      | `transparent`                 | Header background      |
| `--bloc-table-td-color`   | `#6b7280`                     | Body text colour       |
| `--bloc-table-border`     | `var(--bloc-border, #d1d5db)` | Border colour          |
| `--bloc-table-stripe-bg`  | `#f9fafb`                     | Striped row background |
| `--bloc-table-hover-bg`   | `#f3f4f6`                     | Hovered row background |

---

## Custom cell templates

The `blocCellDef` directive provides the implicit template context:

| Variable    | Type                      | Description                   |
| ----------- | ------------------------- | ----------------------------- |
| `$implicit` | `unknown`                 | The cell value (`row[field]`) |
| `row`       | `Record<string, unknown>` | The full row object           |

---

## Accessibility

- Renders semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements.
- Responsive overflow wrapper on the host element.

---

## Theming

All visual tokens (`--bloc-primary`, `--bloc-surface`, colour scales, dark-mode) are provided by the optional [`@bloc-ui/theme`](https://www.npmjs.com/package/@bloc-ui/theme) package. The table works without it — neutral fallbacks are applied automatically.

---

## License

MIT
