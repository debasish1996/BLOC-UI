> ⚠️ **Experimental** — API may change before reaching stable status.

# @bloc-ui/tooltip

Hover/focus tooltip with intelligent repositioning and delay control, built on the `@bloc-ui/overlay` platform layer.

## Installation

```bash
npm install @bloc-ui/tooltip @bloc-ui/overlay
```

## Usage

```html
<button [blocTooltip]="'Save changes'">Save</button>

<!-- With position -->
<button [blocTooltip]="'Delete item'" tooltipPosition="bottom">Delete</button>

<!-- Disabled -->
<button [blocTooltip]="'Not available'" [tooltipDisabled]="true">Locked</button>
```

## Inputs

| Input              | Type              | Default | Description                             |
| ------------------ | ----------------- | ------- | --------------------------------------- |
| `blocTooltip`      | `string`          | —       | Tooltip text content (required)         |
| `tooltipPosition`  | `OverlayPosition` | `'top'` | Placement of the tooltip panel          |
| `tooltipDisabled`  | `boolean`         | `false` | When true, tooltip will not appear      |
| `tooltipShowDelay` | `number`          | `200`   | Milliseconds before showing the tooltip |
| `tooltipHideDelay` | `number`          | `100`   | Milliseconds before hiding the tooltip  |

## CSS tokens

| Token                      | Default   | Description             |
| -------------------------- | --------- | ----------------------- |
| `--bloc-tooltip-bg`        | `#374151` | Panel background colour |
| `--bloc-tooltip-color`     | `#f9fafb` | Panel text colour       |
| `--bloc-tooltip-padding`   | `4px 8px` | Panel padding           |
| `--bloc-tooltip-radius`    | `4px`     | Panel border radius     |
| `--bloc-tooltip-font-size` | `12px`    | Panel font size         |
| `--bloc-tooltip-max-width` | `240px`   | Maximum panel width     |
