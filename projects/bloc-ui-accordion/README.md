# @bloc-ui/accordion

> **Latest:** v1.0.3

> ⚠️ **Experimental** — API may change before reaching stable status.

Collapsible accordion component for Angular with single-open and multi-open modes, keyboard navigation, optional chevron icon, and disabled item support.

**[Live Documentation & Demos](https://ui.bloc-verse.com/accordion)**

---

## Installation

```bash
npm install @bloc-ui/accordion
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Selectors / API

| Export                          | Selector                 | Type      | Description                                     |
| ------------------------------- | ------------------------ | --------- | ----------------------------------------------- |
| `BlocAccordionComponent`        | `bloc-accordion`         | Component | Accordion container; controls single/multi mode |
| `BlocAccordionItemDirective`    | `[blocAccordionItem]`    | Directive | Marks a panel as an accordion item              |
| `BlocAccordionTriggerDirective` | `[blocAccordionTrigger]` | Directive | The clickable trigger button for an item        |
| `BlocAccordionContentDirective` | `[blocAccordionContent]` | Directive | The collapsible content region                  |
| `BlocAccordionChevronDirective` | `[blocAccordionChevron]` | Directive | Marks a custom icon element as the chevron      |

---

## Usage

### Basic (single-open)

```ts
import {
    BlocAccordionComponent,
    BlocAccordionItemDirective,
    BlocAccordionTriggerDirective,
    BlocAccordionContentDirective,
} from '@bloc-ui/accordion';
```

```html
<bloc-accordion class="gap-3">
    <div blocAccordionItem [expanded]="true">
        <button blocAccordionTrigger>Overview</button>
        <div blocAccordionContent>Summary content goes here.</div>
    </div>
    <div blocAccordionItem>
        <button blocAccordionTrigger>Details</button>
        <div blocAccordionContent>More detail goes here.</div>
    </div>
</bloc-accordion>
```

### Multi-open

```html
<bloc-accordion [multi]="true" class="gap-3">
    <div blocAccordionItem [expanded]="true">
        <button blocAccordionTrigger>Design tokens</button>
        <div blocAccordionContent>Keep spacing and typography in sync.</div>
    </div>
    <div blocAccordionItem [expanded]="true">
        <button blocAccordionTrigger>Accessibility</button>
        <div blocAccordionContent>Preserve semantic structure and keyboard affordances.</div>
    </div>
</bloc-accordion>
```

### Disabled item

```html
<bloc-accordion class="gap-3">
    <div blocAccordionItem>
        <button blocAccordionTrigger>Enabled section</button>
        <div blocAccordionContent>This section works normally.</div>
    </div>
    <div blocAccordionItem [disabled]="true">
        <button blocAccordionTrigger>Disabled section</button>
        <div blocAccordionContent>This content cannot be reached.</div>
    </div>
</bloc-accordion>
```

---

## Inputs — `BlocAccordionComponent`

| Input   | Type      | Default | Description                                         |
| ------- | --------- | ------- | --------------------------------------------------- |
| `multi` | `boolean` | `false` | When `true`, multiple items can be expanded at once |

## Inputs — `BlocAccordionItemDirective`

| Input      | Type      | Default | Description                          |
| ---------- | --------- | ------- | ------------------------------------ |
| `expanded` | `boolean` | `false` | Initial expanded state of this item  |
| `disabled` | `boolean` | `false` | Prevents the item from being toggled |

## Inputs — `BlocAccordionTriggerDirective`

| Input     | Type      | Default | Description                             |
| --------- | --------- | ------- | --------------------------------------- |
| `chevron` | `boolean` | `true`  | Shows or hides the default chevron icon |

---

## CSS Tokens

| Token                              | Fallback  | Description              |
| ---------------------------------- | --------- | ------------------------ |
| `--bloc-accordion-border`          | `#d1d5db` | Panel border colour      |
| `--bloc-accordion-header-hover-bg` | `#f3f4f6` | Trigger hover background |
| `--bloc-accordion-focus-ring`      | `#9ca3af` | Focus outline colour     |
| `--bloc-accordion-title-color`     | `#374151` | Trigger text colour      |
| `--bloc-accordion-color`           | `#374151` | Content text colour      |
