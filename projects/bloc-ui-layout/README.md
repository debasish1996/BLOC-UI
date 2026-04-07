# @bloc-ui/layout

> **Latest:** v1.0.1

> ⚠️ **Experimental** — API may change before reaching stable status.

Sidebar layout package for Angular. Provides a responsive two-column grid layout with a collapsible sidebar panel and a scrollable content area. Responsive stacking at ≤ 900 px is built in.

**[Live Documentation & Demos](https://ui.bloc-verse.com/layout)**

---

## Installation

```bash
npm install @bloc-ui/layout
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Selectors / API

| Export                        | Selector               | Type      | Description                                    |
| ----------------------------- | ---------------------- | --------- | ---------------------------------------------- |
| `BlocSidebarLayoutComponent`  | `bloc-sidebar-layout`  | Component | Outer grid container for the two-column layout |
| `BlocSidebarComponent`        | `bloc-sidebar`         | Component | Left-panel sidebar slot                        |
| `BlocSidebarContentComponent` | `bloc-sidebar-content` | Component | Right-panel main content slot                  |

---

## Usage

### Basic sidebar layout

```ts
import {
    BlocSidebarLayoutComponent,
    BlocSidebarComponent,
    BlocSidebarContentComponent,
} from '@bloc-ui/layout';
```

```html
<bloc-sidebar-layout [collapsed]="collapsed" sidebarWidth="14rem">
    <bloc-sidebar>
        <nav>
            <a>Overview</a>
            <a>Components</a>
            <a>Settings</a>
        </nav>
    </bloc-sidebar>

    <bloc-sidebar-content>
        <h4>Dashboard</h4>
        <p>Main content area.</p>
    </bloc-sidebar-content>
</bloc-sidebar-layout>
```

### Collapsed sidebar

```html
<bloc-sidebar-layout [collapsed]="true" sidebarWidth="14rem">
    <bloc-sidebar><!-- content clips to collapsedWidth --></bloc-sidebar>
    <bloc-sidebar-content>...</bloc-sidebar-content>
</bloc-sidebar-layout>
```

---

## Inputs — `BlocSidebarLayoutComponent`

| Input            | Type      | Default   | Description                                   |
| ---------------- | --------- | --------- | --------------------------------------------- |
| `collapsed`      | `boolean` | `false`   | Collapses the sidebar to its `collapsedWidth` |
| `sidebarWidth`   | `string`  | `'16rem'` | Full sidebar width (CSS length)               |
| `collapsedWidth` | `string`  | `'0px'`   | Width when the sidebar is collapsed           |

---

## CSS Tokens — `BlocSidebarComponent`

| Token                    | Fallback  | Description           |
| ------------------------ | --------- | --------------------- |
| `--bloc-sidebar-bg`      | `#f3f4f6` | Sidebar background    |
| `--bloc-sidebar-color`   | `#374151` | Sidebar text colour   |
| `--bloc-sidebar-border`  | `#d1d5db` | Sidebar border colour |
| `--bloc-sidebar-radius`  | `0.5rem`  | Sidebar corner radius |
| `--bloc-sidebar-padding` | `1rem`    | Sidebar inner padding |

## CSS Tokens — `BlocSidebarContentComponent`

| Token                            | Fallback | Description                 |
| -------------------------------- | -------- | --------------------------- |
| `--bloc-sidebar-content-radius`  | `0.5rem` | Content panel corner radius |
| `--bloc-sidebar-content-padding` | `1rem`   | Content panel inner padding |
