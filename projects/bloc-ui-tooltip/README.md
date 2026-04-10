# @bloc-ui/tooltip

> **Latest:** v1.0.4

Hover/focus tooltip with intelligent repositioning and delay control, built on the `@bloc-ui/overlay` platform layer.

**[Live Documentation & Demos](https://ui.bloc-verse.com/tooltip)**

## Installation

```bash
npm install @bloc-ui/tooltip
```

## Usage

```html
<button [blocTooltip]="'Save changes'">Save</button>

<!-- All four placement sides -->
<button [blocTooltip]="'Opens above'" tooltipPosition="top">Top</button>
<button [blocTooltip]="'Opens below'" tooltipPosition="bottom">Bottom</button>
<button [blocTooltip]="'Opens left'" tooltipPosition="left">Left</button>
<button [blocTooltip]="'Opens right'" tooltipPosition="right">Right</button>

<!-- Disabled -->
<button [blocTooltip]="'Not available'" [tooltipDisabled]="true">Locked</button>
```

## Inputs

| Input              | Type                                     | Default | Description                                                                                             |
| ------------------ | ---------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `blocTooltip`      | `string`                                 | —       | Tooltip text content (required)                                                                         |
| `tooltipPosition`  | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Placement of the tooltip panel. Alignment variants (`top-start`, `bottom-end`, etc.) are also accepted. |
| `tooltipDisabled`  | `boolean`                                | `false` | When true, tooltip will not appear                                                                      |
| `tooltipShowDelay` | `number`                                 | `200`   | Milliseconds before showing the tooltip                                                                 |
| `tooltipHideDelay` | `number`                                 | `100`   | Milliseconds before hiding the tooltip                                                                  |

## CSS tokens

| Token                        | Default   | Description             |
| ---------------------------- | --------- | ----------------------- |
| `--bloc-tooltip-bg`          | `#374151` | Panel background colour |
| `--bloc-tooltip-color`       | `#f9fafb` | Panel text colour       |
| `--bloc-tooltip-padding`     | `4px 8px` | Panel padding           |
| `--bloc-tooltip-radius`      | `4px`     | Panel border radius     |
| `--bloc-tooltip-font-size`   | `12px`    | Panel font size         |
| `--bloc-tooltip-max-width`   | `240px`   | Maximum panel width     |
| `--bloc-tooltip-line-height` | `1.4`     | Panel line height       |

## Accessibility

- The tooltip panel has `role="tooltip"` so screen readers announce it correctly.
- When the tooltip is visible, the host element receives `aria-describedby` pointing to the panel's `id`. The attribute is removed when the tooltip hides.
- The tooltip panel has no `tabindex` and is never placed in the tab order — it cannot be reached via keyboard navigation.
- Show/hide is triggered by both mouse (`mouseenter`/`mouseleave`) and keyboard (`focus`/`blur`), ensuring full keyboard accessibility without additional configuration.
- **Escape key** dismisses the tooltip without moving pointer or keyboard focus (WCAG 2.1 SC 1.4.13 — Dismissible).
- The pointer can move from the host element over the tooltip panel without the tooltip disappearing (WCAG 2.1 SC 1.4.13 — Hoverable). The tooltip hides after the pointer leaves the panel.

## Keyboard & Focus Behaviour

The tooltip appears after a short delay (`tooltipShowDelay`, default 200 ms) when the host element receives **hover** (`mouseenter`) or **keyboard focus** (`focus`). It hides when the pointer leaves the host or focus moves away (`blur`), after a `tooltipHideDelay` (default 100 ms).

You can move the pointer from the host element directly into the tooltip panel — the hide timer is cancelled on `mouseenter` of the panel, so the panel stays visible while you read or copy its content. The tooltip hides once the pointer leaves the panel.

Pressing **Escape** while the tooltip is visible dismisses it immediately without moving pointer or keyboard focus, satisfying WCAG 2.1 SC 1.4.13 (Content on Hover or Focus — Dismissible).
